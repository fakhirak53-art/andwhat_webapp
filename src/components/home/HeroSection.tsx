import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-b-[36px] pt-[74px] sm:rounded-b-[52px] lg:rounded-b-[68px]"
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


      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 md:px-10 lg:px-16 lg:pb-20 lg:pt-12">
        <div className="grid grid-cols-1 items-center gap-8 py-8 sm:gap-10 sm:py-10 md:gap-12 lg:grid-cols-2 lg:gap-10 lg:py-14 xl:gap-20">
          <div className="max-w-[672px]">
            <h1 className="mb-4 text-[clamp(36px,11.5vw,86px)] font-black uppercase leading-[0.92] tracking-[-0.035em] text-[#0a1628] sm:mb-5 md:text-[66px] lg:text-[55px] xl:text-[80px]">
              <span className="block lg:whitespace-nowrap">
                Struggling <span className="hidden lg:inline">At</span>
              </span>
              <span className="block lg:whitespace-nowrap">
                <span className="lg:hidden">At </span>School? <span className="text-[#2440a4]">Let&apos;s</span>
              </span>
              <span className="block whitespace-nowrap">
                <span className="text-[#2440a4]">Change</span> That
              </span>
            </h1>

            <p className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-[#374151] sm:mb-9 sm:text-[17px] lg:text-[18px]">
              If you&apos;re going to be on your phone anyway, you might as well
              accidentally pass your next test. We turn your distractions into tiny
              brain power-ups. Add the extension, skip the stress, and get back to
              what matters.
            </p>

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#2440a4] px-6 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#1f378e] sm:w-auto sm:px-7"
            >
              Add Chrome Extension
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="relative mx-auto mt-2 w-full max-w-[620px] lg:ml-auto lg:mr-0 lg:mt-0">
            <div
              className="absolute inset-0 translate-x-2 -translate-y-2 rotate-3 rounded-[22px] bg-[#2440a4] sm:translate-x-4 sm:-translate-y-4 sm:rounded-[28px] lg:translate-x-6 lg:-translate-y-5 lg:rotate-[4deg] lg:rounded-[34px]"
              style={{
                zIndex: 0,
              }}
            />

            <div className="relative overflow-hidden rounded-[22px] bg-white sm:rounded-[28px] lg:rounded-[34px]" style={{ zIndex: 1, aspectRatio: "1.08 / 1" }}>
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
