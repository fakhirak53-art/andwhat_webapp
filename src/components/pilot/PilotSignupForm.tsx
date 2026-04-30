"use client";

import { useState } from "react";
import Link from "next/link";
import { submitPilotSignup, type PilotSignupState } from "@/app/actions/pilot-signup";

const INITIAL_STATE: PilotSignupState = { success: false };

export default function PilotSignupForm() {
  const [state, setState] = useState<PilotSignupState>(INITIAL_STATE);
  const [numClasses, setNumClasses] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setState(INITIAL_STATE);
    const result = await submitPilotSignup(formData);
    setState(result);
    setIsSubmitting(false);
  }

  if (state.success) {
    return (
      <div className="rounded-2xl border border-[#d7e0ef] bg-white p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#0a1628]">Success</p>
        <h2 className="mt-1 text-2xl font-black text-[#0a1628] uppercase tracking-tight">
          Your pilot is active
        </h2>
        <p className="mt-4 text-sm text-[#4b5563]">
          Your school code: <span className="font-semibold text-[#0a1628]">{state.schoolCode}</span>
        </p>
        <div className="mt-4 rounded-xl bg-[#f6f8fc] p-4">
          <p className="text-sm font-semibold text-[#0a1628]">Teacher codes</p>
          <ul className="mt-2 space-y-2 text-sm text-[#374151]">
            {(state.teacherCodes ?? []).map((entry) => (
              <li key={entry.code}>
                {entry.label}: <span className="font-semibold text-[#0a1628]">{entry.code}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-sm text-[#4b5563]">
          Next step: use these codes to onboard your teachers and students.
        </p>
        <div className="mt-4">
          <Link
            href="/teacher/register"
            className="inline-flex items-center rounded-xl border border-[#d7e0ef] px-4 py-2 text-sm font-semibold text-[#0048AE] hover:bg-[#f6f8fc]"
          >
            Open teacher onboarding
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-[#e5e7eb] rounded-xl px-4 py-3 text-[14px] text-[#0a1628] placeholder-[#9ca3af] bg-white focus:outline-none focus:ring-2 focus:ring-[#0048AE]/25 focus:border-[#0048AE] transition";

  return (
    <div className="rounded-2xl border border-[#d7e0ef] bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="font-black uppercase tracking-tight text-[#0a1628] text-[clamp(18px,2vw,24px)]">
        School Pilot Program
      </h2>
      <p className="mt-2 text-sm text-[#6b7280]">
        Join our 1-month distraction-blocking pilot.
      </p>

      <form action={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="school_name" className="block text-[13px] font-semibold text-[#374151] mb-2">
              School Name
            </label>
            <input id="school_name" name="school_name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="district" className="block text-[13px] font-semibold text-[#374151] mb-2">
              District
            </label>
            <input id="district" name="district" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="contact_name" className="block text-[13px] font-semibold text-[#374151] mb-2">
              Contact Name
            </label>
            <input id="contact_name" name="contact_name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact_email" className="block text-[13px] font-semibold text-[#374151] mb-2">
              Contact Email
            </label>
            <input id="contact_email" type="email" name="contact_email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact_phone" className="block text-[13px] font-semibold text-[#374151] mb-2">
              Contact Phone
            </label>
            <input id="contact_phone" name="contact_phone" className={inputClass} />
          </div>
        </div>

        <div>
          <p className="block text-[13px] font-semibold text-[#374151] mb-2">Number of Classes</p>
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((value) => (
              <label key={value} className="inline-flex items-center gap-2 text-sm text-[#374151]">
                <input
                  type="radio"
                  name="num_classes"
                  value={value}
                  checked={numClasses === value}
                  onChange={() => setNumClasses(value)}
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="class_1_label" className="block text-[13px] font-semibold text-[#374151] mb-2">
              Class 1 Label
            </label>
            <input id="class_1_label" name="class_1_label" className={inputClass} placeholder="Period 2 - Biology" />
          </div>
          {numClasses >= 2 ? (
            <div>
              <label htmlFor="class_2_label" className="block text-[13px] font-semibold text-[#374151] mb-2">
                Class 2 Label
              </label>
              <input id="class_2_label" name="class_2_label" className={inputClass} placeholder="Period 5 - Chemistry" />
            </div>
          ) : null}
          {numClasses >= 3 ? (
            <div>
              <label htmlFor="class_3_label" className="block text-[13px] font-semibold text-[#374151] mb-2">
                Class 3 Label
              </label>
              <input id="class_3_label" name="class_3_label" className={inputClass} placeholder="Class 3" />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <label className="inline-flex items-start gap-2 text-sm text-[#374151]">
            <input type="checkbox" name="terms_accepted" className="mt-1" required />
            <span>I agree to the pilot terms and data policy</span>
          </label>

          {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="block w-full sm:w-auto bg-[#0048AE] text-white px-6 py-3 rounded-xl text-[15px] font-semibold hover:bg-[#003d99] disabled:opacity-60 disabled:pointer-events-none transition-colors"
          >
            {isSubmitting ? "Registering..." : "Register School"}
          </button>
        </div>
      </form>
    </div>
  );
}
