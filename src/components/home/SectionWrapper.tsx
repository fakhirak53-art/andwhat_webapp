import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
  return (
    <div className={`max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-16 w-full ${className}`}>
      {children}
    </div>
  );
}
