type BrandNameProps = {
  /** Use parent text color (e.g. in gray body copy). */
  tone?: "brand" | "inherit";
};

export function BrandName({ tone = "brand" }: BrandNameProps) {
  const className =
    tone === "inherit" ? "font-bold" : "font-bold text-[#0048AE]";
  return <span className={className}>AndWhat</span>;
}
