"use client";

import { useState, useTransition } from "react";
import {
  linkStudentAccount,
  unlinkStudentAccount,
} from "@/app/actions/students-admin";
import { Button, Input } from "@/components/ui";

interface LinkAccountFormProps {
  studentId: string;
  isLinked: boolean;
  linkedEmail?: string | null;
}

export default function LinkAccountForm({
  studentId,
  isLinked,
  linkedEmail,
}: LinkAccountFormProps) {
  const [email, setEmail] = useState(linkedEmail ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLinkSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    startTransition(async () => {
      const result = await linkStudentAccount(studentId, email);
      if (!result.success) {
        setIsError(true);
        setMessage(result.error ?? "Could not link account.");
        return;
      }
      setIsError(false);
      setMessage("Account linked successfully.");
      window.location.reload();
    });
  }

  function handleUnlink(): void {
    setMessage(null);
    setIsError(false);
    startTransition(async () => {
      const result = await unlinkStudentAccount(studentId);
      if (!result.success) {
        setIsError(true);
        setMessage(result.error ?? "Could not unlink account.");
        return;
      }
      setIsError(false);
      setMessage("Account unlinked.");
      window.location.reload();
    });
  }

  return (
    <div>
      {!isLinked ? (
        <form onSubmit={handleLinkSubmit} className="space-y-3">
          <Input
            id="link-email"
            label="Auth user email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@school.edu.au"
            type="email"
            required
          />
          <Button type="submit" loading={isPending}>
            Link account
          </Button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-ink">
            Linked to:{" "}
            <span className="font-medium">
              {linkedEmail ?? "Unknown email"}
            </span>
          </p>
          <Button
            variant="secondary"
            loading={isPending}
            onClick={handleUnlink}
          >
            Unlink account
          </Button>
        </div>
      )}

      {message ? (
        <p
          className={[
            "mt-3 text-sm",
            isError ? "text-red-700" : "text-green-700",
          ].join(" ")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
