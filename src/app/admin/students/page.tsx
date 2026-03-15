import { AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import StudentsTable from "@/components/admin/StudentsTable";
import { Card } from "@/components/ui/Card";
import { getAdminProfile, getSchoolStudents } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const students = await getSchoolStudents(adminProfile.school_id);
  const unlinkedCount = students.filter(
    (student) => !student.auth_user_id,
  ).length;

  return (
    <div>
      <header>
        <h1 className="font-serif text-2xl text-ink">Students</h1>
        <p className="text-muted text-sm mt-1">{students.length} registered</p>
      </header>

      {unlinkedCount > 0 ? (
        <Card className="mt-6 border-amber-200 bg-amber-50" padding="md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {unlinkedCount} students have no linked login account
              </p>
              <p className="text-sm text-amber-800 mt-1">
                These students exist in your school roster but haven&apos;t
                signed up on the website yet, or need to be manually linked.
              </p>
              <p className="text-sm text-amber-800 mt-1">
                How to link: ask the student to sign up, then use the Link
                Account button to connect their login to this record.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <StudentsTable students={students} />
    </div>
  );
}
