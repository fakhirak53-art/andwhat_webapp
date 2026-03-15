import Link from "next/link";
import { redirect } from "next/navigation";
import CSVUploader from "@/components/admin/CSVUploader";
import { getAdminProfile, getAdminQuestionSets } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

interface UploadSetOption {
  id: string;
  set_name: string;
  reference_code: string | null;
}

export default async function AdminSetsUploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const sets = await getAdminQuestionSets(adminProfile.school_id);
  const activeSets = sets
    .filter((set) => set.is_active)
    .map((set) => {
      const typedSet = set as { reference_code?: string | null };
      const row: UploadSetOption = {
        id: set.id,
        set_name: set.set_name,
        reference_code: typedSet.reference_code ?? null,
      };
      return row;
    });

  return (
    <div>
      <Link href="/admin/sets" className="text-sm text-muted hover:text-ink">
        ← Back to question sets
      </Link>

      <div className="mt-4">
        <CSVUploader questionSets={activeSets} />
      </div>
    </div>
  );
}
