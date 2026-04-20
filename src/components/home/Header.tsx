"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks?: NavLink[];
  activeHref?: string;
  registerHref?: string;
  registerLabel?: string;
  variant?: "default" | "student-home";
}

const defaultNavLinks: NavLink[] = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header({
  navLinks = defaultNavLinks,
  activeHref,
  registerHref = "/login",
  registerLabel = "Register Now",
  variant = "default",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isStudentHome = variant === "student-home";
  const mobileInlineLink = isStudentHome ? navLinks[0] : null;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-sm ${
        isStudentHome
          ? "border-[#ede8df] bg-[#fbf7eb]/95"
          : "border-[#ede8df] bg-[#faf7f2]"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div
          className={`flex items-center justify-between ${
            isStudentHome ? "min-h-[74px] gap-4 py-2" : "h-[72px]"
          }`}
        >
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/new/andWhatLogo.png"
              alt="AndWhat - Learning Gatekeeper"
              className={`w-auto ${isStudentHome ? "h-8 sm:h-11" : "h-14"}`}
              width={isStudentHome ? 240 : 220}
              height={isStudentHome ? 96 : 112}
              priority
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            {mobileInlineLink ? (
              <a
                href={mobileInlineLink.href}
                className="text-[11px] font-semibold text-[#0a1628] transition-colors hover:text-[#2440a4] md:hidden"
              >
                {mobileInlineLink.label}
              </a>
            ) : null}

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`whitespace-nowrap text-[15px] font-medium transition-colors ${
                    activeHref === item.href
                      ? isStudentHome
                        ? "text-[#0a1628]"
                        : "text-[#0048AE] underline decoration-2 underline-offset-4"
                      : "text-gray-700 hover:text-[#0048AE]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Link
              href={registerHref}
              className={`items-center gap-2 whitespace-nowrap font-semibold transition-colors ${
                isStudentHome
                  ? "inline-flex rounded-[10px] bg-[#111827] px-3 py-2 text-[11px] text-white hover:bg-[#1d2940] sm:px-5 sm:py-3 sm:text-[14px]"
                  : "hidden rounded-full bg-[#0a1628] px-5 py-2.5 text-[14px] text-white hover:bg-[#162340] md:flex"
              }`}
            >
              {registerLabel}
              <span className="text-base leading-none">›</span>
            </Link>

            {!isStudentHome ? (
              <button
                type="button"
                className="p-2 text-gray-700 md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {!isStudentHome && mobileOpen && (
          <div className="md:hidden border-t border-[#ede8df] py-5 flex flex-col gap-5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[15px] font-medium transition-colors ${
                  activeHref === item.href
                    ? "text-[#0048AE]"
                    : "text-gray-700 hover:text-[#0048AE]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={registerHref}
              className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold w-fit"
            >
              {registerLabel}
              <span className="text-base leading-none">›</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
