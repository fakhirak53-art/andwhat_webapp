import { createClient } from "@/utils/supabase/server";

interface SchoolPilotRow {
  id: string;
  pilot_status: string | null;
  pilot_expires_at: string | null;
}

export interface PilotAccessResult {
  schoolId: string | null;
  blocked: boolean;
  reason: "expired" | "inactive" | "missing_school" | null;
  pilotStatus: string | null;
  pilotExpiresAt: string | null;
}

function isSchoolBlocked(row: SchoolPilotRow | null): PilotAccessResult {
  if (!row) {
    return {
      schoolId: null,
      blocked: true,
      reason: "missing_school",
      pilotStatus: null,
      pilotExpiresAt: null,
    };
  }

  const status = row.pilot_status ?? "active";
  if (status !== "active") {
    return {
      schoolId: row.id,
      blocked: true,
      reason: "inactive",
      pilotStatus: status,
      pilotExpiresAt: row.pilot_expires_at,
    };
  }

  if (row.pilot_expires_at) {
    const expiresAtMs = new Date(row.pilot_expires_at).getTime();
    if (Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now()) {
      return {
        schoolId: row.id,
        blocked: true,
        reason: "expired",
        pilotStatus: status,
        pilotExpiresAt: row.pilot_expires_at,
      };
    }
  }

  return {
    schoolId: row.id,
    blocked: false,
    reason: null,
    pilotStatus: status,
    pilotExpiresAt: row.pilot_expires_at,
  };
}

export async function getPilotAccessForUser(
  userId: string,
): Promise<PilotAccessResult> {
  const supabase = await createClient();

  const [{ data: teacherSchool }, { data: student }] = await Promise.all([
    supabase
      .from("teacher_schools")
      .select("school_id")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("students")
      .select("school_id")
      .eq("auth_user_id", userId)
      .maybeSingle(),
  ]);

  const schoolId = teacherSchool?.school_id ?? student?.school_id ?? null;
  if (!schoolId) {
    return {
      schoolId: null,
      blocked: false,
      reason: null,
      pilotStatus: null,
      pilotExpiresAt: null,
    };
  }

  const { data: school } = await supabase
    .from("schools")
    .select("id, pilot_status, pilot_expires_at")
    .eq("id", schoolId)
    .maybeSingle();

  return isSchoolBlocked((school as SchoolPilotRow | null) ?? null);
}

export async function getPilotAccessForSchool(
  schoolId: string,
): Promise<PilotAccessResult> {
  const supabase = await createClient();
  const { data: school } = await supabase
    .from("schools")
    .select("id, pilot_status, pilot_expires_at")
    .eq("id", schoolId)
    .maybeSingle();

  return isSchoolBlocked((school as SchoolPilotRow | null) ?? null);
}
