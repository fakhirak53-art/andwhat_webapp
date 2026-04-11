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
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f2] border-b border-[#ede8df]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0  ">
            <Image
              src="/images/new/andWhatLogo.png"
              alt="AndWhat - Learning Gatekeeper"
              className="w-auto h-14"
              width={220}
              height={112}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[15px] font-medium transition-colors whitespace-nowrap ${activeHref === item.href
                    ? "text-[#0048AE] underline underline-offset-4 decoration-2"
                    : "text-gray-700 hover:text-[#0048AE]"
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Register button */}
          <Link
            href={registerHref}
            className="hidden md:flex items-center gap-2 bg-[#0a1628] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#162340] transition-colors whitespace-nowrap"
          >
            {registerLabel}
            <span className="text-base leading-none">›</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
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
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#ede8df] py-5 flex flex-col gap-5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-[15px] font-medium transition-colors ${activeHref === item.href ? "text-[#0048AE]" : "text-gray-700 hover:text-[#0048AE]"
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
