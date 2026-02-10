import { supabaseRequest } from "@/src/services/supabase/http";

type UpsertProfileInput = {
  id: string;
  email: string;
  fullName: string;
};

export const upsertProfile = async (
  accessToken: string,
  profile: UpsertProfileInput
) => {
  await supabaseRequest("/rest/v1/profiles", {
    method: "POST",
    accessToken,
    prefer: "resolution=merge-duplicates,return=minimal",
    body: [
      {
        id: profile.id,
        email: profile.email,
        full_name: profile.fullName,
      },
    ],
  });
};
