import { ForgotPasswordForm } from "./ForgotPasswordForm";

function mapCallbackError(code: string | undefined): string | null {
  if (code === "auth") {
    return "That reset link is invalid or has expired. Please request a new one.";
  }
  if (code === "config") {
    return "Sign-in is not configured. Please contact support.";
  }
  return null;
}

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const initialError = mapCallbackError(params.error);

  return <ForgotPasswordForm initialError={initialError} />;
}
