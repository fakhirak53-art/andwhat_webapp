/*
  IMPORTANT: Run this SQL in Supabase before using enrollment features:

  create table if not exists public.student_enrollments (
    id uuid not null default gen_random_uuid(),
    student_id uuid not null references auth.users(id) on delete cascade,
    question_set_id uuid not null references public.question_sets(id) on delete cascade,
    enrolled_at timestamp with time zone not null default now(),
    constraint student_enrollments_pkey primary key (id),
    constraint student_enrollments_unique unique (student_id, question_set_id)
  );

  alter table public.student_enrollments enable row level security;

  create policy "Students manage own enrollments"
  on public.student_enrollments
  for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

  create policy "Students read active question sets"
  on public.question_sets for select
  using (is_active = true);
*/
/*
  REQUIRED SQL — run in Supabase SQL Editor:

  -- Step 1: Add auth_user_id column to students table
  alter table public.students
    add column if not exists auth_user_id uuid references auth.users(id);

  -- Step 2: Add index for fast lookup
  create index if not exists students_auth_user_id_idx
    on public.students(auth_user_id);

  -- Step 3: Update RLS so students can read their own row
  create policy "Students read own student row"
  on public.students for select
  using (auth.uid() = auth_user_id);

  -- Step 4: Update the handle_new_user trigger to also
  -- create a students row on signup.
  -- Run this to replace the existing trigger function:

  create or replace function public.handle_new_user()
  returns trigger as $$
  declare
    default_school_id uuid;
    new_student_id uuid;
  begin
    insert into public.profiles (id, user_type, full_name)
    values (
      new.id,
      coalesce(
        (new.raw_user_meta_data->>'user_type')::user_type,
        'HIGH_SCHOOL'::user_type
      ),
      coalesce(new.raw_user_meta_data->>'full_name', 'Student')
    );

    select id into default_school_id from public.schools limit 1;

    if default_school_id is not null then
      new_student_id := gen_random_uuid();
      insert into public.students (
        id,
        school_id,
        auth_user_id,
        external_hash,
        student_secret
      ) values (
        new_student_id,
        default_school_id,
        new.id,
        encode(gen_random_bytes(16), 'hex'),
        encode(gen_random_bytes(16), 'hex')
      );
    end if;

    return new;
  exception when others then
    raise log 'handle_new_user error: % %', SQLERRM, SQLSTATE;
    return new;
  end;
  $$ language plpgsql security definer set search_path = public;
*/
import { calculateStreak, isUUID } from "@/lib/utils";
import type {
  DashboardStats,
  HighSchoolStudent,
  Profile,
  QuestionLog,
  QuestionSet,
  School,
  SpacedRepetitionItem,
  StudentSubjectPreference,
  Subject,
} from "@/types/database";
import { createClient } from "@/utils/supabase/server";

const EMPTY_STATS: DashboardStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  accuracyRate: 0,
  activeSets: 0,
  streakDays: 0,
  thisWeekAnswered: 0,
};

interface QuestionCountRow {
  question_set_id: string;
}

function mapQuestionSetRow(row: {
  id: string;
  set_name: string;
  year_level: number;
  is_active: boolean;
  subject_id: string;
  school_id: string;
  created_at: string;
  subjects?: Subject | null;
  schools?: School | null;
}): QuestionSet {
  return {
    id: row.id,
    set_name: row.set_name,
    year_level: row.year_level,
    is_active: row.is_active,
    subject_id: row.subject_id,
    school_id: row.school_id,
    created_at: row.created_at,
    subject: row.subjects ?? undefined,
    school: row.schools ?? undefined,
  };
}

async function resolveLogStudentIds(authUserId: string): Promise<string[]> {
  try {
    const supabase = await createClient();
    const ids = [authUserId];
    const { data: studentRow } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (studentRow?.id && studentRow.id !== authUserId) {
      ids.push(studentRow.id);
    }

    return ids;
  } catch {
    return [authUserId];
  }
}

