"use client";

import { login, signup } from "@/app/actions/auth";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { StudentAuthShell } from "@/components/auth/StudentAuthShell";
import { Button, Form, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = isSignup ? await signup(formData) : await login(formData);

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
      <h1 className="font-serif text-3xl text-ink mb-1">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>
      <p className="text-muted text-sm mb-8">
        Log in with your school email to continue.
      </p>

      <div className="flex gap-1 p-1 rounded-md border border-border bg-cream/50 mb-6">
        <button
          type="button"
          onClick={() => {
            setIsSignup(false);
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${!isSignup ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignup(true);
            setError(null);
          }}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${isSignup ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
        >
          Sign up
        </button>
      </div>

      <Form action={handleSubmit} className="space-y-4">
        {isSignup && (
          <Input
            label="Full name"
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Your name"
            required
          />
        )}
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="you@school.edu.au"
          required
        />
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
        />

        {!isSignup && (
          <div className="flex justify-end -mt-1">
            <Link
              href="/login/forgot-password"
              className="text-xs text-[#0048AE] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        )}

        {error && <AuthErrorAlert message={error} />}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full justify-center"
        >
          {loading
            ? "Please wait..."
            : isSignup
              ? "Create account →"
              : "Log in →"}
        </Button>
      </Form>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-border" />
        <span className="text-muted text-xs uppercase">or</span>
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-muted text-xs text-center">
        Have a question set reference code? You can enter it after logging in.
      </p>
    </StudentAuthShell>
  );
}
