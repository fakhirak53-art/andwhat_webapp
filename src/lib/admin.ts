import type {
  AdminProfile,
  AdminRole,
  AdminStats,
  RecentActivity,
  StudentRow,
} from "@/types/admin";
import type {
  Question,
  QuestionLog,
  QuestionSet,
  Subject,
} from "@/types/database";
import { createClient } from "@/utils/supabase/server";

const EMPTY_STATS: AdminStats = {
  totalStudents: 0,
  activeStudentsThisWeek: 0,
  newSignupsThisWeek: 0,
  totalQuizCompletions: 0,
  totalQuestionSets: 0,
  averageAccuracy: 0,
  completionsToday: 0,
  completionsThisWeek: 0,
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function relationName(value: unknown, key: string): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    const first = value[0] as Record<string, unknown> | undefined;
    return typeof first?.[key] === "string" ? (first[key] as string) : null;
  }
  if (typeof value === "object") {
    const row = value as Record<string, unknown>;
    return typeof row[key] === "string" ? (row[key] as string) : null;
  }
  return null;
}

export async function getAdminProfile(
  userId: string,
): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient();

    const { data: teacherSchool, error: teacherSchoolError } = await supabase
      .from("teacher_schools")
      .select("user_id, school_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (teacherSchoolError || !teacherSchool) return null;

    const [{ data: school }, { data: profile }] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name, school_code")
        .eq("id", teacherSchool.school_id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    return {
      user_id: teacherSchool.user_id,
      full_name: profile?.full_name ?? "Admin user",
      school_id: teacherSchool.school_id,
      school_name: school?.name ?? "School",
      school_code: school?.school_code ?? "N/A",
      role: teacherSchool.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export async function getAdminStats(schoolId: string): Promise<AdminStats> {
  try {
    const supabase = await createClient();
    const today = startOfToday();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      studentsCountResponse,
      activeLogsResponse,
      newSignupsResponse,
      logsCountResponse,
      questionSetsCountResponse,
      accuracyLogsResponse,
      todayCompletionsResponse,
      weekCompletionsResponse,
    ] = await Promise.all([
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId),
      supabase
        .from("question_logs")
        .select("student_id")
        .eq("school_id", schoolId)
        .gte("answered_at", weekAgo.toISOString()),
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .gte("created_at", weekAgo.toISOString()),
      supabase
        .from("question_logs")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId),
      supabase
        .from("question_sets")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId),
      supabase
        .from("question_logs")
        .select("is_correct")
        .eq("school_id", schoolId),
      supabase
        .from("question_logs")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .gte("answered_at", today.toISOString()),
      supabase
        .from("question_logs")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .gte("answered_at", weekAgo.toISOString()),
    ]);

    const activeStudentCount = activeLogsResponse.data
      ? new Set(activeLogsResponse.data.map((row) => row.student_id)).size
      : 0;

    const accuracyRows = accuracyLogsResponse.data ?? [];
    const totalRows = accuracyRows.length;
    const correctRows = accuracyRows.filter((row) => row.is_correct).length;
    const averageAccuracy =
      totalRows > 0 ? Math.round((correctRows / totalRows) * 100) : 0;

    return {
      totalStudents: studentsCountResponse.count ?? 0,
      activeStudentsThisWeek: activeStudentCount,
      newSignupsThisWeek: newSignupsResponse.count ?? 0,
      totalQuizCompletions: logsCountResponse.count ?? 0,
      totalQuestionSets: questionSetsCountResponse.count ?? 0,
      averageAccuracy,
      completionsToday: todayCompletionsResponse.count ?? 0,
      completionsThisWeek: weekCompletionsResponse.count ?? 0,
    };
  } catch {
    return EMPTY_STATS;
  }
}

