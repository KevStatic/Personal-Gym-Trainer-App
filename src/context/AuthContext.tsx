import {
  getCurrentUser,
  getGoogleOAuthUrl,
  requestPasswordResetEmail,
  signInWithPassword,
  signOutWithToken,
  signUpWithPassword,
} from "@/src/services/supabase/auth";
import { isSupabaseConfigured } from "@/src/services/supabase/config";
import { upsertProfile } from "@/src/services/supabase/profiles";
import type { SupabaseSession, SupabaseUser } from "@/src/services/supabase/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Linking, Platform } from "react-native";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
  message?: string;
  requiresEmailVerification?: boolean;
};

interface AuthContextProps {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthInitializing: boolean;
  isAuthLoading: boolean;
  isBackendConfigured: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string, redirectTo?: string) => Promise<AuthResult>;
  continueWithGoogle: (redirectTo?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthInitializing: true,
  isAuthLoading: false,
  isBackendConfigured: false,
  signIn: async () => ({ ok: false, error: "Auth provider is not mounted." }),
  signUp: async () => ({ ok: false, error: "Auth provider is not mounted." }),
  requestPasswordReset: async () => ({ ok: false, error: "Auth provider is not mounted." }),
  continueWithGoogle: async () => ({ ok: false, error: "Auth provider is not mounted." }),
  signOut: async () => {},
});

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const AUTH_SESSION_KEY = "@ai-gym-trainer/auth-session";

const toAuthMessage = (error: unknown, fallback: string) => {
  const raw = error instanceof Error ? error.message : fallback;
  const normalized = raw.toLowerCase();

  if (normalized.includes("rate limit")) {
    return "Too many signup attempts. Wait a minute and use the verification email already sent.";
  }

  if (normalized.includes("security purposes") && normalized.includes("request")) {
    return "Too many verification requests. Please wait before trying again.";
  }

  if (normalized.includes("user already registered")) {
    return "This email is already registered. Try signing in instead.";
  }

  return raw;
};

const normalizeNameFromEmail = (email: string) => {
  const local = email.split("@")[0] ?? "User";
  const clean = local.replace(/[._-]+/g, " ").trim();
  const formatted = clean
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return formatted || "User";
};

