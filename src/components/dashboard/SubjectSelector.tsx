"use client";

import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { updateSubjectPreferences } from "@/app/actions/student";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { marketingTheme as t } from "@/lib/marketing-theme";
import type { StudentSubjectPreference, Subject } from "@/types/database";

interface SubjectSelectorProps {
  allSubjects: Subject[];
  initialPreferences: StudentSubjectPreference[];
  yearLevel: number | null;
}

export default function SubjectSelector({
  allSubjects,
  initialPreferences,
  yearLevel,
}: SubjectSelectorProps) {
  const toast = useToast();
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    initialPreferences
      .filter((preference) => preference.is_active)
      .sort((a, b) => a.priority - b.priority)
      .map((preference) => preference.subject_id),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showLinkCallout, setShowLinkCallout] = useState(false);

  const filteredSubjects = useMemo(
    () =>
      allSubjects
        .filter((subject) =>
          yearLevel ? subject.year_level === yearLevel : true,
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allSubjects, yearLevel],
  );

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  function toggleSubject(subjectId: string): void {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  }

  async function onSave(): Promise<void> {
    setIsSaving(true);
    setSaveMessage(null);
    setIsError(false);

    const result = await updateSubjectPreferences(selectedSubjectIds);
    setIsSaving(false);

    if (!result.success) {
      const message = result.error ?? "Could not save subjects.";
      setSaveMessage(message);
      setIsError(true);
      setShowLinkCallout(message.toLowerCase().includes("not set up yet"));
      toast.error(message);
      return;
    }

    setSaveMessage("Subjects updated!");
    setIsError(false);
    setShowLinkCallout(false);
    toast.success("Subjects updated!");
  }

  return (
    <div>
      <h2 className={["font-serif text-lg", t.textHeading].join(" ")}>
        My Subjects
      </h2>
      <p className="text-muted text-sm mt-1">
        Select the subjects you&apos;re studying this year.
      </p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {filteredSubjects.map((subject) => {
          const selected = selectedSubjectIds.includes(subject.id);
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(subject.id)}
              className={[
                "rounded-md px-3 py-2 text-sm text-left transition-colors",
                "flex items-center gap-2",
                selected
                  ? "bg-[#0a1628] text-white border border-[#0a1628] font-medium"
                  : "bg-[#faf7f2] border border-[#ede8df] text-gray-600 hover:border-[#0a1628]/30 hover:text-[#0a1628]",
              ].join(" ")}
            >
              {selected ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="w-4 h-4" />
              )}
              <span className="truncate">{subject.name}</span>
            </button>
          );
        })}
      </div>

      <Button className="mt-4 w-full" loading={isSaving} onClick={onSave}>
        Save subjects
      </Button>

      {saveMessage ? (
        showLinkCallout ? (
          <Card className="mt-4 border-amber-200 bg-amber-50" padding="sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Account not fully linked
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Your student record hasn&apos;t been linked to your login yet.
                  This is done by your school admin. Once linked, you&apos;ll be
                  able to set subject preferences and take quizzes.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <p
            className={[
              "mt-2 text-sm transition-opacity duration-200",
              isError ? "text-red-600" : t.accentText,
            ].join(" ")}
          >
            {saveMessage}
          </p>
        )
      ) : null}
    </div>
  );
}
