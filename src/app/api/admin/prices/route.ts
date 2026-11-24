import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getPricesAdmin } from "@/lib/content";

function parseIncludes(body: Record<string, unknown>): string[] {
  if (Array.isArray(body.includes)) {
    return body.includes.map(String).filter((x) => x.trim());
  }
  return String(body.includesText || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await getPricesAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.name || !body?.price) return badRequest("Vyplňte název a cenu.");

  const cms = await readCms();
  const id = String(body.key || `p-${Date.now().toString(36)}`);
  const nextDbId =
    (cms.priceItems.reduce((m, p) => Math.max(m, p.dbId ?? 0), 0) || 0) + 1;
  const item = {
    id,
    dbId: nextDbId,
    name: String(body.name).trim(),
    meta: String(body.meta ?? "").trim(),
    price: String(body.price).trim(),
    summary: String(body.summary ?? "").trim(),
    includes: parseIncludes(body),
    sortOrder: Number(body.sortOrder ?? cms.priceItems.length),
    published: body.published !== false,
  };
  cms.priceItems.push(item);

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

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.id && !body?.key && body?.dbId == null) return badRequest("Chybí id.");

  const cms = await readCms();
  const idx = cms.priceItems.findIndex(
    (p) =>
      p.id === body.id ||
      p.id === body.key ||
      (body.dbId != null && p.dbId === Number(body.dbId)),
  );
  if (idx < 0) return badRequest("Položka nenalezena.");

  cms.priceItems[idx] = {
    ...cms.priceItems[idx],
    name: String(body.name ?? cms.priceItems[idx].name).trim(),
    meta: String(body.meta ?? cms.priceItems[idx].meta).trim(),
    price: String(body.price ?? cms.priceItems[idx].price).trim(),
    summary: String(body.summary ?? cms.priceItems[idx].summary).trim(),
    includes: parseIncludes(body),
    sortOrder: Number(body.sortOrder ?? cms.priceItems[idx].sortOrder ?? 0),
    published: body.published !== false,
  };

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item: cms.priceItems[idx] });
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
  const before = cms.priceItems.length;
  cms.priceItems = cms.priceItems.filter(
    (p) => String(p.dbId) !== idParam && p.id !== idParam,
  );
  if (cms.priceItems.length === before) return badRequest("Položka nenalezena.");

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ ok: true });
}
