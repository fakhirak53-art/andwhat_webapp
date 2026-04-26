import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export type StudentAuthShellProps = {
  children: ReactNode;
};

export function StudentAuthShell({ children }: StudentAuthShellProps) {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:flex-col md:justify-between bg-ink text-paper p-12 md:w-1/2">
        <div>
          <Link href="/" className="inline-block mb-12">
            <Image
              src="/images/logo.png"
              alt="andwhat"
              width={300}
              height={80}
              className="h-12 w-auto filter brightness-0 invert contrast-125"
              priority
            />
          </Link>
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            Turn screen time into <em>learn time.</em>
          </h2>
          <ul className="space-y-3 text-paper/90 font-sans text-sm md:text-base">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Quick quizzes before you browse
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Track your progress over time
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Assigned by your school, built for you
            </li>
          </ul>
        </div>
        <p className="text-paper/50 text-xs mt-8">
          andwhat.app · Built for Australian schools
        </p>
      </div>

      <div className="flex flex-col justify-center bg-paper p-8 md:p-16 md:w-1/2 flex-1 relative">
        <p className="absolute top-6 right-6 md:top-8 md:right-8 text-muted text-xs">
          Need help?{" "}
          <a
            href="mailto:hello@andwhat.app"
            className="text-ink hover:underline"
          >
            hello@andwhat.app
          </a>
        </p>

        <div className="max-w-sm mx-auto w-full">{children}</div>
      </div>
    </main>
  );
}