export async function getRecentSchoolActivity(
  schoolId: string,
): Promise<RecentActivity[]> {
  try {
    const supabase = await createClient();
    const { data: logs, error } = await supabase
      .from("question_logs")
      .select(
        "student_id, is_correct, answered_at, question_sets(set_name), subjects(name)",
      )
      .eq("school_id", schoolId)
      .order("answered_at", { ascending: false })
      .limit(20);

    if (error || !logs) return [];

    const studentIds = Array.from(new Set(logs.map((log) => log.student_id)));

    const [profilesResponse, studentEmailsResponse] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", studentIds),
      supabase
        .from("high_school_students")
        .select("id, school_email")
        .in("id", studentIds),
    ]);

    const nameById = new Map<string, string | null>(
      (profilesResponse.data ?? []).map((row) => [row.id, row.full_name]),
    );
    const emailById = new Map<string, string | null>(
      (studentEmailsResponse.data ?? []).map((row) => [
        row.id,
        row.school_email,
      ]),
    );

    return logs.map((log) => ({
      student_name: nameById.get(log.student_id) ?? null,
      email: emailById.get(log.student_id) ?? null,
      event_type: "question_answered",
      set_name: relationName(log.question_sets, "set_name"),
      subject_name: relationName(log.subjects, "name"),
      is_correct: log.is_correct,
      answered_at: log.answered_at,
    }));
  } catch {
    return [];
  }
}

export async function getDailyCompletions(
  schoolId: string,
): Promise<Array<{ date: string; count: number }>> {
  try {
    const supabase = await createClient();
    const today = startOfToday();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 13);

    const { data, error } = await supabase
      .from("question_logs")
      .select("answered_at")
      .eq("school_id", schoolId)
      .gte("answered_at", startDate.toISOString())
      .order("answered_at", { ascending: true });

    if (error) return [];

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const key = toDateKey(new Date(row.answered_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const result: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < 14; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = toDateKey(date);
      result.push({ date: key, count: counts.get(key) ?? 0 });
    }

    return result;
  } catch {
    return [];
  }
}

export interface Textbook {
  id: string;
  school_id: string;
  subject_id: string;
  title: string;
  publisher: string | null;
  year_level: number | null;
  is_active: boolean;
}

interface AdminQuestionSet extends QuestionSet {
  textbook?: Textbook | null;
  textbook_id?: string | null;
  reference_code?: string | null;
}

export async function getAdminQuestionSets(
  schoolId: string,
): Promise<QuestionSet[]> {
  try {
    const supabase = await createClient();
    const { data: setsData, error: setsError } = await supabase
      .from("question_sets")
      .select(
        "id, reference_code, set_name, year_level, is_active, subject_id, school_id, created_at, textbook_id, subjects(id, name, year_level, curriculum_code), textbooks(id, school_id, subject_id, title, publisher, year_level, is_active)",
      )
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (setsError || !setsData) return [];

    const setRows = setsData as unknown as Array<{
      id: string;
      reference_code?: string | null;
      set_name: string;
      year_level: number;
      is_active: boolean;
      subject_id: string;
      school_id: string;
      created_at: string;
      textbook_id?: string | null;
      subjects?: Subject[] | Subject | null;
      textbooks?: Textbook[] | Textbook | null;
    }>;

    const setIds = setRows.map((set) => set.id);
    const { data: questionRows } = await supabase
      .from("questions")
      .select("question_set_id")
      .in("question_set_id", setIds);

    const counts = new Map<string, number>();
    for (const row of (questionRows ?? []) as Array<{
      question_set_id: string;
    }>) {
      counts.set(
        row.question_set_id,
        (counts.get(row.question_set_id) ?? 0) + 1,
      );
    }

    return setRows.map((set) => {
      const subject = Array.isArray(set.subjects)
        ? set.subjects[0]
        : set.subjects;
      const textbook = Array.isArray(set.textbooks)
        ? set.textbooks[0]
        : set.textbooks;
      const mapped: AdminQuestionSet = {
        id: set.id,
        reference_code: set.reference_code ?? null,
        set_name: set.set_name,
        year_level: set.year_level,
        is_active: set.is_active,
        subject_id: set.subject_id,
        school_id: set.school_id,
        created_at: set.created_at,
        subject: subject ?? undefined,
        question_count: counts.get(set.id) ?? 0,
        textbook: textbook ?? null,
        textbook_id: set.textbook_id ?? null,
      };
      return mapped;
    });
  } catch {
    return [];
  }
}

