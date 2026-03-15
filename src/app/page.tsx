import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import WhyStudentsSection from "@/components/home/WhyStudentsSection";
import PowerfulFeaturesSection from "@/components/home/PowerfulFeaturesSection";
import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";

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