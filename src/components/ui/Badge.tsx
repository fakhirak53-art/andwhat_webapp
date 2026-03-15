import { type ReactNode } from "react";

export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "lime";
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  lime: "bg-lime text-ink",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  default: "bg-cream border border-border text-muted",
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
