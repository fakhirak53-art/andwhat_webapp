"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  fetchActiveMhCards,
  filterCardsForLocalDay,
  localDateYmd,
  pickDailyMhCard,
} from "@/lib/mh-cards";
import { marketingTheme as t } from "@/lib/marketing-theme";
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

async function resolveUserId(propId: string | undefined): Promise<string | null> {
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
        "fixed inset-0 z-[100] flex items-center justify-center p-4",
        t.overlayScrim,
      ].join(" ")}
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog backdrop"
        onClick={dismiss}
      />

      <div
        className="relative z-[101] w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl rounded-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <Card padding="lg" className={["relative", t.cardSurface].join(" ")}>
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
                className={["font-serif text-xl mt-1", t.textHeading].join(" ")}
              >
                {showResponse ? "Here’s something for you" : "Today’s check-in"}
              </h2>
              <p className={["text-xs mt-1", t.textMuted].join(" ")}>
                {showResponse
                  ? "Based on what you picked — take what helps, leave the rest."
                  : "Pick the line that fits you best — there’s no wrong answer."}
              </p>
            </div>
          </div>

          {!showResponse ? (
            <>
              <p
                className={["mt-5 text-sm leading-relaxed font-medium", t.textHeading].join(
                  " ",
                )}
              >
                {card.question_text}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {card.answerOptions.map((opt, i) => (
                  <li key={optionLetter(i)}>
                    <button
                      type="button"
                      onClick={() => setUi({ step: "response", selectedIndex: i })}
                      className={[
                        "w-full text-left text-sm rounded-lg border px-3 py-2.5 transition",
                        "hover:bg-[#eef3fc] hover:border-[#0048AE]/40",
                        t.borderSubtle,
                        t.textBody,
                      ].join(" ")}
                    >
                      <span className={["font-semibold mr-1.5", t.accentText].join(" ")}>
                        {optionLetter(i)}.
                      </span>
                      {optionPreview(opt)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div
              className={[
                "mt-5 max-h-[min(50vh,22rem)] overflow-y-auto text-sm leading-relaxed space-y-4",
                t.textBody,
              ].join(" ")}
            >
              {card.message ? (
                <p className={["text-sm italic", t.textMuted].join(" ")}>{card.message}</p>
              ) : null}
              <p className="whitespace-pre-wrap">{card.positiveTexts[ui.selectedIndex]}</p>
              <p className="whitespace-pre-wrap text-[13px]">{card.infoTexts[ui.selectedIndex]}</p>
            </div>
          )}

          <p
            className={[
              "mt-5 text-[11px] leading-snug border-t pt-4",
              t.borderSubtle,
              t.textMuted,
            ].join(" ")}
          >
            Our Daily Messaging is for educational purposes only. It is not medical advice
            and does not replace professional care. If you need help, talk to a trusted
            adult, your school counsellor, or a health professional. In an emergency, call
            your local emergency number.
          </p>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {showResponse ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setUi({ step: "question" })}
              >
                Back
              </Button>
            ) : null}
            <Button type="button" variant="secondary" size="sm" onClick={dismiss}>
              Not today
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={dismiss}>
              {showResponse ? "Got it" : "Skip"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
