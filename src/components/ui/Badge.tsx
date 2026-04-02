import type { ReactNode } from "react";

export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "lime";
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  lime: "bg-[#0048AE]/15 text-[#0a1628] border border-[#0048AE]/25",
  success: "bg-[#0048AE]/15 text-[#0a1628] border border-[#0048AE]/25",
  warning: "bg-amber-100 text-amber-800",
  default: "bg-[#faf7f2] border border-[#ede8df] text-gray-600",
};

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

export default Badge;
