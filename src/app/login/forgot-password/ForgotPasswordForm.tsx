"use client";

import { requestPasswordReset } from "@/app/actions/auth";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { StudentAuthShell } from "@/components/auth/StudentAuthShell";
import { Button, Form, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

type ForgotPasswordFormProps = {
  initialError: string | null;
};

export function ForgotPasswordForm({ initialError }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await requestPasswordReset(formData);

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <StudentAuthShell>
      <p className="text-muted text-xs uppercase tracking-widest font-medium mb-2">
        Student portal
      </p>
      <h1 className="font-serif text-3xl text-ink mb-1">Forgot password</h1>
      <p className="text-muted text-sm mb-8">
        Enter your school email and we&apos;ll send you a link to reset your
        password.
      </p>

      {submitted ? (
        <div className="space-y-6">
          <div className="bg-cream/80 border border-border rounded-md p-4 text-sm text-ink">
            <p className="mb-2 font-medium">Check your email</p>
            <p className="text-muted">
              If an account exists for that address, you&apos;ll receive a link
              to reset your password. The link expires after a short time.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm text-[#0048AE] hover:underline font-medium"
          >
            ← Back to log in
          </Link>
        </div>
      ) : (
        <Form action={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="you@school.edu.au"
            required
            autoComplete="email"
          />

          {error && <AuthErrorAlert message={error} />}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full justify-center"
          >
            {loading ? "Please wait..." : "Send reset link →"}
          </Button>

          <p className="text-center text-sm text-muted">
            <Link href="/login" className="text-ink hover:underline font-medium">
              Back to log in
            </Link>
          </p>
        </Form>
      )}
    </StudentAuthShell>
  );
}
