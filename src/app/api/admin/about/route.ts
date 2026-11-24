import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getAboutAdmin } from "@/lib/content";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ item: await getAboutAdmin() });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  const paragraphs = Array.isArray(body?.paragraphs)
    ? body.paragraphs.map(String).filter((p: string) => p.trim())
    : String(body?.paragraphsText || "")
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean);

  const cms = await readCms();
  cms.about = {
    id: cms.about.id ?? 1,
    title: String(body?.title ?? cms.about.title).trim(),
    subtitle: String(body?.subtitle ?? cms.about.subtitle).trim(),
    paragraphs,
  };

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item: cms.about });
}
