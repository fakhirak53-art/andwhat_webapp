"use client";

import { useState, type ReactNode } from "react";

interface FAQItemProps {
  question: ReactNode;
  answer: ReactNode;
  defaultOpen?: boolean;
}

export default function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-4 px-6 py-4 rounded-full text-left transition-colors ${
          isOpen
            ? "bg-[#1e3a8a] text-white"
            : "bg-white border border-gray-200 text-[#0a1628] hover:border-[#0048AE]"
        }`}
      >
        <span className="text-[14px] sm:text-[15px] font-semibold leading-snug">{question}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            isOpen ? "bg-[#38bdf8] text-white" : "bg-gray-700 text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-6 py-4">
          <p className="text-[14px] text-[#4b5563] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
