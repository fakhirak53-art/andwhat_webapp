"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface TeacherOnboardingResult {
  error?: string;
}

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isPilotExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

export async function registerTeacher(
  formData: FormData,
): Promise<TeacherOnboardingResult | void> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const schoolCode = String(formData.get("school_code") ?? "").trim().toUpperCase();
  const teacherCode = String(formData.get("teacher_code") ?? "").trim().toUpperCase();

  if (!fullName || !email || !password || !schoolCode || !teacherCode) {
    return { error: "All fields are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const adminSupabase = getAdminSupabaseClient();
  if (!adminSupabase) {
    return {
      error:
        "Teacher onboarding is not configured. Please set SUPABASE_SERVICE_ROLE_KEY on the server.",
    };
  }

  const { data: school } = await adminSupabase
    .from("schools")
    .select("id, pilot_status, pilot_expires_at")
    .eq("school_code", schoolCode)
    .maybeSingle();

  if (!school) return { error: "Invalid school code." };
  if (school.pilot_status !== "active" || isPilotExpired(school.pilot_expires_at)) {
    return { error: "This school's pilot is not currently active." };
  }

  const { data: signups } = await adminSupabase
    .from("school_pilot_signups")
    .select("class_1_code, class_2_code, class_3_code")
    .eq("provisioned_school_id", school.id)
    .eq("status", "provisioned")
    .order("created_at", { ascending: false })
    .limit(10);

  const validCodes = new Set<string>();
  for (const row of signups ?? []) {
    [row.class_1_code, row.class_2_code, row.class_3_code]
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .forEach((value) => validCodes.add(value.toUpperCase()));
  }

  if (!validCodes.has(teacherCode)) {
    return { error: "Invalid teacher code for this school." };
  }

  const { data: createdUser, error: createUserError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createUserError || !createdUser.user) {
    return {
      error: createUserError?.message ?? "Could not create teacher account.",
    };
  }

  const { error: membershipError } = await adminSupabase
    .from("teacher_schools")
    .insert({
      user_id: createdUser.user.id,
      school_id: school.id,
      role: "teacher",
    });

  if (membershipError) {
    return {
      error: membershipError.message,
    };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    return {
      error:
        "Account created, but automatic login failed. Please sign in from admin login.",
    };
  }

  redirect("/admin");
}
