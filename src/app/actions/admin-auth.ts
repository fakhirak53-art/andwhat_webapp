"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPilotAccessForSchool } from "@/lib/pilot-access";
import { createClient } from "@/utils/supabase/server";

export async function adminLogin(
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unable to verify this account." };
  }

  const { data: teacherSchool } = await supabase
    .from("teacher_schools")
    .select("user_id, school_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!teacherSchool) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  const pilotAccess = await getPilotAccessForSchool(teacherSchool.school_id);
  if (pilotAccess.blocked) {
    await supabase.auth.signOut();
    return {
      error:
        "This school pilot has expired. Please contact support to reactivate access.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}
