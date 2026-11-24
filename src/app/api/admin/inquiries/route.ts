import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, unauthorized } from "@/lib/admin/api";
import {
  deleteInquiry,
  readInquiries,
  updateInquiryStatus,
} from "@/lib/cms/inquiries";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const items = await readInquiries();
  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body?.id) return badRequest("Chybí id.");
  const status = body.status === "done" ? "done" : body.status === "new" ? "new" : null;
  if (!status) return badRequest("Neplatný stav.");

  const item = await updateInquiryStatus(String(body.id), status);
  if (!item) return badRequest("Poptávka nenalezena.");
  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return badRequest("Chybí id.");
  const ok = await deleteInquiry(id);
  if (!ok) return badRequest("Poptávka nenalezena.");
  return NextResponse.json({ ok: true });
}
