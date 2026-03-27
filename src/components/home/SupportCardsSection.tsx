const cards = [
  {
    title: "Student Guide",
    description: "How to set up your extension and start learning.",
    icon: (
      <svg className="w-12 h-12 text-[#0048AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Troubleshooting",
    description: "Common fixes for the extension and login issues.",
    icon: (
      <svg className="w-12 h-12 text-[#0048AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Privacy & Safety",
    description: "How we protect your data and meet Australian standards.",
    icon: (
      <svg className="w-12 h-12 text-[#0048AE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function SupportCardsSection() {
  return (
    <section className=" relative overflow-hidden bg-red-500 ">
      
        <div className=" absolute left-0 top-0 w-full h-full  bg-red-500 " >
          <img
            src="/images/new/backgroundVector.png"
            alt="Support background"
            className="w-full h-full object-cover opacity-100"
          />
        </div>

      {/* ✅ Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-20 sm:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm border-l-4 border-[#0048AE]"
            >
              <div className="mb-5">{card.icon}</div>
              <h3 className="text-[17px] font-black text-[#0a1628] mb-3">{card.title}</h3>
              <p className="text-[14px] text-[#6b7280] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

     
    </section>
  );
}