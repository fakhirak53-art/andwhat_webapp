import { BrandName } from "@/components/ui/BrandName";
import { CONTACT_EMAIL } from "@/lib/contact";
import ContactLeadForm from "./ContactLeadForm";

export default function ContactInfoSection() {
  return (
    <section className="bg-[#faf7f2] border-t border-[#ede8df]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <p className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0048AE] mb-3">
              Contact
            </p>
            <h2 className="font-black uppercase tracking-tight text-[#0a1628] text-[clamp(22px,2.5vw,32px)] leading-tight mb-4">
              Talk to the <BrandName /> team
            </h2>
            <p className="text-[15px] text-[#4b5563] leading-relaxed mb-8 max-w-md">
              Whether you&apos;re a student, educator, RTO, or NDIS participant,
              we&apos;re happy to answer questions about{" "}
              <BrandName tone="inherit" /> and how it fits your goals.
            </p>

            <ul className="space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <title>Email</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-[16px] font-bold text-[#0a1628] hover:text-[#0048AE] transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a1628] text-white">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <title>Clock</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">
                    Response time
                  </p>
                  <p className="text-[15px] text-[#374151] leading-relaxed">
                    We typically reply within one to two business days
                    (Australian Eastern Time).
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <ContactLeadForm />
        </div>
      </div>
    </section>
  );
}
