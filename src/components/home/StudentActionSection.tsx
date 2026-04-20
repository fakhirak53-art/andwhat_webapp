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
    <section className="relative overflow-hidden ">
      <svg width="1920" height="565" viewBox="0 0 1920 565" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 135.505C0 135.505 317 -26.2602 875 116.76C1433 259.78 1920 0 1920 0V413.034C1920 413.034 1576.5 618.535 918 515.785C259.5 413.034 0 565 0 565V135.505Z" fill="#F2F7FF" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center z-10 w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 w-full max-w-[400px] lg:max-w-[1418px] mx-auto lg:gap-44 gap-10 md:grid-cols-3 md:gap-8">
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

