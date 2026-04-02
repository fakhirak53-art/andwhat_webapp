"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteQuestion, updateQuestion } from "@/app/actions/sets-admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import type { Question } from "@/types/database";

interface QuestionCardProps {
  question: Question;
  seq: number;
}

function difficultyClass(difficulty: Question["difficulty"]): string {
  if (difficulty === "easy")
    return "bg-[#0048AE]/15 text-ink border border-[#0048AE]/25";
  if (difficulty === "medium") return "bg-amber-100 text-amber-800";
  if (difficulty === "hard") return "bg-red-100 text-red-700";
  return "bg-cream text-muted border border-border";
}

export default function QuestionCard({ question, seq }: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [questionText, setQuestionText] = useState(question.question_text);
  const [optionA, setOptionA] = useState(question.option_a);
  const [optionB, setOptionB] = useState(question.option_b);
  const [optionC, setOptionC] = useState(question.option_c);
  const [correct, setCorrect] = useState<"A" | "B" | "C">(
    question.correct_answer,
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    question.difficulty ?? "medium",
  );

  function save(): void {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("question_text", questionText);
      formData.set("option_a", optionA);
      formData.set("option_b", optionB);
      formData.set("option_c", optionC);
      formData.set("correct_answer", correct);
      formData.set("difficulty", difficulty);

      const result = await updateQuestion(question.id, formData);
      if (!result.success) {
        setError(result.error ?? "Could not update question.");
        return;
      }
      setIsEditing(false);
      window.location.reload();
    });
  }

  function removeQuestion(): void {
    setError(null);
    startTransition(async () => {
      const result = await deleteQuestion(question.id);
      if (!result.success) {
        setError(result.error ?? "Could not delete question.");
        return;
      }
      window.location.reload();
    });
  }

  return (
    <Card padding="md">
      {isEditing ? (
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label
                htmlFor={`edit-question-text-${question.id}`}
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Question text
              </label>
              <textarea
                id={`edit-question-text-${question.id}`}
                value={questionText}
                onChange={(event) => setQuestionText(event.target.value)}
                rows={3}
                className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
              />
            </div>
            <Input
              label="Option A"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
            />
            <Input
              label="Option B"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
            />
            <div className="col-span-2">
              <Input
                label="Option C"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium text-ink mb-1.5">
              Correct answer
            </p>
            <div className="flex items-center gap-2">
              {(["A", "B", "C"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCorrect(key)}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm border",
                    correct === key
                      ? "bg-ink text-paper border-ink"
                      : "bg-cream text-muted border-border",
                  ].join(" ")}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-medium text-ink mb-1.5">Difficulty</p>
            <div className="flex items-center gap-2">
              {(["easy", "medium", "hard"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDifficulty(key)}
                  className={[
                    "px-3 py-1.5 rounded-md text-sm border capitalize",
                    difficulty === key
                      ? key === "easy"
                        ? "bg-[#0048AE]/15 text-ink border-[#0048AE]/25"
                        : key === "medium"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      : "bg-cream text-muted border-border",
                  ].join(" ")}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-error mt-3">{error}</p> : null}

          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" loading={isPending} onClick={save}>
              Save
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cream text-muted text-xs flex items-center justify-center">
                {seq}
              </div>
              <Badge className={difficultyClass(question.difficulty)}>
                {(question.difficulty ?? "medium").toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-error"
                loading={isPending}
                onClick={removeQuestion}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <p className="font-serif text-base text-ink mt-3">
            {question.question_text}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            {(
              [
                ["A", question.option_a],
                ["B", question.option_b],
                ["C", question.option_c],
              ] as const
            ).map(([key, option]) => {
              const isCorrect = question.correct_answer === key;
              return (
                <div
                  key={key}
                  className={[
                    "rounded-md border px-3 py-2 text-sm",
                    isCorrect
                      ? "bg-lime/20 border-lime-dark text-ink"
                      : "bg-cream border-border text-muted",
                  ].join(" ")}
                >
                  <span className="font-medium mr-1">{key}</span>
                  {option}
                </div>
              );
            })}
          </div>
          {error ? <p className="text-sm text-error mt-3">{error}</p> : null}
        </div>
      )}
    </Card>
  );
}
