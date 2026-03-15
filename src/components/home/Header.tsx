"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = ["Features", "Benefits", "About", "FAQ"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link href="/">
            <Image src="/logo.png" alt="AndWhat Logo" width={140} height={40} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[15px] font-medium text-gray-700 hover:text-[#0048AE] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Register button */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-gray-900 text-white pl-5 pr-1.5 py-1.5 rounded-full text-[14px] font-semibold hover:bg-gray-800 transition-colors"
          >
            Register Now
            <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-bold">
              ↗
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
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
          <div className="md:hidden border-t border-gray-100 py-5 flex flex-col gap-5">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[15px] font-medium text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gray-900 text-white pl-5 pr-1.5 py-1.5 rounded-full text-[14px] font-semibold w-fit"
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
