/*
  If you see CORS errors, update the edge function to include:

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  }

  Add to the edge function response headers.
  In Supabase Dashboard → Edge Functions → daily-message → Edit
*/

"use client";

import { Check, Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { marketingTheme as t } from "@/lib/marketing-theme";
import type { DailyMessageCard } from "@/types/database";

const STORAGE_KEY = "andwhat_wellbeing_seen";
const EDGE_URL =
  "https://fbcakpikndbdjpzyngjm.supabase.co/functions/v1/daily-message";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type Phase = "loading" | "question" | "response" | "hidden";

function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

function parseStored(
  raw: string | null,
): { date: string; card_id: string } | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const o = parsed as Record<string, unknown>;
    if (typeof o.date !== "string" || typeof o.card_id !== "string")
      return null;
    return { date: o.date, card_id: o.card_id };
  } catch {
    return null;
  }
}

function isDailyMessageCard(value: unknown): value is DailyMessageCard {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (
    typeof v.card_id !== "string" ||
    typeof v.topic !== "string" ||
    typeof v.message !== "string" ||
    !Array.isArray(v.options)
  ) {
    return false;
  }
  return v.options.every((item) => typeof item === "string");
}

function parseApiJson(value: unknown): DailyMessageCard | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (v.ok !== true || v.data === undefined) return null;
  return isDailyMessageCard(v.data) ? v.data : null;
}

function optionPreview(option: string): string {
  return option.length > 80 ? `${option.substring(0, 80).trim()}...` : option;
}

function optionLetter(index: number): string {
  if (index >= 0 && index < OPTION_LETTERS.length) {
    return OPTION_LETTERS[index];
  }
  return String.fromCharCode(65 + index);
}

export interface WellbeingPopupProps {
  onClose: () => void;
}

