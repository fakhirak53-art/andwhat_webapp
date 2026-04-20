"use client";

import { useState } from "react";

export default function ContactLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        hint?: string;
        debug?: string;
      };

      if (!res.ok) {
        setStatus("error");
        const base =
          data.error ??
          (res.status === 503
            ? "Sending is temporarily unavailable. Please try again later or email us directly."
            : "Something went wrong. Please try again.");
        const hint =
          typeof data.hint === "string" && data.hint.length > 0
            ? ` ${data.hint}`
            : "";
        const detail =
          typeof data.debug === "string" && data.debug.length > 0
            ? ` Technical detail: ${data.debug}`
            : "";
        setErrorMessage(`${base}${hint}${detail}`);
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  const inputClass =
    "w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[14px] text-[#0a1628] placeholder-[#9ca3af] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048AE]/25 focus:border-[#0048AE] transition";

  if (status === "success") {
    return (
      <div
        id="contact-form"
        className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-sm"
      >
        <p className="text-[15px] font-bold text-[#0a1628] mb-2">
          Message sent
        </p>
        <p className="text-[14px] text-[#4b5563] leading-relaxed mb-6">
          Thanks for reaching out. We&apos;ve emailed you a confirmation, and
          our team will reply soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-[14px] font-semibold text-[#0048AE] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div
      id="contact-form"
      className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-sm"
    >
      <h3 className="font-black uppercase tracking-tight text-[#0a1628] text-[clamp(18px,2vw,22px)] mb-2">
        Send a message
      </h3>
      <p className="text-[14px] text-[#6b7280] mb-6">
        Share a few details and we&apos;ll follow up by email.
      </p>

      <form onSubmit={onSubmit} className="space-y-5" autoComplete="on">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-[13px] font-semibold text-[#374151] mb-2"
            >
              Full name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-[13px] font-semibold text-[#374151] mb-2"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-[13px] font-semibold text-[#374151] mb-2"
          >
            Subject{" "}
            <span className="font-normal text-[#9ca3af]">(optional)</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-[13px] font-semibold text-[#374151] mb-2"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={8000}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClass} resize-none min-h-[140px]`}
            placeholder="Tell us a bit about your question or request..."
          />
          <p className="mt-1.5 text-[12px] text-[#9ca3af]">
            At least 10 characters.
          </p>
        </div>

        {errorMessage ? (
          <p className="text-[14px] text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#0048AE] text-white py-3.5 rounded-xl text-[15px] font-semibold hover:bg-[#003d99] disabled:opacity-60 disabled:pointer-events-none transition-colors"
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
