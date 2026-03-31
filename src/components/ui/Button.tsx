import type { ButtonHTMLAttributes, ReactNode } from "react";
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
    "bg-[#0a1628] text-white rounded-md hover:bg-[#162340] hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-[#ede8df] text-[#0a1628] bg-transparent hover:bg-[#faf7f2] rounded-md",
  ghost:
    "text-gray-600 hover:text-[#0a1628] underline-offset-4 hover:underline bg-transparent",
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
