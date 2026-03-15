"use client";

import { login, signup } from "@/app/actions/auth";
import { Button, Input, Logo } from "@/components/ui";
import { useState } from "react";

function WarningIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left column — hidden on mobile */}
      <div className="hidden md:flex md:flex-col md:justify-between bg-ink text-paper p-12 md:w-1/2">
        <div>
          <Logo size="md" light className="mb-12" />
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            Turn screen time into <em>learn time.</em>
          </h2>
          <ul className="space-y-3 text-paper/90 font-sans text-sm md:text-base">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
              Quick quizzes before you browse
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
              Track your progress over time
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
              Assigned by your school, built for you
            </li>
          </ul>
        </div>
        <p className="text-paper/50 text-xs mt-8">
          andwhat.app · Built for Australian schools
        </p>
      </div>

      {/* Right column */}
      <div className="flex flex-col justify-center bg-paper p-8 md:p-16 md:w-1/2 flex-1 relative">
        <p className="absolute top-6 right-6 md:top-8 md:right-8 text-muted text-xs">
          Need help?{" "}
          <a
            href="mailto:hello@andwhat.app"
            className="text-ink hover:underline"
          >
            hello@andwhat.app
          </a>
        </p>

        <div className="max-w-sm mx-auto w-full">
          <p className="text-muted text-xs uppercase tracking-widest font-medium mb-2">
            Student portal
          </p>
          <h1 className="font-serif text-3xl text-ink mb-1">
            {isSignup ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-muted text-sm mb-8">
            Log in with your school email to continue.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-md border border-border bg-cream/50 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignup(false);
                setError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${
                !isSignup
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignup(true);
                setError(null);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${
                isSignup
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sign up
            </button>
          </div>

          <form action={handleSubmit} className="space-y-4">
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

            {error && (
              <div
                className="bg-red-50 border border-error/20 text-error text-sm rounded-md p-3 flex items-start gap-2"
                role="alert"
              >
                <WarningIcon />
                <span>{error}</span>
              </div>
            )}

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
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-border" />
            <span className="text-muted text-xs uppercase">or</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <p className="text-muted text-xs text-center">
            Have a question set reference number? You can enter it after logging
            in.
          </p>
        </div>
      </div>
    </main>
  );
}
