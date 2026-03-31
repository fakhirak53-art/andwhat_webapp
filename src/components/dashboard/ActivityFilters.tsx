"use client";

export type ActivityFilterValue = "all" | "correct" | "incorrect";

interface ActivityFiltersProps {
  value: ActivityFilterValue;
  onChange: (value: ActivityFilterValue) => void;
}

const options: Array<{ value: ActivityFilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "correct", label: "Correct only" },
  { value: "incorrect", label: "Incorrect only" },
];

export default function ActivityFilters({
  value,
  onChange,
}: ActivityFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors",
              isActive
                ? "bg-[#0a1628] text-white"
                : "bg-[#faf7f2] border border-[#ede8df] text-gray-600 hover:text-[#0a1628]",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
