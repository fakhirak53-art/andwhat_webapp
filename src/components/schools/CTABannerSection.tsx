import Link from "next/link";

export default function CTABannerSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0a1628 100%)",
          }}
        >
          {/* Decorative concentric rings */}
          <div
            className="absolute rounded-full border border-white/5 pointer-events-none"
            style={{ width: 640, height: 640, top: "50%", left: "55%", transform: "translate(-50%, -50%)" }}
          />
          <div
            className="absolute rounded-full border border-white/5 pointer-events-none"
            style={{ width: 460, height: 460, top: "50%", left: "55%", transform: "translate(-50%, -50%)" }}
          />
          <div
            className="absolute rounded-full border border-white/5 pointer-events-none"
            style={{ width: 290, height: 290, top: "50%", left: "55%", transform: "translate(-50%, -50%)" }}
          />

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 p-10 sm:p-14 items-center">
            {/* Left */}
            <div>
              <h2
                className="font-black text-white uppercase leading-tight mb-5"
                style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
              >
                Need A Hand With Anything?
              </h2>
              <p className="text-[14px] sm:text-[15px] text-gray-300 leading-relaxed mb-8 max-w-md">
                We don&apos;t do complicated IT support tickets. If something isn&apos;t
                working or you&apos;re just not sure what to do next, click below and
                we&apos;ll help you out in plain English.
              </p>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-7 py-3.5 rounded-lg text-[14px] sm:text-[15px] font-semibold hover:bg-white hover:text-[#0a1628] transition-colors"
              >
                Get In Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Right — floating tip cards */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              <div className="bg-white rounded-xl p-5 shadow-lg w-full max-w-[280px]">
                <p className="text-[12px] font-black text-[#f59e0b] uppercase tracking-wide mb-2">
                  Quick Tip
                </p>
                <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
                  Use the reference numbers on your course handout to find question sets faster.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-lg w-full max-w-[280px] lg:mr-8">
                <p className="text-[12px] font-black text-[#0048AE] uppercase tracking-wide mb-2">
                  Remember
                </p>
                <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
                  You can pause the extension anytime if a student needs a break from questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
