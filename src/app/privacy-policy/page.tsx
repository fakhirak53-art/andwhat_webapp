import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { BrandName } from "@/components/ui/BrandName";
import { PageShell } from "@/components/ui/PageShell";
import { marketingNavLinks } from "@/lib/marketing-nav";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Andwhat Extension | andwhat",
  description:
    "How the Andwhat Chrome extension collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header
        navLinks={[...marketingNavLinks]}
        registerHref="/login"
        registerLabel="Register Now"
      />
      <main className="min-h-screen bg-[#faf7f2] pt-[72px]">
        <PageShell maxWidth="md" className="py-12 sm:py-16 lg:py-20">
          <article className="text-[#0a1628]">
            <p className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0048AE] mb-3">
              Legal
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0a1628] tracking-tight mb-2">
              Privacy Policy for <BrandName /> Extension
            </h1>
            <p className="text-sm text-[#0a1628]/70 mb-8">
              <span className="font-semibold text-[#0a1628]">Effective Date:</span>{" "}
              12 April 2026
            </p>

            <div className="space-y-6 text-[15px] leading-relaxed text-[#0a1628]/90">
              <p>
                Thank you for using <BrandName />, a Chrome extension developed to help
                students manage their online learning environment by providing quizzes, daily
                messages, and website restrictions. This Privacy Policy outlines how we
                collect, use, and protect your personal data. Please read it carefully.
              </p>

              <section aria-labelledby="section-1">
                <h2 id="section-1" className="text-lg font-bold text-[#0a1628] mb-3">
                  1. Information We Collect
                </h2>
                <p className="mb-3">
                  When you use the <BrandName /> extension, we collect the following types of
                  information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      Authentication Information:
                    </span>{" "}
                    We use Google OAuth for authentication. When you sign in with Google, we
                    collect the email address and user ID from your Google account. This
                    information is used to authenticate and identify you within the
                    extension.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">Student Information:</span>{" "}
                    We collect a unique student ID and a student hash to associate your data
                    with your account, as well as your school code and year level. This is
                    used to personalize your learning experience and track your progress in
                    quizzes.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">User Activity:</span> The
                    extension monitors the websites you visit to determine whether they are
                    educational or not. Based on the websites you visit, the extension will
                    either block or allow access based on pre-defined rules.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      Device and Browser Information:
                    </span>{" "}
                    The extension may collect data about your device and browser for the
                    purpose of enhancing your experience and improving the extension&apos;s
                    functionality. This data may include your device type, operating system,
                    browser version, and IP address.
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-2">
                <h2 id="section-2" className="text-lg font-bold text-[#0a1628] mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="mb-3">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold text-[#0a1628]">User Authentication:</span>{" "}
                    To securely authenticate users via Google Sign-In and associate the
                    user&apos;s account with their unique student ID.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      Personalized Experience:
                    </span>{" "}
                    To provide a personalized learning experience by offering daily messages,
                    quizzes, and blocking non-educational websites.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      Usage Data for Extension Functionality:
                    </span>{" "}
                    To monitor which websites are visited and apply content restrictions
                    based on the rules set within the extension.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      Improvement of Services:
                    </span>{" "}
                    To improve the functionality of the extension, fix bugs, and enhance
                    features based on user feedback.
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-3">
                <h2 id="section-3" className="text-lg font-bold text-[#0a1628] mb-3">
                  3. Data Storage
                </h2>
                <p>
                  All personal data is stored locally on your device through Chrome&apos;s
                  local storage. This includes authentication tokens, student IDs, and
                  website rules. We do not store your personal data on our servers or share
                  it with third parties.
                </p>
              </section>

              <section aria-labelledby="section-4">
                <h2 id="section-4" className="text-lg font-bold text-[#0a1628] mb-3">
                  4. Sharing Your Information
                </h2>
                <p className="mb-3">
                  We do not sell, rent, or trade your personal data to third parties. Your
                  information is only shared in the following situations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold text-[#0a1628]">With Google:</span> When
                    you authenticate using Google OAuth, the Google services handle your login
                    process, and the information shared with Google is governed by their
                    privacy policies.
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">
                      For Legal Requirements:
                    </span>{" "}
                    We may share your information to comply with applicable legal obligations
                    or protect our rights.
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-5">
                <h2 id="section-5" className="text-lg font-bold text-[#0a1628] mb-3">
                  5. Cookies and Tracking Technologies
                </h2>
                <p>
                  The extension does not use cookies or any tracking technologies. We only
                  collect the data necessary for the functionality of the extension and do
                  not track your behavior across the web outside of what is required for the
                  operation of the extension.
                </p>
              </section>

              <section aria-labelledby="section-6">
                <h2 id="section-6" className="text-lg font-bold text-[#0a1628] mb-3">
                  6. Security
                </h2>
                <p>
                  We take reasonable precautions to protect your personal information from
                  unauthorized access, use, or disclosure. However, please be aware that no
                  data transmission over the internet or electronic storage method is 100%
                  secure. While we strive to protect your information, we cannot guarantee
                  its absolute security.
                </p>
              </section>

              <section aria-labelledby="section-7">
                <h2 id="section-7" className="text-lg font-bold text-[#0a1628] mb-3">
                  7. Your Rights
                </h2>
                <p className="mb-3">
                  You have the right to access, update, or delete the information we store
                  locally on your device through the Chrome extension. You can do so through
                  the extension&apos;s settings or by clearing your browser&apos;s local
                  storage.
                </p>
                <p>
                  If you no longer wish to use the extension, you can remove it from your
                  browser. This will also remove any locally stored data associated with the
                  extension.
                </p>
              </section>

              <section aria-labelledby="section-8">
                <h2 id="section-8" className="text-lg font-bold text-[#0a1628] mb-3">
                  8. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. If we make significant
                  changes, we will notify you through the extension or via other appropriate
                  communication channels. We encourage you to review this Privacy Policy
                  periodically to stay informed about how we are protecting your data.
                </p>
              </section>

              <section aria-labelledby="section-9">
                <h2 id="section-9" className="text-lg font-bold text-[#0a1628] mb-3">
                  9. Contact Us
                </h2>
                <p className="mb-3">
                  If you have any questions or concerns about this Privacy Policy or the data
                  we collect, please contact us at:
                </p>
                <ul className="list-none space-y-2 pl-0">
                  <li>
                    <span className="font-semibold text-[#0a1628]">Email:</span>{" "}
                    <a
                      href="mailto:admin@andwhat.au"
                      className="text-[#0048AE] underline underline-offset-2 hover:text-[#003d99]"
                    >
                      admin@andwhat.au
                    </a>
                  </li>
                  <li>
                    <span className="font-semibold text-[#0a1628]">Website:</span>{" "}
                    <Link
                      href="https://andwhat.au/"
                      className="text-[#0048AE] underline underline-offset-2 hover:text-[#003d99]"
                    >
                      https://andwhat.au/
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </article>
        </PageShell>
      </main>
      <Footer />
    </>
  );
}
