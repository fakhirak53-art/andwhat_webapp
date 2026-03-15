"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

async function verifyAdmin(): Promise<{
  userId: string;
  schoolId: string;
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: teacherSchool } = await supabase
      .from("teacher_schools")
      .select("school_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!teacherSchool) return null;
    return { userId: user.id, schoolId: teacherSchool.school_id };
  } catch {
    return null;
  }
}

async function studentBelongsToSchool(
  studentId: string,
  schoolId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("school_id", schoolId)
    .maybeSingle();
  return Boolean(data);
}

export async function linkStudentAccount(
  studentId: string,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await studentBelongsToSchool(studentId, admin.schoolId))) {
    return { success: false, error: "Student not found for your school." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  const { data: authIdentity, error: authIdentityError } = await supabase
    .from("high_school_students")
    .select("id, school_email")
    .ilike("school_email", normalizedEmail)
    .maybeSingle();

  let authUserId = authIdentity?.id ?? null;

  // Fallback for environments where high_school_students cannot be read due to RLS:
  // Use a secure definer RPC that looks up auth.users by email.
  if (!authUserId) {
    const { data: rpcUserId } = await supabase.rpc(
      "get_auth_user_id_by_email",
      {
        p_email: normalizedEmail,
      },
    );

    if (typeof rpcUserId === "string" && rpcUserId.length > 0) {
      authUserId = rpcUserId;
    }
  }

  if (!authUserId) {
    if (authIdentityError) {
      return {
        success: false,
        error:
          "Unable to verify that email. Check admin read access for high_school_students or add get_auth_user_id_by_email() RPC.",
      };
    }
    return {
      success: false,
      error: "No auth user found with that email.",
    };
  }

  const { data: existingLink } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", authUserId)
    .neq("id", studentId)
    .maybeSingle();

  if (existingLink) {
    return {
      success: false,
      error: "This auth account is already linked to another student.",
    };
  }

  const { error: updateError } = await supabase
    .from("students")
    .update({ auth_user_id: authUserId })
    .eq("id", studentId)
    .eq("school_id", admin.schoolId);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  return { success: true };
}

export async function unlinkStudentAccount(
  studentId: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await studentBelongsToSchool(studentId, admin.schoolId))) {
    return { success: false, error: "Student not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ auth_user_id: null })
    .eq("id", studentId)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  return { success: true };
}
