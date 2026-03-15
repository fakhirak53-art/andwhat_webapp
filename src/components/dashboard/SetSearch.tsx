"use client";

import { Check, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useState, useTransition } from "react";
import { searchSetAction } from "@/app/actions/sets";
import {
  enrollInQuestionSet,
  unenrollFromQuestionSet,
} from "@/app/actions/student";
import EmptyState from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatFullDate, formatRelativeTime } from "@/lib/utils";
import type { QuestionSet, SpacedRepetitionItem } from "@/types/database";

interface SetSearchProps {
  initialSets: QuestionSet[];
  progressBySetId: Record<
    string,
    {
      total_questions: number;
      answered: number;
      correct: number;
      accuracy: number;
      last_practiced: string | null;
    }
  >;
  dueBySetId: Record<string, SpacedRepetitionItem | undefined>;
}

export default function SetSearch({
  initialSets,
  progressBySetId,
  dueBySetId,
}: SetSearchProps) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<QuestionSet | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [isPending, startTransition] = useTransition();
  const [enrolledSets, setEnrolledSets] = useState<QuestionSet[]>(initialSets);
  const [localProgressBySetId, setLocalProgressBySetId] =
    useState(progressBySetId);
  const [menuOpenForSetId, setMenuOpenForSetId] = useState<string | null>(null);
  const [actionSetId, setActionSetId] = useState<string | null>(null);

  const subjectFilters = useMemo(() => {
    const names = new Set<string>();
    enrolledSets.forEach((set) => {
      if (set.subject?.name) names.add(set.subject.name);
    });
    return ["All", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }, [enrolledSets]);

  const filteredSets = useMemo(() => {
    if (subjectFilter === "All") return enrolledSets;
    return enrolledSets.filter((set) => set.subject?.name === subjectFilter);
  }, [enrolledSets, subjectFilter]);

  const enrolledSetIds = useMemo(
    () => new Set(enrolledSets.map((set) => set.id)),
    [enrolledSets],
  );

  function getDueLabel(setId: string): {
    text: string;
    variant: "lime" | "default";
  } {
    const schedule = dueBySetId[setId];
    if (!schedule) return { text: "Not scheduled", variant: "default" };
    if (schedule.is_due_today) return { text: "Due today", variant: "lime" };

    const dueDate = new Date(schedule.next_due);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (
      dueDate.getFullYear() === tomorrow.getFullYear() &&
      dueDate.getMonth() === tomorrow.getMonth() &&
      dueDate.getDate() === tomorrow.getDate()
    ) {
      return { text: "Due tomorrow", variant: "default" };
    }

    return {
      text: `Next: ${formatFullDate(schedule.next_due)}`,
      variant: "default",
    };
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSearchError(null);
    setSearchResult(null);

    startTransition(async () => {
      const response = await searchSetAction(searchQuery);
      if (response.error) {
        setSearchError(response.error);
        return;
      }
      setSearchResult(response.data?.[0] ?? null);
    });
  }

  async function handleEnroll(
    set: QuestionSet,
    startNow: boolean,
  ): Promise<void> {
    setActionSetId(set.id);
    const response = await enrollInQuestionSet(set.id);
    setActionSetId(null);

    if (!response.success) {
      toast.error(response.error ?? "Could not enroll in this set.");
      return;
    }

    if (!enrolledSetIds.has(set.id)) {
      setEnrolledSets((prev) => [set, ...prev]);
      setLocalProgressBySetId((prev) => ({
        ...prev,
        [set.id]: {
          total_questions: set.question_count ?? 0,
          answered: 0,
          correct: 0,
          accuracy: 0,
          last_practiced: null,
        },
      }));
    }

    toast.success(
      startNow ? "Enrolled. Starting quiz..." : "Added to your sets!",
    );
    if (startNow) {
      window.location.href = `/dashboard/quiz/${set.id}`;
    }
  }

  async function handleUnenroll(setId: string): Promise<void> {
    setActionSetId(setId);
    const response = await unenrollFromQuestionSet(setId);
    setActionSetId(null);
    setMenuOpenForSetId(null);

    if (!response.success) {
      toast.error(response.error ?? "Could not remove this set.");
      return;
    }

    setEnrolledSets((prev) => prev.filter((set) => set.id !== setId));
    toast.info("Removed from your sets.");
  }

  return (
    <div>
      <header>
        <h1 className="font-serif text-2xl text-ink">Question Sets</h1>
        <p className="text-muted text-sm mt-1">
          Browse your assigned sets or enter a reference number.
        </p>
      </header>

      <Card className="mt-6 border-2 border-lime/50 bg-lime/5" padding="md">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-ink">
              Enter reference number
            </p>
            <p className="text-xs text-muted mt-1">
              Paste the UUID reference number given by your teacher
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g. 3f2504e0-4f89-11d3-9a0c-0305e82c3301"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="font-mono text-sm"
            />
            <Button type="submit" loading={isPending}>
              Find Set
            </Button>
          </div>

          {searchError ? (
            <p className="text-sm text-error">
              {searchError.includes("No question set found")
                ? "No question set found with that reference number."
                : searchError}
            </p>
          ) : null}
        </form>

        {searchResult ? (
          <div className="mt-4 bg-paper border-2 border-lime rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-ink" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-xl text-ink">
                  {searchResult.set_name}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {searchResult.subject?.name ?? "Unknown subject"} · Year{" "}
                  {searchResult.year_level} ·{" "}
                  {searchResult.school?.name ?? "Unknown school"}
                </p>
                <Badge variant="lime" className="mt-3">
                  {searchResult.question_count ?? 0} questions
                </Badge>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {enrolledSetIds.has(searchResult.id) ? (
                    <>
                      <Badge variant="lime">Already enrolled</Badge>
                      <Link href={`/dashboard/quiz/${searchResult.id}`}>
                        <Button>Practice now -&gt;</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        loading={actionSetId === searchResult.id}
                        onClick={() => handleEnroll(searchResult, true)}
                      >
                        Enroll &amp; Start Quiz -&gt;
                      </Button>
                      <Button
                        variant="secondary"
                        loading={actionSetId === searchResult.id}
                        onClick={() => handleEnroll(searchResult, false)}
                      >
                        Enroll only
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <p className="text-center text-muted text-xs mt-6">
        - or browse your enrolled sets -
      </p>

      <div className="mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {subjectFilters.map((subject) => {
            const active = subjectFilter === subject;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setSubjectFilter(subject)}
                className={[
                  "rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "bg-cream border border-border text-muted hover:text-ink",
                ].join(" ")}
              >
                {subject}
              </button>
            );
          })}
        </div>

        {filteredSets.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No active sets"
              description="Enter a reference number above or ask your teacher to assign a set."
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSets.map((set) => (
              <Card
                key={set.id}
                padding="md"
                className="hover:shadow-sm transition-shadow duration-150"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg text-ink line-clamp-1">
                    {set.set_name}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-2" />
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Badge variant="default">
                    {set.subject?.name ?? "Unknown subject"}
                  </Badge>
                  <Badge variant="default">Year {set.year_level}</Badge>
                </div>

                <p className="text-xs text-muted mt-2">
                  {set.school?.name ?? "Unknown school"}
                </p>

                {(() => {
                  const progress = localProgressBySetId[set.id];
                  const practiced = progress?.answered ?? 0;
                  const total =
                    progress?.total_questions ?? set.question_count ?? 0;
                  const progressPct =
                    total > 0
                      ? Math.min(100, Math.round((practiced / total) * 100))
                      : 0;

                  return (
                    <div className="mt-3">
                      <div className="w-full h-1.5 rounded-full bg-cream border border-border overflow-hidden">
                        <div
                          className="h-full bg-lime-dark transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {practiced}/{total} questions practiced
                      </p>
                      <p className="text-xs text-muted">
                        {progress?.last_practiced
                          ? `Last practiced ${formatRelativeTime(progress.last_practiced)}`
                          : "Not practiced yet"}
                      </p>
                    </div>
                  );
                })()}

                <div className="my-3 border-t border-border" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const dueLabel = getDueLabel(set.id);
                      return (
                        <Badge variant={dueLabel.variant}>
                          {dueLabel.text}
                        </Badge>
                      );
                    })()}
                    <p className="text-xs text-muted">
                      Added {formatRelativeTime(set.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <Link href={`/dashboard/quiz/${set.id}`}>
                      <Button size="sm">Practice -&gt;</Button>
                    </Link>
                    <button
                      type="button"
                      className="text-muted hover:text-ink p-1"
                      onClick={() =>
                        setMenuOpenForSetId((prev) =>
                          prev === set.id ? null : set.id,
                        )
                      }
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpenForSetId === set.id ? (
                      <div className="absolute right-0 top-8 z-20 min-w-40 bg-paper border border-border rounded-md shadow-sm p-1">
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-xs text-ink hover:bg-cream rounded"
                          onClick={() => {
                            const progress = localProgressBySetId[set.id];
                            toast.info(
                              progress
                                ? `Progress: ${progress.answered}/${progress.total_questions} practiced`
                                : "No progress yet.",
                            );
                            setMenuOpenForSetId(null);
                          }}
                        >
                          View progress
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleUnenroll(set.id)}
                          disabled={actionSetId === set.id}
                        >
                          Remove from my sets
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
