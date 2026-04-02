/**
 * Design tokens aligned with public marketing pages
 * (Header, Hero, schools, wellbeing — see Header.tsx & WellbeingHeroSection).
 *
 * Use these class strings in dashboard + landing popups so product UI matches
 * the marketing site (navy #0a1628, accent blue #0048AE, warm page #faf7f2).
 */
export const marketingTheme = {
  bgPage: "bg-[#faf7f2]",
  bgSidebar: "bg-[#0a1628]",
  borderSubtle: "border-[#ede8df]",
  textHeading: "text-[#0a1628]",
  textBody: "text-[#374151]",
  textMuted: "text-muted",
  textMutedSoft: "text-muted/80",
  accentText: "text-[#0048AE]",
  accentBg: "bg-[#0048AE]",
  accentBgHover: "hover:bg-[#003d99]",
  accentRing: "ring-[#0048AE]",
  overlayScrim: "bg-[#0a1628]/50",
  cardSurface: "bg-white border-[#ede8df]",
  cardMutedBg: "bg-[#faf7f2]",
  softBluePanel: "bg-[#eef3fc]",
  primaryButton: "!bg-[#0a1628] hover:!bg-[#162340] !text-white rounded-lg",
  avatar: "bg-[#0048AE] text-white",
  linkHover: "hover:text-[#0a1628]",
  borderAccent: "border-[#0048AE]",
  borderAccentSoft: "border-[#0048AE]/30",
  bgAccentTint: "bg-[#0048AE]/10",
} as const;
