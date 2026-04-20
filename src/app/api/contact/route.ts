import { NextResponse } from "next/server";

import { isMailConfigured, sendContactEmails } from "@/lib/mail";

const MAX = { name: 200, subject: 200, message: 8000 };

function simpleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mailFailureHint(smtpMessage: string): string | undefined {
  const m = smtpMessage.toLowerCase();
  if (
    smtpMessage.includes("ENOTFOUND") ||
    smtpMessage.includes("EAI_AGAIN") ||
    smtpMessage.includes("getaddrinfo")
  ) {
    return (
      "The SMTP server hostname could not be resolved (DNS). In .env set SMTP_HOST to the " +
      "exact outgoing server from cPanel (often mail.yourdomain — if that fails, use the " +
      "server hostname from your host, e.g. the server shown in your webmail URL). " +
      "Ensure an A record exists for mail.yourdomain if you use that form."
    );
  }
  if (
    m.includes("535") ||
    m.includes("incorrect authentication") ||
    m.includes("invalid login") ||
    m.includes("authentication failed") ||
    m.includes("auth failed")
  ) {
    return (
      "SMTP rejected the login (wrong user/password or .env mangled the password). " +
      "1) In cPanel reset the mailbox password and copy it once into .env. " +
      "2) Use SMTP_USER=full address (admin@andwhat.au). " +
      "3) If the password has $ # or backslashes, set SMTP_PASSWORD_B64 instead of SMTP_PASSWORD " +
      "(run: echo -n YOUR_PASSWORD | base64 — paste one line into .env). " +
      "4) If SMTP_HOST is the server hostname, try SMTP_TLS_SERVERNAME=mail.andwhat.au. " +
      "5) If 465 still fails, try SMTP_PORT=587 and SMTP_SECURE=false."
    );
  }
  return undefined;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const subject =
    typeof record.subject === "string" ? record.subject.trim() : "";
  const message =
    typeof record.message === "string" ? record.message.trim() : "";

  if (!name || name.length > MAX.name) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!email || !simpleEmail(email) || email.length > MAX.name) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (subject.length > MAX.subject) {
    return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
  }
  if (!message || message.length < 10 || message.length > MAX.message) {
    return NextResponse.json(
      { error: "Message must be between 10 and 8000 characters" },
      { status: 400 },
    );
  }

  const adminEmail =
    process.env.CONTACT_ADMIN_EMAIL?.trim() ?? process.env.SMTP_USER?.trim();
  if (!adminEmail || !isMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Contact is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and CONTACT_ADMIN_EMAIL (or rely on SMTP_USER for admin inbox).",
      },
      { status: 503 },
    );
  }

  try {
    await sendContactEmails({ name, email, subject, message }, adminEmail);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact] SMTP send failed:", message);

    const isDev = process.env.NODE_ENV !== "production";
    const hint = mailFailureHint(message);
    return NextResponse.json(
      {
        error:
          "We could not send your message. Check your connection and try again, or email us directly.",
        ...(hint ? { hint } : {}),
        ...(isDev ? { debug: message } : {}),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
