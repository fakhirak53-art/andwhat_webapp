import Link from "next/link";
import { redirect } from "next/navigation";
import SetFilters from "@/components/admin/SetFilters";
import { Button } from "@/components/ui/Button";
import { getAdminProfile, getAdminQuestionSets } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

export default async function AdminSetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const sets = await getAdminQuestionSets(adminProfile.school_id);

  return (
    <div>
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Question Sets</h1>
          <p className="text-muted text-sm mt-1">{sets.length} sets</p>
        </div>
        <Link href="/admin/sets/new">
          <Button>Create set</Button>
        </Link>
      </header>

      <SetFilters sets={sets} />
    </div>
  );
}
