"use client";

import { BrandName } from "@/components/ui/BrandName";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const CONTACT_PHONE_DISPLAY = "843-496-7759";
const CONTACT_PHONE_TEL = "tel:+18434967759";
const CONTACT_EMAIL = "admin@andwhat.au";

const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const usefulLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed) {
        setSubscribeStatus("error");
        setSubscribeMessage("Please enter your email.");
        return;
      }
      if (!EMAIL_REGEX.test(trimmed)) {
        setSubscribeStatus("error");
        setSubscribeMessage("Please enter a valid email address.");
        return;
      }

      setSubscribeStatus("loading");
      setSubscribeMessage("");

      const supabase = createClient();
      const normalized = trimmed.toLowerCase();
      const { error } = await supabase
        .from("newsletter_signups")
        .insert({ email: normalized });

      if (error) {
        if (error.code === "23505") {
          setSubscribeStatus("success");
          setSubscribeMessage("You’re already subscribed. Thanks!");
          setEmail("");
          return;
        }
        setSubscribeStatus("error");
        setSubscribeMessage("Something went wrong. Please try again later.");
        return;
      }

      setSubscribeStatus("success");
      setSubscribeMessage("Thanks — you’re on the list.");
      setEmail("");
    },
    [email],
  );

  const contactLinkClass =
    "flex items-start gap-3 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#0048AE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1628]";

  return (
    <footer id="contact" className="bg-[#0c1628]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 — Brand */}
          <div>
            <Image
              src="/images/logo.png"
              alt="AndWhat - Learning Gatekeeper"
              width={120}
              height={40}
              className="brightness-0 invert mb-5"
            />
            <p className="text-[13px] text-gray-400 leading-relaxed mb-6 max-w-[220px]">
              <BrandName tone="onDark" /> helps students learn smarter by turning everyday browsing into
              quick, effective practice. Build better habits, remember more, and stay
              consistent without extra study.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-8 h-8 rounded-md border border-gray-600 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Contact Details */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-6">Contact Details</h4>
            <div className="flex flex-col gap-4">
              <a href={CONTACT_PHONE_TEL} className={contactLinkClass}>
                <span className="w-9 h-9 rounded-full bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[12px] text-gray-400">Call Us Now</span>
                  <span className="block text-[14px] font-bold text-white">{CONTACT_PHONE_DISPLAY}</span>
                </span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className={contactLinkClass}>
                <span className="w-9 h-9 rounded-full bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[12px] text-gray-400">Send email</span>
                  <span className="block text-[14px] font-bold text-white hover:text-blue-300 transition-colors">
                    {CONTACT_EMAIL}
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Column 3 — Useful Links */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-6">Useful Links</h4>
            <ul className="flex flex-col gap-3">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-3">Get Notification</h4>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-5">
              Get Notification From Our Latest News! Enter Your Email Here.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                name="newsletter-email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribeStatus !== "idle") {
                    setSubscribeStatus("idle");
                    setSubscribeMessage("");
                  }
                }}
                placeholder="Enter Email Here"
                disabled={subscribeStatus === "loading"}
                className="w-full bg-white text-gray-700 placeholder-gray-400 text-[14px] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#0048AE] border border-transparent disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="w-full bg-[#0048AE] text-white text-[14px] font-semibold py-3 rounded-lg hover:bg-[#003d99] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
              >
                subscribe now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {subscribeMessage ? (
                <p
                  className={
                    subscribeStatus === "error"
                      ? "text-[13px] text-red-300"
                      : "text-[13px] text-green-300"
                  }
                  role={subscribeStatus === "error" ? "alert" : "status"}
                >
                  {subscribeMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 flex-wrap">
          <p className="text-[13px] text-gray-500 text-center sm:text-left">
            © 2026 All rights reserved
          </p>
          <Link
            href="/privacy-policy"
            className="text-[13px] text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <p className="text-[13px] font-semibold text-gray-300 text-center sm:text-right">
            Fully compliant with Australian Student Data Safety Standards.
          </p>
        </div>
      </div>
    </footer>
  );
}
