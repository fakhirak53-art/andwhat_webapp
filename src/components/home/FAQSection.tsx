import FAQItem from "./FAQItem";

export interface FAQ {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

interface FAQSectionProps {
  faqs?: FAQ[];
  bgColor?: string;
  id?: string;
  variant?: "default" | "home";
}

const defaultFaqs: FAQ[] = [
  {
    question: "How do students log in to the platform?",
    answer:
      "No passwords needed. Just enter the unique Reference Number provided by your teacher to jump straight in.",
    defaultOpen: true,
  },
  {
    question: "How does the spaced repetition system work?",
    answer:
      "Our \"Sneaky Extension\" tracks what you've seen and resurfaces key concepts right before you're likely to forget them.",
    defaultOpen: true,
  },
  {
    question: "Can teachers create their own questions?",
    answer:
      "Yes. Teachers can upload custom question sets directly to their dashboard to align with their specific curriculum.",
    defaultOpen: true,
  },
  {
    question: "What devices are compatible?",
    answer:
      "The core experience is a Chrome Extension for laptops/desktops, paired with a mobile-friendly web app for daily messages.",
    defaultOpen: true,
  },
  {
    question: "Is student progress tracked?",
    answer:
      "Yes. Students see their own growth, and teachers receive high-level insights to see where the class needs more support.",
    defaultOpen: true,
  },
  {
    question: "How are schools registered?",
    answer:
      "A school representative simply fills out the Registration Form to get a unique code and set up their pilot program.",
    defaultOpen: true,
  },
  {
    question: "What is Daily Learning Messages?",
    answer:
      "It's a \"Vibe Check\" that sends daily tips and support to your phone to help manage school stress and mindset.",
    defaultOpen: true,
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes. Schools can sign up for a School Pilot to test the full power of the platform before committing.",
    defaultOpen: true,
  },
];

export default function FAQSection({
  faqs = defaultFaqs,
  bgColor,
  id = "faq",
  variant = "default",
}: FAQSectionProps) {
  const left = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 !== 0);

  return (
    <section
      id={id}
      className="py-16 sm:py-20"
      style={{ backgroundColor: bgColor ?? "white" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-black text-[#0a1628] text-center uppercase leading-tight tracking-wide mb-12 sm:mb-16">
          Frequently{" "}
          <span className="text-[#0048AE]">Ask</span>{" "}
          Questions
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            {left.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
                variant={variant}
              />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {right.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
                variant={variant}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
