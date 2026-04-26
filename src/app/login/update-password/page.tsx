"use client";

import { updatePassword } from "@/app/actions/auth";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { StudentAuthShell } from "@/components/auth/StudentAuthShell";
import { createClient } from "@/utils/supabase/client";
import { Button, Form, Input } from "@/components/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) {
        setHasSession(!!user);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <StudentAuthShell>
      <p className="text-muted text-xs uppercase tracking-widest font-medium mb-2">
        Student portal
      </p>
      <h1 className="font-serif text-3xl text-ink mb-1">Set new password</h1>
      <p className="text-muted text-sm mb-8">
        Choose a new password for your account.
      </p>

      {hasSession === false && (
        <div className="mb-6 bg-cream/80 border border-border rounded-md p-4 text-sm text-ink">
          <p className="mb-2">
            You need a valid reset link to set a new password. Open the link
            from your email, or request a new one.
          </p>
          <Link
            href="/login/forgot-password"
            className="text-[#0048AE] font-medium hover:underline"
          >
            Forgot password
          </Link>
        </div>
      )}

      <Form action={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          autoComplete="new-password"
        />

        {error && <AuthErrorAlert message={error} />}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={hasSession === false}
          className="w-full justify-center"
        >
          {loading ? "Please wait..." : "Update password →"}
        </Button>

        <p className="text-center text-sm text-muted">
          <Link href="/login" className="text-ink hover:underline font-medium">
            Back to log in
          </Link>
        </p>
      </Form>
    </StudentAuthShell>
  );
}