export async function getStudentProfile(
  userId: string,
): Promise<{ profile: Profile; student: HighSchoolStudent | null } | null> {
  try {
    const supabase = await createClient();

    const [profileResponse, studentResponse] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("high_school_students")
        .select("*")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    if (profileResponse.error || !profileResponse.data) {
      return null;
    }

    const student = studentResponse.error
      ? null
      : (studentResponse.data as HighSchoolStudent | null);

    return {
      profile: profileResponse.data as Profile,
      student,
    };
  } catch {
    return null;
  }
}

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);
    const { data, error } = await supabase
      .from("question_logs")
      .select("is_correct, answered_at, question_set_id")
      .in("student_id", logStudentIds);

    if (error || !data) return EMPTY_STATS;

    const totalAnswered = data.length;
    const totalCorrect = data.filter((log) => log.is_correct).length;
    const accuracyRate =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const weekCutoff = new Date();
    weekCutoff.setDate(weekCutoff.getDate() - 7);
    const thisWeekAnswered = data.filter(
      (log) => new Date(log.answered_at) >= weekCutoff,
    ).length;

    const streakDays = calculateStreak(data.map((log) => log.answered_at));

    const monthCutoff = new Date();
    monthCutoff.setDate(monthCutoff.getDate() - 30);
    const recentSetIds = new Set(
      data
        .filter((log) => new Date(log.answered_at) >= monthCutoff)
        .map((log) => log.question_set_id),
    );

    return {
      totalAnswered,
      totalCorrect,
      accuracyRate,
      activeSets: recentSetIds.size,
      streakDays,
      thisWeekAnswered,
    };
  } catch {
    return EMPTY_STATS;
  }
}

export async function getRecentActivity(
  userId: string,
): Promise<QuestionLog[]> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);
    const { data, error } = await supabase
      .from("question_logs")
      .select(
        "id, student_id, question_id, question_set_id, subject_id, selected_answer, is_correct, attempt_number, response_time_ms, blocked_site, answered_at, question_sets(set_name), subjects(name)",
      )
      .in("student_id", logStudentIds)
      .order("answered_at", { ascending: false })
      .limit(10);

    if (error || !data) return [];

    return data as unknown as QuestionLog[];
  } catch {
    return [];
  }
}

