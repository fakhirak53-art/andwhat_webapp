"use client";

import { CalendarDays, Check, CircleX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { submitQuizAnswer } from "@/app/actions/student";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { QuizAnswer, QuizQuestion, QuizResult } from "@/types/database";

interface QuizEngineProps {
  questions: QuizQuestion[];
  questionSetId: string;
  subjectId: string;
  schoolId: string;
  setName: string;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export default function QuizEngine({
  questions,
  questionSetId,
  subjectId,
  schoolId,
  setName,
  onComplete,
  onExit,
}: QuizEngineProps) {
  const [sessionQuestions, setSessionQuestions] =
    useState<QuizQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | null>(
    null,
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [saveFailures, setSaveFailures] = useState(0);
  const sessionStartTime = useRef(Date.now());

  const currentQuestion = sessionQuestions[currentIndex] ?? null;
  const progressPercent =
    sessionQuestions.length > 0
      ? (Math.min(currentIndex + 1, sessionQuestions.length) /
          sessionQuestions.length) *
        100
      : 0;

  const correctCount = useMemo(
    () => answers.filter((answer) => answer.is_correct).length,
    [answers],
  );

  function getPerformanceMessage(accuracy: number): string {
    if (accuracy >= 80) return "Excellent work. 🔥";
    if (accuracy >= 60) return "Good effort. Keep it up.";
    if (accuracy >= 40) return "Keep practicing. You'll get there.";
    return "Review this set and try again.";
  }

  function getNextReviewMessage(accuracy: number): string {
    if (accuracy >= 80) return "Next review: in 7 days. You've locked this in!";
    if (accuracy >= 60) return "Next review: in 3 days. Nearly there!";
    return "Next review: tomorrow. A bit more practice needed.";
  }

  function completeQuiz(nextAnswers: QuizAnswer[]): void {
    const total = sessionQuestions.length;
    const correct = nextAnswers.filter((answer) => answer.is_correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeTaken = Date.now() - sessionStartTime.current;

    const nextResult: QuizResult = {
      total,
      correct,
      accuracy,
      answers: nextAnswers,
      timeTaken,
    };

    setResult(nextResult);
    onComplete(nextResult);
  }

  function handleSelect(option: "A" | "B" | "C"): void {
    if (!currentQuestion || showFeedback) return;

    const timeMs = Date.now() - questionStartTime;
    const nextAnswer: QuizAnswer = {
      question_id: currentQuestion.id,
      selected: option,
      correct_answer: currentQuestion.correct_answer,
      is_correct: option === currentQuestion.correct_answer,
      time_ms: timeMs,
    };

    setSelectedOption(option);
    setShowFeedback(true);
    setAnswers((prev) => [...prev, nextAnswer]);

    void (async () => {
      const response = await submitQuizAnswer({
        question_id: currentQuestion.id,
        question_set_id: questionSetId,
        subject_id: subjectId,
        school_id: schoolId,
        selected_answer: option,
        correct_answer: currentQuestion.correct_answer,
        response_time_ms: timeMs,
      });
      if (!response.success) {
        setSaveFailures((prev) => prev + 1);
      }
    })();

    window.setTimeout(() => {
      const isLast = currentIndex >= sessionQuestions.length - 1;
      if (isLast) {
        // Use functional update so the result screen always matches saved answers
        // (avoids a stale `answers` closure on the last question).
        setAnswers((prev) => {
          completeQuiz(prev);
          return prev;
        });
        return;
      }
      setQuestionStartTime(Date.now());
      setSelectedOption(null);
      setShowFeedback(false);
      setCurrentIndex((prev) => prev + 1);
    }, 1500);
  }

  function resetQuiz(): void {
    setSessionQuestions(shuffle(sessionQuestions));
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setResult(null);
    setShowReview(false);
    setShowExitConfirm(false);
    setSaveFailures(0);
    sessionStartTime.current = Date.now();
    setQuestionStartTime(Date.now());
  }

  function getOptionState(option: "A" | "B" | "C"): string {
    if (!showFeedback) {
      if (selectedOption === option) {
        return "border-ink bg-ink text-paper";
      }
      return "border-border bg-cream hover:border-ink/30 hover:bg-paper";
    }

    const isSelected = selectedOption === option;
    const isCorrect = currentQuestion?.correct_answer === option;

    if (isSelected && isCorrect) {
      return "border-lime-dark bg-lime text-ink";
    }

    if (isSelected && !isCorrect) {
      return "border-red-400 bg-red-50 text-red-800";
    }

    if (isCorrect) {
      return "border-lime-dark bg-lime/30 text-ink";
    }

    return "border-border bg-cream text-ink";
  }

  if (result) {
    return (
      <Card padding="lg" className="mt-6">
        <p className="text-xs uppercase tracking-widest text-muted">
          Quiz complete
        </p>
        <h2 className="font-serif text-xl text-ink mt-1">{setName}</h2>

        <div className="mt-6 text-center">
          <p className="font-serif text-6xl text-ink">
            {result.correct}/{result.total}
          </p>
          <p className="font-serif text-2xl text-muted mt-2">
            {result.accuracy}%
          </p>
          <p className="font-serif italic text-xl text-muted mt-4">
            {getPerformanceMessage(result.accuracy)}
          </p>
        </div>

        <Card className="mt-4 bg-lime/10 border-lime/30" padding="sm">
          <p className="text-sm text-ink flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {getNextReviewMessage(result.accuracy)}
          </p>
        </Card>

        {saveFailures > 0 ? (
          <Card className="mt-3 border-amber-200 bg-amber-50" padding="sm">
            <p className="text-sm text-amber-800">
              Some answers could not be saved ({saveFailures}). Your score is
              shown, but progress may not fully update yet.
            </p>
          </Card>
        ) : null}

        <button
          type="button"
          onClick={() => setShowReview((prev) => !prev)}
          className="mt-4 text-sm text-muted hover:text-ink"
        >
          {showReview ? "Hide answer review" : "Review answers"}
        </button>

        {showReview ? (
          <div className="mt-4 space-y-3">
            {result.answers.map((answer, idx) => {
              const question = sessionQuestions.find(
                (q) => q.id === answer.question_id,
              );
              if (!question) return null;

              return (
                <div
                  key={answer.question_id}
                  className={[
                    "rounded-md border px-3 py-3",
                    answer.is_correct
                      ? "border-lime-dark/40 bg-lime/10"
                      : "border-red-300 bg-red-50",
                  ].join(" ")}
                >
                  <p className="text-xs text-muted">Question {idx + 1}</p>
                  <p className="text-sm text-ink mt-1">
                    {question.question_text}
                  </p>
                  <p className="text-xs mt-2">
                    Your answer:{" "}
                    <span className="font-medium">{answer.selected}</span> ·
                    Correct:{" "}
                    <span className="font-medium">{answer.correct_answer}</span>
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={resetQuiz}>Practice again</Button>
          <Button variant="secondary" onClick={onExit}>
            Back to sets
          </Button>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card padding="lg" className="mt-6">
        <p className="text-muted">No questions available.</p>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="w-full h-1 rounded-full bg-cream border border-border overflow-hidden mr-3">
          <div
            className="h-full bg-lime-dark transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted text-right shrink-0">
          {currentIndex + 1} of {sessionQuestions.length}
        </p>
      </div>

      <Card padding="lg" className="mt-6 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {currentQuestion.difficulty ? (
            <Badge variant="default" className="capitalize">
              {currentQuestion.difficulty}
            </Badge>
          ) : null}
          <div>
            {showExitConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Exit quiz?</span>
                <button
                  type="button"
                  className="text-xs text-red-600 hover:text-red-700"
                  onClick={onExit}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="text-xs text-muted hover:text-ink"
                  onClick={() => setShowExitConfirm(false)}
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-sm text-muted hover:text-ink"
                onClick={() => setShowExitConfirm(true)}
              >
                x Exit
              </button>
            )}
          </div>
        </div>

        <h2 className="font-serif text-xl md:text-2xl leading-relaxed text-ink pr-24">
          {currentQuestion.question_text}
        </h2>

        <div className="flex flex-col gap-3 mt-8">
          {(["A", "B", "C"] as const).map((option) => {
            const text =
              option === "A"
                ? currentQuestion.option_a
                : option === "B"
                  ? currentQuestion.option_b
                  : currentQuestion.option_c;

            const isCorrect = currentQuestion.correct_answer === option;
            const isSelected = selectedOption === option;
            const showCorrectLabel = showFeedback && !isSelected && isCorrect;
            const isWrongSelected = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={option}
                type="button"
                disabled={showFeedback}
                onClick={() => handleSelect(option)}
                className={[
                  "w-full text-left px-5 py-4 rounded-lg border transition-all duration-150 cursor-pointer",
                  "flex items-center gap-4",
                  getOptionState(option),
                ].join(" ")}
              >
                <span
                  className={[
                    "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium shrink-0",
                    showFeedback && isSelected && isCorrect
                      ? "bg-lime-dark text-paper border-lime-dark"
                      : isWrongSelected
                        ? "bg-red-400 text-paper border-red-400"
                        : "bg-paper text-muted border-border",
                  ].join(" ")}
                >
                  {showFeedback && isSelected && isCorrect ? (
                    <Check className="w-4 h-4" />
                  ) : isWrongSelected ? (
                    <CircleX className="w-4 h-4" />
                  ) : (
                    option
                  )}
                </span>
                <span className="min-w-0">
                  {showCorrectLabel ? (
                    <span className="block text-xs text-lime-dark mb-0.5">
                      Correct answer
                    </span>
                  ) : null}
                  <span className="text-sm md:text-base">{text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {showFeedback ? (
          <div
            className={[
              "mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm animate-[toast-in_220ms_ease-out]",
              selectedOption === currentQuestion.correct_answer
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700",
            ].join(" ")}
          >
            {selectedOption === currentQuestion.correct_answer
              ? "✓ Correct! +1"
              : "✗ Not quite"}
          </div>
        ) : null}
      </Card>

      <p className="mt-3 text-xs text-muted">
        Score so far: {correctCount}/{answers.length}
      </p>
    </div>
  );
}
