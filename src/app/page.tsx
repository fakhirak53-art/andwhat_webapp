import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import PowerfulFeaturesSection from "@/components/home/PowerfulFeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import WhyStudentsSection from "@/components/home/WhyStudentsSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustedBySection />
        <WhyStudentsSection />
        <PowerfulFeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}