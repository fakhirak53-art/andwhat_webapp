import SectionWrapper from "./SectionWrapper";
import SectionHeader from "./SectionHeader";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student1.png",
    content:
      "I just received an invite to @reflectnotes, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses.",
  },
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student2.png",
    content:
      "I just received an invite to @reflectnotes, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses.",
  },
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student3.png",
    content:
      "I just received an invite to @reflectnotes, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses.",
  },
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student4.png",
    content:
      "I just received an invite to @reflectnotes, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses.",
  },
  {
    name: "Jeremy McPeak",
    handle: "@jwmcpeak",
    avatar: "/images/student1.png",
    content:
      "I just received an invite to @reflectnotes, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <SectionWrapper>
        <div className="mb-10 sm:mb-14">
          <SectionHeader
            title="What educators and students are saying"
            subtitle="Simple tools that help students stay focused while giving trainers better insight into learning progress."
            centered
          />
        </div>
        {/* Top row — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard
              key={i}
              name={t.name}
              handle={t.handle}
              avatar={t.avatar}
              content={t.content}
            />
          ))}
        </div>
        {/* Bottom row — 2 cards centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:max-w-[calc(66.667%+8px)] md:mx-auto">
          <TestimonialCard
            name={testimonials[3].name}
            handle={testimonials[3].handle}
            avatar={testimonials[3].avatar}
            content={testimonials[3].content}
          />
          <TestimonialCard
            name={testimonials[4].name}
            handle={testimonials[4].handle}
            avatar={testimonials[4].avatar}
            content={testimonials[4].content}
          />
        </div>
      </SectionWrapper>
    </section>
  );
}
