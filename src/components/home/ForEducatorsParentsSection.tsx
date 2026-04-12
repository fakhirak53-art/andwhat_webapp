import { BrandName } from "@/components/ui/BrandName";
import Image from "next/image";
import type { ReactNode } from "react";

function TriangleBullet() {
  return (
    <span className="mt-0.5 shrink-0" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Triangle bullet</title>
        <path
          d="M12 3L22 20H2L12 3Z"
          stroke="#0048AE"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const messagingPoints = [
  "We offer wellbeing tips, helping you any way we can.",
  "Help with things like anxiety, coping skills, bullying, and more.",
  "Learning to deal with issues helps. Asking for help helps too.",
];

const educatorPoints: ReactNode[] = [
  <>
    <BrandName possessive /> spaced repetition of learning material helps drive retention of
    lessons learnt in class.
  </>,
  "No IT onboarding required. Teachers upload Question sets with multi-choice answers relating to course material. A reference number is allocated to share with Students and away they go.",
];

const parentPoints = [
  "Built to Australian Student Safety Standards.",
  "Data is encrypted and never shared with third parties.",
  "Encouraging consistent study habits without the 'homework' battle.",
];

interface CopyTileProps {
  heading: string;
  accentHeading?: string;
  description?: string;
  points: ReactNode[];
  className?: string;
}

function CopyTile({
  heading,
  accentHeading,
  description,
  points,
  className = "",
}: CopyTileProps) {
  return (
    <div
      className={`flex h-full flex-col justify-center bg-white p-6 sm:p-10 lg:p-12 ${className}`}
    >
      <h2 className="text-[18px] font-black uppercase leading-[1.05] tracking-tight text-[#0a1628] sm:text-[28px] lg:text-[34px]">
        <span>{heading}</span>
        {accentHeading ? (
          <>
            <br />
            <span className="text-[#0048AE]">{accentHeading}</span>
          </>
        ) : null}
      </h2>

      {description ? (
        <p className="mt-4 max-w-120 text-[11px] leading-relaxed text-[#374151] sm:text-[15px]">
          {description}
        </p>
      ) : null}

      <ul className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-4">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 sm:gap-3">
            <TriangleBullet />
            <span className="text-[11px] leading-relaxed text-[#374151] sm:text-[15px]">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ImageTileProps {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
  className?: string;
  objectPosition?: string;
}

function ImageTile({
  src,
  alt,
  fit = "cover",
  className = "",
  objectPosition = "center",
}: ImageTileProps) {
  return (
    <div
      className={`relative min-h-47.5 bg-white sm:min-h-75 lg:min-h-85 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="50vw"
        className={
          fit === "contain" ? "object-contain p-4 sm:p-6" : "object-cover"
        }
        style={{ objectPosition }}
      />
    </div>
  );
}

export default function ForEducatorsParentsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#e8edf3] shadow-[0_18px_40px_rgba(10,22,40,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <CopyTile
            heading="Daily Messaging:"
            description="So many things make learning hard. Sign up and our messaging arrives each day to help."
            points={messagingPoints}
            className="border-b border-[#e8edf3] lg:border-r order-1 lg:order-1"
          />
          <ImageTile
            src="/images/new/3rdImage.jpg"
            alt="Student with a thought bubble representing daily wellbeing check-ins"
            fit="contain"
            className="border-b border-[#e8edf3] order-2 lg:order-2"
            objectPosition="center"
          />

          <ImageTile
            src="/images/new/educationImage1.png"
            alt="Educator working on a laptop"
            className="border-b border-[#e8edf3] lg:border-r order-4 lg:order-3"
            objectPosition="center"
          />
          <CopyTile
            heading="For Educators:"
            accentHeading="Personalise The Learning"
            points={educatorPoints}
            className="border-b border-[#e8edf3] order-3 lg:order-4"
          />

          <CopyTile
            heading="For Parents:"
            accentHeading="Safety & Progress"
            points={parentPoints}
            className="border-b border-[#e8edf3] lg:border-r lg:border-b-0 order-5 lg:order-5"
          />
          <ImageTile
            src="/images/new/educationImage2.png"
            alt="Parent helping a student with school work"
            objectPosition="center"
            className="order-6"
          />
        </div>
      </div>
    </section>
  );
}
