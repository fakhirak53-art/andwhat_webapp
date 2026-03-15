import { Ban, BookOpen, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import EmptyState from "@/components/dashboard/EmptyState";
import ProgressBar from "@/components/dashboard/ProgressBar";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import {
  getAccuracyBySubject,
  getAdminProfile,
  getAdminStats,
  getSignupTrend,
  getTopBlockedSites,
  getTopQuestionSets,
  getWeeklyActiveStudents,
} from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function weekdayNameFromDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const [
    stats,
    signupTrend,
    accuracyBySubject,
    topSets,
    weeklyActive,
    topSites,
    monthLogs,
  ] = await Promise.all([
    getAdminStats(adminProfile.school_id),
    getSignupTrend(adminProfile.school_id),
    getAccuracyBySubject(adminProfile.school_id),
    getTopQuestionSets(adminProfile.school_id),
    getWeeklyActiveStudents(adminProfile.school_id),
    getTopBlockedSites(adminProfile.school_id),
    supabase
      .from("question_logs")
      .select("answered_at")
      .eq("school_id", adminProfile.school_id)
      .gte("answered_at", startOfMonth().toISOString()),
  ]);

  const thisMonthAnswers = monthLogs.data?.length ?? 0;
  const dayCounts = new Map<string, number>();
  for (const row of monthLogs.data ?? []) {
    const day = weekdayNameFromDate(row.answered_at);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const mostActiveDay =
    Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "N/A";

  const maxWeeklyCount = Math.max(1, ...weeklyActive.map((item) => item.count));
  const maxSiteCount = Math.max(1, ...topSites.map((item) => item.count));
  const maxSignupCount = Math.max(1, ...signupTrend.map((item) => item.count));

  return (
    <div>
      <header>
        <h1 className="font-serif text-2xl text-ink">Analytics</h1>
        <p className="text-muted text-sm mt-1">Showing data for your school</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard
          label="Total answers"
          value={stats.totalQuizCompletions}
          description="all-time answers"
        />
        <StatCard
          label="This month"
          value={thisMonthAnswers}
          description="answers this month"
        />
        <StatCard
          label="Avg accuracy"
          value={`${stats.averageAccuracy}%`}
          description="across all students"
        />
        <StatCard
          label="Most active day"
          value={mostActiveDay}
          description="by monthly activity"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card padding="md">
          <h2 className="font-serif text-lg text-ink">
            Weekly active students
          </h2>
          {weeklyActive.length === 0 ? (
            <p className="text-sm text-muted mt-3">No data yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {weeklyActive.map((item) => {
                const percent = Math.round((item.count / maxWeeklyCount) * 100);
                return (
                  <div key={item.week}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">{item.week}</span>
                      <span className="text-ink">{item.count}</span>
                    </div>
                    <ProgressBar value={percent} color="lime" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card padding="md">
          <h2 className="font-serif text-lg text-ink">Accuracy by subject</h2>
          {accuracyBySubject.length === 0 ? (
            <p className="text-sm text-muted mt-3">No data yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {accuracyBySubject.slice(0, 8).map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink">{item.subject}</span>
                    <span className="text-muted">
                      {item.accuracy}% ({item.total})
                    </span>
                  </div>
                  <ProgressBar
                    value={item.accuracy}
                    color={
                      item.accuracy >= 70
                        ? "lime"
                        : item.accuracy >= 40
                          ? "amber"
                          : "red"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">Most practiced sets</h2>
        {topSets.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={<BookOpen className="w-10 h-10" />}
              title="No set activity yet"
              description="Top question sets will appear once students start answering."
            />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full bg-paper text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                    Set name
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                    Total answers
                  </th>
                  <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                    Accuracy %
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSets.map((item) => (
                  <tr
                    key={`${item.set_name}-${item.subject}`}
                    className="border-b border-border"
                  >
                    <td className="px-4 py-3 text-sm text-ink">
                      {item.set_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {item.subject}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {item.answers}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      {item.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">
          Most visited blocked sites
        </h2>
        {topSites.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={<Ban className="w-10 h-10" />}
              title="No blocked-site data yet"
              description="Blocked-site trends will appear after extension-triggered activity."
            />
          </div>
        ) : (
          <Card className="mt-3" padding="md">
            <div className="space-y-3">
              {topSites.map((item, index) => {
                const percent = Math.round((item.count / maxSiteCount) * 100);
                return (
                  <div key={item.site}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-ink">
                        <span className="text-muted mr-2">#{index + 1}</span>
                        {item.site}
                      </p>
                      <span className="text-muted">{item.count}</span>
                    </div>
                    <div className="mt-1">
                      <ProgressBar value={percent} color="amber" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">
          Student signups — last 30 days
        </h2>
        {signupTrend.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={<UserPlus className="w-10 h-10" />}
              title="No signup data yet"
              description="Signup trends will appear as new students join your school."
            />
          </div>
        ) : (
          <Card className="mt-3" padding="md">
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {signupTrend.map((item) => {
                const percent = Math.round((item.count / maxSignupCount) * 100);
                return (
                  <div key={item.date}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">{item.date}</span>
                      <span className="text-ink">{item.count}</span>
                    </div>
                    <ProgressBar value={percent} color="lime" />
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
