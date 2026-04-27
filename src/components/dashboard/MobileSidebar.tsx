"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { logout } from "@/app/actions/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { marketingTheme } from "@/lib/marketing-theme";

interface MobileSidebarProps {
  fullName: string;
  email: string;
  yearLevel: number | null;
  schoolName: string | null;
}

function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "S";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function MobileSidebar({
  fullName,
  email,
  yearLevel,
  schoolName,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  return (
    <>
      <div
        className={[
          "md:hidden sticky top-0 z-50 px-4 py-3 flex items-center justify-between",
          marketingTheme.bgSidebar,
        ].join(" ")}
      >
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo.png"
            alt="andwhat"
            width={200}
            height={56}
            className="h-7 w-auto filter brightness-0 invert contrast-125"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={[
          "md:hidden fixed inset-0 z-[60] transition-opacity duration-200",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <button
          type="button"
          className={["absolute inset-0", marketingTheme.overlayScrim].join(
            " ",
          )}
          aria-label="Close menu backdrop"
          onClick={() => setIsOpen(false)}
        />

        <aside
          className={[
            "relative h-full w-72 text-white flex flex-col p-6 transition-transform duration-200",
            marketingTheme.bgSidebar,
            isOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo.png"
              alt="andwhat"
              width={240}
              height={64}
              className="h-8 w-auto filter brightness-0 invert contrast-125"
              priority
            />
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <div
              className={[
                "w-10 h-10 rounded-full font-serif text-sm font-medium flex items-center justify-center",
                marketingTheme.avatar,
              ].join(" ")}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {fullName}
              </p>
              <p className="text-white/50 text-xs truncate">
                {yearLevel ? `Year ${yearLevel}` : email}
              </p>
            </div>
          </div>

          <DashboardNav onNavigate={() => setIsOpen(false)} />

          <div className="mt-auto">
            {schoolName ? (
              <p className="text-white/40 text-xs truncate mb-4">
                {schoolName}
              </p>
            ) : null}
            <Form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="text-white/50 hover:text-white/90 px-0 py-0 text-sm"
              >
                Logout
              </Button>
            </Form>
          </div>
        </aside>
      </div>
    </>
  );
}
