import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  id?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id: idProp, name, className = "", ...rest },
  ref,
) {
  const id = idProp ?? name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-sans text-sm font-medium text-[#0a1628] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        name={name}
        className={[
          "w-full bg-[#faf7f2] border rounded-md px-4 py-2.5 text-[#0a1628] placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-[#0048AE] focus:border-transparent",
          "transition-all duration-150",
          error ? "border-error focus:ring-error" : "border-[#ede8df]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...rest}
      />
      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          className="text-error text-xs mt-1"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p
          id={id ? `${id}-hint` : undefined}
          className="text-gray-600 text-xs mt-1"
        >
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
