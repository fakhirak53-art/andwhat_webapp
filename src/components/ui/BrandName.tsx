import type { ComponentPropsWithoutRef, CSSProperties } from "react";

export type BrandNameTone = "default" | "onDark" | "inherit";

export type BrandNameProps = ComponentPropsWithoutRef<"span"> & {
  possessive?: boolean;
  tone?: BrandNameTone;
};

const toneClass: Record<BrandNameTone, string> = {
  default: "font-bold text-[#0048AE]",
  onDark: "font-bold text-lime",
  inherit: "font-bold text-inherit",
};

const brandFontStack: NonNullable<CSSProperties["fontFamily"]> =
  "var(--font-brand), ui-sans-serif, system-ui, sans-serif";

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
