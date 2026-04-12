import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

/** Display sans for inline “AndWhat” only — Syne reads clearly apart from body DM Sans (Tailwind v4 @theme has no `font-brand` token, so `BrandName` sets `fontFamily` via this variable). */
const brandWordmark = Syne({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "andwhat",
  description: "Learn before you scroll",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${brandWordmark.variable} bg-white`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-white!" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
