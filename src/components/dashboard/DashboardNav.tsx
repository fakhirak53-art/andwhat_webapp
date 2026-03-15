"use client";

import { BarChart3, BookOpen, Grid3X3, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  onNavigate?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Grid3X3 },
  { href: "/dashboard/sets", label: "Question Sets", icon: BookOpen },
  { href: "/dashboard/activity", label: "My Activity", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardNav({ onNavigate }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
              isActive
                ? "bg-paper/10 text-paper font-medium"
                : "text-paper/50 hover:text-paper hover:bg-paper/5",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
