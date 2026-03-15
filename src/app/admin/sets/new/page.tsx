import Link from "next/link";
import { redirect } from "next/navigation";
import CreateSetForm from "@/components/admin/CreateSetForm";
import { getAdminProfile, getAllSubjects, getTextbooks } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

export default async function AdminCreateSetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const [subjects, textbooks] = await Promise.all([
    getAllSubjects(),
    getTextbooks(adminProfile.school_id),
  ]);

  return (
    <div>
      <Link href="/admin/sets" className="text-sm text-muted hover:text-ink">
        ← Back to question sets
      </Link>
      <div className="mt-4">
        <CreateSetForm
          subjects={subjects}
          textbooks={textbooks}
          schoolId={adminProfile.school_id}
        />
      </div>
    </div>
  );
}
