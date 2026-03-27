function TriangleBullet() {
  return (
    <span className="flex-shrink-0 mt-0.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L22 20H2L12 3Z" stroke="#0048AE" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const educatorPoints = [
  "Andwhat's spaced repetition of learning material helps drive retention of lessons learnt in class.",
  "No IT onboarding required. Teachers upload Question sets with multi-choice answers relating to course material. A reference number is allocated to share with Students and away they go.",
];

const parentPoints = [
  "Built to Australian Student Safety Standards.",
  "Data is encrypted and never shared with third parties.",
  "Encouraging consistent study habits without the 'homework' battle.",
];

export default function ForEducatorsParentsSection() {
  return (
    <section className="bg-white py-16">
      {/* FOR EDUCATORS — image LEFT, text RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="overflow-hidden rounded-tr-2xl">
          <img
            src="/images/new/educationImage1.png"
            alt="Educator in classroom"
            className="w-full h-96 object-cover"
            style={{ minHeight: "380px" }}
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-14 sm:px-12 lg:px-16 xl:px-20">
          <p className="text-[11px] font-black text-[#0a1628] uppercase tracking-[0.18em] mb-2">
            For Educators:
          </p>
          <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-black text-[#0048AE] uppercase leading-tight mb-8">
            Personalize The Learning
          </h2>
          <ul className="flex flex-col gap-5">
            {educatorPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <TriangleBullet />
                <span className="text-[14px] sm:text-[15px] text-[#374151] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOR PARENTS — text LEFT, image RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-14 sm:px-12 lg:px-16 xl:px-20 ">
          <p className="text-[11px] font-black text-[#0a1628] uppercase tracking-[0.18em] mb-2">
            For Parents:
          </p>
          <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-black text-[#0048AE] uppercase leading-tight mb-8">
            Safety &amp; Progress
          </h2>
          <ul className="flex flex-col gap-5">
            {parentPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <TriangleBullet />
                <span className="text-[14px] sm:text-[15px] text-[#374151] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-bl-2xl max-lg:order-1">
          <img
            src="/images/new/educationImage2.png"
            alt="Parent helping student"
            className="w-full h-96 object-cover"
            style={{ minHeight: "380px" }}
          />
        </div>
      </div>
    </section>
  );
}
