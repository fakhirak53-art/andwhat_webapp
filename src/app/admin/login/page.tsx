"use client";

import { adminLogin } from "@/app/actions/admin-auth";
import { Button, Form, Input } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function WarningIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <title>Warning</title>
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData): Promise<void> {
    setLoading(true);
    setError(null);

    const result = await adminLogin(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:flex-col md:justify-between bg-ink text-paper p-12 md:w-1/2">
        <div>
          <Link href="/" className="inline-block mb-12">
            <Image
              src="/images/logo.png"
              alt="andwhat"
              width={280}
              height={76}
              className="h-10 w-auto filter brightness-0 invert contrast-125"
              priority
            />
          </Link>
        </div>
        <div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            Manage your school&apos;s learning.
          </h2>
          <ul className="space-y-3 text-paper/90 font-sans text-sm md:text-base">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Upload and manage question sets
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Track student engagement and progress
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#0048AE] shrink-0" />
              Configure browser extension rules
            </li>
          </ul>
        </div>
        <p className="text-paper/50 text-xs mt-8">
          andwhat.app · Built for Australian schools
        </p>
      </div>

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
            Admin portal
          </p>
          <h1 className="font-serif text-3xl text-ink mb-1">Welcome back</h1>
          <p className="text-muted text-sm mb-8">
            Log in with your admin account to continue.
          </p>

          <Form action={handleSubmit} className="space-y-4">
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

            {error ? (
              <div
                className="bg-red-50 border border-error/20 text-error text-sm rounded-md p-3 flex items-start gap-2"
                role="alert"
              >
                <WarningIcon />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center"
            >
              {loading ? "Please wait..." : "Log in →"}
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
}
