import { ShieldOff } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <ShieldOff className="w-14 h-14 text-muted/40 mx-auto" />
        <h1 className="font-serif text-2xl text-ink mt-4">Access denied</h1>
        <p className="text-muted text-sm mt-2">
          You don&apos;t have permission to view this page.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button>Go to student dashboard</Button>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="secondary">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
