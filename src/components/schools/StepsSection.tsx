const steps = [
  {
    number: "01",
    title: "Student Registers",
    description:
      "Students sign up independently with a name and email — no complex IT setup or school logins required.",
  },
  {
    number: "02",
    title: "Extension Download",
    description:
      "Users install the Chrome extension with one click. It runs quietly in the background of their browser.",
  },
  {
    number: "03",
    title: "Tutor Question Upload",
    description:
      "Trainers upload multiple-choice questions via a simple web form — no technical onboarding or special skills needed.",
  },
  {
    number: "04",
    title: "Site Selection",
    description:
      "Students select 3 sites they regularly visit. Once there, the extension shows 1–3 questions from your course before granting access.",
  },
  {
    number: "05",
    title: "Reference Allocation",
    description:
      "Each question set is assigned a specific reference number, which trainers provide to students to access the correct set.",
  },
  {
    number: "06",
    title: "Smart Trigger Delivery",
    description:
      "A revision question appears before a distraction site loads, turning digital breaks into valuable study moments.",
  },
];

export default function StepsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#f7f7f4" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="font-black text-[#0a1628] uppercase tracking-tight mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            How It{" "}
            <span className="text-[#0048AE]">Works</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#6b7280] max-w-xl mx-auto">
            No IT onboarding. No system integration. Just six steps and you&apos;re running.
          </p>
        </div>

        {/* 3 × 2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-7"
              style={{ borderLeft: "4px solid #0048AE" }}
            >
              {/* Numbered circle */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: "#1e3a8a" }}>
                <span className="text-white text-[12px] font-black tracking-wide">
                  {step.number}
                </span>
              </div>

              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#0a1628] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
