const conversations = [
  {
    header: { initials: "EA", name: "Anchor Support", time: "8:30 AM TRIGGER" },
    messages: [
      { from: "support", text: "G\u2019day Alex! Big day at uni today. How\u2019s the sensory load feeling this morning?" },
      { from: "user", text: "Feeling a bit shaky. The train was really loud." },
      { from: "support", text: "Totally get that. Do you have your noise-cancelling headphones? Let\u2019s take 2 min for a grounding exercise before you walk into class." },
    ],
  },
  {
    header: { initials: "EA", name: "Anchor Support", time: "8:30 AM TRIGGER" },
    messages: [
      { from: "support", text: "Hey Leo, just checking in. Remember that break you planned? Did you manage to grab some water?" },
      { from: "user", text: "Almost forgot. Lost track of time in the lab." },
      { from: "support", text: "Good catch. Step away for 5 mins now. Your brain will thank you for the reset!" },
    ],
  },
  {
    header: { initials: "EA", name: "Anchor Support", time: "8:30 AM TRIGGER" },
    messages: [
      { from: "support", text: "Evening! You\u2019ve navigated the whole day. What\u2019s one thing that went okay today?" },
      { from: "user", text: "Managed to submit my draft! I was so stressed about it." },
      { from: "support", text: "That\u2019s huge! Massive win. Time to switch off the \u2018study brain\u2019 now and get some rest." },
    ],
  },
];

function PhoneMockup({ convo }: { convo: (typeof conversations)[0] }) {
  return (
    <div
      className="relative mx-auto flex flex-col"
      style={{
        width: "100%",
        maxWidth: "300px",
        aspectRatio: "9 / 17",
        backgroundColor: "#1a1a1a",
        borderRadius: "32px",
        padding: "10px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Inner white screen */}
      <div className="flex-1 bg-white rounded-[22px] overflow-hidden flex flex-col">
        {/* Status / notch area */}
        <div className="h-6 bg-white" />

        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#0048AE" }}
          >
            {convo.header.initials}
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0a1628] leading-none">{convo.header.name}</p>
            <p className="text-[9px] text-[#9ca3af] leading-none mt-0.5">{convo.header.time}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3 py-2 flex flex-col gap-2.5 overflow-hidden">
          {convo.messages.map((msg, i) =>
            msg.from === "support" ? (
              <div key={i} className="self-start max-w-[85%]">
                <p
                  className="text-[11px] leading-snug px-3 py-2 rounded-xl"
                  style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                >
                  {msg.text}
                </p>
              </div>
            ) : (
              <div key={i} className="self-end max-w-[80%]">
                <p
                  className="text-[11px] leading-snug px-3 py-2 rounded-xl text-white"
                  style={{ backgroundColor: "#0048AE" }}
                >
                  {msg.text}
                </p>
              </div>
            )
          )}
        </div>

        {/* Bottom bar indicator */}
        <div className="flex items-center justify-center pb-2 pt-3">
          <div className="w-[100px] h-[4px] rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default function DailySupportsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "#e8eff8" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="font-black uppercase tracking-tight"
            style={{ color: "#0a1628", fontSize: "clamp(26px, 4vw, 46px)" }}
          >
            What{" "}
            <span style={{ color: "#0048AE" }}>Daily Supports</span>{" "}
            Looks Like
          </h2>
        </div>

        {/* 3 phone mockups */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {conversations.map((convo, idx) => (
            <PhoneMockup key={idx} convo={convo} />
          ))}
        </div>
      </div>
    </section>
  );
}
