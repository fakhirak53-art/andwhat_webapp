import Image from "next/image";

export default function DailyVibeCheckSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbf8f1] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 100%, rgba(240, 229, 199, 0.58) 0%, rgba(240, 229, 199, 0.58) 21%, transparent 21.25%, transparent 30%, rgba(240, 229, 199, 0.4) 30.25%, rgba(240, 229, 199, 0.4) 39%, transparent 39.25%, transparent 48%, rgba(240, 229, 199, 0.28) 48.25%, rgba(240, 229, 199, 0.28) 57%, transparent 57.25%, transparent 66%, rgba(240, 229, 199, 0.18) 66.25%, rgba(240, 229, 199, 0.18) 75%, transparent 75.25%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 md:px-10 lg:px-16">
        <div className="text-center">
          <h2 className="text-[28px] font-black uppercase leading-tight tracking-wide text-[#0a1628] sm:text-[36px] lg:text-[44px]">
            Your <span className="text-[#0048AE]">Daily Vibe Check</span>
          </h2>
          <p className="mt-3 text-[14px] text-[#6b7280] sm:text-[15px]">
            A quick boost to keep you grounded.
          </p>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-[260px] sm:mt-14 sm:max-w-[320px] lg:max-w-[360px]">
          <Image
            src="/images/new/mobileImage.png"
            alt="Daily vibe check wellbeing prompt displayed on a mobile screen"
            width={503}
            height={819}
            className="h-auto w-full drop-shadow-[0_22px_40px_rgba(10,22,40,0.08)]"
          />
        </div>
      </div>
    </section>
  );
}
