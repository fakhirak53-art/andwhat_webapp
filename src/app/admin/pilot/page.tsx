import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getAdminProfile } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

function getDaysRemaining(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default async function AdminPilotPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const daysRemaining = getDaysRemaining(adminProfile.pilot_expires_at ?? null);

  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl text-ink">Pilot status</h1>
        <p className="text-muted text-sm mt-1">
          Manage your school pilot timeline and next steps.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">School code</p>
          <p className="mt-2 text-xl font-semibold text-ink">{adminProfile.school_code}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">Pilot status</p>
          <p className="mt-2 text-xl font-semibold text-ink capitalize">
            {adminProfile.pilot_status ?? "active"}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted">Days remaining</p>
          <p className="mt-2 text-xl font-semibold text-ink">
            {daysRemaining === null ? "Not set" : Math.max(daysRemaining, 0)}
          </p>
        </Card>
      </section>

      <Card className="mt-6">
        <h2 className="font-serif text-xl text-ink">What happens on expiry?</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          When your pilot expires, student and teacher access is blocked until your
          school is upgraded or reactivated.
        </p>
      </Card>
    </div>
  );
}
