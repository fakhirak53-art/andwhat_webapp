import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { enrollInQuestionSet, getQuestionsForSet } from "@/app/actions/student";
import QuizSessionClient from "@/components/dashboard/QuizSessionClient";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/utils/supabase/server";

interface QuizPageProps {
  params: Promise<{ setId: string }>;
}

export default async function QuizSetPage({ params }: QuizPageProps) {
  const { setId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [setResponse, questionsResponse, enrollmentResponse] =
    await Promise.all([
      supabase
        .from("question_sets")
        .select("id, set_name, subject_id, school_id, subjects(name)")
        .eq("id", setId)
        .eq("is_active", true)
        .maybeSingle(),
      getQuestionsForSet(setId, 10),
      supabase
        .from("student_enrollments")
        .select("id")
        .eq("student_id", user.id)
        .eq("question_set_id", setId)
        .maybeSingle(),
    ]);

  const setData = setResponse.data;
  const questions = questionsResponse.data ?? [];
  const isEnrolled = Boolean(enrollmentResponse.data);

  async function handleEnrollAndStart(): Promise<void> {
    "use server";

    const result = await enrollInQuestionSet(setId);
    if (result.success) {
      redirect(`/dashboard/quiz/${setId}`);
    }
    redirect("/dashboard/sets");
  }

  if (setResponse.error || !setData) {
    return (
      <div className="py-8">
        <Card padding="lg">
          <h1 className="font-serif text-2xl text-ink">Set not found</h1>
          <p className="text-muted text-sm mt-2">
            This question set could not be loaded.
          </p>
          <Link href="/dashboard/sets" className="inline-block mt-4">
            <Button variant="secondary">Back to sets</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (questionsResponse.error || questions.length === 0) {
    return (
      <div className="py-8">
        <Card padding="lg">
          <h1 className="font-serif text-2xl text-ink">
            No questions available
          </h1>
          <p className="text-muted text-sm mt-2">
            This set has no questions yet. Please try another set.
          </p>
          <Link href="/dashboard/sets" className="inline-block mt-4">
            <Button variant="secondary">Back to sets</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="py-8">
        <Card padding="lg">
          <h1 className="font-serif text-2xl text-ink">
            You&apos;re not enrolled in this set
          </h1>
          <p className="text-muted text-sm mt-2">
            Enroll first to start practice for {setData.set_name}.
          </p>
          <form action={handleEnrollAndStart} className="mt-4">
            <Button>Enroll and start</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard/sets"
          className="inline-flex items-center gap-2 text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <Badge variant="default">{(setData.subjects as { name: string }[])?.[0]?.name ?? "Subject"}</Badge>
      </div>
      <h1 className="font-serif text-2xl text-ink mt-3">{setData.set_name}</h1>

      <QuizSessionClient
        questions={questions}
        questionSetId={setId}
        subjectId={setData.subject_id}
        schoolId={setData.school_id}
        setName={setData.set_name}
      />
    </div>
  );
}
