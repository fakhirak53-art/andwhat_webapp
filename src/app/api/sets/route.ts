import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Not implemented. Use dashboard/admin set actions." },
    { status: 501 },
  );
}
