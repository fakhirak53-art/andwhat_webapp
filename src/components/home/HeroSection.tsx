import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-b-[44px] pt-[74px] sm:rounded-b-[68px]"
      style={{ backgroundColor: "#d7ecfb" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(70,130,200,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(70,130,200,0.13) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 pb-16 pt-10 md:px-10 lg:px-16 lg:pb-20 lg:pt-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-32 py-14">
          <div className="max-w-[672px]">
            <h1
              className="mb-6 font-black uppercase leading-[0.94] tracking-[-0.04em] text-[#0a1628] text-[80px] py-8"
            // style={{ fontSize: "clamp(44px, 7vw, 86px)" }}
            >
              Struggling At
              <br />
              School? <span className="text-[#2440a4]">Let&apos;s Change</span>
              &nbsp;That
            </h1>

            <p className="mb-8 max-w-[520px] text-[15px] leading-relaxed text-[#374151] sm:mb-10 sm:text-[18px]">
              If you&apos;re going to be on your phone anyway, you might as well
              accidentally pass your next test. We turn your distractions into tiny
              brain power-ups. Add the extension, skip the stress, and get back to
              what matters.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#2440a4] px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#1f378e] sm:px-7"
            >
              Add Chrome Extension
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative mx-auto mt-4 w-full max-w-[620px] lg:ml-auto lg:mr-0 lg:mt-0">
            <div
              className="absolute inset-0 translate-x-4 -translate-y-4 rotate-[4deg] rounded-[34px] bg-[#2440a4] sm:translate-x-6 sm:-translate-y-5"
              style={{
                zIndex: 0,
              }}
            />

            <div className="relative overflow-hidden rounded-[34px] bg-white" style={{ zIndex: 1, aspectRatio: "1.08 / 1" }}>
              <Image
                src="/images/new/heroImage.png"
                alt="Students smiling together outside school"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 92vw"
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
