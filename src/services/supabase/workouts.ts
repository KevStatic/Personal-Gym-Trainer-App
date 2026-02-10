import { supabaseRequest } from "@/src/services/supabase/http";

export type WorkoutSession = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  duration_minutes: number | null;
  calories_burned: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
};

type WorkoutSessionInsert = {
  title: string;
  notes?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  startedAt?: string;
  completedAt?: string;
};

export const listWorkoutSessions = async (accessToken: string, userId: string) => {
  const params =
    `?user_id=eq.${encodeURIComponent(userId)}` +
    "&order=created_at.desc" +
    "&select=id,user_id,title,notes,duration_minutes,calories_burned,started_at,completed_at,created_at";

  return supabaseRequest<WorkoutSession[]>(`/rest/v1/workout_sessions${params}`, {
    method: "GET",
    accessToken,
  });
};

export const createWorkoutSession = async (
  accessToken: string,
  payload: WorkoutSessionInsert
) => {
  const [created] = await supabaseRequest<WorkoutSession[]>("/rest/v1/workout_sessions", {
    method: "POST",
    accessToken,
    prefer: "return=representation",
    body: [
      {
        title: payload.title,
        notes: payload.notes ?? null,
        duration_minutes: payload.durationMinutes ?? null,
        calories_burned: payload.caloriesBurned ?? null,
        started_at: payload.startedAt ?? new Date().toISOString(),
        completed_at: payload.completedAt ?? null,
      },
    ],
  });

  return created;
};
