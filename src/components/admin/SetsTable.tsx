"use client";

import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  deleteQuestionSet,
  toggleQuestionSetActive,
} from "@/app/actions/sets-admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { QuestionSet } from "@/types/database";

interface SetsTableProps {
  sets: QuestionSet[];
}

interface QuestionSetWithReferenceCode extends QuestionSet {
  reference_code?: string | null;
}

function getReferenceCode(set: QuestionSetWithReferenceCode): string {
  if (set.reference_code && set.reference_code.trim().length > 0) {
    return set.reference_code;
  }
  return `QS-${set.id.slice(0, 8).toUpperCase()}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SetsTable({ sets }: SetsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const ordered = useMemo(
    () =>
      [...sets].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [sets],
  );

  function copyUuid(value: string): void {
    navigator.clipboard.writeText(value);
    setCopiedId(value);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  function handleToggle(setId: string, nextActive: boolean): void {
    setPendingId(setId);
    startTransition(async () => {
      await toggleQuestionSetActive(setId, nextActive);
      window.location.reload();
    });
  }

  function handleDelete(setId: string): void {
    setPendingId(setId);
    startTransition(async () => {
      await deleteQuestionSet(setId);
      setConfirmDeleteId(null);
      window.location.reload();
    });
  }

  if (ordered.length === 0) {
    return (
      <Card padding="md" className="border-dashed">
        <p className="font-serif text-lg text-ink text-center">
          No question sets yet
        </p>
        <p className="text-muted text-sm text-center mt-1">
          Create your first set to start assigning quizzes to students.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-left bg-paper">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Set name
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Subject / Year
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Questions
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Status
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Created
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Reference #
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((set) => {
              const typedSet = set as QuestionSetWithReferenceCode;
              const referenceCode = getReferenceCode(typedSet);
              const deleting = confirmDeleteId === set.id;
              const loading = isPending && pendingId === set.id;

              return (
                <tr key={set.id} className="border-b border-border align-top">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/sets/${set.id}`}
                      className="text-sm font-medium text-ink hover:underline"
                    >
                      {set.set_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">
                        {set.subject?.name ?? "Subject"}
                      </Badge>
                      <Badge variant="default">Year {set.year_level}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {set.question_count ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={set.is_active ? "lime" : "default"}>
                      {set.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {formatDate(set.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-muted font-mono">
                        {referenceCode}
                      </code>
                      <button
                        type="button"
                        className="text-muted hover:text-ink"
                        onClick={() => copyUuid(referenceCode)}
                        aria-label={`Copy reference id for ${set.set_name}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedId === referenceCode ? (
                        <span className="text-[11px] text-green-700">
                          Copied!
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {deleting ? (
                      <div className="space-y-2">
                        <p className="text-xs text-red-700">
                          Delete this set and all {set.question_count ?? 0}{" "}
                          questions? This cannot be undone.
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-paper"
                            loading={loading}
                            onClick={() => handleDelete(set.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/sets/${set.id}`}>
                          <Button size="sm" variant="secondary">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={loading}
                          onClick={() => handleToggle(set.id, !set.is_active)}
                        >
                          {set.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error"
                          onClick={() => setConfirmDeleteId(set.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {ordered.map((set) => {
          const typedSet = set as QuestionSetWithReferenceCode;
          const referenceCode = getReferenceCode(typedSet);
          const loading = isPending && pendingId === set.id;
          return (
            <Card key={set.id} padding="sm">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/admin/sets/${set.id}`}
                  className="text-sm font-medium text-ink hover:underline"
                >
                  {set.set_name}
                </Link>
                <Badge variant={set.is_active ? "lime" : "default"}>
                  {set.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="default">
                  {set.subject?.name ?? "Subject"}
                </Badge>
                <Badge variant="default">Year {set.year_level}</Badge>
              </div>
              <p className="text-xs text-muted mt-2">
                {set.question_count ?? 0} questions ·{" "}
                {formatDate(set.created_at)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  loading={loading}
                  onClick={() => handleToggle(set.id, !set.is_active)}
                >
                  {set.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-error"
                  onClick={() => setConfirmDeleteId(set.id)}
                >
                  Delete
                </Button>
                <button
                  type="button"
                  className="text-muted hover:text-ink"
                  onClick={() => copyUuid(referenceCode)}
                >
                  {copiedId === referenceCode ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmDeleteId === set.id ? (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs text-red-700">
                    Delete this set and all {set.question_count ?? 0} questions?
                    This cannot be undone.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-paper"
                      loading={loading}
                      onClick={() => handleDelete(set.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </>
  );
}
