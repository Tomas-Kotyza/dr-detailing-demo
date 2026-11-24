import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getNovinky, getSeasonAdmin } from "@/lib/content";
import { readNewsletter } from "@/lib/cms/newsletter";
import type { NovinkyState } from "@/lib/cms/types";
import { createDefaultCms } from "@/lib/cms/defaults";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const [novinky, season, subscribers] = await Promise.all([
    getNovinky(),
    getSeasonAdmin(),
    readNewsletter(),
  ]);
  return NextResponse.json({ novinky, season, subscribers });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Neplatná data.");

  const cms = await readCms();
  const fallback = createDefaultCms().novinky!;
  const current = cms.novinky ?? fallback;
  const next: NovinkyState = {
    seasonApproved: Boolean(
      body.seasonApproved ?? current.seasonApproved ?? false,
    ),
    leadPopupApproved: Boolean(
      body.leadPopupApproved ?? current.leadPopupApproved ?? false,
    ),
    ebookApproved: Boolean(body.ebookApproved ?? current.ebookApproved ?? false),
    leadPopup: {
      ...fallback.leadPopup,
      ...current.leadPopup,
      ...(body.leadPopup ?? {}),
      title: String(body.leadPopup?.title ?? current.leadPopup.title).trim(),
      body: String(body.leadPopup?.body ?? current.leadPopup.body).trim(),
      discountLabel: String(
        body.leadPopup?.discountLabel ?? current.leadPopup.discountLabel,
      ).trim(),
      buttonLabel: String(
        body.leadPopup?.buttonLabel ?? current.leadPopup.buttonLabel,
      ).trim(),
      delaySeconds: Math.max(
        5,
        Number(body.leadPopup?.delaySeconds ?? current.leadPopup.delaySeconds) ||
          20,
      ),
    },
    ebook: {
      title: String(body.ebook?.title ?? current.ebook.title).trim(),
      subtitle: String(body.ebook?.subtitle ?? current.ebook.subtitle).trim(),
      chapters:
        Array.isArray(body.ebook?.chapters) && body.ebook.chapters.length > 0
          ? body.ebook.chapters.map(
              (ch: { heading?: string; paragraphs?: string[] }) => ({
                heading: String(ch.heading ?? "").trim(),
                paragraphs: Array.isArray(ch.paragraphs)
                  ? ch.paragraphs.map((p: string) => String(p))
                  : [],
              }),
            )
          : current.ebook.chapters,
    },
  };

  cms.novinky = next;

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ novinky: next });
}