export async function getQuestionSetWithQuestions(
  setId: string,
  schoolId: string,
): Promise<{ set: QuestionSet; questions: Question[] } | null> {
  try {
    const supabase = await createClient();
    const { data: setRow, error: setError } = await supabase
      .from("question_sets")
      .select(
        "id, reference_code, set_name, year_level, is_active, subject_id, school_id, created_at, textbook_id, subjects(id, name, year_level, curriculum_code), textbooks(id, school_id, subject_id, title, publisher, year_level, is_active)",
      )
      .eq("id", setId)
      .eq("school_id", schoolId)
      .maybeSingle();

    if (setError || !setRow) return null;

    const typedSet = setRow as unknown as {
      id: string;
      reference_code?: string | null;
      set_name: string;
      year_level: number;
      is_active: boolean;
      subject_id: string;
      school_id: string;
      created_at: string;
      textbook_id?: string | null;
      subjects?: Subject[] | Subject | null;
      textbooks?: Textbook[] | Textbook | null;
    };

    const { data: sequenceRows } = await supabase
      .from("question_set_questions")
      .select("question_id, seq")
      .eq("question_set_id", setId)
      .order("seq", { ascending: true });

    const questionIds = (sequenceRows ?? []).map((row) => row.question_id);
    let orderedQuestions: Question[] = [];

    if (questionIds.length > 0) {
      const { data: questionRows } = await supabase
        .from("questions")
        .select(
          "id, question_set_id, question_text, option_a, option_b, option_c, correct_answer, difficulty",
        )
        .in("id", questionIds);

      const byId = new Map<string, Question>(
        ((questionRows ?? []) as unknown as Question[]).map((q) => [q.id, q]),
      );
      orderedQuestions = questionIds
        .map((questionId) => byId.get(questionId))
        .filter((q): q is Question => Boolean(q));
    } else {
      const { data: questionRows } = await supabase
        .from("questions")
        .select(
          "id, question_set_id, question_text, option_a, option_b, option_c, correct_answer, difficulty",
        )
        .eq("question_set_id", setId);
      orderedQuestions = (questionRows ?? []) as unknown as Question[];
    }

    const subject = Array.isArray(typedSet.subjects)
      ? typedSet.subjects[0]
      : typedSet.subjects;
    const textbook = Array.isArray(typedSet.textbooks)
      ? typedSet.textbooks[0]
      : typedSet.textbooks;

    const mappedSet: AdminQuestionSet = {
      id: typedSet.id,
      reference_code: typedSet.reference_code ?? null,
      set_name: typedSet.set_name,
      year_level: typedSet.year_level,
      is_active: typedSet.is_active,
      subject_id: typedSet.subject_id,
      school_id: typedSet.school_id,
      created_at: typedSet.created_at,
      subject: subject ?? undefined,
      question_count: orderedQuestions.length,
      textbook: textbook ?? null,
      textbook_id: typedSet.textbook_id ?? null,
    };

    return { set: mappedSet, questions: orderedQuestions };
  } catch {
    return null;
  }
}

export async function getAllSubjects(): Promise<Subject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, year_level, curriculum_code")
      .order("year_level", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data) return [];
    return data as unknown as Subject[];
  } catch {
    return [];
  }
}

export async function getTextbooks(
  schoolId: string,
  subjectId?: string,
): Promise<Textbook[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("textbooks")
      .select(
        "id, school_id, subject_id, title, publisher, year_level, is_active",
      )
      .eq("school_id", schoolId)
      .eq("is_active", true);

    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    const { data, error } = await query
      .order("year_level", { ascending: true })
      .order("title", { ascending: true });

    if (error || !data) return [];
    return data as unknown as Textbook[];
  } catch {
    return [];
  }
}