export async function getActiveQuestionSets(
  userId: string,
): Promise<QuestionSet[]> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);

    const { data: studentRow } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", userId)
      .maybeSingle();

    const [logsResponse, prefsResponse] = await Promise.all([
      supabase
        .from("question_logs")
        .select("question_set_id")
        .in("student_id", logStudentIds),
      supabase
        .from("student_subject_preferences")
        .select("subject_id")
        .eq("student_id", studentRow?.id ?? userId)
        .eq("is_active", true),
    ]);

    const logSetIds = new Set<string>(
      (logsResponse.data ?? []).map((row) => row.question_set_id),
    );
    const preferredSubjectIds = new Set<string>(
      (prefsResponse.data ?? []).map((row) => row.subject_id),
    );

    if (logSetIds.size === 0 && preferredSubjectIds.size === 0) return [];

    const setQueries: Promise<{
      data:
        | {
            id: string;
            set_name: string;
            year_level: number;
            is_active: boolean;
            subject_id: string;
            school_id: string;
            created_at: string;
            subjects?: Subject | null;
            schools?: School | null;
          }[]
        | null;
      error: Error | null;
    }>[] = [];

    if (logSetIds.size > 0) {
      setQueries.push(
        supabase
          .from("question_sets")
          .select(
            "id, set_name, year_level, is_active, subject_id, school_id, created_at, subjects(id, name, year_level, curriculum_code), schools(id, name, school_code, timezone)",
          )
          .in("id", Array.from(logSetIds))
          .eq("is_active", true) as unknown as Promise<{
          data:
            | {
                id: string;
                set_name: string;
                year_level: number;
                is_active: boolean;
                subject_id: string;
                school_id: string;
                created_at: string;
                subjects?: Subject | null;
                schools?: School | null;
              }[]
            | null;
          error: Error | null;
        }>,
      );
    }

    if (preferredSubjectIds.size > 0) {
      setQueries.push(
        supabase
          .from("question_sets")
          .select(
            "id, set_name, year_level, is_active, subject_id, school_id, created_at, subjects(id, name, year_level, curriculum_code), schools(id, name, school_code, timezone)",
          )
          .in("subject_id", Array.from(preferredSubjectIds))
          .eq("is_active", true) as unknown as Promise<{
          data:
            | {
                id: string;
                set_name: string;
                year_level: number;
                is_active: boolean;
                subject_id: string;
                school_id: string;
                created_at: string;
                subjects?: Subject | null;
                schools?: School | null;
              }[]
            | null;
          error: Error | null;
        }>,
      );
    }

    const setResults = await Promise.all(setQueries);
    const mergedMap = new Map<string, QuestionSet>();

    for (const result of setResults) {
      if (result.error || !result.data) continue;
      for (const row of result.data) {
        mergedMap.set(row.id, mapQuestionSetRow(row));
      }
    }

    const sets = Array.from(mergedMap.values());
    if (sets.length === 0) return [];

    const { data: countRows, error: countError } = await supabase
      .from("questions")
      .select("question_set_id")
      .in(
        "question_set_id",
        sets.map((set) => set.id),
      );

    const countMap = new Map<string, number>();
    if (!countError && countRows) {
      for (const row of countRows as QuestionCountRow[]) {
        countMap.set(
          row.question_set_id,
          (countMap.get(row.question_set_id) ?? 0) + 1,
        );
      }
    }

    return sets
      .map((set) => ({
        ...set,
        question_count: countMap.get(set.id) ?? 0,
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  } catch {
    return [];
  }
}

export async function searchQuestionSets(
  query: string,
): Promise<QuestionSet[]> {
  try {
    const supabase = await createClient();
    const trimmed = query.trim();

    const baseQuery = supabase
      .from("question_sets")
      .select(
        "id, set_name, year_level, is_active, subject_id, school_id, created_at, subjects(id, name, year_level, curriculum_code), schools(id, name, school_code, timezone)",
      )
      .eq("is_active", true);

    const { data, error } = isUUID(trimmed)
      ? await baseQuery.eq("id", trimmed).limit(1)
      : trimmed.startsWith("QS-") || trimmed.length <= 10
        ? await baseQuery.ilike("reference_code", trimmed).limit(10)
        : await baseQuery.ilike("set_name", `%${trimmed}%`).limit(10);

    if (error || !data || data.length === 0) return [];

    const sets = data.map((row) =>
      mapQuestionSetRow(
        row as unknown as {
          id: string;
          set_name: string;
          year_level: number;
          is_active: boolean;
          subject_id: string;
          school_id: string;
          created_at: string;
          subjects?: Subject | null;
          schools?: School | null;
        },
      ),
    );

    const { data: countRows, error: countError } = await supabase
      .from("questions")
      .select("question_set_id")
      .in(
        "question_set_id",
        sets.map((set) => set.id),
      );

    const countMap = new Map<string, number>();
    if (!countError && countRows) {
      for (const row of countRows as QuestionCountRow[]) {
        countMap.set(
          row.question_set_id,
          (countMap.get(row.question_set_id) ?? 0) + 1,
        );
      }
    }

    return sets.map((set) => ({
      ...set,
      question_count: countMap.get(set.id) ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getSubjectPreferences(
  authUserId: string,
): Promise<StudentSubjectPreference[]> {
  const supabase = await createClient();

  const { data: studentRow } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", authUserId)
    .single();

  if (!studentRow) return [];

  const { data, error } = await supabase
    .from("student_subject_preferences")
    .select("*, subjects (id, name, year_level, curriculum_code)")
    .eq("student_id", studentRow.id)
    .eq("is_active", true)
    .order("priority", { ascending: true });

  if (error) return [];
  return (data ?? []) as StudentSubjectPreference[];
}

export async function getAccuracyBySubject(
  userId: string,
): Promise<
  Array<{ subject_name: string; correct: number; total: number; rate: number }>
> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);
    const { data, error } = await supabase
      .from("question_logs")
      .select("subject_id, is_correct, subjects(name)")
      .in("student_id", logStudentIds);

    if (error || !data || data.length === 0) return [];

    const subjectMap = new Map<
      string,
      { subject_name: string; correct: number; total: number }
    >();

    for (const row of data as unknown as Array<{
      subject_id: string;
      is_correct: boolean;
      subjects?: { name: string } | null;
    }>) {
      const key = row.subject_id;
      const current = subjectMap.get(key) ?? {
        subject_name: row.subjects?.name ?? "Unknown subject",
        correct: 0,
        total: 0,
      };

      current.total += 1;
      if (row.is_correct) current.correct += 1;
      subjectMap.set(key, current);
    }

    return Array.from(subjectMap.values())
      .map((subject) => ({
        ...subject,
        rate:
          subject.total > 0
            ? Math.round((subject.correct / subject.total) * 100)
            : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  } catch {
    return [];
  }
}

interface EnrollmentRow {
  enrolled_at: string;
  question_sets: {
    id: string;
    set_name: string;
    year_level: number;
    is_active: boolean;
    subject_id: string;
    school_id: string;
    created_at: string;
    subjects?: Subject | null;
    schools?: School | null;
  } | null;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(input: Date, days: number): Date {
  const next = new Date(input);
  next.setDate(next.getDate() + days);
  return next;
}

export async function getEnrolledSets(userId: string): Promise<QuestionSet[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_enrollments")
      .select(
        "enrolled_at, question_sets(id, set_name, year_level, is_active, subject_id, school_id, created_at, subjects(id, name, year_level, curriculum_code), schools(id, name, school_code, timezone))",
      )
      .eq("student_id", userId);

    if (error || !data) return [];

    const sets = (data as unknown as EnrollmentRow[])
      .map((row) => row.question_sets)
      .filter((set): set is NonNullable<EnrollmentRow["question_sets"]> =>
        Boolean(set?.is_active),
      )
      .map((set) => mapQuestionSetRow(set));

    if (sets.length === 0) return [];

    const { data: questionRows, error: questionError } = await supabase
      .from("questions")
      .select("question_set_id")
      .in(
        "question_set_id",
        sets.map((set) => set.id),
      );

    const countMap = new Map<string, number>();
    if (!questionError && questionRows) {
      for (const row of questionRows as QuestionCountRow[]) {
        countMap.set(
          row.question_set_id,
          (countMap.get(row.question_set_id) ?? 0) + 1,
        );
      }
    }

    return sets
      .map((set) => ({
        ...set,
        question_count: countMap.get(set.id) ?? 0,
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  } catch {
    return [];
  }
}

export async function getSpacedRepetitionSchedule(
  userId: string,
): Promise<SpacedRepetitionItem[]> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);
    const enrolledSets = await getEnrolledSets(userId);

    if (enrolledSets.length === 0) return [];

    const { data: logs, error: logsError } = await supabase
      .from("question_logs")
      .select("question_set_id, is_correct, answered_at")
      .in("student_id", logStudentIds)
      .in(
        "question_set_id",
        enrolledSets.map((set) => set.id),
      )
      .order("answered_at", { ascending: false });

    if (logsError) return [];

    const today = startOfDay(new Date());
    const grouped = new Map<
      string,
      Array<{
        question_set_id: string;
        is_correct: boolean;
        answered_at: string;
      }>
    >();

    for (const row of (logs ?? []) as Array<{
      question_set_id: string;
      is_correct: boolean;
      answered_at: string;
    }>) {
      const current = grouped.get(row.question_set_id) ?? [];
      current.push(row);
      grouped.set(row.question_set_id, current);
    }

    const schedule: SpacedRepetitionItem[] = enrolledSets
      .map((set) => {
        const entries = grouped.get(set.id) ?? [];
        if (entries.length === 0) {
          return {
            question_set_id: set.id,
            set_name: set.set_name,
            subject_name: set.subject?.name ?? "Unknown subject",
            last_answered: "",
            next_due: today.toISOString(),
            is_due_today: false,
            interval_days: 0,
            accuracy_rate: 0,
            total_attempts: 0,
          };
        }

        const lastAnswered = entries[0].answered_at;
        const correct = entries.filter((entry) => entry.is_correct).length;
        const totalAttempts = entries.length;
        const accuracyRate = Math.round((correct / totalAttempts) * 100);
        const intervalDays = accuracyRate < 60 ? 1 : accuracyRate < 80 ? 3 : 7;
        const nextDueDate = addDays(
          startOfDay(new Date(lastAnswered)),
          intervalDays,
        );
        const isDueToday = nextDueDate.getTime() <= today.getTime();

        return {
          question_set_id: set.id,
          set_name: set.set_name,
          subject_name: set.subject?.name ?? "Unknown subject",
          last_answered: lastAnswered,
          next_due: nextDueDate.toISOString(),
          is_due_today: isDueToday,
          interval_days: intervalDays,
          accuracy_rate: accuracyRate,
          total_attempts: totalAttempts,
        };
      })
      // Only include sets that have been practiced at least once.
      .filter((item) => item.total_attempts > 0);

    return schedule.sort((a, b) => {
      if (a.is_due_today !== b.is_due_today) return a.is_due_today ? -1 : 1;
      return new Date(a.next_due).getTime() - new Date(b.next_due).getTime();
    });
  } catch {
    return [];
  }
}

export async function getSetProgress(
  userId: string,
  questionSetId: string,
): Promise<{
  total_questions: number;
  answered: number;
  correct: number;
  accuracy: number;
  last_practiced: string | null;
}> {
  try {
    const supabase = await createClient();
    const logStudentIds = await resolveLogStudentIds(userId);

    const [questionsResponse, logsResponse] = await Promise.all([
      supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("question_set_id", questionSetId),
      supabase
        .from("question_logs")
        .select("question_id, is_correct, answered_at")
        .in("student_id", logStudentIds)
        .eq("question_set_id", questionSetId)
        .order("answered_at", { ascending: false }),
    ]);

    const totalQuestions = questionsResponse.count ?? 0;
    const logs = (logsResponse.data ?? []) as Array<{
      question_id: string;
      is_correct: boolean;
      answered_at: string;
    }>;

    const answeredDistinct = new Set(logs.map((log) => log.question_id)).size;
    const correct = logs.filter((log) => log.is_correct).length;
    const accuracy =
      logs.length > 0 ? Math.round((correct / logs.length) * 100) : 0;
    const lastPracticed = logs.length > 0 ? logs[0].answered_at : null;

    return {
      total_questions: totalQuestions,
      answered: answeredDistinct,
      correct,
      accuracy,
      last_practiced: lastPracticed,
    };
  } catch {
    return {
      total_questions: 0,
      answered: 0,
      correct: 0,
      accuracy: 0,
      last_practiced: null,
    };
  }
}
