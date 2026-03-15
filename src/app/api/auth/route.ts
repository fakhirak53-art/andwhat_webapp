import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented. Use Supabase auth endpoints." },
    { status: 501 },
  );
}
