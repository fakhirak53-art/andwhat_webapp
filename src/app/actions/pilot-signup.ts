"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

const PILOT_DURATION_DAYS = 30;

export interface PilotSignupState {
  success: boolean;
  error?: string;
  schoolCode?: string;
  teacherCodes?: Array<{ label: string; code: string }>;
}

function randomCode(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function generateUniqueSchoolCode(
  supabase: any,
) {
  for (let attempts = 0; attempts < 10; attempts += 1) {
    const candidate = randomCode(7);
    const { data: existing } = await supabase
      .from("schools")
      .select("id")
      .eq("school_code", candidate)
      .maybeSingle();
    if (!existing) return candidate;
  }
  throw new Error("Unable to generate a unique school code.");
}

export async function submitPilotSignup(
  formData: FormData,
): Promise<PilotSignupState> {
  const schoolName = String(formData.get("school_name") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "")
    .trim()
    .toLowerCase();
  const contactPhone = String(formData.get("contact_phone") ?? "").trim();
  const numClasses = Number(formData.get("num_classes") ?? "1");
  const class1Label = String(formData.get("class_1_label") ?? "").trim();
  const class2Label = String(formData.get("class_2_label") ?? "").trim();
  const class3Label = String(formData.get("class_3_label") ?? "").trim();
  const termsAccepted = formData.get("terms_accepted") === "on";

  if (!schoolName || !contactName || !contactEmail) {
    return {
      success: false,
      error: "School name, contact name, and contact email are required.",
    };
  }

  if (![1, 2, 3].includes(numClasses)) {
    return {
      success: false,
      error: "Please select between 1 and 3 classes.",
    };
  }

  if (!termsAccepted) {
    return {
      success: false,
      error: "You must agree to the pilot terms and data policy.",
    };
  }

  const supabase = await createClient();
  const adminSupabase = getAdminSupabaseClient();
  if (!adminSupabase) {
    return {
      success: false,
      error:
        "Pilot registration is not configured yet. Please set SUPABASE_SERVICE_ROLE_KEY on the server.",
    };
  }

  const classLabels = [
    class1Label || "Class 1",
    class2Label || "Class 2",
    class3Label || "Class 3",
  ].slice(0, numClasses);
  const teacherCodes = classLabels.map((label) => ({
    label,
    code: randomCode(5),
  }));

  try {
    const schoolCode = await generateUniqueSchoolCode(adminSupabase);
    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + PILOT_DURATION_DAYS);

    const { data: school, error: schoolError } = await adminSupabase
      .from("schools")
      .insert({
        name: schoolName,
        school_code: schoolCode,
        pilot_status: "active",
        pilot_started_at: startedAt.toISOString(),
        pilot_expires_at: expiresAt.toISOString(),
        pilot_duration_days: PILOT_DURATION_DAYS,
        pilot_contact_name: contactName,
        pilot_contact_email: contactEmail,
        pilot_contact_phone: contactPhone || null,
      })
      .select("id")
      .single();

    if (schoolError || !school) {
      return {
        success: false,
        error: schoolError?.message ?? "Could not create pilot school.",
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existingMembership } = await adminSupabase
        .from("teacher_schools")
        .select("id")
        .eq("user_id", user.id)
        .eq("school_id", school.id)
        .maybeSingle();

      if (!existingMembership) {
        await adminSupabase.from("teacher_schools").insert({
          user_id: user.id,
          school_id: school.id,
          role: "admin",
        });
      }
    }

    const { error: signupError } = await adminSupabase
      .from("school_pilot_signups")
      .insert({
        school_name: schoolName,
        district: district || null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        num_classes: numClasses,
        class_1_label: teacherCodes[0]?.label ?? null,
        class_2_label: teacherCodes[1]?.label ?? null,
        class_3_label: teacherCodes[2]?.label ?? null,
        class_1_code: teacherCodes[0]?.code ?? null,
        class_2_code: teacherCodes[1]?.code ?? null,
        class_3_code: teacherCodes[2]?.code ?? null,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        status: "provisioned",
        provisioned_school_id: school.id,
        provisioned_admin_user_id: user?.id ?? null,
      });

    if (signupError) {
      return { success: false, error: signupError.message };
    }

    return {
      success: true,
      schoolCode,
      teacherCodes,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to submit pilot signup right now.",
    };
  }
}
