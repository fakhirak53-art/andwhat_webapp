import SectionWrapper from "./SectionWrapper";
import SectionHeader from "./SectionHeader";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Easy Login",
    description:
      "Students can log in using their account or quickly access the system using QR code login",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Practise What You Learn",
    description:
      "Instead of just reading notes, students answer quiz questions created by teachers. This helps strengthen memory and improve understanding.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Remember More For Longer",
    description:
      "Spaced repetition reminds students to review material at the right time so knowledge stays in their long-term memory.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 11l2 2 4-4" />
      </svg>
    ),
    title: "Stay Motivated",
    description:
      "Daily learning messages help students stay focused and motivated throughout their studies.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Feel Confident In Exams",
    description:
      "Regular practice helps students understand what they have mastered and what they still need to improve.",
  },
];

export default function WhyStudentsSection() {
  return (
    <section id="features" className="py-14 sm:py-20 bg-gradient-to-b from-sky-50/60 to-white">
      <SectionWrapper>
        <SectionHeader
          title="Why Students Love Our Platform"
          subtitle="From daily prompts to real-world training modules, our platform keeps learning simple, fun, and easy to follow—anytime, anywhere. Students stay on track, and educators can support progress effortlessly."
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.slice(0, 3).map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.slice(3).map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </SectionWrapper>
    </section>
  );
}
