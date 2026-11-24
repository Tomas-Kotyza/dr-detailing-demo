import { unstable_cache } from "next/cache";
import { readCms, clearCmsCache } from "@/lib/cms/store";
import type { AboutContent, BlogPostItem, FaqItem, PriceItem, PromoItem, ReviewItem } from "./types";

export const CONTENT_TAG = "site-content";

export { clearCmsCache };

async function loadReviews(publishedOnly: boolean): Promise<ReviewItem[]> {
  const cms = await readCms();
  return cms.reviews
    .filter((r) => (publishedOnly ? r.published !== false : true))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function loadBlog(publishedOnly: boolean): Promise<BlogPostItem[]> {
  const cms = await readCms();
  return cms.blogPosts
    .filter((r) => (publishedOnly ? r.published !== false : true))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function loadFaq(publishedOnly: boolean): Promise<FaqItem[]> {
  const cms = await readCms();
  return cms.faqItems
    .filter((r) => (publishedOnly ? r.published !== false : true))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function loadPrices(publishedOnly: boolean): Promise<PriceItem[]> {
  const cms = await readCms();
  return cms.priceItems
    .filter((r) => (publishedOnly ? r.published !== false : true))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

async function loadAbout(): Promise<AboutContent> {
  const cms = await readCms();
  return cms.about;
}

async function loadCeramicNote(): Promise<string> {
  const cms = await readCms();
  return cms.ceramicNote;
}

export const getReviews = unstable_cache(() => loadReviews(true), ["reviews-public"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export const getBlogPosts = unstable_cache(() => loadBlog(true), ["blog-public"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export const getFaqItems = unstable_cache(() => loadFaq(true), ["faq-public"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export const getPriceItems = unstable_cache(() => loadPrices(true), ["prices-public"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export const getAbout = unstable_cache(() => loadAbout(), ["about-public"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export const getCeramicNote = unstable_cache(() => loadCeramicNote(), ["ceramic-note"], {
  tags: [CONTENT_TAG],
  revalidate: 60,
});

export async function getReviewsAdmin() {
  return loadReviews(false);
}
export async function getBlogAdmin() {
  return loadBlog(false);
}
export async function getFaqAdmin() {
  return loadFaq(false);
}
export async function getPricesAdmin() {
  return loadPrices(false);
}
export async function getAboutAdmin() {
  return loadAbout();
}

export async function getPromosAdmin(): Promise<PromoItem[]> {
  const cms = await readCms();
  return [...(cms.promos ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

/** Aktivní akce pro veřejný web (homepage u objednávky). Bez aktivní = prázdné okno. */
export async function getActivePromos(): Promise<PromoItem[]> {
  const all = await getPromosAdmin();
  return all.filter((p) => p.active);
}

/** Aktivní sezónní výzva (admin může přepnout / upravit texty). */
export async function getActiveSeasonCampaign() {
  const {
    defaultSeasonCampaigns,
    getSeasonCampaign,
    seasonIdFromDate,
  } = await import("@/content/seasons");
  const cms = await readCms();
  const campaigns =
    Array.isArray(cms.seasonCampaigns) && cms.seasonCampaigns.length === 4
      ? cms.seasonCampaigns
      : defaultSeasonCampaigns;
  const activeId = cms.seasonActive ?? seasonIdFromDate();
  return getSeasonCampaign(campaigns, activeId);
}

export async function getSeasonAdmin() {
  const {
    defaultSeasonCampaigns,
    seasonIdFromDate,
  } = await import("@/content/seasons");
  const cms = await readCms();
  return {
    active: cms.seasonActive ?? seasonIdFromDate(),
    campaigns:
      Array.isArray(cms.seasonCampaigns) && cms.seasonCampaigns.length === 4
        ? cms.seasonCampaigns
        : defaultSeasonCampaigns.map((c) => ({ ...c })),
  };
}

export async function getNovinky() {
  const { createDefaultCms } = await import("@/lib/cms/defaults");
  const cms = await readCms();
  return cms.novinky ?? createDefaultCms().novinky!;
}

/** Sezóna na homepage jen po schválení v Novinkách. */
export async function getPublicSeasonCampaign() {
  const novinky = await getNovinky();
  if (!novinky.seasonApproved) return null;
  return getActiveSeasonCampaign();
}

export async function getBlogBySlug(slug: string) {
  const { slugify } = await import("@/lib/slugify");
  const wanted = slugify(slug) || slug;
  const posts = await getBlogPosts();
  const hit = posts.find(
    (p) => p.slug === slug || p.slug === wanted || slugify(p.slug) === wanted,
  );
  if (hit) return hit;

  // Fallback: nový článek v kódu, ještě ne v produkčním CMS Blobu
  const { blogPosts } = await import("@/content/site");
  const fallback = blogPosts.find(
    (p) => p.slug === slug || p.slug === wanted || slugify(p.slug) === wanted,
  );
  if (!fallback) return null;
  return {
    slug: fallback.slug,
    title: fallback.title,
    excerpt: fallback.excerpt,
    date: fallback.date,
    body: [...fallback.body],
    published: true,
  };
}
