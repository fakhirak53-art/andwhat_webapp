import { BrandName } from "@/components/ui/BrandName";
import { CONTACT_EMAIL } from "@/lib/contact";

import SectionWrapper from "./SectionWrapper";
import SectionHeader from "./SectionHeader";

export default function ContactSection() {
  return (
    <section id="contact" className="py-14 sm:py-20 bg-white">
      <SectionWrapper>
        <div className="mb-10 sm:mb-14 text-center">
          <SectionHeader
            title={<>Get in Touch with <BrandName /></>}
            subtitle="If you have any questions or would like to learn more about Easystuff, please feel free to contact us."
            centered
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — Form card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0048AE]/30 focus:border-[#0048AE] transition"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0048AE]/30 focus:border-[#0048AE] transition"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0048AE]/30 focus:border-[#0048AE] transition"
              />
            </div>

            <div className="mb-7">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us more about your inquiry..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0048AE]/30 focus:border-[#0048AE] transition resize-none"
              />
            </div>

            <button
              type="button"
              className="w-full bg-[#0048AE] text-white py-4 rounded-xl text-[16px] font-semibold hover:bg-[#003d99] transition-colors"
            >
              Send Message
            </button>
          </div>

          {/* Right — Contact info */}
          <div className="flex flex-col gap-8 pt-4">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#0048AE]/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#0048AE]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900 mb-1">Email Us</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[16px] font-semibold text-[#0048AE] hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-[#0048AE]/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#0048AE]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold text-gray-900 mb-1">Call Us</p>
                <a
                  href="tel:8434967759"
                  className="text-[16px] font-semibold text-[#0048AE] hover:underline"
                >
                  843-496-7759
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4">
                Follow Our Journey
              </p>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                {/* Twitter/X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" strokeWidth={0} />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
