import { supabaseRequest } from "@/src/services/supabase/http";
import { getSupabaseConfig } from "@/src/services/supabase/config";
import type { SupabaseSession, SupabaseUser } from "@/src/services/supabase/types";

type SignUpPayload = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
};

export const signInWithPassword = async (email: string, password: string) => {
  return supabaseRequest<SupabaseSession>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
};

export const signUpWithPassword = async (name: string, email: string, password: string) => {
  return supabaseRequest<SignUpPayload>("/auth/v1/signup", {
    method: "POST",
    body: {
      email,
      password,
      data: {
        full_name: name,
      },
    },
  });
};

export const signOutWithToken = async (accessToken: string) => {
  await supabaseRequest<void>("/auth/v1/logout", {
    method: "POST",
    accessToken,
  });
};

export const getCurrentUser = async (accessToken: string) => {
  return supabaseRequest<SupabaseUser>("/auth/v1/user", {
    method: "GET",
    accessToken,
  });
};

export const requestPasswordResetEmail = async (
  email: string,
  redirectTo?: string
) => {
  await supabaseRequest<void>("/auth/v1/recover", {
    method: "POST",
    body: {
      email,
      ...(redirectTo ? { redirect_to: redirectTo } : {}),
    },
  });
};

export const getGoogleOAuthUrl = (redirectTo?: string) => {
  const { supabaseUrl } = getSupabaseConfig();
  const url = new URL(`${supabaseUrl}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");

  if (redirectTo) {
    url.searchParams.set("redirect_to", redirectTo);
  }

  return url.toString();
};
