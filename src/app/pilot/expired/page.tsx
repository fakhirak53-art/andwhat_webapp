import Link from "next/link";

export default function PilotExpiredPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-white p-8 text-center">
        <p className="text-xs uppercase tracking-widest text-muted font-semibold">
          Pilot status
        </p>
        <h1 className="mt-2 text-3xl font-serif text-ink">Pilot access ended</h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Your school pilot period has expired. Contact us to reactivate access or
          move to a full plan.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-[#162340]"
          >
            Contact us
          </Link>
          <Link
            href="/schools"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-ink hover:bg-[#faf7f2]"
          >
            Back to schools page
          </Link>
        </div>
      </div>
    </main>
  );
}
