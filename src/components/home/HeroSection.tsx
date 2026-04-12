import { BrandName } from "@/components/ui/BrandName";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative pt-[72px] overflow-hidden"
      style={{ backgroundColor: "#d4e8f7" }}
    >
      {/* Square grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(70,130,200,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,200,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-32 sm:pb-40 lg:pt-24 lg:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <h1
              className="font-black text-[#0a1628] leading-[0.95] mb-6 tracking-tight uppercase"
              style={{ fontSize: "clamp(50px, 7.5vw, 90px)" }}
            >
              Study{" "}
              <span className="text-[#0048AE]">Smarter,</span>
              <br />
              Not Harder
            </h1>

            <p className="text-[15px] sm:text-[16px] text-[#374151] leading-relaxed mb-8 sm:mb-10 max-w-[420px]">
              Stop stressing about exams. <BrandName /> makes remembering your lessons easy
              by turning your favorite sites into quick study breaks. Register, download the
              extension, and get started.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#0048AE] text-white px-8 py-4 rounded-full text-[15px] font-bold hover:bg-[#003d99] transition-colors"
            >
              Add Chrome Extension
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right — image with dark rotated frame */}
          <div className="relative w-full max-w-[560px] mx-auto lg:ml-auto lg:mr-0 mt-10 lg:mt-0">
            {/* Dark navy tilted shadow frame */}
            <div
              className="absolute bg-[#0c2355] rounded-2xl"
              style={{
                inset: 0,
                transform: "rotate(4deg) translate(12px, -8px)",
                zIndex: 0,
              }}
            />
            {/* Image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ zIndex: 1, aspectRatio: "4/3" }}
            >
              <img
                src="/images/new/heroImage.png"
                alt="Students studying together"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stat badge */}
            <div
              className="absolute -bottom-5 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              style={{ zIndex: 2 }}
            >
              <img
                src="/images/heroSectionStudentProrfileWholeGroupProfiles.png"
                alt="Student avatars"
                className="h-7 object-contain"
              />
              <div>
                <p className="text-[13px] font-black text-[#0a1628] leading-none">10k+</p>
                <p className="text-[11px] text-gray-500 leading-none mt-0.5">Students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom white curve */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none leading-[0]">
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,90 C480,10 960,10 1440,90 L1440,90 L0,90 Z" fill="white" />
        </svg>
      </div> */}
    </section>
  );
}
