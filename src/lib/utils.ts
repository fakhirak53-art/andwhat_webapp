export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    return `${minutes}m ago`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return `${hours}h ago`;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((today.getTime() - thatDay.getTime()) / dayMs);

  if (dayDiff === 1) {
    return "Yesterday";
  }

  if (dayDiff < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const hourRaw = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");
  const period = hourRaw >= 12 ? "pm" : "am";
  const hour = hourRaw % 12 === 0 ? 12 : hourRaw % 12;

  return `${month} ${day}, ${hour}:${minute}${period}`;
}

export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getFirstName(fullName: string): string {
  const normalized = fullName.trim();
  if (!normalized) return "there";
  return normalized.split(/\s+/)[0];
}

export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const answeredDays = new Set<string>(
    dates.map((dateString) => {
      const date = new Date(dateString);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }),
  );

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  let streak = 0;
  while (true) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;

    if (!answeredDays.has(key)) break;

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getAccuracyColor(rate: number): string {
  if (rate >= 70) return "text-green-600";
  if (rate >= 40) return "text-amber-500";
  return "text-red-500";
}
