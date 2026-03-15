interface FeatureRowProps {
  title: string;
  description: string;
  image: string;
  imageFirst?: boolean;
}

const ArrowIcon = ({ flipped = false }: { flipped?: boolean }) => (
  <div
    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0048AE] flex items-center justify-center flex-shrink-0 ${
      flipped ? "rotate-180" : ""
    }`}
  >
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </div>
);

export default function FeatureRow({ title, description, image, imageFirst = true }: FeatureRowProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Mobile layout: image always on top, text below */}
      <div className="flex flex-col sm:hidden">
        <div className="w-full h-[200px] bg-[#0D3283] overflow-hidden p-4">
          <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className="py-5 px-5">
          <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
          <p className="text-[14px] font-normal text-gray-500 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Desktop layout: controlled by imageFirst prop */}
      <div className="hidden sm:flex items-stretch">
        {imageFirst ? (
          <>
            <div className="w-[42%] min-h-[190px] bg-[#0D3283] flex-shrink-0 overflow-hidden p-8 max-h-96">
              <img src={image} alt={title} className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center px-5">
              <ArrowIcon />
            </div>
            <div className="flex-1 py-6 pl-10 pr-6 flex flex-col justify-center text-left">
              <h3 className="text-[22px] font-bold text-gray-900 mb-3 leading-snug">{title}</h3>
              <p className="text-[16px] font-normal text-gray-500 leading-relaxed max-w-[280px]">
                {description}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 py-6 pl-6 pr-10 flex flex-col justify-center text-right">
              <h3 className="text-[22px] font-bold text-gray-900 mb-3 leading-snug">{title}</h3>
              <p className="text-[16px] font-normal text-gray-500 leading-relaxed max-w-[280px] ml-auto">
                {description}
              </p>
            </div>
            <div className="flex items-center px-5">
              <ArrowIcon flipped />
            </div>
            <div className="w-[42%] min-h-[190px] bg-[#0D3283] flex-shrink-0 overflow-hidden p-8 max-h-96">
              <img src={image} alt={title} className="w-full h-full object-contain" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
