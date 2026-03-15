import { redirect } from "next/navigation";
import ActivityTable from "@/components/dashboard/ActivityTable";
import StatCard from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/lib/dashboard";
import type { QuestionLog } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [stats, logsResponse] = await Promise.all([
    getDashboardStats(user.id),
    supabase
      .from("question_logs")
      .select(
        "id, student_id, question_id, question_set_id, subject_id, selected_answer, is_correct, attempt_number, response_time_ms, blocked_site, answered_at, question_sets(set_name), subjects(name)",
      )
      .eq("student_id", user.id)
      .order("answered_at", { ascending: false })
      .limit(50),
  ]);

  const logs: QuestionLog[] =
    logsResponse.error || !logsResponse.data
      ? []
      : (logsResponse.data as QuestionLog[]);

  return (
    <div>
      <header>
        <h1 className="font-serif text-2xl text-ink">My Activity</h1>
        <p className="text-muted text-sm mt-1">
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
