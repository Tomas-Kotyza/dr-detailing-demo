import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import { readCms, writeCms } from "@/lib/cms/store";
import { getBlogAdmin } from "@/lib/content";
import { slugify } from "@/lib/slugify";

function parseParagraphs(body: Record<string, unknown>): string[] {
  if (Array.isArray(body.body)) return body.body.map(String).filter((p) => p.trim());
  return String(body.bodyText || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await getBlogAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.title) return badRequest("Vyplňte nadpis.");

  const cms = await readCms();
  const slug =
    slugify(String(body.slug || body.title || "")) || `clanek-${Date.now()}`;
  const item = {
    id: (cms.blogPosts.reduce((m, p) => Math.max(m, p.id ?? 0), 0) || 0) + 1,
    slug,
    title: String(body.title).trim(),
    excerpt: String(body.excerpt ?? "").trim(),
    date: String(body.date || new Date().toISOString().slice(0, 10)),
    body: parseParagraphs(body),
    sortOrder: Number(body.sortOrder ?? cms.blogPosts.length),
    published: body.published !== false,
  };
  // Nový článek — pokud byl dříve smazaný, povolíme slug znovu
  const deleted = new Set(cms.deletedBlogSlugs ?? []);
  if (deleted.has(slug)) {
    deleted.delete(slug);
    cms.deletedBlogSlugs = [...deleted];
  }
  cms.blogPosts.push(item);

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ item });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (body?.id == null) return badRequest("Chybí id.");

  const cms = await readCms();
  const idx = cms.blogPosts.findIndex((p) => p.id === Number(body.id));
  if (idx < 0) return badRequest("Článek nenalezen.");

  const nextTitle = String(body.title ?? cms.blogPosts[idx].title).trim();
  const nextSlug =
    slugify(String(body.slug || cms.blogPosts[idx].slug || nextTitle)) ||
    cms.blogPosts[idx].slug;
  cms.blogPosts[idx] = {
    ...cms.blogPosts[idx],
    slug: nextSlug,
    title: nextTitle,
    excerpt: String(body.excerpt ?? cms.blogPosts[idx].excerpt).trim(),
    date: String(body.date ?? cms.blogPosts[idx].date).trim(),
    body: parseParagraphs(body),
    sortOrder: Number(body.sortOrder ?? cms.blogPosts[idx].sortOrder ?? 0),
    published: body.published !== false,
  };

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  revalidatePath(`/blog/${cms.blogPosts[idx].slug}`);
  return NextResponse.json({ item: cms.blogPosts[idx] });
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
  const removed = cms.blogPosts.find((p) => p.id === id);
  if (!removed) return badRequest("Článek nenalezen.");

  cms.blogPosts = cms.blogPosts.filter((p) => p.id !== id);
  const deleted = new Set(cms.deletedBlogSlugs ?? []);
  deleted.add(removed.slug);
  cms.deletedBlogSlugs = [...deleted];

  try {
    await writeCms(cms);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
  revalidateContent();
  return NextResponse.json({ ok: true });
}