export async function getSchoolStudents(
  schoolId: string,
): Promise<StudentRow[]> {
  try {
    const supabase = await createClient();
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select(
        "id, auth_user_id, school_id, year_level, external_hash, created_at",
      )
      .eq("school_id", schoolId);

    if (studentsError || !studentsData) return [];

    const students = studentsData as Array<{
      id: string;
      auth_user_id: string | null;
      school_id: string;
      year_level: number | null;
      external_hash: string;
      created_at: string;
    }>;

    if (students.length === 0) return [];

    const profileIds = Array.from(
      new Set(
        students.flatMap((student) =>
          student.auth_user_id
            ? [student.auth_user_id, student.id]
            : [student.id],
        ),
      ),
    );
    const authUserIds = Array.from(
      new Set(
        students
          .map((student) => student.auth_user_id)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    const [profilesResponse, emailsResponse, logsResponse] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", profileIds),
      authUserIds.length > 0
        ? supabase
            .from("high_school_students")
            .select("id, school_email")
            .in("id", authUserIds)
        : Promise.resolve({ data: [], error: null }),
      authUserIds.length > 0
        ? supabase
            .from("question_logs")
            .select("student_id, is_correct, answered_at")
            .eq("school_id", schoolId)
            .in("student_id", authUserIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const nameById = new Map<string, string | null>(
      (profilesResponse.data ?? []).map((profile) => [
        profile.id,
        profile.full_name,
      ]),
    );
    const emailByAuthId = new Map<string, string | null>(
      (emailsResponse.data ?? []).map((row) => [row.id, row.school_email]),
    );

    const statsByAuthId = new Map<
      string,
      {
        total_answers: number;
        correct_answers: number;
        last_active: string | null;
      }
    >();
    for (const row of logsResponse.data ?? []) {
      const previous = statsByAuthId.get(row.student_id) ?? {
        total_answers: 0,
        correct_answers: 0,
        last_active: null,
      };
      const nextLastActive =
        !previous.last_active ||
        new Date(row.answered_at).getTime() >
          new Date(previous.last_active).getTime()
          ? row.answered_at
          : previous.last_active;
      statsByAuthId.set(row.student_id, {
        total_answers: previous.total_answers + 1,
        correct_answers: previous.correct_answers + (row.is_correct ? 1 : 0),
        last_active: nextLastActive,
      });
    }

    return students
      .map((student) => {
        const full_name =
          (student.auth_user_id ? nameById.get(student.auth_user_id) : null) ??
          nameById.get(student.id) ??
          null;
        const email = student.auth_user_id
          ? (emailByAuthId.get(student.auth_user_id) ?? null)
          : null;
        const stats = student.auth_user_id
          ? statsByAuthId.get(student.auth_user_id)
          : undefined;

        const row: StudentRow = {
          id: student.id,
          auth_user_id: student.auth_user_id,
          school_id: student.school_id,
          year_level: student.year_level,
          external_hash: student.external_hash,
          created_at: student.created_at,
          full_name,
          email,
          total_answers: stats?.total_answers ?? 0,
          correct_answers: stats?.correct_answers ?? 0,
          last_active: stats?.last_active ?? null,
        };
        return row;
      })
      .sort((a, b) => {
        if (!a.last_active && !b.last_active) return 0;
        if (!a.last_active) return 1;
        if (!b.last_active) return -1;
        return (
          new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
        );
      });
  } catch {
    return [];
  }
}

export async function getStudentDetail(
  studentId: string,
  schoolId: string,
): Promise<{
  student: StudentRow;
  recentLogs: QuestionLog[];
  setProgress: Array<{
    set_name: string;
    subject_name: string;
    total: number;
    correct: number;
    last_answered: string;
  }>;
} | null> {
  try {
    const supabase = await createClient();
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select(
        "id, auth_user_id, school_id, year_level, external_hash, created_at",
      )
      .eq("id", studentId)
      .eq("school_id", schoolId)
      .maybeSingle();

    if (studentError || !studentData) return null;

    const student = studentData as {
      id: string;
      auth_user_id: string | null;
      school_id: string;
      year_level: number | null;
      external_hash: string;
      created_at: string;
    };

    const profileIds = student.auth_user_id
      ? [student.id, student.auth_user_id]
      : [student.id];
    const [profilesResponse, emailResponse] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", profileIds),
      student.auth_user_id
        ? supabase
            .from("high_school_students")
            .select("id, school_email")
            .eq("id", student.auth_user_id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const full_name =
      profilesResponse.data?.find(
        (profile) => profile.id === student.auth_user_id,
      )?.full_name ??
      profilesResponse.data?.find((profile) => profile.id === student.id)
        ?.full_name ??
      null;
    const email = emailResponse.data?.school_email ?? null;

    const recentLogsResponse = student.auth_user_id
      ? await supabase
          .from("question_logs")
          .select(
            "id, student_id, question_id, question_set_id, subject_id, selected_answer, is_correct, attempt_number, response_time_ms, blocked_site, answered_at, question_sets(set_name), subjects(name)",
          )
          .eq("school_id", schoolId)
          .eq("student_id", student.auth_user_id)
          .order("answered_at", { ascending: false })
          .limit(20)
      : { data: [], error: null };

    const allLogsForProgressResponse = student.auth_user_id
      ? await supabase
          .from("question_logs")
          .select(
            "question_set_id, is_correct, answered_at, question_sets(set_name), subjects(name)",
          )
          .eq("school_id", schoolId)
          .eq("student_id", student.auth_user_id)
      : { data: [], error: null };

    const recentLogs = (recentLogsResponse.data ??
      []) as unknown as QuestionLog[];

    const progressMap = new Map<
      string,
      {
        set_name: string;
        subject_name: string;
        total: number;
        correct: number;
        last_answered: string;
      }
    >();

    for (const row of allLogsForProgressResponse.data ?? []) {
      const setName =
        relationName(row.question_sets, "set_name") ?? "Unknown question set";
      const subjectName = relationName(row.subjects, "name") ?? "Subject";
      const previous = progressMap.get(row.question_set_id);
      if (!previous) {
        progressMap.set(row.question_set_id, {
          set_name: setName,
          subject_name: subjectName,
          total: 1,
          correct: row.is_correct ? 1 : 0,
          last_answered: row.answered_at,
        });
        continue;
      }

      const latest =
        new Date(row.answered_at).getTime() >
        new Date(previous.last_answered).getTime()
          ? row.answered_at
          : previous.last_answered;
      progressMap.set(row.question_set_id, {
        set_name: previous.set_name,
        subject_name: previous.subject_name,
        total: previous.total + 1,
        correct: previous.correct + (row.is_correct ? 1 : 0),
        last_answered: latest,
      });
    }

    const setProgress = Array.from(progressMap.values()).sort(
      (a, b) =>
        new Date(b.last_answered).getTime() -
        new Date(a.last_answered).getTime(),
    );

    const totals = recentLogs.reduce(
      (acc, log) => {
        acc.total += 1;
        if (log.is_correct) acc.correct += 1;
        return acc;
      },
      { total: 0, correct: 0 },
    );

    const mappedStudent: StudentRow = {
      id: student.id,
      auth_user_id: student.auth_user_id,
      school_id: student.school_id,
      year_level: student.year_level,
      external_hash: student.external_hash,
      created_at: student.created_at,
      full_name,
      email,
      total_answers: totals.total,
      correct_answers: totals.correct,
      last_active: recentLogs[0]?.answered_at ?? null,
    };

    return { student: mappedStudent, recentLogs, setProgress };
  } catch {
    return null;
  }
}

export async function getSignupTrend(
  schoolId: string,
): Promise<Array<{ date: string; count: number }>> {
  try {
    const supabase = await createClient();
    const today = startOfToday();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);

    const { data, error } = await supabase
      .from("students")
      .select("created_at")
      .eq("school_id", schoolId)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) return [];

    const counts = new Map<string, number>();
    for (const row of data ?? []) {
      const key = toDateKey(new Date(row.created_at));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const result: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = toDateKey(date);
      result.push({ date: key, count: counts.get(key) ?? 0 });
    }

    return result;
  } catch {
    return [];
  }
}

export async function getAccuracyBySubject(
  schoolId: string,
): Promise<Array<{ subject: string; accuracy: number; total: number }>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("question_logs")
      .select("is_correct, subjects(name)")
      .eq("school_id", schoolId);

    if (error || !data) return [];

    const stats = new Map<string, { total: number; correct: number }>();
    for (const row of data) {
      const subject = relationName(row.subjects, "name") ?? "Unknown subject";
      const previous = stats.get(subject) ?? { total: 0, correct: 0 };
      stats.set(subject, {
        total: previous.total + 1,
        correct: previous.correct + (row.is_correct ? 1 : 0),
      });
    }

    return Array.from(stats.entries())
      .map(([subject, value]) => ({
        subject,
        total: value.total,
        accuracy:
          value.total > 0 ? Math.round((value.correct / value.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  } catch {
    return [];
  }
}

export async function getTopQuestionSets(schoolId: string): Promise<
  Array<{
    set_name: string;
    subject: string;
    answers: number;
    accuracy: number;
  }>
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("question_logs")
      .select("is_correct, question_sets(set_name), subjects(name)")
      .eq("school_id", schoolId);

    if (error || !data) return [];

    const stats = new Map<
      string,
      { set_name: string; subject: string; total: number; correct: number }
    >();
    for (const row of data) {
      const setName =
        relationName(row.question_sets, "set_name") ?? "Unknown set";
      const subjectName = relationName(row.subjects, "name") ?? "Subject";
      const key = `${setName}|||${subjectName}`;
      const previous = stats.get(key) ?? {
        set_name: setName,
        subject: subjectName,
        total: 0,
        correct: 0,
      };
      stats.set(key, {
        set_name: previous.set_name,
        subject: previous.subject,
        total: previous.total + 1,
        correct: previous.correct + (row.is_correct ? 1 : 0),
      });
    }

    return Array.from(stats.values())
      .map((item) => ({
        set_name: item.set_name,
        subject: item.subject,
        answers: item.total,
        accuracy:
          item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
      }))
      .sort((a, b) => b.answers - a.answers)
      .slice(0, 5);
  } catch {
    return [];
  }
}

function weekStart(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function weekLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function getWeeklyActiveStudents(
  schoolId: string,
): Promise<Array<{ week: string; count: number }>> {
  try {
    const supabase = await createClient();
    const currentWeekStart = weekStart(new Date());
    const rangeStart = new Date(currentWeekStart);
    rangeStart.setDate(rangeStart.getDate() - 7 * 7);

    const { data, error } = await supabase
      .from("question_logs")
      .select("student_id, answered_at")
      .eq("school_id", schoolId)
      .gte("answered_at", rangeStart.toISOString());

    if (error) return [];

    const byWeek = new Map<string, Set<string>>();
    for (const row of data ?? []) {
      const start = weekStart(new Date(row.answered_at));
      const key = toDateKey(start);
      const set = byWeek.get(key) ?? new Set<string>();
      set.add(row.student_id);
      byWeek.set(key, set);
    }

    const result: Array<{ week: string; count: number }> = [];
    for (let i = 0; i < 8; i += 1) {
      const start = new Date(currentWeekStart);
      start.setDate(currentWeekStart.getDate() - (7 - i) * 7);
      const key = toDateKey(start);
      result.push({
        week: weekLabel(start),
        count: byWeek.get(key)?.size ?? 0,
      });
    }

    return result;
  } catch {
    return [];
  }
}

export async function getTopBlockedSites(
  schoolId: string,
): Promise<Array<{ site: string; count: number }>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("question_logs")
      .select("blocked_site")
      .eq("school_id", schoolId)
      .not("blocked_site", "is", null);

    if (error || !data) return [];

    const counts = new Map<string, number>();
    for (const row of data) {
      const site = row.blocked_site?.trim();
      if (!site) continue;
      counts.set(site, (counts.get(site) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([site, count]) => ({ site, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  } catch {
    return [];
  }
}
