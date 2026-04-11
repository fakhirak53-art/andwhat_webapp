"use client";

import { useMemo, useState, useTransition } from "react";
import { createRule, updateRule } from "@/app/actions/rules-admin";
import { Button, Form, Input } from "@/components/ui";

export interface RuleSetOption {
  id: string;
  set_name: string;
  year_level: number;
  subject_name: string;
  is_active: boolean;
}

export interface EditableRule {
  id: string;
  year_level: number | null;
  pattern: string;
  question_set_id: string;
  is_active: boolean;
  priority: number;
}

interface RuleFormProps {
  questionSets: RuleSetOption[];
  initialRule?: EditableRule | null;
  onCancel: () => void;
  onSaved: () => void;
}

export default function RuleForm({
  questionSets,
  initialRule,
  onCancel,
  onSaved,
}: RuleFormProps) {
  const [pattern, setPattern] = useState(initialRule?.pattern ?? "");
  const [yearLevel, setYearLevel] = useState<string>(
    initialRule?.year_level ? String(initialRule.year_level) : "all",
  );
  const [questionSetId, setQuestionSetId] = useState(
    initialRule?.question_set_id ?? "",
  );
  const [priority, setPriority] = useState<number>(initialRule?.priority ?? 1);
  const [isActive, setIsActive] = useState(initialRule?.is_active ?? true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredSets = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const activeSets = questionSets.filter((set) => set.is_active);
    if (!normalized) return activeSets;
    return activeSets.filter((set) => {
      const haystack =
        `${set.set_name} ${set.subject_name} year ${set.year_level}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [questionSets, search]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("pattern", pattern);
    formData.set("year_level", yearLevel);
    formData.set("question_set_id", questionSetId);
    formData.set("priority", String(priority));
    if (isActive) formData.set("is_active", "on");

    startTransition(async () => {
      const result = initialRule
        ? await updateRule(initialRule.id, formData)
        : await createRule(formData);

      if (!result.success) {
        setError(result.error ?? "Could not save rule.");
        return;
      }

      onSaved();
    });
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="URL Pattern"
        value={pattern}
        onChange={(event) => setPattern(event.target.value)}
        placeholder="e.g. youtube.com/*"
        required
        hint="Use * as wildcard. Match subdomains with *.youtube.com"
      />

      <div>
        <label
          htmlFor="rule-year-level"
          className="block text-sm font-medium text-ink mb-1.5"
        >
          Year level
        </label>
        <select
          id="rule-year-level"
          value={yearLevel}
          onChange={(event) => setYearLevel(event.target.value)}
          className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
        >
          <option value="all">All year levels</option>
          {[7, 8, 9, 10, 11, 12].map((year) => (
            <option key={year} value={String(year)}>
              Year {year}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Search question sets"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search set name or subject"
      />

      <div>
        <label
          htmlFor="rule-question-set"
          className="block text-sm font-medium text-ink mb-1.5"
        >
          Question set
        </label>
        <select
          id="rule-question-set"
          value={questionSetId}
          onChange={(event) => setQuestionSetId(event.target.value)}
          className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink"
          required
        >
          <option value="">Select an active question set</option>
          {filteredSets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.set_name} · {set.subject_name} · Year {set.year_level}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Priority"
        type="number"
        min={1}
        value={String(priority)}
        onChange={(event) => setPriority(Number(event.target.value) || 1)}
      />

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Active
      </label>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button type="submit" loading={isPending}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
