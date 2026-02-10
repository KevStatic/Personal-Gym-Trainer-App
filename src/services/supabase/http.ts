import { getSupabaseConfig } from "@/src/services/supabase/config";

type SupabaseRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  accessToken?: string;
  body?: unknown;
  prefer?: string;
};

const getErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    if (typeof payload?.error_description === "string") {
      return payload.error_description;
    }
    if (typeof payload?.msg === "string") {
      return payload.msg;
    }
    if (typeof payload?.message === "string") {
      return payload.message;
    }
    if (typeof payload?.error === "string") {
      return payload.error;
    }
  } catch {
    // Ignore JSON parse failures and fallback to status text.
  }

  return response.statusText || "Supabase request failed.";
};

export const supabaseRequest = async <T>(
  path: string,
  options: SupabaseRequestOptions = {}
): Promise<T> => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const { method = "GET", accessToken, body, prefer } = options;

  const headers: Record<string, string> = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken ?? supabaseAnonKey}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (prefer) {
    headers.Prefer = prefer;
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();

  if (!raw) {
    return undefined as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as T;
  }
};
