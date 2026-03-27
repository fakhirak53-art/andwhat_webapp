"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f2] border-b border-[#ede8df]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="AndWhat - Learning Gatekeeper" width={130} height={44} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[15px] font-medium text-gray-700 hover:text-[#0048AE] transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Register button */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-[#0a1628] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold hover:bg-[#162340] transition-colors whitespace-nowrap"
          >
            Register Now
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
                className="text-[15px] font-medium text-gray-700 hover:text-[#0048AE] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-5 py-2.5 rounded-full text-[14px] font-semibold w-fit"
            >
              Register Now
              <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                ↗
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
