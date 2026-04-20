import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { marketingNavLinks } from "@/lib/marketing-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — andwhat",
  description:
    "Get in touch with the AndWhat team for questions about students and schools.",
};

export default function ContactPage() {
  return (
    <>
      <Header
        navLinks={[...marketingNavLinks]}
        activeHref="/contact"
        registerHref="/login"
        registerLabel="Register Now"
      />
      <main>
        <ContactHeroSection />
        <ContactInfoSection />
      </main>
      <Footer />
    </>
  );
}
