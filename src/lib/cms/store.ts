import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { isValidPublicSlug, slugify } from "@/lib/slugify";
import { createDefaultCms } from "./defaults";
import type { CmsData } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "cms.json");
const BLOB_PATHNAME = "drdetailing-cms.json";

const OLD_RENOVATE_INCLUDE =
  "vícekroková renovace vč. zádveří, oken a lesklých plastů";
const OLD_INTERIOR_INCLUDES = [
  "vysávání a čištění sedadel, koberců a kufru",
  "ošetření plastů a výdechů",
  "čištění skel zevnitř",
  "dle stavu: hloubkové čištění čalounění",
] as const;

function ensureNumericIds<T extends { dbId?: number }>(items: T[]): T[] {
  let max = items.reduce((m, item) => Math.max(m, item.dbId ?? 0), 0);
  return items.map((item) => {
    if (item.dbId != null && item.dbId > 0) return item;
    max += 1;
    return { ...item, dbId: max };
  });
}

/** Doplnění chybějícího obsahu + drobné textové úpravy — bez přepisu uložených změn. */
function applyClientContentEdits(data: CmsData): CmsData {
  const defaults = createDefaultCms();
  const deletedBlog = new Set(data.deletedBlogSlugs ?? []);
  const deletedFaq = new Set(
    (data.deletedFaqQuestions ?? []).map((q) => q.trim().toLowerCase()),
  );

  const existingBlogSlugs = new Set(data.blogPosts.map((p) => p.slug));
  const mergedBlog = [
    ...data.blogPosts,
    ...defaults.blogPosts.filter(
      (p) => !existingBlogSlugs.has(p.slug) && !deletedBlog.has(p.slug),
    ),
  ];

  const existingFaqQuestions = new Set(
    data.faqItems.map((f) => f.question.trim().toLowerCase()),
  );
  const nextFaqId =
    data.faqItems.reduce((max, f) => Math.max(max, f.id ?? 0), 0) + 1;
  const newFaqs = defaults.faqItems
    .filter((f) => {
      const q = f.question.trim().toLowerCase();
      return !existingFaqQuestions.has(q) && !deletedFaq.has(q);
    })
    .map((f, i) => ({ ...f, id: nextFaqId + i }));

  let promos =
    Array.isArray(data.promos) && data.promos.length > 0
      ? data.promos.map((p) => ({ ...p }))
      : defaults.promos.map((p) => ({ ...p }));
  let promosClearedAt = data.promosClearedAt;
  // Jednorázově vypnout staré živé akce (světlomety / ozon za 1 Kč) — okno na webu zůstane.
  if (!promosClearedAt) {
    promos = promos.map((p) => ({ ...p, active: false }));
    promosClearedAt = new Date().toISOString();
  }

  return {
    ...data,
    deletedBlogSlugs: [...deletedBlog],
    deletedFaqQuestions: [...deletedFaq],
    promos,
    promosClearedAt,
    seasonActive: data.seasonActive ?? defaults.seasonActive,
    seasonCampaigns:
      Array.isArray(data.seasonCampaigns) && data.seasonCampaigns.length === 4
        ? data.seasonCampaigns
        : defaults.seasonCampaigns?.map((c) => ({ ...c })),
    novinky: data.novinky
      ? {
          ...defaults.novinky!,
          ...data.novinky,
          leadPopup: {
            ...defaults.novinky!.leadPopup,
            ...data.novinky.leadPopup,
          },
          ebook: {
            ...defaults.novinky!.ebook,
            ...data.novinky.ebook,
            chapters:
              Array.isArray(data.novinky.ebook?.chapters) &&
              data.novinky.ebook.chapters.length > 0
                ? data.novinky.ebook.chapters
                : defaults.novinky!.ebook.chapters,
          },
        }
      : defaults.novinky,
    reviews: ensureNumericIds(data.reviews),
    priceItems: ensureNumericIds(
      data.priceItems.map((item) => {
        if (item.id === "renovate") {
          return {
            ...item,
            includes: item.includes.map((line) =>
              line === OLD_RENOVATE_INCLUDE ? "vícekroková renovace" : line,
            ),
          };
        }
        if (item.id === "interior") {
          const sameOldIncludes =
            item.includes.length === OLD_INTERIOR_INCLUDES.length &&
            OLD_INTERIOR_INCLUDES.every((line, i) => item.includes[i] === line);
          return {
            ...item,
            summary:
              item.summary
                .replace(/čištění kabiny/gi, "čištění interiéru")
                .replace(/\bkabiny\b/gi, "interiér")
                .replace(/\bkabinu\b/gi, "interiér")
                .replace(/\s*Cena se liší podle znečištění\.?/i, "")
                .replace(/\s*Cena podle znečištění\.?/i, "")
                .trim() || "Kompletní čištění interiéru.",
            includes: sameOldIncludes ? [] : item.includes,
          };
        }
        return item;
      }),
    ),
    faqItems: [...data.faqItems, ...newFaqs].map((item) => ({
      ...item,
      answer: item.answer
        .replace(/čištění kabiny/gi, "čištění interiéru")
        .replace(/\bkabiny\b/gi, "interiér"),
    })),
    // Uložené články z adminu zůstávají; jen doplníme nové z defaults a textovou záměnu.
    // Špatné slugy (háčky, mezery, ?) dělají 404 ve výsledcích vyhledávání — vždy sjednotit.
    // CTR seed pro rozlesteni-laku-cena: title/excerpt/body vždy ze site.ts (SEO kampaně).
    blogPosts: mergedBlog.map((post) => {
      const rawSlug = String(post.slug || "").trim();
      const nextSlug = isValidPublicSlug(rawSlug)
        ? rawSlug
        : slugify(rawSlug || post.title) || `clanek-${post.id ?? Date.now()}`;
      const seed =
        nextSlug === "rozlesteni-laku-cena"
          ? defaults.blogPosts.find((p) => p.slug === "rozlesteni-laku-cena")
          : undefined;
      const excerptBase = seed?.excerpt ?? post.excerpt;
      const bodyBase = seed?.body ?? post.body;
      return {
        ...post,
        slug: nextSlug,
        title: seed?.title ?? post.title,
        excerpt: excerptBase.replace(/čištění kabiny/gi, "čištění interiéru"),
        body: bodyBase.map((p) =>
          p.replace(/čištění kabiny/gi, "čištění interiéru"),
        ),
      };
    }),
  };
}

