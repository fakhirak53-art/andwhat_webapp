import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import PilotSignupForm from "@/components/pilot/PilotSignupForm";

const navLinks = [
  { label: "For Students", href: "/" },
  { label: "For Schools & RTOs", href: "/schools" },
  { label: "For Wellbeing & NDIS", href: "/wellbeing" },
];

export default function PilotSignupPage() {
  return (
    <>
      <Header
        navLinks={navLinks}
        activeHref="/schools"
        registerHref="/pilot/signup"
        registerLabel="Pilot Signup"
      />
      <main className="bg-[#eef3fc] py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-16 lg:py-9">
          <PilotSignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
