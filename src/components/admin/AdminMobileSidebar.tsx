"use client";

import { logout } from "@/app/actions/auth";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import type { AdminRole } from "@/types/admin";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface AdminMobileSidebarProps {
  fullName: string;
  schoolName: string;
  role: AdminRole;
  schoolCode: string;
}

function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "A";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function AdminMobileSidebar({
  fullName,
  schoolName,
  role,
  schoolCode,
}: AdminMobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  return (
    <>
      <div className="md:hidden sticky top-0 z-50 bg-ink px-4 py-3 flex items-center justify-between">
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
          className="text-paper/80 hover:text-paper transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={[
          "md:hidden fixed inset-0 z-60 transition-opacity duration-200",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <button
          type="button"
          className="absolute inset-0 bg-ink/50"
          aria-label="Close menu backdrop"
          onClick={() => setIsOpen(false)}
        />
        <aside
          className={[
            "relative h-full w-72 bg-ink text-paper flex flex-col p-6 transition-transform duration-200",
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
            <div className="w-10 h-10 rounded-full bg-lime text-ink font-serif text-sm font-medium flex items-center justify-center">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-paper text-sm font-medium truncate">
                {fullName}
              </p>
              <p className="text-paper/50 text-xs truncate">{schoolName}</p>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="lime">
              {role === "admin" ? "Admin" : "Teacher"}
            </Badge>
          </div>

          <AdminNav onNavigate={() => setIsOpen(false)} />

          <div className="mt-auto">
            <p className="text-paper/40 text-xs">School code</p>
            <p className="text-paper/70 text-sm mt-1">{schoolCode}</p>
            <div className="my-4 border-t border-paper/15" />
            <Form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="text-paper/50 hover:text-paper/90 px-0 py-0 text-sm"
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
