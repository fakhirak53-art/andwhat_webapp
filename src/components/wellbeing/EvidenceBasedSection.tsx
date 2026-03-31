export default function EvidenceBasedSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy & feature cards */}
          <div>
            <h2
              className="font-black uppercase leading-[1.1] tracking-tight mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              <span style={{ color: "#0048AE" }}>Evidence-Based</span>{" "}
              <span style={{ color: "#0a1628" }}>&amp; NDIS Aligned</span>
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#6b7280] mb-10">
              Targeted Support for Psychosocial Outcomes
            </p>

            {/* Feature card 1 */}
            <div
              className="rounded-xl p-5 mb-4"
              style={{ backgroundColor: "#f9f7f4", border: "1px solid #f0ece3" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: "2px solid #0048AE" }}
                >
                  <svg width="18" height="18" fill="none" stroke="#0048AE" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0a1628] mb-1.5">
                    Daily Emotional Stabilisation
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed">
                    Our messaging provides consistent strategies for emotional
                    regulation and sensory management. By delivering timely
                    check-ins, we help participants build the resilience needed to
                    manage daily stress and navigate their environment with greater
                    confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature card 2 */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#f9f7f4", border: "1px solid #f0ece3" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: "2px solid #0048AE" }}
                >
                  <svg width="18" height="18" fill="none" stroke="#0048AE" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0a1628] mb-1.5">
                    Personalised Psychosocial Support
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed">
                    All support is entirely confidential and tailored to the
                    individual&apos;s unique NDIS goals. We focus on building
                    functional capacity and social participation, ensuring every
                    interaction respects the participant&apos;s autonomy and choice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — tilted image with dark frame + floating card */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative" style={{ width: "clamp(280px, 34vw, 420px)" }}>
              {/* Dark navy tilted shadow frame */}
              <div
                className="absolute rounded-2xl"
                style={{
                  inset: 0,
                  backgroundColor: "#0c2355",
                  transform: "rotate(4deg) translate(12px, -8px)",
                  zIndex: 0,
                }}
              />
              {/* Image */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ zIndex: 1, aspectRatio: "3 / 4" }}
              >
                <img
                  src="/images/new/educationImage2.png"
                  alt="Person using phone for daily check-in"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Daily Check-In card */}
              <div
                className="absolute bg-white rounded-xl px-5 py-4 shadow-lg flex items-start gap-3"
                style={{ zIndex: 2, bottom: "-24px", right: "-16px", maxWidth: "220px" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#0048AE" }}
                >
                  <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#0a1628]">Daily Check-In</p>
                  <p className="text-[12px] text-[#6b7280] leading-snug mt-0.5">
                    &ldquo;Building resilience one message at a time.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
