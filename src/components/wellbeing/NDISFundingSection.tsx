export default function NDISFundingSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — image */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/new/educationImage1.png"
              alt="NDIS participants in a support session"
              className="w-full object-cover"
              style={{ aspectRatio: "4 / 3", minHeight: "320px" }}
            />
          </div>

          {/* Right — copy */}
          <div>
            <h2
              className="font-black uppercase leading-[1.1] tracking-tight mb-6"
              style={{ color: "#0a1628", fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              NDIS Funding &amp;{" "}
              <span style={{ color: "#0048AE" }}>Plan Integration</span>
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#6b7280] leading-relaxed mb-5">
              AndWhat is a person-centred tool designed to support NDIS
              participants under Improved Daily Living and Social &amp; Community
              Participation funding categories.
            </p>

            <p className="text-[14px] sm:text-[15px] text-[#6b7280] leading-relaxed">
              By integrating directly into a participant&apos;s daily digital
              routine and content that may facilitate recovery, wellbeing,
              offering no-pressure engagement, we provide consistent, accessible
              support. Emotional, Social, Therapy
              practice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
