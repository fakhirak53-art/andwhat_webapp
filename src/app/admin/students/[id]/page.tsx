import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LinkAccountForm from "@/components/admin/LinkAccountForm";
import ProgressBar from "@/components/dashboard/ProgressBar";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getAdminProfile, getStudentDetail } from "@/lib/admin";
import { formatRelativeTime, getAccuracyColor } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

function initials(name: string | null): string {
  const safe = (name ?? "Student").trim();
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "S";
}

export default async function AdminStudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const detail = await getStudentDetail(id, adminProfile.school_id);
  if (!detail) redirect("/admin/students");

  const { student, recentLogs, setProgress } = detail;
  const accuracy =
    student.total_answers > 0
      ? Math.round((student.correct_answers / student.total_answers) * 100)
      : 0;

  return (
    <div>
      <Link
        href="/admin/students"
        className="text-sm text-muted hover:text-ink"
      >
        ← Back to Students
      </Link>

      <header className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-cream text-ink text-sm flex items-center justify-center shrink-0">
            {initials(student.full_name)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl text-ink">
                {student.full_name ?? "Unnamed student"}
              </h1>
              {student.year_level ? (
                <Badge variant="default">Year {student.year_level}</Badge>
              ) : null}
            </div>
            <p className="text-muted text-sm mt-1">
              {student.email ?? "No email"}
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard
          label="Total answers"
          value={student.total_answers}
          description="all-time answers"
        />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          description={`${student.correct_answers}/${student.total_answers} correct`}
          valueClassName={getAccuracyColor(accuracy)}
        />
        <StatCard
          label="Last active"
          value={
            student.last_active
              ? formatRelativeTime(student.last_active)
              : "Never"
          }
          description="most recent answer"
        />
      </section>

      {student.auth_user_id === null ? (
        <Card className="mt-6 border-amber-200 bg-amber-50" padding="md">
          <h2 className="font-serif text-lg text-ink">Account not linked</h2>
          <p className="text-sm text-muted mt-1">
            Link this student row to an existing signed-up auth account.
          </p>
          <div className="mt-4">
            <LinkAccountForm studentId={student.id} isLinked={false} />
          </div>
        </Card>
      ) : (
        <Card className="mt-6" padding="md">
          <h2 className="font-serif text-lg text-ink">Account status</h2>
          <p className="text-sm text-muted mt-1">
            This student is currently linked to a login account.
          </p>
          <div className="mt-4">
            <LinkAccountForm
              studentId={student.id}
              isLinked
              linkedEmail={student.email}
            />
          </div>
        </Card>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">Set progress</h2>
        {setProgress.length === 0 ? (
          <Card className="mt-3 border-dashed" padding="md">
            <p className="text-sm text-muted">No set activity recorded yet.</p>
          </Card>
        ) : (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {setProgress.map((set) => {
              const rate =
                set.total > 0 ? Math.round((set.correct / set.total) * 100) : 0;
              return (
                <Card key={`${set.set_name}-${set.last_answered}`} padding="md">
                  <p className="font-medium text-ink">{set.set_name}</p>
                  <p className="text-xs text-muted mt-1">{set.subject_name}</p>
                  <div className="mt-3">
                    <ProgressBar
                      value={rate}
                      color={rate >= 70 ? "lime" : rate >= 40 ? "amber" : "red"}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted">
                      {set.correct}/{set.total} correct
                    </span>
                    <span className="text-muted">
                      Last practiced {formatRelativeTime(set.last_answered)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-ink">Recent activity</h2>
        <div className="mt-3 flex flex-col gap-3">
          {recentLogs.length === 0 ? (
            <Card padding="md" className="border-dashed">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-muted/40 mx-auto" />
                <p className="font-serif text-lg text-ink mt-2">
                  No activity yet
                </p>
              </div>
            </Card>
          ) : (
            recentLogs.map((log) => (
              <Card key={log.id} padding="sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {log.subjects?.name ?? "Subject"}
                    </p>
                    <p className="text-xs text-muted">
                      {log.question_sets?.set_name ?? "Question set"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={log.is_correct ? "lime" : "default"}>
                      {log.is_correct ? "Correct" : "Incorrect"}
                    </Badge>
                    <p className="text-xs text-muted mt-1">
                      {formatRelativeTime(log.answered_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