function blogCtrSeedNeedsWrite(before: CmsData, after: CmsData): boolean {
  const a = after.blogPosts.find((p) => p.slug === "rozlesteni-laku-cena");
  const b = before.blogPosts.find((p) => p.slug === "rozlesteni-laku-cena");
  if (!a) return false;
  if (!b) return true;
  return (
    a.title !== b.title ||
    a.excerpt !== b.excerpt ||
    JSON.stringify(a.body) !== JSON.stringify(b.body)
  );
}

function blogSlugsNeedRepair(before: CmsData, after: CmsData): boolean {
  const beforeById = new Map(
    before.blogPosts.map((p) => [p.id ?? p.slug, p.slug] as const),
  );
  return after.blogPosts.some((p) => {
    const prev = beforeById.get(p.id ?? p.slug);
    return prev != null && prev !== p.slug;
  });
}

function promosClearedNeedsWrite(before: CmsData, after: CmsData): boolean {
  return !before.promosClearedAt && Boolean(after.promosClearedAt);
}

let memoryCache: CmsData | null = null;

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readLocalFile(): Promise<CmsData | null> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as CmsData;
  } catch {
    return null;
  }
}

async function writeLocalFile(data: CmsData) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<CmsData | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    // Vždy bust CDN — CMS JSON musí být po admin úpravě aktuální.
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CmsData;
  } catch {
    return null;
  }
}

async function writeBlob(data: CmsData) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

/** Načte CMS — Blob (produkce) → lokální soubor → výchozí obsah. */
export async function readCms(): Promise<CmsData> {
  if (memoryCache) return memoryCache;

  const fromBlob = await readBlob();
  if (fromBlob) {
    memoryCache = applyClientContentEdits(fromBlob);
    if (
      (blogSlugsNeedRepair(fromBlob, memoryCache) ||
        blogCtrSeedNeedsWrite(fromBlob, memoryCache) ||
        promosClearedNeedsWrite(fromBlob, memoryCache)) &&
      hasBlob()
    ) {
      try {
        await writeBlob(memoryCache);
      } catch {
        /* serving opraví slugy / CTR seed / promos v paměti i bez zápisu */
      }
    }
    return memoryCache;
  }

  const fromFile = await readLocalFile();
  if (fromFile) {
    memoryCache = applyClientContentEdits(fromFile);
    if (
      blogSlugsNeedRepair(fromFile, memoryCache) ||
      blogCtrSeedNeedsWrite(fromFile, memoryCache) ||
      promosClearedNeedsWrite(fromFile, memoryCache)
    ) {
      try {
        await writeLocalFile(memoryCache);
      } catch {
        /* ignore */
      }
    }
    return memoryCache;
  }

  const defaults = createDefaultCms();
  memoryCache = defaults;
  return defaults;
}

/** Uloží CMS. Lokálně do souboru; na Vercelu do Blob (stejný účet, bez Neon). */
export async function writeCms(data: CmsData): Promise<CmsData> {
  const next: CmsData = { ...data, updatedAt: new Date().toISOString() };

  if (hasBlob()) {
    await writeBlob(next);
  } else {
    try {
      await writeLocalFile(next);
    } catch {
      throw new Error(
        "Na produkci nelze zapisovat bez úložiště. Ve Vercelu (stejný účet) vytvořte Storage → Blob — žádná nová registrace. Nebo upravujte lokálně.",
      );
    }
  }

  // Držet právě uložená data v paměti — clearCmsCache hned po zápisu by riskoval
  // znovunačtení staré CDN kopie Blobu při regeneraci stránky.
  memoryCache = applyClientContentEdits(next);
  return memoryCache;
}

export function clearCmsCache() {
  memoryCache = null;
}

export function cmsWritableHint() {
  if (hasBlob()) return "blob";
  return "local-file";
}
