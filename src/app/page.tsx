import DailyVibeCheckSection from "@/components/home/DailyVibeCheckSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import ForEducatorsParentsSection from "@/components/home/ForEducatorsParentsSection";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PowerfulFeaturesSection from "@/components/home/PowerfulFeaturesSection";
import QuoteSection from "@/components/home/QuoteSection";
import SupportCardsSection from "@/components/home/SupportCardsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { marketingNavLinks } from "@/lib/marketing-nav";

export default function HomePage() {
  return (
    <>
      <Header navLinks={[...marketingNavLinks]} activeHref="/" />
      <main>
        <HeroSection />
        <QuoteSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <DailyVibeCheckSection />
        <ForEducatorsParentsSection />
        <FAQSection />
        <TestimonialsSection />
        <SupportCardsSection />
      </main>
      <Footer />
    </>
  );
}
