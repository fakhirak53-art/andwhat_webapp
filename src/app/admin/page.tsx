import { BookOpen, BookPlus, Shield, Upload, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ActivitySparkline from "@/components/admin/ActivitySparkline";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  getAdminProfile,
  getAdminStats,
  getDailyCompletions,
  getRecentSchoolActivity,
} from "@/lib/admin";
import {
  formatRelativeTime,
  getAccuracyColor,
  getFirstName,
  getGreeting,
} from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

function getInitials(name: string | null): string {
  const safe = (name ?? "Student").trim();
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "S";
}

const quickActions = [
  {
    href: "/admin/sets/new",
    title: "Create question set",
    description: "Add a new question set for your students",
    icon: BookPlus,
  },
  {
    href: "/admin/sets/upload",
    title: "Upload questions (CSV)",
    description: "Bulk import questions from a spreadsheet",
    icon: Upload,
  },
  {
    href: "/admin/rules",
    title: "Manage site rules",
    description: "Control which sites trigger which quizzes",
    icon: Shield,
  },
  {
    href: "/admin/students",
    title: "View all students",
    description: "See activity and manage student accounts",
    icon: Users,
  },
];

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const [stats, recentActivity, dailyCompletions] = await Promise.all([
    getAdminStats(adminProfile.school_id),
    getRecentSchoolActivity(adminProfile.school_id),
    getDailyCompletions(adminProfile.school_id),
  ]);

  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl text-ink">
          {getGreeting()}, {getFirstName(adminProfile.full_name)}.
        </h1>
        <p className="text-muted text-sm mt-1">
          {adminProfile.school_name} · Admin Dashboard
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          description="registered students"
        />
        <StatCard
          label="Active This Week"
          value={stats.activeStudentsThisWeek}
          description="students active"
        />
        <StatCard
          label="New This Week"
          value={stats.newSignupsThisWeek}
          description="new signups"
        />
        <StatCard
          label="Avg Accuracy"
          value={`${stats.averageAccuracy}%`}
          description="average accuracy"
          valueClassName={getAccuracyColor(stats.averageAccuracy)}
        />

        <StatCard
          label="Total Completions"
          value={stats.totalQuizCompletions}
          description="total quiz answers"
        />
        <StatCard
          label="Today"
          value={stats.completionsToday}
          description="answers today"
        />
        <StatCard
          label="This Week"
          value={stats.completionsThisWeek}
          description="answers this week"
        />
        <StatCard
          label="Question Sets"
          value={stats.totalQuestionSets}
          description="active sets"
        />
      </section>

      <ActivitySparkline data={dailyCompletions} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <h2 className="font-serif text-xl text-ink mb-3">Recent activity</h2>
          <div className="flex flex-col gap-3">
            {recentActivity.length === 0 ? (
              <Card padding="md" className="border-dashed">
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-muted/40 mx-auto" />
                  <p className="font-serif text-lg text-ink mt-2">
                    No activity yet
                  </p>
                  <p className="text-muted text-sm mt-1">
                    Student quiz events will appear here.
                  </p>
                </div>
              </Card>
            ) : (
              recentActivity.map((activity, index) => (
                <Card key={`${activity.answered_at}-${index}`} padding="sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cream text-ink text-xs flex items-center justify-center shrink-0">
                      {getInitials(activity.student_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">
                        {activity.student_name ?? "Unknown student"}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {activity.email ?? "No email"}
                      </p>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-muted">
                          {activity.set_name ?? "Unknown set"}
                        </p>
                        {activity.subject_name ? (
                          <Badge variant="default">
                            {activity.subject_name}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant={activity.is_correct ? "lime" : "default"}>
                        {activity.is_correct ? "Correct" : "Incorrect"}
                      </Badge>
                      <p className="text-xs text-muted mt-1">
                        {formatRelativeTime(activity.answered_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl text-ink mb-3">Quick actions</h2>
          <div className="flex flex-col gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <Card
                    padding="sm"
                    className="flex items-center gap-4 hover:border-ink/30 transition cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-lime flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-ink" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {action.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
