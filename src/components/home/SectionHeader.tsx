interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2
        className={`text-[34px] sm:text-[44px] lg:text-[58px] font-extrabold leading-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-[15px] sm:text-[18px] lg:text-[22px] font-normal mt-4 leading-relaxed ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          } ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
