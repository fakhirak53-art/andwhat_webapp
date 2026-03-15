"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";

interface ActivitySparklineProps {
  data: Array<{ date: string; count: number }>;
}

export default function ActivitySparkline({ data }: ActivitySparklineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxCount = useMemo(
    () => Math.max(1, ...data.map((item) => item.count)),
    [data],
  );

  return (
    <Card className="mt-8" padding="md">
      <h2 className="font-serif text-lg text-ink">
        Quiz completions - last 14 days
      </h2>

      <div className="mt-5">
        <div className="h-20 flex items-end gap-1">
          {data.map((item, index) => {
            const heightPct = Math.max(
              4,
              Math.round((item.count / maxCount) * 100),
            );
            const dayLabel = new Date(item.date).toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <button
                key={item.date}
                type="button"
                className="relative flex-1 h-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                aria-label={`${dayLabel}: ${item.count} completions`}
              >
                {hoveredIndex === index ? (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-ink text-paper text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                    {dayLabel}: {item.count}
                  </div>
                ) : null}
                <div
                  className={[
                    "w-full rounded-t-sm transition-all duration-150",
                    item.count === 0
                      ? "bg-cream border border-border"
                      : "bg-lime",
                  ].join(" ")}
                  style={{ height: `${heightPct}%` }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-1">
          {data.map((item, index) => (
            <div key={`${item.date}-label`} className="flex-1 text-center">
              <span className="text-xs text-muted">
                {index % 2 === 0
                  ? new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
