"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  variant?: "default" | "home";
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
  variant = "default",
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isHomeVariant = variant === "home";

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between gap-4 rounded-full px-6 py-4 text-left transition-colors ${
          isHomeVariant
            ? "border border-[#d9e1ee] bg-white text-[#0a1628] shadow-[0_8px_18px_rgba(10,22,40,0.03)] hover:border-[#2440a4]"
            : isOpen
              ? "bg-[#1e3a8a] text-white"
              : "border border-gray-200 bg-white text-[#0a1628] hover:border-[#0048AE]"
        }`}
      >
        <span className="text-[14px] sm:text-[15px] font-semibold leading-snug">{question}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            isHomeVariant
              ? "bg-[#2440a4] text-white"
              : isOpen
                ? "bg-[#38bdf8] text-white"
                : "bg-gray-700 text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d={isOpen ? "M6 14l6-6 6 6" : "M18 10l-6 6-6-6"}
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={isHomeVariant ? "px-6 pb-2 pt-4" : "px-6 py-4"}>
          <p className={`text-[14px] leading-relaxed ${isHomeVariant ? "text-[#374151]" : "text-[#4b5563]"}`}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
