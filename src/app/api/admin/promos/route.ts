import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getPromosAdmin } from "@/lib/content";
import type { PromoItem } from "@/lib/content/types";

function normalizePromo(raw: Partial<PromoItem>, fallback?: PromoItem): PromoItem {
  return {
    id: String(raw.id ?? fallback?.id ?? `promo-${Date.now()}`).trim(),
    title: String(raw.title ?? fallback?.title ?? "").trim(),
    subtitle: String(raw.subtitle ?? fallback?.subtitle ?? "").trim(),
    badge: String(raw.badge ?? fallback?.badge ?? "AKCE").trim(),
    offerLine: String(raw.offerLine ?? fallback?.offerLine ?? "").trim(),
    flyerPrice: String(raw.flyerPrice ?? fallback?.flyerPrice ?? "").trim(),
    body: String(raw.body ?? fallback?.body ?? "").trim(),
    mapsText: String(raw.mapsText ?? fallback?.mapsText ?? "").trim(),
    smsText: String(raw.smsText ?? fallback?.smsText ?? "").trim(),
    instagramText: String(raw.instagramText ?? fallback?.instagramText ?? "").trim(),
    posterUrl: String(raw.posterUrl ?? fallback?.posterUrl ?? "").trim(),
    active: Boolean(raw.active ?? fallback?.active ?? false),
    sortOrder: Number(raw.sortOrder ?? fallback?.sortOrder ?? 0),
  };
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await getPromosAdmin() });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body?.id) return badRequest("Chybí id akce.");

  const cms = await readCms();
  if (!Array.isArray(cms.promos)) cms.promos = [];
  const idx = cms.promos.findIndex((p) => p.id === body.id);
  if (idx < 0) return badRequest("Akce nenalezena.");

  cms.promos[idx] = normalizePromo(body, cms.promos[idx]);

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item: cms.promos[idx] });
}
