import Link from "next/link";

export default function WellbeingHeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #eef5fc 0%, #dce9f8 100%)",
        paddingTop: "72px",
      }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-10 sm:pt-14 lg:pt-16 text-center">
        {/* Label */}
        <p
          className="font-black uppercase tracking-[0.2em] mb-3"
          style={{ color: "#0048AE", fontSize: "clamp(10px, 0.9vw, 12px)" }}
        >
          Support For Your Daily Wellbeing
        </p>

        {/* Heading */}
        <h1
          className="font-black uppercase leading-[1.08] tracking-tight mb-4 mx-auto"
          style={{
            color: "#0a1628",
            fontSize: "clamp(26px, 4vw, 52px)",
            maxWidth: "700px",
          }}
        >
          Build Resilience. Find Balance.{" "}
          <br className="hidden sm:block" />
          Stay <span style={{ color: "#0048AE" }}>Independent</span>
        </h1>

        {/* Description */}
        <p
          className="mx-auto mb-6 leading-relaxed"
          style={{
            color: "#6b7280",
            fontSize: "clamp(13px, 1.05vw, 15px)",
            maxWidth: "540px",
          }}
        >
          Daily messaging created to help you manage your wellbeing on your own
          terms. We provide evidence-based strategies to help you stay grounded
          and reach your personal goals.
        </p>

        {/* CTA Button */}
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-90"
          style={{
            backgroundColor: "#0a1628",
            padding: "12px 24px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          Request Information For NDIS Providers
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Three tilted hero images */}
        <div className="relative flex items-end justify-center gap-3 sm:gap-5 mt-8 sm:mt-12 pb-6 sm:pb-8">
          {/* Left image — tilted left */}
          <div
            className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl flex-shrink-0"
            style={{
              width: "clamp(120px, 19vw, 240px)",
              aspectRatio: "3 / 4",
              transform: "rotate(-6deg) translateY(8px)",
            }}
          >
            <img
              src="/images/new/educationImage1.png"
              alt="Person receiving support"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center image — straight, tallest */}
          <div
            className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl flex-shrink-0 z-10"
            style={{
              width: "clamp(140px, 22vw, 280px)",
              aspectRatio: "3 / 4",
            }}
          >
            <img
              src="/images/new/educationImage2.png"
              alt="Person with tablet"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right image — tilted right */}
          <div
            className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl flex-shrink-0"
            style={{
              width: "clamp(120px, 19vw, 240px)",
              aspectRatio: "3 / 4",
              transform: "rotate(6deg) translateY(8px)",
            }}
          >
            <img
              src="/images/new/heroImage.png"
              alt="Person in wheelchair"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
