import { logout } from "@/app/actions/auth";
import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { getAdminProfile } from "@/lib/admin";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  const adminProfile = await getAdminProfile(user.id);
  if (!adminProfile) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper">
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-ink text-paper flex-col">
        <div className="p-6">
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

          <div className="mt-8">
            <p className="text-paper text-sm font-medium truncate">
              {adminProfile.full_name}
            </p>
            <p className="text-paper/50 text-xs truncate mt-1">
              {adminProfile.school_name}
            </p>
            <Badge variant="lime" className="mt-3">
              {adminProfile.role === "admin" ? "Admin" : "Teacher"}
            </Badge>
          </div>

          <AdminNav />
        </div>

        <div className="mt-auto p-6">
          <p className="text-paper/40 text-xs">School code</p>
          <p className="text-paper/70 text-sm mt-1">
            {adminProfile.school_code}
          </p>
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

      <div className="ml-0 md:ml-64 min-h-screen bg-paper">
        <AdminMobileSidebar
          fullName={adminProfile.full_name}
          schoolName={adminProfile.school_name}
          role={adminProfile.role}
          schoolCode={adminProfile.school_code}
        />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
