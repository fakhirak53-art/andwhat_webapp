export default function QuoteSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-screen-md mx-auto px-6 md:px-10 text-center">
        {/* Opening quote mark */}
        <div className="flex justify-center mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 8C6.48 8 2 12.48 2 18v12h10V18H8c0-2.21 1.79-4 4-4V8zm20 0c-5.52 0-10 4.48-10 10v12h10V18h-4c0-2.21 1.79-4 4-4V8z"
              fill="#c8d8ec"
            />
          </svg>
        </div>

        <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-normal text-[#374151] leading-relaxed">
          Andwhat is here to make remembering what you learn in class way easy.
          When you sit in class it&#39;s easy to switch off, that&#39;s when the lessons
          become meaningless. Andwhat makes remembering lessons easy so you
          don&#39;t have to panic or stress before exams.
        </p>
      </div>
    </section>
  );
}
