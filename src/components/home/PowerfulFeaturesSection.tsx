const features = [
  {
    title: "ENGAGING WITH\nCLASSWORK",
    description:
      "Regularly visiting material relating to your lessons in class helps reinforce those lessons. Helps jog your memory. Builds knowledge.",
    dark: false,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "GAIN\nCONFIDENCE",
    description:
      "Getting used to facing questions helps reduce fears and anxiety when faced with exams for real. — You Got This!",
    dark: true,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "WELLBEING\nSUPPORT",
    description:
      "Andwhat supports students that sometimes struggle. We offer a hand up to everyone.",
    dark: false,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function PowerfulFeaturesSection() {
  return (
    <section id="features" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-black text-[#0a1628] uppercase leading-tight tracking-wide">
            Powerful{" "}
            <span className="text-[#0048AE]">Learning</span>{" "}
            Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] text-[#5b6474] sm:text-[16px]">
            Andwhat provides tools that make learning simple, effective, and engaging.
          </p>
        </div>

        <div className="mx-auto grid max-w-280 grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center rounded-3xl p-8 text-center sm:p-10 ${
                feature.dark
                  ? "bg-[#111a2d] text-white shadow-[0_22px_40px_rgba(10,22,40,0.12)]"
                  : "border border-[#cfd8e4] bg-[#fbfdff] shadow-[0_14px_28px_rgba(10,22,40,0.04)]"
              }`}
            >
              <div
                className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full border ${
                  feature.dark
                    ? "border-[#d8e2f2] bg-white text-[#2440a4]"
                    : "border-[#93a7df] bg-[#2440a4] text-white"
                }`}
              >
                {feature.icon}
              </div>

              <h3
                className={`mb-4 whitespace-pre-line text-[18px] font-extrabold uppercase leading-[1.15] ${
                  feature.dark ? "text-white" : "text-[#0a1628]"
                }`}
              >
                {feature.title}
              </h3>

              <p
                className={`max-w-70 text-[15px] leading-relaxed ${
                  feature.dark ? "text-[#d5deed]" : "text-[#4d5867]"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
