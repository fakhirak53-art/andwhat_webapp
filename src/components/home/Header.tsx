"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

function isAppRoute(href: string) {
  return href.startsWith("/");
}

function navItemClassName(active: boolean) {
  return [
    "inline-block text-[15px] tracking-tight transition-colors whitespace-nowrap pb-1 border-b-2",
    active
      ? "text-[#0048AE] font-semibold border-[#0048AE]"
      : "text-[#0a1628]/75 border-transparent hover:text-[#0048AE]",
  ].join(" ");
}

export default function Header({
  navLinks = defaultNavLinks,
  activeHref,
  registerHref = "/login",
  registerLabel = "Register Now",
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

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
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Primary"
          >
            {navLinks.map((item) => {
              const active = activeHref === item.href;
              const className = navItemClassName(active);
              if (isAppRoute(item.href)) {
                return (
                  <Link key={item.href} href={item.href} className={className}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              );
            })}
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
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
      </div>

      {/* Full-screen mobile menu: covers viewport + scroll lock via body overflow (see useEffect) */}
      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[100] flex flex-col bg-[#faf7f2] md:hidden min-h-0"
          style={{ height: "100dvh" }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mx-auto flex h-[72px] w-full max-w-screen-xl shrink-0 items-center justify-between border-b border-[#ede8df] px-6">
            <Link
              href="/"
              className="shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <Image
                src="/images/new/andWhatLogo.png"
                alt="AndWhat - Learning Gatekeeper"
                className="h-14 w-auto"
                width={220}
                height={112}
              />
            </Link>
            <button
              type="button"
              className="p-2 text-gray-700"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav
            className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 py-6"
            aria-label="Primary"
          >
            {navLinks.map((item) => {
              const active = activeHref === item.href;
              const className = [
                "text-[15px] tracking-tight transition-colors py-1 border-l-2 pl-3 -ml-px",
                active
                  ? "text-[#0048AE] font-semibold border-[#0048AE]"
                  : "text-[#0a1628]/80 border-transparent hover:text-[#0048AE]",
              ].join(" ");
              const close = () => setMobileOpen(false);
              if (isAppRoute(item.href)) {
                return (
                  <Link key={item.href} href={item.href} className={className} onClick={close}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <a key={item.href} href={item.href} className={className} onClick={close}>
                  {item.label}
                </a>
              );
            })}
            <Link
              href={registerHref}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0a1628] px-5 py-2.5 text-[14px] font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              {registerLabel}
              <span className="text-base leading-none">›</span>
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
