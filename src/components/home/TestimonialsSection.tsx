"use client";

import { BrandName } from "@/components/ui/BrandName";
import { useState, type ReactNode } from "react";

const testimonials: {
  name: string;
  handle: string;
  avatar: string;
  content: ReactNode;
  stars: number;
}[] = [
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student1.png",
    content: (
      <>
        I just received an invite to <BrandName />, and holy crap! It is well thought out, and
        I can see this being my go-to study platform going forward. Well done! I&apos;m looking
        forward to seeing how the app progresses.
      </>
    ),
    stars: 5,
  },
  {
    name: "Marcus Brown",
    handle: "@marcusbrown",
    avatar: "/images/student2.png",
    content: (
      <>
        <BrandName /> helped me stay focused during exam season. The concept of learning
        while browsing is genius — I barely noticed I was studying!
      </>
    ),
    stars: 5,
  },
  {
    name: "Alex Turner",
    handle: "@alexturner",
    avatar: "/images/student3.png",
    content:
      "The extension works seamlessly. Every time I go on YouTube or Reddit, I get a quick question from class. After two weeks I aced my history test!",
    stars: 5,
  },
  {
    name: "Sarah Mitchell",
    handle: "@sarahmitchell",
    avatar: "/images/student4.png",
    content: (
      <>
        My students are so much more engaged since we started using <BrandName />. It&apos;s
        seamless and doesn&apos;t feel like extra work at all.
      </>
    ),
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-[#f5c518]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 2;
  const maxIndex = testimonials.length - visibleCount;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const visible = testimonials.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section id="reviews" className="relative overflow-hidden" style={{ backgroundColor: "#dce9f8" }}>
      {/* Top wave transition from SupportCards */}
     <div className="w-full overflow-hidden leading-[0]">
  <svg
    viewBox="0 0 1440 120"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full block"
    preserveAspectRatio="none"
  >
    <path
      d="M0,60 
         C360,0 1080,0 1440,60 
         L1440,0 
         L0,0 
         Z"
      fill="white"
    />
  </svg>
</div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-10 pb-20">
        {/* Heading */}
        <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-black text-[#0a1628] text-center uppercase leading-tight mb-12 sm:mb-16">
          What{" "}
          <span className="text-[#0048AE]">Students</span>{" "}
          Are Saying About Us
        </h2>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {visible.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 sm:p-7 border border-[#e8d8c4] shadow-sm"
              style={{ backgroundColor: "#f5ede0" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0a1628] leading-tight">{t.name}</p>
                    <p className="text-[12px] text-gray-500">{t.handle}</p>
                  </div>
                </div>
                {/* Quote icon — dark circle */}
                <div className="w-10 h-10 rounded-full bg-[#0a1628] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>

              {/* Separator + content */}
              <div className="border-t border-[#d5c4b0] pt-4 mb-4">
                <p className="text-[14px] text-[#374151] leading-relaxed">
                  {t.content}
                </p>
              </div>

              <StarRating count={t.stars} />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={currentIndex === 0}
            className="w-11 h-11 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:border-[#0048AE] hover:text-[#0048AE] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="w-11 h-11 rounded-full bg-[#0048AE] flex items-center justify-center text-white hover:bg-[#003d99] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
