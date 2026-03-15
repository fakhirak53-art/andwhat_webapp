import type { HTMLAttributes } from "react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export function Spinner({
  size = "md",
  className = "",
  ...rest
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={[
        "rounded-full border-lime-dark border-t-transparent animate-spin shrink-0",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}

export default Spinner;
