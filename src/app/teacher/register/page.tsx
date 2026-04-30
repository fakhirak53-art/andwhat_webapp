"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { registerTeacher } from "@/app/actions/teacher-onboarding";
import { Button, Form, Input } from "@/components/ui";

export default function TeacherRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await registerTeacher(formData);
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
            Teacher onboarding for school pilots.
          </h2>
          <p className="text-paper/80 text-sm md:text-base leading-relaxed">
            Use the school code and teacher code from your school pilot invite to
            create your teacher account.
          </p>
        </div>
        <p className="text-paper/50 text-xs mt-8">
          andwhat.app · Built for Australian schools
        </p>
      </div>

      <div className="flex flex-col justify-center bg-paper p-8 md:p-16 md:w-1/2 flex-1">
        <div className="max-w-sm mx-auto w-full">
          <p className="text-muted text-xs uppercase tracking-widest font-medium mb-2">
            Teacher onboarding
          </p>
          <h1 className="font-serif text-3xl text-ink mb-1">Create teacher account</h1>
          <p className="text-muted text-sm mb-8">
            Already onboarded?{" "}
            <Link href="/admin/login" className="text-ink hover:underline">
              Go to admin login
            </Link>
          </p>

          <Form action={handleSubmit} className="space-y-4">
            <Input name="full_name" label="Full name" required placeholder="Teacher name" />
            <Input name="email" type="email" label="Email" required placeholder="teacher@school.edu.au" />
            <Input name="password" type="password" minLength={6} label="Password" required placeholder="At least 6 characters" />
            <Input name="school_code" label="School code" required placeholder="A3F1B2C4" />
            <Input name="teacher_code" label="Teacher code" required placeholder="B7F2A1" />

            {error ? (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full justify-center" loading={loading}>
              {loading ? "Creating account..." : "Create teacher account"}
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
}
