import Link from "next/link";

export interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** When true, use paper (light) text for "and" on dark backgrounds */
  light?: boolean;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function Logo({
  size = "md",
  className = "",
  light = false,
}: LogoProps) {
  const andClass = light ? "text-paper" : "text-ink";

  return (
    <Link
      href="/"
      className={[
        "font-serif inline-flex items-baseline gap-0 tracking-tight",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={andClass}>and</span>
      <span className="font-serif italic bg-lime rounded px-1.5 text-ink">
        what
      </span>
    </Link>
  );
}

export default Logo;
