import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@adi/database";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    await prisma.user.delete({ where: { id: session.user.id } });
    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "ACCOUNT_DELETE_FAILED" }, { status: 503 });
  }
}
