import { BrandName } from "@/components/ui/BrandName";
import type { ReactNode } from "react";
import FAQItem from "./FAQItem";

export interface FAQ {
  question: ReactNode;
  answer: ReactNode;
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
  },
  {
    question: "How does the spaced repetition system work?",
    answer:
      "Our \"Sneaky Extension\" tracks what you've seen and resurfaces key concepts right before you're likely to forget them.",
  },
  {
    question: "Can teachers create their own questions?",
    answer:
      "Yes. Teachers can upload custom question sets directly to their dashboard to align with their specific curriculum.",
  },
  {
    question: "What devices are compatible?",
    answer: (
      <>
        <BrandName /> is a responsive web application that works on any modern device -
        laptops, tablets, and smartphones. Students can access it from any browser without
        installing an app.
      </>
    ),
  },
  {
    question: "Is student progress tracked?",
    answer:
      "Yes. Students see their own growth, and teachers receive high-level insights to see where the class needs more support.",
  },
  {
    question: "How are schools registered?",
    answer: (
      <>
        Schools are onboarded by the <BrandName /> team. Once set up, admins receive their
        school code and can start adding students and creating question sets immediately.
      </>
    ),
  },
  {
    question: "What is Daily Learning Messages?",
    answer:
      "It's a \"Vibe Check\" that sends daily tips and support to your phone to help manage school stress and mindset.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes. Schools can sign up for a School Pilot to test the full power of the platform before committing.",
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
            {left.map((faq, i) => (
              <FAQItem
                key={`faq-left-${i}`}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
                variant={variant}
              />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {right.map((faq, i) => (
              <FAQItem
                key={`faq-right-${i}`}
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
