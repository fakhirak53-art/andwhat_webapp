"use server";

import { searchQuestionSets } from "@/lib/dashboard";

export async function searchSetAction(query: string): Promise<{
  error?: string;
  data?: Awaited<ReturnType<typeof searchQuestionSets>>;
}> {
  if (!query || query.trim().length < 3) {
    return {
      error: "Please enter at least 3 characters or a full reference number.",
    };
  }

  const results = await searchQuestionSets(query.trim());
  if (!results || results.length === 0) {
    return {
      error: "No question set found with that reference number or name.",
    };
  }

  return { data: results };
}
