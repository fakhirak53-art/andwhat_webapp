import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type BrandNameTone = "default" | "onDark" | "inherit";

export type BrandNameProps = ComponentPropsWithoutRef<"span"> & {
  /** Renders as AndWhat's */
  possessive?: boolean;
  /**
   * default — brand blue (no background).
   * onDark — lime text on navy / gradient sections.
   * inherit — matches surrounding text colour (e.g. FAQ toggle).
   */
  tone?: BrandNameTone;
};

const toneClass: Record<BrandNameTone, string> = {
  default: "font-bold text-[#0048AE]",
  onDark: "font-bold text-lime",
  inherit: "font-bold text-inherit",
};

/** Must match `variable` on the Syne instance in `app/layout.tsx`. */
const brandFontStack: NonNullable<CSSProperties["fontFamily"]> =
  "var(--font-brand), ui-sans-serif, system-ui, sans-serif";

/**
 * Inline “AndWhat” wordmark. Font is applied with `fontFamily: var(--font-brand)` so it works
 * under Tailwind v4 (the `font-brand` utility is not defined in `@theme`, so class-only fonts
 * were falling back to body DM Sans).
 */
export function BrandName({
  className = "",
  possessive = false,
  tone = "default",
  style,
  ...props
}: BrandNameProps) {
  return (
    <span
      style={{ fontFamily: brandFontStack, ...style }}
      className={["not-italic tracking-tight normal-case", toneClass[tone], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      AndWhat
      {possessive ? "'s" : null}
    </span>
  );
}
