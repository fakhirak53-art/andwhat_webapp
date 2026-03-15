import { createClient } from "@/utils/supabase/server";

/**
 * Resolves the students.id for the currently logged-in auth user.
 * Returns null if no students row exists for this user yet.
 *
 * The students table has its own UUID separate from auth.users.
 * They are linked via students.auth_user_id = auth.users.id
 */
export async function getStudentId(authUserId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", authUserId)
    .single();

  if (error || !data) return null;
  return data.id;
}

/**
 * Returns full student row for the logged-in user.
 * Includes school_id needed for quiz logging.
 */
export async function getStudentRow(authUserId: string): Promise<{
  id: string;
  school_id: string;
  year_level: number | null;
  auth_user_id: string;
} | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("id, school_id, year_level, auth_user_id")
    .eq("auth_user_id", authUserId)
    .single();

  if (error || !data) return null;
  return data;
}
