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

function parseActive(raw: FormDataEntryValue | null): boolean {
  return raw === "true" || raw === "on";
}

function parseYear(raw: FormDataEntryValue | null): number | null {
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function generateReferenceCode(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  return `QS-${stamp.slice(-6)}`;
}

export async function createQuestionSet(
  formData: FormData,
): Promise<{ data?: { id: string }; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { error: "Unauthorized" };

  const set_name = String(formData.get("set_name") ?? "").trim();
  const subject_id = String(formData.get("subject_id") ?? "").trim();
  const textbookRaw = String(formData.get("textbook_id") ?? "").trim();
  const year_level = parseYear(formData.get("year_level"));
  const is_active = parseActive(formData.get("is_active"));

  if (!set_name || !subject_id || !year_level) {
    return { error: "Please fill in set name, subject, and year level." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      reference_code: generateReferenceCode(),
      set_name,
      subject_id,
      textbook_id: textbookRaw || null,
      year_level,
      school_id: admin.schoolId,
      created_by: admin.userId,
      is_active,
    })
    .select("id")
    .single();

  if (error || !data)
    return { error: error?.message ?? "Could not create set." };

  revalidatePath("/admin/sets");
  return { data: { id: data.id } };
}

export async function updateQuestionSet(
  setId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await setBelongsToSchool(setId, admin.schoolId))) {
    return { success: false, error: "Set not found for your school." };
  }

  const set_name = String(formData.get("set_name") ?? "").trim();
  const subject_id = String(formData.get("subject_id") ?? "").trim();
  const textbookRaw = String(formData.get("textbook_id") ?? "").trim();
  const year_level = parseYear(formData.get("year_level"));
  const is_active = parseActive(formData.get("is_active"));

  if (!set_name || !subject_id || !year_level) {
    return {
      success: false,
      error: "Please fill in set name, subject, and year level.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("question_sets")
    .update({
      set_name,
      subject_id,
      textbook_id: textbookRaw || null,
      year_level,
      is_active,
    })
    .eq("id", setId)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/sets");
  revalidatePath(`/admin/sets/${setId}`);
  return { success: true };
}

export async function deleteQuestionSet(
  setId: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await setBelongsToSchool(setId, admin.schoolId))) {
    return { success: false, error: "Set not found for your school." };
  }

  const supabase = await createClient();
  const { data: questionIds } = await supabase
    .from("questions")
    .select("id")
    .eq("question_set_id", setId);

  if ((questionIds ?? []).length > 0) {
    const ids = questionIds?.map((q) => q.id) ?? [];
    await supabase
      .from("question_set_questions")
      .delete()
      .in("question_id", ids);
  } else {
    await supabase
      .from("question_set_questions")
      .delete()
      .eq("question_set_id", setId);
  }

  await supabase.from("questions").delete().eq("question_set_id", setId);
  const { error: setDeleteError } = await supabase
    .from("question_sets")
    .delete()
    .eq("id", setId)
    .eq("school_id", admin.schoolId);

  if (setDeleteError) return { success: false, error: setDeleteError.message };

  revalidatePath("/admin/sets");
  return { success: true };
}

