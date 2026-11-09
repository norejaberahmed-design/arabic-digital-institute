import { NextResponse } from "next/server";
import { prisma } from "@adi/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch {
    return NextResponse.json(
      { status: "degraded", database: "unavailable", message: "Check DATABASE_URL and SQLite initialization." },
      { status: 503 },
    );
  }
}
