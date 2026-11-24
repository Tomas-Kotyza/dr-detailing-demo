import type { MetadataRoute } from "next";
import { indexableLocalitySlugs } from "@/content/localities";
import { serviceSlugs } from "@/content/services";
import { getBlogPosts } from "@/lib/content";
import { isValidPublicSlug, slugify } from "@/lib/slugify";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();
  const { blogPosts: fallbackBlog } = await import("@/content/site");
  const blogSlugs = new Map<string, string>();
  for (const p of fallbackBlog) {
    const slug = isValidPublicSlug(p.slug) ? p.slug : slugify(p.slug);
    if (slug) blogSlugs.set(slug, p.date);
  }
  for (const p of blogPosts) {
    const slug = isValidPublicSlug(p.slug) ? p.slug : slugify(p.slug);
    if (slug) blogSlugs.set(slug, p.date);
  }

  const posts = [...blogSlugs.entries()].map(([slug, date]) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const services = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.92,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sluzby`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.96,
    },
    {
      url: `${baseUrl}/detailing-praha-9`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/detailing-praha-10`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.94,
    },
    ...indexableLocalitySlugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.93,
    })),
    ...services,
    {
      url: `${baseUrl}/galerie`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${baseUrl}/o-mne`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/obchodni-podminky`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ochrana-udaju`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...posts,
  ];
}