export default function WellbeingPopup({ onClose }: WellbeingPopupProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [card, setCard] = useState<DailyMessageCard | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [enterReady, setEnterReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const stored = parseStored(
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEY)
            : null,
        );
        const today = todayIsoDate();
        if (stored?.date === today) {
          if (!cancelled) setPhase("hidden");
          return;
        }

        const res = await fetch(EDGE_URL);
        const json: unknown = await res.json();
        const data = parseApiJson(json);

        if (!data) {
          if (!cancelled) setPhase("hidden");
          return;
        }

        if (cancelled) return;
        setCard(data);

        await new Promise((r) => {
          setTimeout(r, 1200);
        });
        if (cancelled) return;
        setPhase("question");
      } catch {
        if (!cancelled) setPhase("hidden");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== "question" && phase !== "response") {
      setEnterReady(false);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnterReady(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  const handleOptionSelect = useCallback(
    (index: number) => {
      if (!card || phase !== "question") return;
      setSelectedIndex(index);
      const text = card.options[index];
      setSelectedText(text);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            date: todayIsoDate(),
            card_id: card.card_id,
          }),
        );
      } catch {
        /* ignore quota / private mode */
      }

      setTimeout(() => {
        setPhase("response");
      }, 400);
    },
    [card, phase],
  );

  const handleSkip = useCallback(() => {
    setPhase("hidden");
    onClose();
  }, [onClose]);

  const handleCloseComplete = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setPhase("hidden");
      onClose();
    }, 200);
  }, [onClose]);

  if (phase === "loading" || phase === "hidden") {
    return null;
  }

  if (!card) {
    return null;
  }

  const overlayClasses = [
    "fixed inset-0 z-50 flex items-end justify-center px-0 sm:items-center sm:px-4",
    t.overlayScrim,
    "backdrop-blur-sm",
    isClosing ? "opacity-0" : enterReady ? "opacity-100" : "opacity-0",
    "transition-opacity duration-300 ease-out",
    isClosing && "duration-200",
  ].join(" ");

  const cardEntered =
    enterReady || isClosing
      ? "translate-y-0 opacity-100 sm:scale-100"
      : "translate-y-full opacity-0 sm:translate-y-0 sm:scale-95";

  const cardShellClasses = [
    "w-full overflow-hidden shadow-2xl transition-all duration-300 ease-out",
    "bg-[#faf7f2] border-t border-[#ede8df] sm:border sm:border-[#ede8df]",
    "rounded-t-2xl sm:max-w-lg sm:rounded-2xl",
    cardEntered,
  ].join(" ");

  return (
    <>
      <style>{`
        @keyframes wellbeing-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .wellbeing-pulse-dot {
          animation: wellbeing-pulse-dot 2s ease-in-out infinite;
        }
      `}</style>
      <div className={overlayClasses} role="dialog" aria-modal="true">
        <div className={cardShellClasses}>
          {phase === "question" && (
            <>
              <div className="flex items-center justify-between px-5 pt-5">
                <div className="flex items-center gap-2">
                  <span
                    className="wellbeing-pulse-dot h-2 w-2 flex-shrink-0 rounded-full bg-[#0048AE]"
                    aria-hidden
                  />
                  <span
                    className={[
                      "text-xs font-medium uppercase tracking-widest",
                      t.textMuted,
                    ].join(" ")}
                  >
                    Daily check-in
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSkip}
                  className={[
                    "cursor-pointer text-xs transition-colors",
                    t.textMuted,
                    t.linkHover,
                  ].join(" ")}
                >
                  Not now
                </button>
              </div>

              <div className="mt-3 px-5">
                <span
                  className={[
                    "inline-block rounded-full border px-3 py-1 text-xs font-medium",
                    t.borderAccentSoft,
                    t.bgAccentTint,
                    t.textHeading,
                  ].join(" ")}
                >
                  {card.topic}
                </span>
              </div>

              <p
                className={[
                  "mt-4 px-5 font-serif text-xl leading-snug",
                  t.textHeading,
                ].join(" ")}
              >
                {card.message}
              </p>
              <p className={["mt-1 px-5 text-sm", t.textMuted].join(" ")}>
                Choose the option that feels most true for you right now.
              </p>

              <div className="mt-5 flex flex-col gap-2 px-5 pb-6">
                {card.options.map((option, index) => {
                  const selected = selectedIndex === index;
                  return (
                    <button
                      key={`${card.card_id}:${option}`}
                      type="button"
                      disabled={selectedIndex !== null}
                      onClick={() => handleOptionSelect(index)}
                      className={[
                        "group flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150",
                        "border-[#ede8df] bg-white",
                        selected
                          ? "border-[#0048AE] bg-[#0048AE]/10"
                          : "hover:border-[#0048AE]/40 hover:bg-[#faf7f2]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          "border-[#ede8df] bg-[#faf7f2] text-gray-600",
                          "group-hover:border-[#0048AE]/50 group-hover:text-[#0a1628]",
                          selected &&
                            "border-[#0048AE] bg-[#0048AE] text-white",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {optionLetter(index)}
                      </span>
                      <span
                        className={["text-sm leading-snug", t.textHeading].join(
                          " ",
                        )}
                      >
                        {optionPreview(option)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {phase === "response" && selectedText && (
            <div className="transition-opacity duration-300 ease-out">
              <div className="px-5 pt-5">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0048AE]">
                  <Check className="h-5 w-5 text-white" aria-hidden />
                </div>
                <p
                  className={[
                    "mt-3 text-center text-sm font-medium",
                    t.textHeading,
                  ].join(" ")}
                >
                  Here&apos;s something for you
                </p>
              </div>

              <div
                className={[
                  "mx-5 mt-4 rounded-xl border p-4",
                  t.borderSubtle,
                  "bg-white",
                ].join(" ")}
              >
                <p
                  className={[
                    "mb-2 text-xs uppercase tracking-widest",
                    t.textMuted,
                  ].join(" ")}
                >
                  You chose:
                </p>
                <p
                  className={[
                    "text-sm font-light leading-relaxed",
                    t.textBody,
                  ].join(" ")}
                >
                  {selectedText}
                </p>
              </div>

              <div
                className={[
                  "mx-5 mt-3 rounded-xl border px-4 py-3",
                  t.borderSubtle,
                  t.cardMutedBg,
                ].join(" ")}
              >
                <div className="flex items-start gap-2">
                  <Heart
                    className={[
                      "mt-0.5 h-3.5 w-3.5 flex-shrink-0",
                      t.textMuted,
                    ].join(" ")}
                    aria-hidden
                  />
                  <div>
                    <p
                      className={["text-xs font-medium", t.textHeading].join(
                        " ",
                      )}
                    >
                      Need more support?
                    </p>
                    <div
                      className={["mt-1 space-y-0.5 text-xs", t.textMuted].join(
                        " ",
                      )}
                    >
                      <p>Kids Helpline: 1800 55 1800</p>
                      <p>Beyond Blue: 1300 22 4636</p>
                      <p>Lifeline: 13 11 14</p>
                    </div>
                    <p className="mt-1 text-xs italic text-gray-500">
                      Available 24/7 · Free · Confidential
                    </p>
                  </div>
                </div>
              </div>

              <div className="mx-5 mt-4 mb-5">
                <Button
                  variant="primary"
                  className="w-full rounded-full font-semibold !rounded-full"
                  onClick={handleCloseComplete}
                >
                  Thanks, I&apos;m good →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
