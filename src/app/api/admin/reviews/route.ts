import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getReviewsAdmin } from "@/lib/content";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await getReviewsAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.text) return badRequest("Vyplňte jméno a text.");

  const cms = await readCms();
  const id = String(body.key || `r-${Date.now().toString(36)}`);
  const nextDbId =
    (cms.reviews.reduce((m, r) => Math.max(m, r.dbId ?? 0), 0) || 0) + 1;
  const item = {
    id,
    dbId: nextDbId,
    role: body.role === "owner" ? "owner" : "customer",
    name: String(body.name).trim(),
    car: String(body.car ?? "").trim(),
    text: String(body.text).trim(),
    sortOrder: Number(body.sortOrder ?? cms.reviews.length),
    published: body.published !== false,
  };
  cms.reviews.push(item);
  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body?.id && !body?.key && body?.dbId == null) return badRequest("Chybí id.");

  const cms = await readCms();
  const idx = cms.reviews.findIndex(
    (r) =>
      r.id === body.id ||
      r.id === body.key ||
      (body.dbId != null && r.dbId === Number(body.dbId)),
  );
  if (idx < 0) return badRequest("Recenze nenalezena.");

  cms.reviews[idx] = {
    ...cms.reviews[idx],
    role: body.role === "owner" ? "owner" : "customer",
    name: String(body.name ?? cms.reviews[idx].name).trim(),
    car: String(body.car ?? cms.reviews[idx].car).trim(),
    text: String(body.text ?? cms.reviews[idx].text).trim(),
    sortOrder: Number(body.sortOrder ?? cms.reviews[idx].sortOrder ?? 0),
    published: body.published !== false,
  };

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item: cms.reviews[idx] });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const idParam = new URL(request.url).searchParams.get("id");
  if (!idParam) return badRequest("Chybí id.");

  const cms = await readCms();
  const before = cms.reviews.length;
  cms.reviews = cms.reviews.filter(
    (r) => String(r.dbId) !== idParam && r.id !== idParam,
  );
  if (cms.reviews.length === before) return badRequest("Recenze nenalezena.");

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ ok: true });
}
