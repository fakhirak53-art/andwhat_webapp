const steps = [
  {
    number: "01",
    title: "Simple Registration",
    description:
      "Register online with your NDIS participant number to link your support directly to your approved plan.",
    bgColor: "#0a1628",
    textColor: "white",
  },
  {
    number: "02",
    title: "Choose Your Support",
    description:
      "Select your personalised support themes, such as daily routine management, building confidence, or emotional stabilisation.",
    bgColor: "#1e3a8a",
    textColor: "white",
  },
  {
    number: "03",
    title: "Daily Support Delivery",
    description:
      "Receive timely strategies triggered directly by your daily digital habits\u2014like unlocking your phone or visiting specific websites.",
    bgColor: "#5cc8e8",
    textColor: "white",
  },
];

export default function HowToGetStartedSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#e8eff8" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <h2
            className="font-black uppercase tracking-tight"
            style={{ color: "#0a1628", fontSize: "clamp(26px, 4vw, 46px)" }}
          >
            How To Get{" "}
            <span style={{ color: "#0048AE" }}>Started</span>
          </h2>
        </div>

        {/* 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              {/* Rounded square number icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md"
                style={{ backgroundColor: step.bgColor }}
              >
                <span
                  className="font-bold text-[15px]"
                  style={{ color: step.textColor }}
                >
                  {step.number}
                </span>
              </div>

              <h3 className="text-[13px] sm:text-[14px] font-black text-[#0a1628] uppercase tracking-wide mb-3">
                {step.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed max-w-[300px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
