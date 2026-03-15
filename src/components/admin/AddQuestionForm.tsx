"use client";

import { useState, useTransition } from "react";
import { addQuestion } from "@/app/actions/sets-admin";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface AddQuestionFormProps {
  setId: string;
}

export default function AddQuestionForm({ setId }: AddQuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [correct, setCorrect] = useState<"A" | "B" | "C">("A");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm(): void {
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setCorrect("A");
    setDifficulty("medium");
  }

  function submit(): void {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("question_text", questionText);
      formData.set("option_a", optionA);
      formData.set("option_b", optionB);
      formData.set("option_c", optionC);
      formData.set("correct_answer", correct);
      formData.set("difficulty", difficulty);

      const result = await addQuestion(setId, formData);
      if (!result.success) {
        setError(result.error ?? "Unable to add question.");
        return;
      }
      resetForm();
      window.location.reload();
    });
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-cream/30">
      <h3 className="font-serif text-lg text-ink">Add question</h3>
      <div className="mt-3">
        <label
          htmlFor="new-question-text"
          className="block text-sm font-medium text-ink mb-1.5"
        >
          Question text
        </label>
        <textarea
          id="new-question-text"
          rows={3}
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          className="w-full bg-cream border border-border rounded-md px-4 py-2.5 text-sm text-ink"
          placeholder="Write the question prompt..."
        />
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
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
        <div className="md:col-span-2">
          <Input
            label="Option C"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-ink mb-1.5">Correct answer</p>
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
                  : "bg-cream border-border text-muted",
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
                    ? "bg-green-100 text-green-800 border-green-200"
                    : key === "medium"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  : "bg-cream border-border text-muted",
              ].join(" ")}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-error mt-3">{error}</p> : null}

      <Button className="mt-4" loading={isPending} onClick={submit}>
        Add question
      </Button>
    </div>
  );
}
