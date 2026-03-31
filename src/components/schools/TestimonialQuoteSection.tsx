export default function TestimonialQuoteSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" >
      <div className="max-w-screen-lg mx-auto px-6 md:px-10">
        <div className="bg-[#fdfbf7] rounded-3xl p-10 sm:p-14 lg:p-16 shadow-sm border border-gray-100 relative">
          {/* Large decorative "99" quote graphic */}
          <span
            className="absolute top-6 left-8 sm:top-8 sm:left-10 font-black leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(20px, 2vw, 24px)", color: "#d4c4b0" }}
            aria-hidden="true"
          >
            99
          </span>

          {/* Quote + attribution — centered */}
          <div className="text-center pt-12 sm:pt-16">
            <p
              className="font-semibold italic text-[#0a1628] leading-snug mb-10 mx-auto"
              style={{ fontSize: "clamp(18px, 2.5vw, 26px)", maxWidth: "640px" }}
            >
              &ldquo;It turns the 15 minutes they would have wasted on TikTok
              into 15 minutes of high-value exam prep.&rdquo;
            </p>

            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid #0048AE" }}
              >
                <img
                  src="/images/student1.png"
                  alt="Vocational Education Lead"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[15px] font-bold" style={{ color: "#0048AE" }}>
                  Vocational Education Lead
                </p>
                <p className="text-[13px] text-gray-400">Top-Tier Australian RTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