const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
  const derivedName =
    supabaseUser.user_metadata?.full_name?.trim() ||
    supabaseUser.user_metadata?.name?.trim() ||
    normalizeNameFromEmail(supabaseUser.email ?? "");

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: derivedName,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const applySession = useCallback(
    async (nextSession: SupabaseSession, rememberMe: boolean) => {
      const userFromSession = mapSupabaseUser(nextSession.user);
      setSession(nextSession);
      setUser(userFromSession);

      if (rememberMe) {
        await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
      } else {
        await AsyncStorage.removeItem(AUTH_SESSION_KEY);
      }

      void upsertProfile(nextSession.access_token, {
        id: userFromSession.id,
        email: userFromSession.email,
        fullName: userFromSession.name,
      });
    },
    []
  );

  const consumeAuthRedirect = useCallback(
    async (url: string, rememberMe = true) => {
      const hash = url.split("#")[1] ?? "";
      const query = url.split("?")[1]?.split("#")[0] ?? "";
      const paramsFromHash = new URLSearchParams(hash);
      const params = paramsFromHash.get("access_token")
        ? paramsFromHash
        : new URLSearchParams(query);
      const accessToken = params.get("access_token");

      if (!accessToken) {
        return false;
      }

      const refreshToken = params.get("refresh_token") ?? "";
      const expiresInRaw = Number(params.get("expires_in") ?? "3600");
      const expiresIn = Number.isFinite(expiresInRaw) ? expiresInRaw : 3600;
      const tokenType = params.get("token_type") ?? "bearer";
      const expiresAtRaw = Number(params.get("expires_at"));
      const expiresAt = Number.isFinite(expiresAtRaw)
        ? expiresAtRaw
        : Math.floor(Date.now() / 1000) + expiresIn;

      setIsAuthLoading(true);

      try {
        const supabaseUser = await getCurrentUser(accessToken);
        const nextSession: SupabaseSession = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
          expires_at: expiresAt,
          token_type: tokenType,
          user: supabaseUser,
        };

        await applySession(nextSession, rememberMe);

        if (Platform.OS === "web" && typeof window !== "undefined") {
          const cleanUrl = `${window.location.pathname}${window.location.search}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        return true;
      } catch {
        return false;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [applySession]
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setIsAuthInitializing(false);
        }
        return;
      }

      try {
        if (
          Platform.OS === "web" &&
          typeof window !== "undefined" &&
          (await consumeAuthRedirect(window.location.href, true))
        ) {
          return;
        }

        const rawSession = await AsyncStorage.getItem(AUTH_SESSION_KEY);

        if (!rawSession) {
          return;
        }

        const storedSession = JSON.parse(rawSession) as SupabaseSession;

        if (!storedSession.access_token) {
          await AsyncStorage.removeItem(AUTH_SESSION_KEY);
          return;
        }

        const supabaseUser = await getCurrentUser(storedSession.access_token);

        if (!isMounted) {
          return;
        }

        await applySession({ ...storedSession, user: supabaseUser }, true);
      } catch {
        await AsyncStorage.removeItem(AUTH_SESSION_KEY);

        if (!isMounted) {
          return;
        }

        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsAuthInitializing(false);
        }
      }
    };

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [applySession, consumeAuthRedirect]);

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      void consumeAuthRedirect(url, true);
    });

    return () => sub.remove();
  }, [consumeAuthRedirect]);

  const signIn = useCallback(
    async (email: string, password: string, rememberMe = true): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return {
          ok: false,
          error:
            "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to your .env.",
        };
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (password.trim().length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      setIsAuthLoading(true);

      try {
        const nextSession = await signInWithPassword(normalizedEmail, password.trim());
        await applySession(nextSession, rememberMe);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toAuthMessage(error, "Unable to sign in right now."),
        };
      } finally {
        setIsAuthLoading(false);
      }
    },
    [applySession]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return {
          ok: false,
          error:
            "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to your .env.",
        };
      }

      const normalizedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedName) {
        return { ok: false, error: "Enter your full name." };
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (password.trim().length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      setIsAuthLoading(true);

      try {
        const result = await signUpWithPassword(normalizedName, normalizedEmail, password.trim());

        if (!result.session || !result.user) {
          return {
            ok: true,
            message: "Account created. Check your email to verify your account, then sign in.",
            requiresEmailVerification: true,
          };
        }

        await applySession(result.session, true);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          error: toAuthMessage(error, "Unable to create your account right now."),
        };
      } finally {
        setIsAuthLoading(false);
      }
    },
    [applySession]
  );

  const requestPasswordReset = useCallback(
    async (email: string, redirectTo?: string): Promise<AuthResult> => {
      if (!isSupabaseConfigured) {
        return {
          ok: false,
          error:
            "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to your .env.",
        };
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { ok: false, error: "Enter a valid email before requesting reset." };
      }

      setIsAuthLoading(true);

      try {
        await requestPasswordResetEmail(normalizedEmail, redirectTo);
        return { ok: true, message: "Password reset email sent. Check your inbox." };
      } catch (error) {
        return {
          ok: false,
          error: toAuthMessage(error, "Unable to send reset email right now."),
        };
      } finally {
        setIsAuthLoading(false);
      }
    },
    []
  );

  const continueWithGoogle = useCallback(async (redirectTo?: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) {
      return {
        ok: false,
        error:
          "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to your .env.",
      };
    }

    try {
      const oauthUrl = getGoogleOAuthUrl(redirectTo);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.location.assign(oauthUrl);
      } else {
        await Linking.openURL(oauthUrl);
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: toAuthMessage(error, "Unable to continue with Google right now."),
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    const token = session?.access_token;
    setIsAuthLoading(true);

    try {
      if (token) {
        await signOutWithToken(token);
      }
    } catch {
      // Always clear local auth state even if remote logout fails.
    } finally {
      try {
        await AsyncStorage.removeItem(AUTH_SESSION_KEY);
      } catch {
        // Best-effort local cleanup.
      }
      setSession(null);
      setUser(null);
      setIsAuthLoading(false);
    }
  }, [session?.access_token]);

  const accessToken = session?.access_token ?? null;

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user),
      isAuthInitializing,
      isAuthLoading,
      isBackendConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      requestPasswordReset,
      continueWithGoogle,
      signOut,
    }),
    [
      accessToken,
      continueWithGoogle,
      isAuthInitializing,
      isAuthLoading,
      requestPasswordReset,
      signIn,
      signOut,
      signUp,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
