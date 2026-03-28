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

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <QuoteSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <ForEducatorsParentsSection />
        <SupportCardsSection />
        <FAQSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}