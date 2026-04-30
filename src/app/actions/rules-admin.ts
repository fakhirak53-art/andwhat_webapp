"use server";

import { revalidatePath } from "next/cache";
import { getPilotAccessForSchool } from "@/lib/pilot-access";
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
    const pilotAccess = await getPilotAccessForSchool(teacherSchool.school_id);
    if (pilotAccess.blocked) return null;
    return { userId: user.id, schoolId: teacherSchool.school_id };
  } catch {
    return null;
  }
}

async function ruleBelongsToSchool(
  ruleId: string,
  schoolId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("protected_rules")
    .select("id")
    .eq("id", ruleId)
    .eq("school_id", schoolId)
    .maybeSingle();
  return Boolean(data);
}

async function setBelongsToSchool(
  setId: string,
  schoolId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("question_sets")
    .select("id")
    .eq("id", setId)
    .eq("school_id", schoolId)
    .maybeSingle();
  return Boolean(data);
}

function parseYear(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value || value === "all") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePriority(raw: FormDataEntryValue | null): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.floor(value);
}

function parseActive(raw: FormDataEntryValue | null): boolean {
  return raw === "true" || raw === "on";
}

export async function createRule(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const pattern = String(formData.get("pattern") ?? "").trim();
  const questionSetId = String(formData.get("question_set_id") ?? "").trim();
  const yearLevel = parseYear(formData.get("year_level"));
  const priority = parsePriority(formData.get("priority"));
  const isActive = parseActive(formData.get("is_active"));

  if (!pattern || !questionSetId) {
    return { success: false, error: "Pattern and question set are required." };
  }

  if (!(await setBelongsToSchool(questionSetId, admin.schoolId))) {
    return { success: false, error: "Question set not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("protected_rules").insert({
    school_id: admin.schoolId,
    year_level: yearLevel,
    pattern,
    question_set_id: questionSetId,
    is_active: isActive,
    priority,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/rules");
  return { success: true };
}

export async function updateRule(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await ruleBelongsToSchool(id, admin.schoolId))) {
    return { success: false, error: "Rule not found for your school." };
  }

  const pattern = String(formData.get("pattern") ?? "").trim();
  const questionSetId = String(formData.get("question_set_id") ?? "").trim();
  const yearLevel = parseYear(formData.get("year_level"));
  const priority = parsePriority(formData.get("priority"));
  const isActive = parseActive(formData.get("is_active"));

  if (!pattern || !questionSetId) {
    return { success: false, error: "Pattern and question set are required." };
  }

  if (!(await setBelongsToSchool(questionSetId, admin.schoolId))) {
    return { success: false, error: "Question set not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("protected_rules")
    .update({
      pattern,
      question_set_id: questionSetId,
      year_level: yearLevel,
      priority,
      is_active: isActive,
    })
    .eq("id", id)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/rules");
  return { success: true };
}

export async function deleteRule(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await ruleBelongsToSchool(id, admin.schoolId))) {
    return { success: false, error: "Rule not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("protected_rules")
    .delete()
    .eq("id", id)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/rules");
  return { success: true };
}

export async function toggleRule(
  id: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await ruleBelongsToSchool(id, admin.schoolId))) {
    return { success: false, error: "Rule not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("protected_rules")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/rules");
  return { success: true };
}
