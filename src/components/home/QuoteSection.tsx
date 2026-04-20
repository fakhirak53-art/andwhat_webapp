export default function QuoteSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1100px] px-6 text-center md:px-10 lg:px-16">
        <div className="mb-6 flex justify-center sm:mb-8">
          <svg className="h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 8C6.48 8 2 12.48 2 18v12h10V18H8c0-2.21 1.79-4 4-4V8zm20 0c-5.52 0-10 4.48-10 10v12h10V18h-4c0-2.21 1.79-4 4-4V8z"
              fill="#d6e2f5"
            />
          </svg>
        </div>

        <p className="mx-auto max-w-[980px] text-[18px] leading-[1.6] text-[#30384a] sm:text-[24px] lg:text-[32px]">
          Andwhat is here to make remembering what you learn in class way easy.
          When you sit in class it&#39;s easy to switch off, that&#39;s when the lessons
          become meaningless. Andwhat makes remembering lessons easy...so you
          don&#39;t have to panic or stress before exams.
        </p>
      </div>
    </section>
  );
}
