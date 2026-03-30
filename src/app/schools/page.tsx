import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FAQSection, { FAQ } from "@/components/home/FAQSection";
import RTOHeroSection from "@/components/schools/RTOHeroSection";
import StepsSection from "@/components/schools/StepsSection";
import BenefitsSection from "@/components/schools/BenefitsSection";
import CTABannerSection from "@/components/schools/CTABannerSection";
import TestimonialQuoteSection from "@/components/schools/TestimonialQuoteSection";

const schoolsNavLinks = [
  { label: "For Students", href: "/" },
  { label: "For Wellbeing & NDIS", href: "#" },
  { label: "For Schools & RTOs", href: "/schools" },
];

const schoolsFaqs: FAQ[] = [
  {
    question: "Does My IT Team Need To Set Anything Up?",
    answer:
      "No. Students install the extension themselves with one click. Your trainers upload questions through a simple web dashboard, so no technical involvement is required from your IT department.",
    defaultOpen: true,
  },
  {
    question: "Can We Customise The Questions For Our Course?",
    answer:
      "Yes. Your trainers have full control to write and upload every question. This ensures each set aligns exactly with the specific unit, licence, or accreditation the student is pursuing.",
    defaultOpen: true,
  },
  {
    question: "How do trainers upload question sets?",
    answer:
      "Trainers log in to the AndWhat web dashboard and use the question builder to add multiple-choice questions one at a time, or upload them in bulk via CSV. Each set is assigned a reference number to share with students.",
  },
  {
    question: "Is this compatible with our current LMS?",
    answer:
      "AndWhat operates completely independently of your LMS. Because it works at the browser level via a Chrome extension, there is no integration or configuration needed with your existing systems.",
  },
  {
    question: "What if a student uninstalls the extension?",
    answer:
      "If a student uninstalls the extension, revision questions simply stop appearing. They can reinstall it at any time — the process takes under a minute and does not require IT involvement.",
  },
  {
    question: "Which industries is this suitable for?",
    answer:
      "AndWhat works well for any RTO delivering certificate or diploma-level vocational training — including construction, hospitality, aged care, childcare, business, and more. Any course with knowledge-based exam components benefits.",
  },
];

export default function SchoolsPage() {
  return (
    <>
      <Header
        navLinks={schoolsNavLinks}
        activeHref="/schools"
        registerHref="/login"
        registerLabel="Register Now"
      />
      <main>
        <RTOHeroSection />
        <StepsSection />
        <BenefitsSection />
        <CTABannerSection />
        <FAQSection
          faqs={schoolsFaqs}
          bgColor="#eef3fc"
          id="faq"
        />
        <TestimonialQuoteSection />
      </main>
      <Footer />
    </>
  );
}
