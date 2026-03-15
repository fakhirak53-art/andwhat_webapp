import Link from "next/link";
import { redirect } from "next/navigation";
import RulesTable, {
  type ProtectedRuleRow,
} from "@/components/admin/RulesTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getAdminProfile, getAdminQuestionSets } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";

interface AdminRulesPageProps {
  searchParams: Promise<{ new?: string }>;
}

export default async function AdminRulesPage({
  searchParams,
}: AdminRulesPageProps) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) redirect("/admin/login");

  const [questionSets, rulesResponse] = await Promise.all([
    getAdminQuestionSets(adminProfile.school_id),
    supabase
      .from("protected_rules")
      .select("id, year_level, pattern, question_set_id, is_active, priority")
      .eq("school_id", adminProfile.school_id)
      .order("priority", { ascending: true }),
  ]);

  const rules = (rulesResponse.data ?? []) as unknown as ProtectedRuleRow[];
  const setOptions = questionSets.map((set) => ({
    id: set.id,
    set_name: set.set_name,
    year_level: set.year_level,
    subject_name: set.subject?.name ?? "Subject",
    is_active: set.is_active,
  }));

  return (
    <div>
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-ink">Site Rules</h1>
          <p className="text-muted text-sm mt-1">
            Control which websites trigger quizzes for your students
          </p>
        </div>
        <Link href="/admin/rules?new=1">
          <Button>Add rule</Button>
        </Link>
      </header>

      <Card className="mt-6 border-lime/30 bg-lime/5" padding="md">
        <p className="text-sm text-ink">
          When a student visits a URL matching a pattern, the browser extension
          intercepts it and shows a quiz from the assigned question set.
        </p>
        <p className="text-sm text-muted mt-2">
          Example: <code className="font-mono text-ink">youtube.com/*</code> →
          Biology Unit 3 → Year 10
        </p>
      </Card>

      <RulesTable
        rules={rules}
        questionSets={setOptions}
        openCreateByDefault={params.new === "1"}
      />
    </div>
  );
}
