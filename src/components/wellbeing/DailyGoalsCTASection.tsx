import { BrandName } from "@/components/ui/BrandName";
import Link from "next/link";

export default function DailyGoalsCTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Top concave curve — dark navy dips down from edges */}
      <div className="pointer-events-none leading-[0]" >
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: "clamp(40px, 6vw, 100px)" }}
        >
          {/* White background fills top, dark navy shape curves down from corners */}
          <path
            d="M0,0 L0,20 Q720,100 1440,20 L1440,0 Z"
            fill="white"
          />
          <path
            d="M0,20 Q720,100 1440,20 L1440,100 L0,100 Z"
            fill="#0c2355"
          />
        </svg>
      </div>

      {/* Dark navy body */}
      <div
        className="relative text-center"
        style={{
          background: "linear-gradient(160deg, #1e3a8a 0%, #0c2355 50%, #0a1628 100%)",
          padding: "2rem 1.5rem 3.5rem",
        }}
      >
        <h2
          className="font-black uppercase tracking-tight mb-3 text-white"
          style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
        >
          Supporting Your{" "}
          <span style={{ color: "#5cc8e8" }}>Daily Goals</span>
        </h2>

        <p
          className="mx-auto mb-7 leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "clamp(12px, 1vw, 14px)",
            maxWidth: "520px",
          }}
        >
          <BrandName tone="onDark" /> Daily Messaging provides practical, person-centred support to
          help you build resilience and develop independence. We focus on helping
          you achieve your mental health and wellbeing outcomes&mdash;starting in
          your NDIS plan.
        </p>

        <Link
          href="#contact"
          className="inline-flex items-center gap-2 font-semibold transition-colors hover:bg-white hover:text-[#0a1628]"
          style={{
            border: "2px solid white",
            color: "white",
            padding: "11px 22px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          Request Information For NDIS Providers
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
