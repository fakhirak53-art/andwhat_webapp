import SectionWrapper from "./SectionWrapper";
import SectionHeader from "./SectionHeader";
import FeatureRow from "./FeatureRow";

const features = [
  {
    title: "Student Registration",
    description:
      "Students register using their School Code, Student ID, and Year Level.",
    image: "/images/studentRegistration.png",
    imageFirst: true,
  },
  {
    title: "QR Code Login",
    description: "Students can log in quickly by scanning a QR code.",
    image: "/images/qrCode.png",
    imageFirst: false,
  },
  {
    title: "Quiz Practice",
    description:
      "Students practise questions created by teachers to reinforce learning.",
    image: "/images/quizPractice.png",
    imageFirst: true,
  },
  {
    title: "Smart Revision System",
    description:
      "Spaced repetition schedules revision at the right time to improve memory.",
    image: "/images/smartRevision.png",
    imageFirst: false,
  },
  {
    title: "Daily Learning Messages",
    description: "Students receive daily messages to encourage consistent learning.",
    image: "/images/dailyLearning.png",
    imageFirst: true,
  },
  {
    title: "Google Sign-In",
    description: "Students can easily sign in using their Google account.",
    image: "/images/googleSignIn.png",
    imageFirst: false,
  },
];

export default function PowerfulFeaturesSection() {
  return (
    <section id="benefits" className="py-14 sm:py-20 bg-slate-50">
      <SectionWrapper>
        <div className="mb-10 sm:mb-14">
          <SectionHeader
            title="Powerful Learning Features"
            subtitle="Easystuff provides tools that make learning simple, effective, and engaging."
            centered
          />
        </div>
        <div className="flex flex-col gap-6">
          {features.map((feature) => (
            <FeatureRow
              key={feature.title}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              imageFirst={feature.imageFirst}
            />
          ))}
        </div>
      </SectionWrapper>
    </section>
  );
}
