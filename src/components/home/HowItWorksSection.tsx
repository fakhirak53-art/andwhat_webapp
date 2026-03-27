const steps = [
  {
    number: "01",
    title: "GETTING STARTED",
    description: "Register with us, download the extension and away we go.",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "HOW THE EXTENSION WORKS",
    description:
      "You pick sites you visit a lot. Each time you go there, you're blocked. A drop-box opens, you get a question from class — pick correctly from the multi-choice answers and you're in.",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "WHY IT'S NOT PUNISHMENT",
    description:
      "This takes maybe 1 minute of time. You're learning while you're not meant to be learning — that's sneaky.",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#e8eff8" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <h2 className="text-[26px] sm:text-[34px] lg:text-[44px] font-black text-[#0a1628] text-center mb-14 sm:mb-20 leading-tight uppercase">
          Here&#39;s How Our{" "}
          <span className="text-[#0048AE]">Sneaky Extension</span>{" "}
          Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col">
              {/* Step number + connector line */}
              <div className="flex items-center mb-5">
                <span className="text-[12px] font-black text-[#0a1628] tracking-[0.15em] uppercase whitespace-nowrap">
                  Step {step.number}
                </span>
                <div className="flex items-center ml-3 flex-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a1628] flex-shrink-0" />
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-[#0a1628] opacity-25 ml-0" />
                  )}
                </div>
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 flex-1 shadow-sm">
                {/* Icon circle */}
                <div className="w-14 h-14 rounded-full bg-[#0048AE] flex items-center justify-center mb-5">
                  {step.icon}
                </div>
                <h3 className="text-[13px] font-black text-[#0a1628] uppercase tracking-wide mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#4b5563] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
