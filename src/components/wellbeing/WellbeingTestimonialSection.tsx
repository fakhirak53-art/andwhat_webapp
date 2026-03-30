export default function WellbeingTestimonialSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-screen-lg mx-auto px-6 md:px-10">
        <div className="bg-white rounded-3xl p-10 sm:p-14 lg:p-16 shadow-sm border border-gray-100 relative">
          {/* Large decorative quote mark */}
          <span
            className="absolute top-6 left-8 sm:top-8 sm:left-10 font-black leading-none select-none pointer-events-none"
            style={{ fontSize: "clamp(60px, 8vw, 96px)", color: "#d4c4b0" }}
            aria-hidden="true"
          >
            &ldquo;
          </span>

          {/* Quote + attribution */}
          <div className="text-center pt-12 sm:pt-16">
            <p
              className="font-semibold italic leading-snug mb-10 mx-auto"
              style={{
                color: "#0a1628",
                fontSize: "clamp(18px, 2.5vw, 26px)",
                maxWidth: "640px",
              }}
            >
              &ldquo;Having daily support has made such a difference in how I
              manage my anxiety. It feels like I always have someone in my
              corner, even on the tough days.&rdquo;
            </p>

            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: "2px solid #0048AE" }}
              >
                <img
                  src="/images/student2.png"
                  alt="NDIS Participant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[15px] font-bold" style={{ color: "#0048AE" }}>
                  NDIS Participant
                </p>
                <p className="text-[13px] text-gray-400">Melbourne, VIC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
