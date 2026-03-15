import { type ReactNode } from "react";

export interface PageShellProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-5xl",
  full: "max-w-7xl",
};

export function PageShell({
  children,
  maxWidth = "lg",
  className = "",
}: PageShellProps) {
  return (
    <div
      className={[
        "px-6 mx-auto w-full",
        maxWidthClasses[maxWidth],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export default PageShell;
