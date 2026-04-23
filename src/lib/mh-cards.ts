/**
 * Daily mental health / learning disability messaging (`public.mh_cards`).
 *
 * Run in Supabase SQL Editor so students can read rows (example policy):
 *
 * ```sql
 * grant usage on schema public to authenticated;
 * grant select on table public.mh_cards to authenticated;
 *
 * alter table public.mh_cards enable row level security;
 *
 * drop policy if exists "students_read_active_mh_cards" on public.mh_cards;
 *
 * create policy "students_read_active_mh_cards"
 * on public.mh_cards
 * for select
 * to authenticated
 * using (
 *   is_active = true
 *   and (active_from is null or active_from <= current_date)
 *   and (active_to is null or active_to >= current_date)
 *   and (
 *     school_id is null
 *     or exists (
 *       select 1 from public.students s
 *       where s.auth_user_id = auth.uid() and s.school_id = mh_cards.school_id
 *     )
 *   )
 * );
 * ```
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MhCard, ParsedMhCard } from "@/types/database";

const MH_SELECT =
  "id, school_id, topic, target_group, question_text, answer_options, info_texts, positive_texts, message, active_from, active_to, is_active, created_at, updated_at";

export function localDateYmd(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isCardEligibleOnLocalDay(
  card: Pick<ParsedMhCard, "active_from" | "active_to">,
  ymd: string,
): boolean {
  if (card.active_from != null) {
    const from = card.active_from.slice(0, 10);
    if (ymd < from) return false;
  }
  if (card.active_to != null) {
    const to = card.active_to.slice(0, 10);
    if (ymd > to) return false;
  }
  return true;
}

export function filterCardsForLocalDay(
  cards: ParsedMhCard[],
  ymd: string,
): ParsedMhCard[] {
  return cards.filter((c) => isCardEligibleOnLocalDay(c, ymd));
}

function stableNonNegativeIndex(seed: string, modulo: number): number {
  if (modulo <= 0) return 0;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
  }
  return Math.abs(h) % modulo;
}

export function pickDailyMhCard(
  userId: string,
  localYmd: string,
  cards: ParsedMhCard[],
): ParsedMhCard | null {
  if (cards.length === 0) return null;
  const sorted = [...cards].sort((a, b) => a.id.localeCompare(b.id));
  const idx = stableNonNegativeIndex(`${userId}:${localYmd}`, sorted.length);
  return sorted[idx] ?? null;
}

function parseFourStrings(value: unknown): [string, string, string, string] | null {
  if (!Array.isArray(value) || value.length !== 4) return null;
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") return null;
    out.push(item);
  }
  return out as [string, string, string, string];
}

export function parseMhCard(row: MhCard): ParsedMhCard | null {
  const answerOptions = parseFourStrings(row.answer_options);
  const infoTexts = parseFourStrings(row.info_texts);
  const positiveTexts = parseFourStrings(row.positive_texts);
  if (!answerOptions || !infoTexts || !positiveTexts) return null;
  if (typeof row.topic !== "string" || typeof row.question_text !== "string") {
    return null;
  }

  return {
    id: row.id,
    school_id: row.school_id,
    topic: row.topic,
    question_text: row.question_text,
    answerOptions,
    infoTexts,
    positiveTexts,
    message: row.message,
    active_from: row.active_from,
    active_to: row.active_to,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export interface FetchMhCardsOptions {
  /** If set: global cards (`school_id` null) or cards for that school. Falls back to all active if none. */
  schoolId?: string | null;
}

export async function fetchActiveMhCards(
  supabase: SupabaseClient,
  options?: FetchMhCardsOptions,
): Promise<ParsedMhCard[]> {
  const schoolId = options?.schoolId;

  const baseQuery = supabase.from("mh_cards").select(MH_SELECT).eq("is_active", true);
  const { data: scopedData, error: scopedError } = schoolId
    ? await baseQuery.or(`school_id.is.null,school_id.eq.${schoolId}`)
    : await baseQuery;

  if (scopedError) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[mh_cards] Select failed — check RLS, grants, and column names:",
        scopedError.message,
        scopedError.code,
        scopedError.details,
      );
    }
    return [];
  }

  let rows = (scopedData ?? []) as MhCard[];
  if (schoolId && rows.length === 0) {
    const { data: fallbackData, error: fallbackError } = await baseQuery;
    if (!fallbackError && fallbackData) {
      rows = fallbackData as MhCard[];
    } else if (process.env.NODE_ENV === "development" && fallbackError) {
      console.warn(
        "[mh_cards] Fallback select failed:",
        fallbackError.message,
        fallbackError.code,
        fallbackError.details,
      );
    }
  }

  const parsed = rows
    .map((row) => parseMhCard(row))
    .filter((c): c is ParsedMhCard => c !== null);

  if (parsed.length === 0 && process.env.NODE_ENV === "development") {
    console.warn(
      "[mh_cards] No usable cards after parse (empty table, RLS, school filter, or invalid JSONB). Raw row count:",
      rows.length,
    );
  }

  return parsed;
}
