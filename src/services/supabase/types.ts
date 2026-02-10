export interface SupabaseUser {
  id: string;
  email: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: SupabaseUser;
}
