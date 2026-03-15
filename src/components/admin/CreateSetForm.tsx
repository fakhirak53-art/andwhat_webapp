"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createQuestionSet, createTextbook } from "@/app/actions/sets-admin";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import type { Textbook } from "@/lib/admin";
import type { Subject } from "@/types/database";

interface CreateSetFormProps {
  subjects: Subject[];
  textbooks: Textbook[];
  schoolId: string;
}

export default function CreateSetForm({
  subjects,
  textbooks,
  schoolId: _schoolId,
}: CreateSetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState("");
  const [showTextbookForm, setShowTextbookForm] = useState(false);
  const [localTextbooks, setLocalTextbooks] = useState<Textbook[]>(textbooks);
  const [selectedTextbookId, setSelectedTextbookId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newTextbookTitle, setNewTextbookTitle] = useState("");
  const [newTextbookPublisher, setNewTextbookPublisher] = useState("");
  const [newTextbookYear, setNewTextbookYear] = useState("");
  const [textbookError, setTextbookError] = useState<string | null>(null);

  const groupedSubjects = useMemo(() => {
    const grouped = new Map<number, Subject[]>();
    for (const subject of subjects) {
      const current = grouped.get(subject.year_level) ?? [];
      current.push(subject);
      grouped.set(subject.year_level, current);
    }
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [subjects]);

  const filteredTextbooks = useMemo(() => {
    if (!subjectId) return localTextbooks;
    return localTextbooks.filter((book) => book.subject_id === subjectId);
  }, [localTextbooks, subjectId]);

  function handleCreateSet(formData: FormData): void {
    setError(null);
    formData.set("is_active", String(isActive));
    formData.set("textbook_id", selectedTextbookId);

    startTransition(async () => {
      const result = await createQuestionSet(formData);
      if (result.error || !result.data) {
        setError(result.error ?? "Unable to create question set.");
        return;
      }
      router.push(`/admin/sets/${result.data.id}`);
      router.refresh();
    });
  }

  function handleCreateTextbook(): void {
    if (!subjectId) {
      setTextbookError("Select a subject first.");
      return;
    }

    setTextbookError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", newTextbookTitle);
      formData.set("publisher", newTextbookPublisher);
      formData.set("subject_id", subjectId);
      formData.set("year_level", newTextbookYear);

      const createResult = await createTextbook(formData);
      if (createResult.error || !createResult.data) {
        setTextbookError(createResult.error ?? "Could not create textbook.");
        return;
      }

      const selectedSubject = subjects.find(
        (subject) => subject.id === subjectId,
      );
      const newBook: Textbook = {
        id: createResult.data.id,
        school_id: _schoolId,
        subject_id: subjectId,
        title: newTextbookTitle,
        publisher: newTextbookPublisher || null,
        year_level: selectedSubject?.year_level ?? null,
        is_active: true,
      };
      setLocalTextbooks((prev) => [newBook, ...prev]);
      setSelectedTextbookId(newBook.id);
      setNewTextbookTitle("");
      setNewTextbookPublisher("");
      setNewTextbookYear("");
      setShowTextbookForm(false);
    });
  }

  return (
    <Card padding="lg" className="max-w-2xl">
      <h2 className="font-serif text-2xl text-ink">Create question set</h2>
      <p className="text-muted text-sm mt-1">Set details</p>

      <form action={handleCreateSet} className="mt-6 space-y-4">
        <Input
          name="set_name"
          label="Set name"
          required
          placeholder="e.g. Biology Unit 3 - Cells"
        />

        <div>
          <label
            htmlFor="subject_id"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Subject
          </label>
          <select
            id="subject_id"
            name="subject_id"
            required
            value={subjectId}
            onChange={(event) => {
              setSubjectId(event.target.value);
              setSelectedTextbookId("");
            }}
            className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
          >
            <option value="">Select subject</option>
            {groupedSubjects.map(([year, yearSubjects]) => (
              <optgroup key={year} label={`Year ${year}`}>
                {yearSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="year_level"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Year level
          </label>
          <select
            id="year_level"
            name="year_level"
            required
            className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
          >
            {[7, 8, 9, 10, 11, 12].map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="textbook_id"
            className="block text-sm font-medium text-ink mb-1.5"
          >
            Textbook
          </label>
          <select
            id="textbook_id"
            name="textbook_id"
            value={selectedTextbookId}
            onChange={(event) => setSelectedTextbookId(event.target.value)}
            className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
          >
            <option value="">None</option>
            {filteredTextbooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="text-sm text-muted hover:text-ink mt-2"
            onClick={() => setShowTextbookForm((prev) => !prev)}
          >
            Can&apos;t find your textbook? Add it →
          </button>

          {showTextbookForm ? (
            <div className="mt-3 border border-border rounded-md p-3 bg-paper">
              <Input
                label="Textbook title"
                value={newTextbookTitle}
                onChange={(event) => setNewTextbookTitle(event.target.value)}
                placeholder="e.g. Nelson Science 8"
              />
              <div className="mt-2">
                <Input
                  label="Publisher (optional)"
                  value={newTextbookPublisher}
                  onChange={(event) =>
                    setNewTextbookPublisher(event.target.value)
                  }
                  placeholder="e.g. Cengage"
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Year level (optional)"
                  value={newTextbookYear}
                  onChange={(event) => setNewTextbookYear(event.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
              {textbookError ? (
                <p className="text-sm text-error mt-2">{textbookError}</p>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                loading={isPending}
                onClick={handleCreateTextbook}
              >
                Add textbook
              </Button>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-border p-3 bg-paper">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">
                Make this set active immediately
              </p>
              <p className="text-xs text-muted mt-1">
                Students can only enroll in active sets
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={[
                "w-11 h-6 rounded-full transition-colors relative",
                isActive ? "bg-lime-dark" : "bg-border",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-paper transition-all",
                  isActive ? "left-5" : "left-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        <Button type="submit" className="w-full" loading={isPending}>
          Create set →
        </Button>
      </form>
    </Card>
  );
}
