import Link from "next/link";
import SectionWrapper from "./SectionWrapper";

export default function HeroSection() {
  return (
    <section
      className="relative pt-[70px] overflow-hidden"
      style={{ backgroundColor: "#edf2f8" }}
    >
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,150,200,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,200,0.13) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top-right blue gradient blob */}
      <div
        className="absolute top-0 right-0 w-[38%] h-[70%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, rgba(50,130,230,0.55) 0%, rgba(100,175,255,0.28) 45%, transparent 70%)",
        }}
      />

      {/* Bottom-left blue gradient blob */}
      <div
        className="absolute bottom-0 left-0 w-[28%] h-[55%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 100%, rgba(50,130,230,0.5) 0%, rgba(100,175,255,0.22) 45%, transparent 70%)",
        }}
      />

      <SectionWrapper className="relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <h1 className="text-[44px] sm:text-[60px] lg:text-[70px] xl:text-[82px] font-black text-gray-900 leading-[1.05] mb-5 sm:mb-6 tracking-tight">
              Study Smarter,
              <br />
              Not Harder
            </h1>

            <p className="text-base sm:text-lg lg:text-xl font-normal text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-[480px]">
              Easystuff helps students practise questions and review information
              at the right time so learning becomes easier and more effective.
            </p>

            <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
              <Link
                href="/login"
                className="bg-[#1a3692] text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-[15px] sm:text-[17px] font-semibold hover:bg-[#132d7e] transition-colors shadow-md"
              >
                Add to Chrome
              </Link>
              <button
                type="button"
                className="flex items-center gap-3 text-[15px] sm:text-[17px] font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#bdd1eb] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a3692] ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative w-full max-w-[600px] mx-auto lg:ml-auto lg:mr-0">
            {/* 2k+ badge — floats outside the card at top-right */}
            <div className="absolute -top-5 -right-4 sm:-right-6 z-10 bg-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-xl flex items-center gap-2 sm:gap-3">
              <div className="leading-tight">
                <div className="text-[13px] sm:text-[15px] font-extrabold text-gray-900">2k+</div>
                <div className="text-[11px] sm:text-xs text-gray-400">Student</div>
              </div>
              <img
                src="/images/heroSectionStudentProrfileWholeGroupProfiles.png"
                alt="2k+ students"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>

            {/* Main hero image */}
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#1a2535] shadow-2xl">
              <img
                src="/images/heroImage.png"
                alt="Students studying together"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Wave vectors — bottom-left of image card */}
            <div className="absolute -bottom-3 -left-6 sm:-left-8 flex flex-col gap-1.5 pointer-events-none select-none">
              <img
                src="/images/heroSectionImageLeftBottomVector.png"
                alt=""
                className="w-16 sm:w-20 opacity-90"
              />
              <img
                src="/images/heroSectionImageLeftBottomVector.png"
                alt=""
                className="w-16 sm:w-20 opacity-60"
              />
              <img
                src="/images/heroSectionImageLeftBottomVector.png"
                alt=""
                className="w-16 sm:w-20 opacity-30"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
