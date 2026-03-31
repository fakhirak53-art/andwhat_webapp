import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FAQSection, { FAQ } from "@/components/home/FAQSection";
import WellbeingHeroSection from "@/components/wellbeing/WellbeingHeroSection";
import EvidenceBasedSection from "@/components/wellbeing/EvidenceBasedSection";
import HowToGetStartedSection from "@/components/wellbeing/HowToGetStartedSection";
import NDISFundingSection from "@/components/wellbeing/NDISFundingSection";
import DailySupportsSection from "@/components/wellbeing/DailySupportsSection";
import WellbeingTestimonialSection from "@/components/wellbeing/WellbeingTestimonialSection";
import DailyGoalsCTASection from "@/components/wellbeing/DailyGoalsCTASection";

const wellbeingNavLinks = [
  { label: "For Students", href: "/" },
  { label: "For Schools & RTOs", href: "/schools" },
  { label: "For Wellbeing & NDIS", href: "/wellbeing" },
];

const wellbeingFaqs: FAQ[] = [
  {
    question: "Is AndWhat Covered By My NDIS Plan?",
    answer:
      "Yes. AndWhat Daily Messaging can be funded under Improved Daily Living or Social and Community Participation categories in your NDIS plan. We recommend speaking to your Support Coordinator or Plan Manager for confirmation.",
    defaultOpen: true,
  },
  {
    question: "How Does The Messaging Support Work?",
    answer:
      "You receive personalised, evidence-based messages triggered by your daily digital habits—such as unlocking your phone or visiting certain websites. These messages provide practical strategies aligned to your NDIS goals.",
    defaultOpen: true,
  },
  {
    question: "Is my information kept private and secure?",
    answer:
      "Absolutely. All interactions are completely confidential. Your data is encrypted, stored securely in Australia, and never shared with third parties. We take your privacy seriously.",
  },
  {
    question: "Can I customise the type of support I receive?",
    answer:
      "Yes. During setup you choose your support themes—such as emotional regulation, daily routine management, or building confidence. Your messaging is then tailored to those specific areas.",
  },
  {
    question: "Do I need any special equipment or software?",
    answer:
      "No. All you need is a smartphone or a computer with a web browser. There is nothing additional to install beyond the Chrome extension if you want website-triggered support.",
  },
  {
    question: "How do I get started as an NDIS provider?",
    answer:
      "Simply click the 'Request Information For NDIS Providers' button on this page. Our team will get in touch to walk you through setup, onboarding, and how to integrate AndWhat into your participants' plans.",
  },
];

export default function WellbeingPage() {
  return (
    <>
      <Header
        navLinks={wellbeingNavLinks}
        activeHref="/wellbeing"
        registerHref="/login"
        registerLabel="Register Now"
      />
      <main>
        <WellbeingHeroSection />
        <EvidenceBasedSection />
        <HowToGetStartedSection />
        <NDISFundingSection />
        <DailySupportsSection />
        <DailyGoalsCTASection />
        <FAQSection
          faqs={wellbeingFaqs}
          bgColor="#eef3fc"
          id="faq"
        />
        <WellbeingTestimonialSection />
      </main>
      <Footer />
    </>
  );
}
