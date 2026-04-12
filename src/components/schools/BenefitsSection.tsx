const benefits = [
  {
    dark: false,
    title: "HIGHER PASS\nRATES",
    description:
      "By reviewing course material daily, workers stay exam-ready without extra study hours or formal revision sessions.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    dark: true,
    title: "VERIFIED\nPROGRESS",
    description:
      "Repetition of course material leads to better retention and gives trainers clear insight into student engagement.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    dark: false,
    title: "ZERO TECHNICAL\nHASSLE",
    description:
      "No onboarding with IT systems means quick turnaround. Register, download the extension, then away you go.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

import { BrandName } from "@/components/ui/BrandName";

export default function BenefitsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="font-black text-[#0a1628] uppercase tracking-tight"
            style={{ fontSize: "clamp(26px, 4vw, 46px)" }}
          >
            How <BrandName /> Helps Your{" "}
            <span className="text-[#0048AE]">Organisation</span>
          </h2>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {benefits.map((b, idx) => {
            const isDark = b.dark;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-8 sm:p-10 flex flex-col gap-5 ${
                  isDark
                    ? "text-white"
                    : "bg-white border border-gray-100 shadow-sm text-[#0a1628]"
                } ${isDark ? "md:-mt-4 md:mb-[-16px]" : ""}`}
                style={isDark ? { backgroundColor: "#0a1628" } : undefined}
              >
                {/* Dashed circle icon */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0`}
                  style={{
                    border: `2px dashed ${isDark ? "rgba(255,255,255,0.35)" : "#0048AE"}`,
                  }}
                >
                  <span className={isDark ? "text-white" : "text-[#0048AE]"}>
                    {b.icon}
                  </span>
                </div>

                <h3
                  className={`font-black text-[15px] sm:text-[17px] uppercase leading-snug whitespace-pre-line ${isDark ? "text-white" : "text-[#0a1628]"}`}
                >
                  {b.title}
                </h3>

                <p
                  className={`text-[14px] sm:text-[15px] leading-relaxed ${isDark ? "text-gray-300" : "text-[#6b7280]"}`}
                >
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
