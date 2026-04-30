"use client";

import {
  BarChart2,
  BookOpen,
  CalendarClock,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavProps {
  onNavigate?: () => void;
}

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/sets", label: "Question Sets", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/rules", label: "Site Rules", icon: Shield },
  { href: "/admin/pilot", label: "Pilot Status", icon: CalendarClock },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
];

export default function AdminNav({ onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
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
