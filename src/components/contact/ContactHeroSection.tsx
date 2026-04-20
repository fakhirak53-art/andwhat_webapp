import Link from "next/link";

export default function ContactHeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #eef5fc 0%, #dce9f8 100%)",
        paddingTop: "72px",
      }}
    >
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 text-center">
        <p
          className="font-black uppercase tracking-[0.2em] mb-3"
          style={{ color: "#0048AE", fontSize: "clamp(10px, 0.9vw, 12px)" }}
        >
          Get in touch
        </p>

        <h1
          className="font-black uppercase leading-[1.08] tracking-tight mb-4 mx-auto"
          style={{
            color: "#0a1628",
            fontSize: "clamp(26px, 4vw, 48px)",
            maxWidth: "720px",
          }}
        >
          We&apos;re Here To <span style={{ color: "#0048AE" }}>Help</span>
        </h1>

        <p
          className="mx-auto mb-6 leading-relaxed"
          style={{
            color: "#6b7280",
            fontSize: "clamp(13px, 1.05vw, 15px)",
            maxWidth: "560px",
          }}
        >
          Questions about students or schools? Send us a message and we&apos;ll
          get back to you as soon as we can.
        </p>

        <Link
          href="#contact-form"
          className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-90"
          style={{
            backgroundColor: "#0a1628",
            padding: "12px 24px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          Send a message
          <svg
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <title>Scroll to contact form</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
