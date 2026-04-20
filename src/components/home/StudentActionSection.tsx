import Link from "next/link";

const actions = [
  {
    label: "Download Extension",
    href: "/login",
  },
  {
    label: "Teacher Upload Questions",
    href: "/admin/login",
  },
  {
    label: "Request A School Pilot",
    href: "/schools",
  },
];

export default function StudentActionSection() {
  return (
    <section className="relative overflow-hidden bg-[#eaf2fd] py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[72px] w-full sm:h-[96px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,110 C260,20 500,20 720,70 C950,120 1190,120 1440,30 L1440,0 L0,0 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[72px] w-full sm:h-[96px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C280,10 520,10 720,55 C960,110 1200,110 1440,40 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group relative flex min-h-[72px] items-center justify-center overflow-hidden rounded-[14px] border border-[#dde5f0] bg-white px-6 py-5 text-center text-[13px] font-black uppercase tracking-[0.04em] text-[#212734] shadow-[0_16px_30px_rgba(10,22,40,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="absolute inset-y-0 left-0 w-1.5 bg-[#2440a4]" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}