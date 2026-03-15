"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { formatRelativeTime, getAccuracyColor } from "@/lib/utils";
import type { StudentRow } from "@/types/admin";

interface StudentsTableProps {
  students: StudentRow[];
}

type LinkFilter = "all" | "linked" | "unlinked";

function getInitials(name: string | null): string {
  const safe = (name ?? "Student").trim();
  const parts = safe.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "S";
}

function accuracyFor(student: StudentRow): number {
  if (student.total_answers === 0) return 0;
  return Math.round((student.correct_answers / student.total_answers) * 100);
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const [search, setSearch] = useState("");
  const [linkFilter, setLinkFilter] = useState<LinkFilter>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const yearValues = useMemo(() => {
    const values = Array.from(
      new Set(
        students
          .map((student) => student.year_level)
          .filter((value): value is number => value !== null),
      ),
    ).sort((a, b) => a - b);
    return values;
  }, [students]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        (student.full_name ?? "").toLowerCase().includes(normalizedSearch) ||
        (student.email ?? "").toLowerCase().includes(normalizedSearch);

      const matchesLink =
        linkFilter === "all" ||
        (linkFilter === "linked" && Boolean(student.auth_user_id)) ||
        (linkFilter === "unlinked" && !student.auth_user_id);

      const matchesYear =
        yearFilter === "all"
          ? true
          : yearFilter === "unknown"
            ? student.year_level === null
            : String(student.year_level) === yearFilter;

      return matchesSearch && matchesLink && matchesYear;
    });
  }, [students, search, linkFilter, yearFilter]);

  if (students.length === 0) {
    return (
      <Card padding="md" className="border-dashed">
        <p className="font-serif text-lg text-ink text-center">
          No students found
        </p>
        <p className="text-muted text-sm text-center mt-1">
          Students will appear here once they are added to your school roster.
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <div className="rounded-lg border border-border bg-cream/40 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
          />
          <div>
            <p className="text-xs text-muted mb-1">Account status</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: "all", label: "All" },
                { key: "linked", label: "Linked" },
                { key: "unlinked", label: "Unlinked" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLinkFilter(item.key as LinkFilter)}
                  className={[
                    "px-3 py-1 text-xs rounded-full",
                    linkFilter === item.key
                      ? "bg-ink text-paper"
                      : "bg-paper border border-border text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Year level</p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setYearFilter("all")}
                className={[
                  "px-3 py-1 text-xs rounded-full",
                  yearFilter === "all"
                    ? "bg-ink text-paper"
                    : "bg-paper border border-border text-muted hover:text-ink",
                ].join(" ")}
              >
                All
              </button>
              {yearValues.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setYearFilter(String(year))}
                  className={[
                    "px-3 py-1 text-xs rounded-full",
                    yearFilter === String(year)
                      ? "bg-ink text-paper"
                      : "bg-paper border border-border text-muted hover:text-ink",
                  ].join(" ")}
                >
                  Year {year}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setYearFilter("unknown")}
                className={[
                  "px-3 py-1 text-xs rounded-full",
                  yearFilter === "unknown"
                    ? "bg-ink text-paper"
                    : "bg-paper border border-border text-muted hover:text-ink",
                ].join(" ")}
              >
                Unspecified
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full bg-paper text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Student
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Year level
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Answers
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Accuracy
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Last active
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Account status
              </th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => {
              const accuracy = accuracyFor(student);
              const isLinked = Boolean(student.auth_user_id);
              return (
                <tr
                  key={student.id}
                  className="border-b border-border align-top"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-cream text-ink text-xs flex items-center justify-center shrink-0">
                        {getInitials(student.full_name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {student.full_name ?? "Unnamed student"}
                        </p>
                        <p className="text-xs text-muted">
                          {student.email ?? "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">
                    {student.year_level ? `Year ${student.year_level}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {student.total_answers}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={getAccuracyColor(accuracy)}>
                      {accuracy}%
                    </span>
                    <span className="text-muted">
                      {" "}
                      ({student.correct_answers}/{student.total_answers})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {student.last_active
                      ? formatRelativeTime(student.last_active)
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    {isLinked ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-lime" />
                        <Badge variant="lime">Linked</Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <Badge variant="default">Unlinked</Badge>
                        <Link href={`/admin/students/${student.id}`}>
                          <Button size="sm" variant="secondary">
                            Link account →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/students/${student.id}`}>
                      <Button size="sm" variant="secondary">
                        View →
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 md:hidden flex flex-col gap-3">
        {filtered.map((student) => {
          const accuracy = accuracyFor(student);
          const isLinked = Boolean(student.auth_user_id);
          return (
            <Card key={student.id} padding="sm">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-cream text-ink text-xs flex items-center justify-center shrink-0">
                  {getInitials(student.full_name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {student.full_name ?? "Unnamed student"}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {student.email ?? "No email"}
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <p className="text-muted">
                  Year:{" "}
                  <span className="text-ink">
                    {student.year_level ? `Year ${student.year_level}` : "—"}
                  </span>
                </p>
                <p className="text-muted">
                  Answers:{" "}
                  <span className="text-ink">{student.total_answers}</span>
                </p>
                <p className="text-muted">
                  Accuracy:{" "}
                  <span className={getAccuracyColor(accuracy)}>
                    {accuracy}% ({student.correct_answers}/
                    {student.total_answers})
                  </span>
                </p>
                <p className="text-muted">
                  Last active:{" "}
                  <span className="text-ink">
                    {student.last_active
                      ? formatRelativeTime(student.last_active)
                      : "Never"}
                  </span>
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {isLinked ? (
                  <Badge variant="lime">Linked</Badge>
                ) : (
                  <Badge variant="default">Unlinked</Badge>
                )}
                <Link href={`/admin/students/${student.id}`}>
                  <Button size="sm" variant="secondary">
                    View →
                  </Button>
                </Link>
                {!isLinked ? (
                  <Link href={`/admin/students/${student.id}`}>
                    <Button size="sm" variant="secondary">
                      Link account →
                    </Button>
                  </Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
