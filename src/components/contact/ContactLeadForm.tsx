"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

type FormStatus = "idle" | "error";

export default function ContactLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedSubject = subject.trim();
      const trimmedMessage = message.trim();

      if (!trimmedName || !trimmedEmail || !trimmedMessage) {
        setStatus("error");
        setError("Please fill in your name, email, and message.");
        return;
      }
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setStatus("error");
        setError("Please enter a valid email address.");
        return;
      }

      setStatus("idle");
      setError("");

      const line = "\n";
      const subj =
        trimmedSubject ||
        `Enquiry from ${trimmedName} via andwhat contact form`;
      const body = [
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        "",
        trimmedMessage,
      ].join(line);

      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    },
    [name, email, subject, message],
  );

  return (
    <div
      id="contact-form"
      className="rounded-2xl border border-[#ede8df] bg-white p-6 sm:p-8 shadow-sm"
    >
      <h2 className="text-lg font-bold text-[#0a1628] mb-1">
        Send us a message
      </h2>
      <p className="text-[13px] text-[#6b7280] mb-6">
        Your email app will open with your message ready to send. You can edit
        it before sending.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-[13px] font-semibold text-[#0a1628] mb-1.5"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setError("");
              }
            }}
            className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#0a1628] outline-none transition-shadow focus:border-[#0048AE] focus:ring-2 focus:ring-[#0048AE]/25"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-[13px] font-semibold text-[#0a1628] mb-1.5"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setError("");
              }
            }}
            className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#0a1628] outline-none transition-shadow focus:border-[#0048AE] focus:ring-2 focus:ring-[#0048AE]/25"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-[13px] font-semibold text-[#0a1628] mb-1.5"
          >
            Subject{" "}
            <span className="font-normal text-[#9ca3af]">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#0a1628] outline-none transition-shadow focus:border-[#0048AE] focus:ring-2 focus:ring-[#0048AE]/25"
            placeholder="What is this about?"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-[13px] font-semibold text-[#0a1628] mb-1.5"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setError("");
              }
            }}
            className="w-full resize-y min-h-[120px] rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#0a1628] outline-none transition-shadow focus:border-[#0048AE] focus:ring-2 focus:ring-[#0048AE]/25"
            placeholder="How can we help?"
          />
        </div>

        {error ? (
          <p className="text-[13px] text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0048AE] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#003d99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0048AE] focus-visible:ring-offset-2"
        >
          Open in email app
          <svg
            className="w-4 h-4"
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
        </button>
      </form>

      <p className="mt-6 text-[12px] text-[#9ca3af] leading-relaxed">
        Prefer not to use a form? Email us directly at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-[#0048AE] hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        . For product help, you can also check the{" "}
        <Link
          href="/#faq"
          className="font-semibold text-[#0048AE] hover:underline"
        >
          FAQ on the home page
        </Link>
        .
      </p>
    </div>
  );
}
