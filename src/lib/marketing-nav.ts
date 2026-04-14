/**
 * Primary audience links for the marketing site header (home, schools, wellbeing, contact).
 * Shared copy avoids drift and keeps labels short for a production nav bar.
 */
export const marketingNavLinks = [
  { label: "Students", href: "/" },
  { label: "Schools & RTOs", href: "/schools" },
  { label: "Wellbeing & NDIS", href: "/wellbeing" },
  { label: "Contact", href: "/contact" },
] as const;
