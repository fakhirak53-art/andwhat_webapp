import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const variantClasses = {
  primary:
    "bg-ink text-paper rounded-md hover:bg-ink/80 hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-border text-ink bg-transparent hover:bg-cream rounded-md",
  ghost:
    "text-muted hover:text-ink underline-offset-4 hover:underline bg-transparent",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled ?? loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "font-sans font-medium transition-all duration-150 inline-flex items-center justify-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        loading && "pointer-events-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
