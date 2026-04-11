import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_NEXT = "/login/update-password";

function safeNextPath(next: string | null): string {
  const path = next?.trim() || DEFAULT_NEXT;
  if (!path.startsWith("/") || path.startsWith("//")) {
    return DEFAULT_NEXT;
  }
  return path;
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/login/forgot-password?error=config", request.url),
    );
  }

  const url = request.nextUrl.clone();
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const nextPath = safeNextPath(url.searchParams.get("next"));

  let redirectResponse = NextResponse.redirect(new URL(nextPath, request.url));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        redirectResponse = NextResponse.redirect(new URL(nextPath, request.url));
        cookiesToSet.forEach(({ name, value, options }) => {
          redirectResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirectResponse;
    }
  } else if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash,
    });
    if (!error) {
      return redirectResponse;
    }
  }

  return NextResponse.redirect(
    new URL("/login/forgot-password?error=auth", request.url),
  );
}
