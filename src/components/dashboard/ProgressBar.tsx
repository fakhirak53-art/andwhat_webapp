"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  color?: "lime" | "amber" | "red";
}

const colorClasses: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  lime: "bg-[#0048AE]",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

export default function ProgressBar({
  value,
  color = "lime",
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const normalized = Math.max(0, Math.min(100, value));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setWidth(normalized);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [normalized]);

  return (
    <div className="w-full h-2 bg-[#faf7f2] rounded-full border border-[#ede8df] overflow-hidden">
      <div
        className={[
          "h-full rounded-full transition-all duration-700 ease-out",
          colorClasses[color],
        ].join(" ")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
