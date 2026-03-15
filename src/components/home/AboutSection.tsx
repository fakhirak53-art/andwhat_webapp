import SectionWrapper from "./SectionWrapper";

const activeUserBars = [
  { color: "bg-[#0048AE]", width: "w-full", avatarBg: "bg-blue-200" },
  { color: "bg-purple-400", width: "w-3/4", avatarBg: "bg-purple-200" },
  { color: "bg-green-400", width: "w-1/2", avatarBg: "bg-green-200" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-gray-900 py-14 sm:py-20 lg:py-24">
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left text */}
          <div>
            <h2 className="text-[34px] sm:text-[44px] lg:text-[58px] font-extrabold text-white leading-tight mb-6 sm:mb-8">
              About Easystuff
            </h2>
            <div className="space-y-4 sm:space-y-5 text-[15px] sm:text-[17px] font-normal text-gray-300 leading-relaxed">
              <p>
                Easystuff was created to make studying simpler and more effective
                for students.
              </p>
              <p>
                Many students spend hours reading notes but still struggle to
                remember important information. Easystuff solves this problem by
                encouraging active learning through quizzes and scheduled
                revision.
              </p>
              <p>
                By combining technology with proven learning science, Easystuff
                helps students remember more, improve their understanding, and
                build confidence in their studies.
              </p>
              <p>
                Our mission is to make learning smarter, easier, and{" "}
                <span className="text-[#54DBFE]">
                  more effective for both teachers and students
                </span>
              </p>
            </div>
          </div>

          {/* Right image + floating card */}
          <div className="relative">
            {/* Active users floating card */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-6 z-10 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl min-w-[160px] sm:min-w-[200px]">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-4">
                Active Users
              </p>
              <div className="flex flex-col gap-3">
                {activeUserBars.map((bar, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      <img
                        src={`/images/student${i + 1}.png`}
                        alt="active user"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div
                      className={`h-2 ${bar.color} ${bar.width} rounded-full`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main image */}
            <div className="w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-3xl overflow-hidden bg-gray-700 shadow-xl">
              <img
                src="/images/aboutEasystuff.jpg"
                alt="Teacher in classroom"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
