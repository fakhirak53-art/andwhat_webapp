"use client";

import { useRouter } from "next/navigation";
import QuizEngine from "@/components/dashboard/QuizEngine";
import { useToast } from "@/components/ui/Toast";
import type { QuizQuestion, QuizResult } from "@/types/database";

interface QuizSessionClientProps {
  questions: QuizQuestion[];
  questionSetId: string;
  subjectId: string;
  schoolId: string;
  setName: string;
}

export default function QuizSessionClient({
  questions,
  questionSetId,
  subjectId,
  schoolId,
  setName,
}: QuizSessionClientProps) {
  const router = useRouter();
  const toast = useToast();

  function handleComplete(result: QuizResult): void {
    toast.success(`Quiz complete: ${result.correct}/${result.total} correct`);
  }

  function handleExit(): void {
    router.push("/dashboard/sets");
  }

  return (
    <QuizEngine
      questions={questions}
      questionSetId={questionSetId}
      subjectId={subjectId}
      schoolId={schoolId}
      setName={setName}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}
