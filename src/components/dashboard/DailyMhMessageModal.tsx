"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { marketingTheme as t } from "@/lib/marketing-theme";
import {
  fetchActiveMhCards,
  filterCardsForLocalDay,
  localDateYmd,
  pickDailyMhCard,
} from "@/lib/mh-cards";
import type { ParsedMhCard } from "@/types/database";
import { createClient } from "@/utils/supabase/client";

const STORAGE_KEY = "andwhat_mh_daily_dismiss";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type Phase = "loading" | "ready" | "hidden";
type ModalState =
  | { step: "question" }
  | { step: "response"; selectedIndex: number };

function parseDismissedDate(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const d = (parsed as Record<string, unknown>).date;
    return typeof d === "string" ? d : null;
  } catch {
    return null;
  }
}

async function resolveUserId(
  propId: string | undefined,
): Promise<string | null> {
  if (propId) return propId;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function optionLetter(index: number): string {
  if (index >= 0 && index < OPTION_LETTERS.length) return OPTION_LETTERS[index];
  return String(index + 1);
}

function optionPreview(text: string): string {
  const s = text.trim();
  return s.length > 90 ? `${s.slice(0, 90).trim()}…` : s;
}

export interface DailyMhMessageModalProps {
  userId?: string;
  schoolId?: string | null;
}

export default function DailyMhMessageModal({
  userId,
  schoolId = null,
}: DailyMhMessageModalProps) {
  const titleId = useId();
  const [phase, setPhase] = useState<Phase>("loading");
  const [card, setCard] = useState<ParsedMhCard | null>(null);
  const [ui, setUi] = useState<ModalState>({ step: "question" });

  const dismiss = useCallback(() => {
    const today = localDateYmd();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today }));
    } catch {
      /* ignore */
    }
    setPhase("hidden");
    setCard(null);
    setUi({ step: "question" });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setPhase("loading");
      const today = localDateYmd();
      const stored = parseDismissedDate(
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null,
      );
      if (stored === today) {
        if (!cancelled) setPhase("hidden");
        return;
      }

      const uid = await resolveUserId(userId);
      if (!uid) {
        if (!cancelled) setPhase("hidden");
        return;
      }

      const supabase = createClient();
      const rows = await fetchActiveMhCards(supabase, { schoolId });
      const eligible = filterCardsForLocalDay(rows, today);
      const picked = pickDailyMhCard(uid, today, eligible);

      if (cancelled) return;
      if (!picked) {
        setPhase("hidden");
        return;
      }
      setCard(picked);
      setUi({ step: "question" });
      setPhase("ready");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [userId, schoolId]);

  useEffect(() => {
    if (phase !== "ready") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, dismiss]);

  if (phase === "loading" || phase === "hidden") {
    return null;
  }

  if (!card) return null;

  const showResponse = ui.step === "response";

  return (
    <div
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain",
        "px-3 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4",
        t.overlayScrim,
      ].join(" ")}
      role="presentation"
    >
      <button
        type="button"
        className="fixed inset-0 cursor-default"
        aria-label="Close dialog backdrop"
        onClick={dismiss}
      />

      <div
        className={[
          "relative z-[101] my-auto flex w-full max-w-lg min-h-0 max-h-[min(92dvh,calc(100dvh-1.5rem))] flex-col",
          "rounded-lg shadow-xl sm:max-h-[min(88dvh,calc(100dvh-2rem))]",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <Card
          padding="sm"
          className={[
            "relative flex max-h-full min-h-0 flex-col overflow-hidden sm:p-8",
            t.cardSurface,
          ].join(" ")}
        >
          <div className="shrink-0">
            <div className="flex items-start gap-3">
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  t.bgAccentTint,
                ].join(" ")}
              >
                <Heart className="h-5 w-5 text-[#0048AE]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "text-xs font-semibold uppercase tracking-wide",
                    t.accentText,
                  ].join(" ")}
                >
                  {card.topic}
                </p>
                <h2
                  id={titleId}
                  className={[
                    "font-serif text-lg leading-snug sm:text-xl mt-1 break-words",
                    t.textHeading,
                  ].join(" ")}
                >
                  {showResponse
                    ? "Here’s something for you"
                    : "Today’s check-in"}
                </h2>
                <p
                  className={["text-xs mt-1 break-words", t.textMuted].join(
                    " ",
                  )}
                >
                  {showResponse
                    ? "Based on what you picked — take what helps, leave the rest."
                    : "Pick the line that fits you best — there’s no wrong answer."}
                </p>
              </div>
            </div>
          </div>

          <div
            className={[
              "mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5 -mr-0.5 text-sm leading-relaxed",
              showResponse ? `space-y-4 ${t.textBody}` : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {!showResponse ? (
              <>
                <p
                  className={[
                    "text-sm leading-relaxed font-medium break-words",
                    t.textHeading,
                  ].join(" ")}
                >
                  {card.question_text}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {card.answerOptions.map((opt, i) => (
                    <li key={optionLetter(i)}>
                      <button
                        type="button"
                        onClick={() =>
                          setUi({ step: "response", selectedIndex: i })
                        }
                        className={[
                          "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition",
                          "break-words text-left [text-wrap:pretty]",
                          "hover:bg-[#eef3fc] hover:border-[#0048AE]/40 active:bg-[#eef3fc]",
                          t.borderSubtle,
                          t.textBody,
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "font-semibold mr-1.5 align-top",
                            t.accentText,
                          ].join(" ")}
                        >
                          {optionLetter(i)}.
                        </span>
                        <span className="align-top">{optionPreview(opt)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                {card.message ? (
                  <p
                    className={["text-sm italic break-words", t.textMuted].join(
                      " ",
                    )}
                  >
                    {card.message}
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap break-words">
                  {card.positiveTexts[ui.selectedIndex]}
                </p>
                <p className="whitespace-pre-wrap break-words text-[13px]">
                  {card.infoTexts[ui.selectedIndex]}
                </p>
              </>
            )}
          </div>

          <div
            className={[
              "mt-4 shrink-0 border-t pt-4 space-y-4",
              t.borderSubtle,
            ].join(" ")}
          >
            <p
              className={[
                "text-[11px] leading-snug break-words",
                t.textMuted,
              ].join(" ")}
            >
              Our Daily Messaging is for educational purposes only. It is not
              medical advice and does not replace professional care. If you need
              help, talk to a trusted adult, your school counsellor, or a health
              professional. In an emergency, call your local emergency number.
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              {showResponse ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setUi({ step: "question" })}
                >
                  Back
                </Button>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={dismiss}
              >
                Not today
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={dismiss}
              >
                {showResponse ? "Got it" : "Skip"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
