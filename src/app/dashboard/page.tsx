import EmptyState from "@/components/dashboard/EmptyState";
import ProgressBar from "@/components/dashboard/ProgressBar";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getAccuracyBySubject,
  getDashboardStats,
  getEnrolledSets,
  getRecentActivity,
  getSpacedRepetitionSchedule,
  getStudentProfile,
} from "@/lib/dashboard";
import {
  formatRelativeTime,
  getAccuracyColor,
  getFirstName,
  getGreeting,
} from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { BookOpen, Flame, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    profileData,
    stats,
    recentActivity,
    enrolledSets,
    accuracyBySubject,
    reviewSchedule,
  ] = await Promise.all([
    getStudentProfile(user.id),
    getDashboardStats(user.id),
    getRecentActivity(user.id),
    getEnrolledSets(user.id),
    getAccuracyBySubject(user.id),
    getSpacedRepetitionSchedule(user.id),
  ]);

  const fullName =
    profileData?.profile.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Student";
  const firstName = getFirstName(fullName);
  const greeting = getGreeting();

  const dueToday = reviewSchedule.filter((item) => item.is_due_today);
  const activeSetsCount = enrolledSets.length;

  return (
    <div>
      <header>
        <h1 className="font-serif text-2xl md:text-3xl text-ink">
          {greeting}, {firstName}.
        </h1>
        <p className="text-muted text-sm mt-1">
          Here&apos;s how your learning is going.
        </p>
      </header>

      <section className="mt-6">
        {dueToday.length > 0 ? (
          <Card className="border-2 border-lime bg-lime/5" padding="md">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-ink">
                🧠 Due for review today
              </h2>
              <Badge variant="lime">{dueToday.length} sets</Badge>
            </div>
            <p className="text-muted text-sm mt-2">
              Based on your last practice, these sets are ready for review.
              Testing yourself now locks the memory in.
            </p>

            <div className="flex flex-col gap-2 mt-4">
              {dueToday.map((item) => (
                <div
                  key={item.question_set_id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {item.set_name}
                    </p>
                    <p className="text-xs text-muted">{item.subject_name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="default">{item.accuracy_rate}%</Badge>
                    <Link href={`/dashboard/quiz/${item.question_set_id}`}>
                      <Button size="sm">Practice -&gt;</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="bg-cream border-dashed" padding="md">
            <h2 className="font-serif text-lg text-ink">
              ✓ You&apos;re all caught up!
            </h2>
            <p className="text-muted text-sm mt-1">
              No sets due for review today. Check back tomorrow.
            </p>
          </Card>
        )}
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard
          label="Total Answered"
          value={stats.totalAnswered}
          description="questions answered"
        />
        <StatCard
          label="Accuracy"
          value={`${stats.accuracyRate}%`}
          description="correct answers"
          valueClassName={getAccuracyColor(stats.accuracyRate)}
        />
        <StatCard
          label="This Week"
          value={stats.thisWeekAnswered}
          description="answered this week"
        />
        <StatCard
          label="Active Sets"
          value={activeSetsCount}
          description="currently enrolled sets"
        />

        <div className="col-span-2 md:col-span-4">
          {stats.streakDays > 0 ? (
            <Card
              className="bg-lime border-0 rounded-lg p-4 flex items-center justify-between"
              padding="sm"
            >
              <p className="font-serif text-xl text-ink flex items-center gap-2">
                <Flame className="w-5 h-5" />
                {stats.streakDays} day streak
              </p>
              <p className="text-ink/70 text-sm">Keep it up!</p>
            </Card>
          ) : (
            <Card
              className="bg-cream border border-border rounded-lg p-4"
              padding="sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-serif text-xl text-muted">
                  Start your streak today
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-ink">Recent activity</h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-muted hover:text-ink"
            >
              View all -&gt;
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-10 h-10" />}
              title="No activity yet"
              description="Your quiz answers will appear here once you start answering questions."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity) => (
                <Card key={activity.id} padding="sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={[
                          "w-2 h-2 rounded-full mt-1.5",
                          activity.is_correct ? "bg-lime" : "bg-red-400",
                        ].join(" ")}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">
                          {activity.subjects?.name ?? "Unknown subject"}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {activity.question_sets?.set_name ?? "Unknown set"}
                        </p>
                        {activity.blocked_site ? (
                          <p className="text-xs text-muted/60 italic">
                            via {activity.blocked_site}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted">
                        {formatRelativeTime(activity.answered_at)}
                      </p>
                      <Badge
                        variant={activity.is_correct ? "lime" : "default"}
                        className="mt-1"
                      >
                        {activity.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-ink">My sets</h2>
            <Link
              href="/dashboard/sets"
              className="text-sm text-muted hover:text-ink"
            >
              Browse all -&gt;
            </Link>
          </div>

          {enrolledSets.length === 0 ? (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No active sets"
              description="Enter a reference code above or ask your teacher to assign a set."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {enrolledSets.map((set) => (
                <Card
                  key={set.id}
                  padding="sm"
                  className="hover:border-ink/30 transition cursor-pointer"
                >
                  <h3 className="text-sm font-medium text-ink line-clamp-1">
                    {set.set_name}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {set.subject?.name ?? "Unknown subject"} · Year{" "}
                    {set.year_level}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="lime">
                      {set.question_count ?? 0} questions
                    </Badge>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink mb-4">
          Accuracy by subject
        </h2>

        {accuracyBySubject.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-10 h-10" />}
            title="No subjects yet"
            description="Your subject preferences will appear here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {accuracyBySubject.map((subject) => {
              const color: "lime" | "amber" | "red" =
                subject.rate >= 70
                  ? "lime"
                  : subject.rate >= 40
                    ? "amber"
                    : "red";

              return (
                <div key={subject.subject_name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-ink">
                      {subject.subject_name}
                    </p>
                    <p className="text-sm text-muted">
                      {subject.rate}% ({subject.correct}/{subject.total})
                    </p>
                  </div>
                  <ProgressBar value={subject.rate} color={color} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
