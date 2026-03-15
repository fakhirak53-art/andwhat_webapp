interface TestimonialCardProps {
  name: string;
  handle: string;
  content: string;
  avatar: string;
}

export default function TestimonialCard({ name, handle, content, avatar }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-900 leading-none mb-1">{name}</p>
          <p className="text-[13px] text-gray-400">{handle}</p>
        </div>
      </div>
      <p className="text-[14px] text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}
