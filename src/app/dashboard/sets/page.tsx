import { redirect } from "next/navigation";
import SetSearch from "@/components/dashboard/SetSearch";
import {
  getEnrolledSets,
  getSetProgress,
  getSpacedRepetitionSchedule,
} from "@/lib/dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardSetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [initialSets, schedule] = await Promise.all([
    getEnrolledSets(user.id),
    getSpacedRepetitionSchedule(user.id),
  ]);

  const progressEntries = await Promise.all(
    initialSets.map(
      async (set) => [set.id, await getSetProgress(user.id, set.id)] as const,
    ),
  );
  const progressBySetId = Object.fromEntries(progressEntries);

  const dueBySetId = Object.fromEntries(
    schedule.map((item) => [item.question_set_id, item] as const),
  );

  return (
    <SetSearch
      initialSets={initialSets}
      progressBySetId={progressBySetId}
      dueBySetId={dueBySetId}
    />
  );
}
