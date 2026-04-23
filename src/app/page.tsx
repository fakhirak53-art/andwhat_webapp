import DailyVibeCheckSection from "@/components/home/DailyVibeCheckSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import ForEducatorsParentsSection from "@/components/home/ForEducatorsParentsSection";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PowerfulFeaturesSection from "@/components/home/PowerfulFeaturesSection";
import QuoteSection from "@/components/home/QuoteSection";
import StudentActionSection from "@/components/home/StudentActionSection";

const homeNavLinks = [
  { label: "For Students", href: "/" },
];

export default function HomePage() {
  return (
    <>
      <Header navLinks={homeNavLinks} activeHref="/" variant="student-home" />
      <main>
        <HeroSection />
        <QuoteSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <DailyVibeCheckSection />
        <ForEducatorsParentsSection />
        <StudentActionSection />
        <FAQSection variant="home" />
      </main>
      <Footer />
    </>
  );
}
