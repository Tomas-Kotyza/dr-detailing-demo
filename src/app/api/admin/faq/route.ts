import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getFaqAdmin } from "@/lib/content";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await getFaqAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = await request.json().catch(() => null);
  if (!body?.question || !body?.answer) return badRequest("Vyplňte otázku i odpověď.");

  const cms = await readCms();
  const item = {
    id: (cms.faqItems.reduce((m, p) => Math.max(m, p.id ?? 0), 0) || 0) + 1,
    question: String(body.question).trim(),
    answer: String(body.answer).trim(),
    sortOrder: Number(body.sortOrder ?? cms.faqItems.length),
    published: body.published !== false,
  };
  cms.faqItems.push(item);
  const deleted = new Set(cms.deletedFaqQuestions ?? []);
  const qKey = item.question.trim().toLowerCase();
  if (deleted.has(qKey)) {
    deleted.delete(qKey);
    cms.deletedFaqQuestions = [...deleted];
  }

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
  if (body?.id == null) return badRequest("Chybí id.");

  const cms = await readCms();
  const idx = cms.faqItems.findIndex((f) => f.id === Number(body.id));
  if (idx < 0) return badRequest("Položka nenalezena.");

  cms.faqItems[idx] = {
    ...cms.faqItems[idx],
    question: String(body.question ?? cms.faqItems[idx].question).trim(),
    answer: String(body.answer ?? cms.faqItems[idx].answer).trim(),
    sortOrder: Number(body.sortOrder ?? cms.faqItems[idx].sortOrder ?? 0),
    published: body.published !== false,
  };

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ item: cms.faqItems[idx] });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return badRequest("Chybí id.");

  const cms = await readCms();
  const removed = cms.faqItems.find((f) => f.id === id);
  if (!removed) return badRequest("Položka nenalezena.");

  cms.faqItems = cms.faqItems.filter((f) => f.id !== id);
  const deleted = new Set(cms.deletedFaqQuestions ?? []);
  deleted.add(removed.question.trim().toLowerCase());
  cms.deletedFaqQuestions = [...deleted];

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ ok: true });
}
