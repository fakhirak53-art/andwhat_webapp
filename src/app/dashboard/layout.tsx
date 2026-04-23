import { logout } from "@/app/actions/auth";
import DailyMhMessageModal from "@/components/dashboard/DailyMhMessageModal";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import { Button } from "@/components/ui/Button";
import { ToastProvider } from "@/components/ui/Toast";
import { getStudentProfile } from "@/lib/dashboard";
import { getStudentRow } from "@/lib/student";
import { marketingTheme } from "@/lib/marketing-theme";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
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

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileData, studentRow] = await Promise.all([
    getStudentProfile(user.id),
    getStudentRow(user.id),
  ]);
  const fullName =
    profileData?.profile.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Student";
  const yearLevel = profileData?.student?.year_level ?? null;
  const schoolName = profileData?.student?.school_name ?? null;
  const email = user.email ?? "No email";
  const initials = getInitials(fullName);

  return (
    <ToastProvider>
      <DailyMhMessageModal
        userId={user.id}
        schoolId={studentRow?.school_id ?? null}
      />
      <div className={["min-h-screen", marketingTheme.bgPage].join(" ")}>
        <aside
          className={[
            "hidden md:flex fixed left-0 top-0 h-screen w-60 text-white flex-col",
            marketingTheme.bgSidebar,
          ].join(" ")}
        >
          <div className="p-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="andwhat"
                width={240}
                height={64}
                className="h-12 w-auto filter brightness-0 invert contrast-125"
                priority
              />
            </Link>

            <div className="mt-8">
              <div className="flex items-center gap-3">
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
            </div>

            <DashboardNav />
          </div>

          <div className="mt-auto p-6">
            {schoolName ? (
              <p className="text-white/40 text-xs truncate mb-4">
                {schoolName}
              </p>
            ) : null}
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="text-white/50 hover:text-white/90 px-0 py-0 text-sm"
              >
                Logout
              </Button>
            </form>
          </div>
        </aside>

        <div
          className={["ml-0 md:ml-60 min-h-screen", marketingTheme.bgPage].join(
            " ",
          )}
        >
          <MobileSidebar
            fullName={fullName}
            email={email}
            yearLevel={yearLevel}
            schoolName={schoolName}
          />
          <main className="p-6 md:p-8 max-w-6xl">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
