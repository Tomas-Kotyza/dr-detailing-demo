import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getSeasonAdmin } from "@/lib/content";
import {
  defaultSeasonCampaigns,
  type SeasonCampaign,
  type SeasonId,
} from "@/content/seasons";

const IDS: SeasonId[] = ["spring", "summer", "autumn", "winter"];

function normalizeCampaign(
  raw: Partial<SeasonCampaign>,
  fallback: SeasonCampaign,
): SeasonCampaign {
  return {
    id: fallback.id,
    label: String(raw.label ?? fallback.label).trim() || fallback.label,
    badge: String(raw.badge ?? fallback.badge).trim() || fallback.badge,
    title: String(raw.title ?? fallback.title).trim() || fallback.title,
    body: String(raw.body ?? fallback.body).trim() || fallback.body,
    packId: String(raw.packId ?? fallback.packId).trim() || fallback.packId,
  };
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json(await getSeasonAdmin());
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Neplatná data.");

  const active = String(body.active ?? "") as SeasonId;
  if (!IDS.includes(active)) return badRequest("Neplatná sezóna.");

  const cms = await readCms();
  const base =
    Array.isArray(cms.seasonCampaigns) && cms.seasonCampaigns.length === 4
      ? cms.seasonCampaigns
      : defaultSeasonCampaigns.map((c) => ({ ...c }));

  const incoming = Array.isArray(body.campaigns) ? body.campaigns : [];
  cms.seasonActive = active;
  cms.seasonCampaigns = IDS.map((id) => {
    const fallback = base.find((c) => c.id === id) ?? defaultSeasonCampaigns.find((c) => c.id === id)!;
    const raw = incoming.find((c: { id?: string }) => c?.id === id) ?? {};
    return normalizeCampaign(raw, fallback);
  });

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json(await getSeasonAdmin());
}
