import nodemailer, { type SentMessageInfo } from "nodemailer";

/** Strip BOM / accidental line breaks from .env paste (common cause of 535 auth failures). */
function normalizeSmtpSecret(raw: string): string {
  return raw.replace(/^\uFEFF/, "").replace(/[\r\n]+$/, "");
}

/**
 * Prefer SMTP_PASSWORD_B64 when set (UTF-8 password, base64-encoded) so special
 * characters in .env never break parsing. Example:
 *   echo -n 'your-exact-password' | base64
 */
function getSmtpPassword(): string | undefined {
  const b64 = process.env.SMTP_PASSWORD_B64?.trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      return decoded.length > 0 ? normalizeSmtpSecret(decoded) : undefined;
    } catch {
      return undefined;
    }
  }
  const raw = process.env.SMTP_PASSWORD;
  if (raw === undefined || raw === "") {
    return undefined;
  }
  return normalizeSmtpSecret(raw);
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = getSmtpPassword();

  if (!host || !user || !pass) {
    return null;
  }

  const secure =
    process.env.SMTP_SECURE === "true" ||
    (!process.env.SMTP_SECURE && port === 465);

  const tlsServername = process.env.SMTP_TLS_SERVERNAME?.trim();
  const tls = {
    minVersion: "TLSv1.2" as const,
    ...(tlsServername ? { servername: tlsServername } : {}),
  };

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    /** Helps with some cPanel / shared hosts that use older TLS chains */
    tls,
  });
}

export function isMailConfigured(): boolean {
  return getTransport() !== null;
}

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function assertAccepted(
  result: SentMessageInfo,
  target: string,
  label: string,
): void {
  const lower = target.toLowerCase();
  const rejected = (result.rejected as string[] | undefined)?.map((a) =>
    a.toLowerCase(),
  );
  if (
    rejected?.some((r) => r === lower || r.includes(lower) || lower.includes(r))
  ) {
    throw new Error(`${label}: server rejected recipient ${target}`);
  }
}

export async function sendContactEmails(
  payload: ContactPayload,
  adminEmail: string,
): Promise<void> {
  const transport = getTransport();
  if (!transport) {
    throw new Error("Mail is not configured");
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  if (!smtpUser) {
    throw new Error("Mail is not configured");
  }
  const from = process.env.SMTP_FROM ?? smtpUser;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "andwhat";

  const { name, email, subject, message } = payload;
  const subjectLine = subject.trim() || "Contact form";

  if (process.env.SMTP_SKIP_VERIFY !== "true") {
    await transport.verify();
  }

  const adminResult = await transport.sendMail({
    from: `"${siteName}" <${from}>`,
    to: adminEmail,
    replyTo: email,
    subject: `[${siteName}] ${subjectLine} — from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subjectLine}`,
      "",
      message,
    ].join("\n"),
  });
  assertAccepted(adminResult, adminEmail, "Admin notification");

  const userResult = await transport.sendMail({
    from: `"${siteName}" <${from}>`,
    to: email,
    subject: `We received your message — ${siteName}`,
    text: [
      `Hi ${name},`,
      "",
      "Thanks for contacting us. We've received your message and will get back to you as soon as we can.",
      "",
      "Your message:",
      "---",
      subjectLine !== "Contact form" ? `Subject: ${subjectLine}\n` : "",
      message,
      "---",
      "",
      `— The ${siteName} team`,
    ].join("\n"),
  });
  assertAccepted(userResult, email, "User confirmation");
}
