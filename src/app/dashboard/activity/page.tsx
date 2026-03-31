import { redirect } from "next/navigation";
import ActivityTable from "@/components/dashboard/ActivityTable";
import StatCard from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/lib/dashboard";
import { marketingTheme as t } from "@/lib/marketing-theme";
import type { QuestionLog } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: studentRow } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  const logStudentIds = Array.from(
    new Set(
      [user.id, studentRow?.id].filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0,
      ),
    ),
  );

  const [stats, logsResponse] = await Promise.all([
    getDashboardStats(user.id),
    supabase
      .from("question_logs")
      .select(
        "id, student_id, question_id, question_set_id, subject_id, selected_answer, is_correct, attempt_number, response_time_ms, blocked_site, answered_at, question_sets(set_name), subjects(name)",
      )
      .in("student_id", logStudentIds)
      .order("answered_at", { ascending: false })
      .limit(50),
  ]);

  const logs: QuestionLog[] =
    logsResponse.error || !logsResponse.data
      ? []
      : (logsResponse.data as unknown as QuestionLog[]);

  return (
    <div>
      <header>
        <h1 className={["font-serif text-2xl", t.textHeading].join(" ")}>
          My Activity
        </h1>
        <p className={["text-sm mt-1", t.textMuted].join(" ")}>
          A complete record of your quiz answers.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-4 mt-6">
        <StatCard
          label="Total Answered"
          value={stats.totalAnswered}
          description="questions answered"
        />
        <StatCard
          label="Accuracy"
          value={`${stats.accuracyRate}%`}
          description="correct answers"
        />
        <StatCard
          label="This Week"
          value={stats.thisWeekAnswered}
          description="answered this week"
        />
      </section>

      <section className="mt-6">
        <ActivityTable logs={logs} />
      </section>
    </div>
  );
}
