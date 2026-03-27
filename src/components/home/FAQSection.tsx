import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "How do students log in to the platform?",
    answer:
      "Students can log in using their school-provided credentials or quickly access the system by scanning a QR code. Google Sign-In is also available for added convenience.",
    defaultOpen: true,
  },
  {
    question: "How does the spaced repetition system work?",
    answer:
      "Our smart revision algorithm tracks each student's performance and schedules questions for review at optimal intervals. This ensures knowledge is reinforced at exactly the right time for long-term retention.",
  },
  {
    question: "Can teachers create their own questions?",
    answer:
      "Yes! Teachers can upload questions via CSV, create them one at a time through the admin dashboard, or organise questions into sets that students can practise.",
  },
  {
    question: "What devices is the platform compatible with?",
    answer:
      "AndWhat is a responsive web application that works on any modern device — laptops, tablets, and smartphones. Students can access it from any browser without installing an app.",
  },
  {
    question: "Is student progress tracked?",
    answer:
      "Absolutely. Administrators and teachers can view detailed analytics including activity timelines, completion rates, and performance trends for each student.",
  },
  {
    question: "How are schools registered on the platform?",
    answer:
      "Schools are onboarded by the AndWhat team. Once set up, admins receive their school code and can start adding students and creating question sets immediately.",
  },
  {
    question: "What is the Daily Learning Messages feature?",
    answer:
      "Each day students receive personalised messages to remind and encourage them to review their scheduled material. This keeps them motivated and consistent in their studies.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a trial period for schools to evaluate the platform. Please get in touch via the contact form and our team will set you up.",
  },
];

export default function FAQSection() {
  const left = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-black text-[#0a1628] text-center uppercase leading-tight tracking-wide mb-12 sm:mb-16">
          Frequently{" "}
          <span className="text-[#0048AE]">Ask</span>{" "}
          Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {left.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-4">
            {right.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