export async function toggleQuestionSetActive(
  setId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await setBelongsToSchool(setId, admin.schoolId))) {
    return { success: false, error: "Set not found for your school." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("question_sets")
    .update({ is_active: isActive })
    .eq("id", setId)
    .eq("school_id", admin.schoolId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/sets");
  revalidatePath(`/admin/sets/${setId}`);
  return { success: true };
}

export async function addQuestion(
  setId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  if (!(await setBelongsToSchool(setId, admin.schoolId))) {
    return { success: false, error: "Set not found for your school." };
  }

  const question_text = String(formData.get("question_text") ?? "").trim();
  const option_a = String(formData.get("option_a") ?? "").trim();
  const option_b = String(formData.get("option_b") ?? "").trim();
  const option_c = String(formData.get("option_c") ?? "").trim();
  const correct_answer = String(formData.get("correct_answer") ?? "A") as
    | "A"
    | "B"
    | "C";
  const difficulty = String(formData.get("difficulty") ?? "medium") as
    | "easy"
    | "medium"
    | "hard";

  if (!question_text || !option_a || !option_b || !option_c) {
    return { success: false, error: "Please complete all question fields." };
  }

  const supabase = await createClient();
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      question_set_id: setId,
      question_text,
      option_a,
      option_b,
      option_c,
      correct_answer,
      difficulty,
    })
    .select("id")
    .single();

  if (questionError || !question) {
    return {
      success: false,
      error: questionError?.message ?? "Could not add question.",
    };
  }

  const { data: seqRow } = await supabase
    .from("question_set_questions")
    .select("seq")
    .eq("question_set_id", setId)
    .order("seq", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSeq = (seqRow?.seq ?? 0) + 1;
  await supabase.from("question_set_questions").insert({
    question_set_id: setId,
    question_id: question.id,
    seq: nextSeq,
  });

  revalidatePath(`/admin/sets/${setId}`);
  return { success: true };
}

export async function updateQuestion(
  questionId: string,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { data: qRow } = await supabase
    .from("questions")
    .select("id, question_set_id")
    .eq("id", questionId)
    .maybeSingle();

  if (!qRow) return { success: false, error: "Question not found." };
  if (!(await setBelongsToSchool(qRow.question_set_id, admin.schoolId))) {
    return {
      success: false,
      error: "Question does not belong to your school.",
    };
  }

  const updates = {
    question_text: String(formData.get("question_text") ?? "").trim(),
    option_a: String(formData.get("option_a") ?? "").trim(),
    option_b: String(formData.get("option_b") ?? "").trim(),
    option_c: String(formData.get("option_c") ?? "").trim(),
    correct_answer: String(formData.get("correct_answer") ?? "A") as
      | "A"
      | "B"
      | "C",
    difficulty: String(formData.get("difficulty") ?? "medium") as
      | "easy"
      | "medium"
      | "hard",
  };

  const { error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", questionId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/sets/${qRow.question_set_id}`);
  return { success: true };
}

export async function deleteQuestion(
  questionId: string,
): Promise<{ success: boolean; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { data: qRow } = await supabase
    .from("questions")
    .select("id, question_set_id")
    .eq("id", questionId)
    .maybeSingle();

  if (!qRow) return { success: false, error: "Question not found." };
  if (!(await setBelongsToSchool(qRow.question_set_id, admin.schoolId))) {
    return {
      success: false,
      error: "Question does not belong to your school.",
    };
  }

  await supabase
    .from("question_set_questions")
    .delete()
    .eq("question_id", questionId);
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/sets/${qRow.question_set_id}`);
  return { success: true };
}

export async function createTextbook(
  formData: FormData,
): Promise<{ data?: { id: string }; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { error: "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const subject_id = String(formData.get("subject_id") ?? "").trim();
  const publisherRaw = String(formData.get("publisher") ?? "").trim();
  const year_level = parseYear(formData.get("year_level"));

  if (!title || !subject_id)
    return { error: "Title and subject are required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("textbooks")
    .insert({
      school_id: admin.schoolId,
      subject_id,
      title,
      publisher: publisherRaw || null,
      year_level,
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !data)
    return { error: error?.message ?? "Could not create textbook." };

  revalidatePath("/admin/sets/new");
  return { data: { id: data.id } };
}

export async function bulkImportQuestions(
  setId: string,
  questions: Array<{
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    correct_answer: "A" | "B" | "C";
    difficulty: "easy" | "medium" | "hard" | null;
  }>,
): Promise<{ imported: number; error?: string }> {
  const admin = await verifyAdmin();
  if (!admin) return { imported: 0, error: "Unauthorized" };

  if (!(await setBelongsToSchool(setId, admin.schoolId))) {
    return { imported: 0, error: "Set not found for your school." };
  }

  if (questions.length === 0) {
    return { imported: 0, error: "No valid questions to import." };
  }

  if (questions.length > 200) {
    return { imported: 0, error: "Maximum 200 questions per upload." };
  }

  const supabase = await createClient();
  const { data: seqRow } = await supabase
    .from("question_set_questions")
    .select("seq")
    .eq("question_set_id", setId)
    .order("seq", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSeqStart = (seqRow?.seq ?? 0) + 1;

  const payload = questions.map((item) => ({
    question_set_id: setId,
    question_text: item.question_text,
    option_a: item.option_a,
    option_b: item.option_b,
    option_c: item.option_c,
    correct_answer: item.correct_answer,
    difficulty: item.difficulty,
  }));

  const { data: insertedQuestions, error: insertQuestionsError } =
    await supabase.from("questions").insert(payload).select("id");

  if (insertQuestionsError || !insertedQuestions) {
    return {
      imported: 0,
      error: insertQuestionsError?.message ?? "Could not import questions.",
    };
  }

  const linkRows = insertedQuestions.map((question, index) => ({
    question_set_id: setId,
    question_id: question.id,
    seq: nextSeqStart + index,
  }));

  const { error: linkError } = await supabase
    .from("question_set_questions")
    .insert(linkRows);

  if (linkError) {
    return {
      imported: 0,
      error: linkError.message,
    };
  }

  revalidatePath(`/admin/sets/${setId}`);
  revalidatePath("/admin/sets");
  revalidatePath("/admin/sets/upload");

  return { imported: insertedQuestions.length };
}
