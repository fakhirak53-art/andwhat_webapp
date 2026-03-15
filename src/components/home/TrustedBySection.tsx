import SectionWrapper from "./SectionWrapper";

const trustedLogos = [
  { name: "Notion", image: "/images/notion.png" },
  { name: "Slack", image: "/images/slack.png" },
  { name: "Trello", image: "/images/trello.png" },
  { name: "Microsoft", image: "/images/microsoft.png" },
];

export default function TrustedBySection() {
  return (
    <section className="bg-black py-12 sm:py-16">
      <SectionWrapper>
        <p className="text-center text-gray-400 text-[14px] sm:text-[16px] font-normal mb-8 sm:mb-10">
          Trusted by students, trainers, and wellbeing organisations.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {trustedLogos.map((logo) => (
            <div
              key={logo.name}
              className="bg-white rounded-2xl px-4 py-5 flex items-center justify-center gap-2 sm:gap-3"
            >
              <img
                src={logo.image}
                alt={logo.name}
                className="h-14 sm:h-24 w-auto object-contain"
              />
              <span className="text-[14px] sm:text-[18px] font-bold text-gray-800">{logo.name}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </section>
  );
}
