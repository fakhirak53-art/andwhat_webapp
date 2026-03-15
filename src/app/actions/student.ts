"use server";

import { getStudentId, getStudentRow } from "@/lib/student";
import type { QuizQuestion } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

interface ActionResult<T> {
  data?: T;
  error?: string;
}

export async function enrollInQuestionSet(
  questionSetId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "You need to be logged in." };
    }

    const { error } = await supabase.from("student_enrollments").insert({
      student_id: user.id,
      question_set_id: questionSetId,
    });

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Unable to enroll right now." };
  }
}

export async function submitQuizAnswer(payload: {
  question_id: string;
  question_set_id: string;
  subject_id: string;
  school_id: string;
  selected_answer: "A" | "B" | "C";
  correct_answer: "A" | "B" | "C";
  response_time_ms: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const studentRow = await getStudentRow(user.id);

  const { error } = await supabase.from("question_logs").insert({
    student_id: user.id,
    school_id: studentRow?.school_id ?? payload.school_id,
    question_id: payload.question_id,
    question_set_id: payload.question_set_id,
    subject_id: payload.subject_id,
    selected_answer: payload.selected_answer,
    is_correct: payload.selected_answer === payload.correct_answer,
    attempt_number: 1,
    response_time_ms: payload.response_time_ms,
    blocked_site: null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateSubjectPreferences(
  subjectIds: string[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const studentId = await getStudentId(user.id);

  if (!studentId) {
    return {
      success: false,
      error:
        "Your student record is not set up yet. Please contact your school admin to link your account.",
    };
  }

  const { error: deleteError } = await supabase
    .from("student_subject_preferences")
    .delete()
    .eq("student_id", studentId);

  if (deleteError) return { success: false, error: deleteError.message };

  if (subjectIds.length === 0) return { success: true };

  const rows = subjectIds.map((subject_id, index) => ({
    student_id: studentId,
    subject_id,
    is_active: true,
    priority: index + 1,
  }));

  const { error: insertError } = await supabase
    .from("student_subject_preferences")
    .insert(rows);

  if (insertError) return { success: false, error: insertError.message };
  return { success: true };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export async function getQuestionsForSet(
  questionSetId: string,
  limit = 5,
): Promise<ActionResult<QuizQuestion[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, question_text, option_a, option_b, option_c, correct_answer, difficulty",
      )
      .eq("question_set_id", questionSetId);

    if (error) {
      return { error: error.message };
    }

    const shuffled = shuffle((data ?? []) as QuizQuestion[]);
    return { data: shuffled.slice(0, Math.max(1, limit)) };
  } catch {
    return { error: "Could not load questions for this set." };
  }
}

export async function unenrollFromQuestionSet(
  questionSetId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "You need to be logged in." };
    }

    const { error } = await supabase
      .from("student_enrollments")
      .delete()
      .eq("student_id", user.id)
      .eq("question_set_id", questionSetId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Unable to remove set right now." };
  }
}
