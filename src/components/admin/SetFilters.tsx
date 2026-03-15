"use client";

import { useMemo, useState } from "react";
import SetsTable from "@/components/admin/SetsTable";
import Input from "@/components/ui/Input";
import type { QuestionSet } from "@/types/database";

interface SetFiltersProps {
  sets: QuestionSet[];
}

type StatusFilter = "all" | "active" | "inactive";

export default function SetFilters({ sets }: SetFiltersProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [yearLevel, setYearLevel] = useState<string>("all");
  const [search, setSearch] = useState("");

  const subjects = useMemo(() => {
    const map = new Map<string, string>();
    for (const set of sets) {
      if (set.subject_id && set.subject?.name) {
        map.set(set.subject_id, set.subject.name);
      }
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sets]);

  const years = useMemo(
    () =>
      Array.from(new Set(sets.map((set) => set.year_level))).sort(
        (a, b) => a - b,
      ),
    [sets],
  );

  const filtered = useMemo(() => {
    return sets.filter((set) => {
      const matchesStatus =
        status === "all" ||
        (status === "active" && set.is_active) ||
        (status === "inactive" && !set.is_active);
      const matchesSubject =
        subjectId === "all" || set.subject_id === subjectId;
      const matchesYear =
        yearLevel === "all" || String(set.year_level) === yearLevel;
      const matchesSearch =
        search.trim().length === 0 ||
        set.set_name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesStatus && matchesSubject && matchesYear && matchesSearch;
    });
  }, [sets, status, subjectId, yearLevel, search]);

  return (
    <div className="mt-6">
      <div className="rounded-lg border border-border p-4 bg-cream/40">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "inactive", label: "Inactive" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatus(item.key as StatusFilter)}
              className={[
                "px-3 py-1 text-xs rounded-full whitespace-nowrap",
                status === item.key
                  ? "bg-ink text-paper"
                  : "bg-paper border border-border text-muted hover:text-ink",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="subject-filter"
              className="block text-xs text-muted mb-1"
            >
              Subject
            </label>
            <select
              id="subject-filter"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="w-full bg-paper border border-border rounded-md px-3 py-2 text-sm text-ink"
            >
              <option value="all">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="year-filter"
              className="block text-xs text-muted mb-1"
            >
              Year level
            </label>
            <select
              id="year-filter"
              value={yearLevel}
              onChange={(event) => setYearLevel(event.target.value)}
              className="w-full bg-paper border border-border rounded-md px-3 py-2 text-sm text-ink"
            >
              <option value="all">All</option>
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Search"
              placeholder="Search by set name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <SetsTable sets={filtered} />
      </div>
    </div>
  );
}
