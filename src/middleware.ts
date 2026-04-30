import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session — do NOT remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Keep existing student dashboard protection unchanged
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin")) &&
    request.nextUrl.pathname !== "/admin/login" &&
    request.nextUrl.pathname !== "/pilot/expired"
  ) {
    const [{ data: teacherSchool }, { data: student }] = await Promise.all([
      supabase
        .from("teacher_schools")
        .select("school_id")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("students")
        .select("school_id")
        .eq("auth_user_id", user.id)
        .maybeSingle(),
    ]);

    const schoolId = teacherSchool?.school_id ?? student?.school_id;
    if (schoolId) {
      const { data: school } = await supabase
        .from("schools")
        .select("pilot_status, pilot_expires_at")
        .eq("id", schoolId)
        .maybeSingle();

      const isInactive = school?.pilot_status && school.pilot_status !== "active";
      const expiresAt = school?.pilot_expires_at;
      const isExpired =
        Boolean(expiresAt) && new Date(expiresAt).getTime() <= Date.now();

      if (isInactive || isExpired) {
        return NextResponse.redirect(new URL("/pilot/expired", request.url));
      }
    }
  }

  // Protect /admin/*
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { data: teacherSchoolRow } = await supabase
      .from("teacher_schools")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!teacherSchoolRow) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Redirect logged-in users away from /login
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && request.nextUrl.pathname === "/login/forgot-password") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclude `/src/*`: devtools / source maps from dependencies (e.g. Supabase)
    // reference paths like `/src/GoTrueClient.ts`, which are not app routes and
    // would otherwise hit this matcher on every failed GET.
    "/((?!_next/static|_next/image|favicon.ico|src/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
