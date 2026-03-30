import Link from "next/link";

export default function RTOHeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#d4e8f7", paddingTop: "72px" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(50,110,180,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(50,110,180,0.07) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-center lg:min-h-[calc(100vh-72px)]"
          
        >
          {/* Left — copy */}
          <div className="py-12 sm:py-16 lg:py-20">
            <p className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.18em] mb-4" style={{ color: "#0048AE" }}>
              For Registered Training Organisations (RTOs)
            </p>

            <h1
              className="font-black uppercase leading-[1.05] tracking-tight mb-5"
              style={{
                color: "#0a1628",
                fontSize: "clamp(28px, 3.8vw, 50px)",
                maxWidth: "480px",
              }}
            >
              Help Your Students Stay Focused While{" "}
              <span style={{ color: "#0048AE" }}>They&apos;re</span>{" "}
              Already Online.
            </h1>

            <p
              className="leading-relaxed mb-8"
              style={{
                color: "#4b5563",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                maxWidth: "400px",
              }}
            >
              AndWhat sits quietly in the background of any website your students
              visit. Before a distraction loads, they answer one quick question
              from your course material. Simple for them. Useful for you.
            </p>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-90"
              style={{
                backgroundColor: "#0a1628",
                padding: "13px 26px",
                fontSize: "14px",
                borderRadius: "8px",
              }}
            >
              Enquire Now
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right spacer — image is absolutely positioned */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ─── Right image with curved left border ─── */}
      {/* Uses an SVG clip-path to create the exact convex curve on the left edge */}
      <div
        className="hidden lg:block absolute top-0 right-0 z-10"
        style={{ width: "52%", height: "100%", paddingTop: "72px" }}
      >
        {/* SVG clip-path definition */}
        <svg className="absolute" width="0" height="0" aria-hidden="true">
          <defs>
            <clipPath id="heroCurve" clipPathUnits="objectBoundingBox">
              <path d="M 0.12 0 C 0 0.25, 0 0.75, 0.12 1 L 1 1 L 1 0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="relative w-full h-full " style={{ clipPath: "url(#heroCurve)" }}>
          <img
            src="/images/new/rtoHeroImage.png"
            alt="Vocational training students on a worksite"
            className="absolute inset-0 w-full h-full object-cover "
          />
        </div>

        {/* Left curved navy border via SVG positioned at the curve edge */}
        {/* <svg
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{ paddingTop: "72px" }}
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 12 0 C 0 250, 0 750, 12 1000"
            fill="none"
            stroke="#0c2355"
            strokeWidth="5"
          />
        </svg> */}
      </div>

      {/* ─── Mobile image ─── */}
      <div className="lg:hidden relative overflow-hidden mx-4 sm:mx-6 mb-6 rounded-2xl" style={{ border: "4px solid #0c2355" }}>
        <img
          src="/images/new/rtoHeroImage.png"
          alt="Vocational training students on a worksite"
          className="w-full object-cover"
          style={{ aspectRatio: "16/10" }}
        />
      </div>
    </section>
  );
}
