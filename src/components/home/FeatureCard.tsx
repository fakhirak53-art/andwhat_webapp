import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-[56px] h-[56px] sm:w-[68px] sm:h-[68px] bg-[#0048AE] rounded-full flex items-center justify-center mb-5 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-[17px] sm:text-[19px] font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">{title}</h3>
      <p className="text-[14px] sm:text-[15px] font-normal text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
