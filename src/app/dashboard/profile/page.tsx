import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import SubjectSelector from "@/components/dashboard/SubjectSelector";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getStudentProfile, getSubjectPreferences } from "@/lib/dashboard";
import { formatFullDate } from "@/lib/utils";
import type { Subject } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "S";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileData, preferences, allSubjectsResponse] = await Promise.all([
    getStudentProfile(user.id),
    getSubjectPreferences(user.id),
    supabase
      .from("subjects")
      .select("id, name, year_level, curriculum_code")
      .order("year_level", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  const fullName =
    profileData?.profile.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Student";
  const email = profileData?.student?.school_email || user.email || "Not set";
  const schoolName = profileData?.student?.school_name || "Not set";
  const yearLevelValue = profileData?.student?.year_level ?? null;
  const yearLevel = yearLevelValue ? `Year ${yearLevelValue}` : "Not set";
  const createdAt = profileData?.profile.created_at;
  const consent = profileData?.student?.parent_consent ?? false;
  const allSubjects: Subject[] = allSubjectsResponse.error
    ? []
    : ((allSubjectsResponse.data ?? []) as Subject[]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card padding="lg">
          <div className="w-20 h-20 rounded-full bg-lime text-ink font-serif text-3xl mx-auto flex items-center justify-center">
            {getInitials(fullName)}
          </div>
          <h1 className="font-serif text-2xl text-center mt-4 text-ink">
            {fullName}
          </h1>
          <div className="flex justify-center mt-3">
            <Badge>High School Student</Badge>
          </div>

          <div className="my-6 border-t border-border" />

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Email
              </p>
              <p className="text-sm text-ink font-medium mt-1">{email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                School
              </p>
              <p className="text-sm text-ink font-medium mt-1">{schoolName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Year level
              </p>
              <p className="text-sm text-ink font-medium mt-1">{yearLevel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Member since
              </p>
              <p className="text-sm text-ink font-medium mt-1">
                {createdAt ? formatFullDate(createdAt) : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Parent consent
              </p>
              <div className="mt-1">
                <Badge variant={consent ? "success" : "warning"}>
                  {consent ? "Approved" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card padding="md">
          <SubjectSelector
            allSubjects={allSubjects}
            initialPreferences={preferences}
            yearLevel={yearLevelValue}
          />
        </Card>

        <Card padding="md" className="mt-4">
          <h2 className="font-serif text-lg text-ink">Account</h2>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">Account type</p>
              <p className="text-sm text-ink font-medium">
                High School Student
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">Auth provider</p>
              <p className="text-sm text-ink font-medium">
                Email &amp; Password
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="text-error px-0 py-0"
              >
                Sign out of all devices
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
