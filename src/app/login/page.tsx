"use client";

import { login, signInWithGoogle, signup } from "@/app/actions/auth";
import { AuthErrorAlert } from "@/components/auth/AuthErrorAlert";
import { StudentAuthShell } from "@/components/auth/StudentAuthShell";
import { Button, Form, Input } from "@/components/ui";
import Link from "next/link";
import { useState } from "react";

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = isSignup ? await signup(formData) : await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setGoogleLoading(false);
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

      <Button
        type="button"
        variant="secondary"
        size="lg"
        loading={googleLoading}
        className="w-full justify-center border-border text-ink"
        onClick={handleGoogleSignIn}
      >
        <GoogleGlyph className="shrink-0" />
        Continue with Google
      </Button>

      <p className="text-muted text-xs text-center mt-6">
        Have a question set reference code? You can enter it after logging in.
      </p>
    </StudentAuthShell>
  );
}
