import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

/** Povolení běžných AI crawlerů (stejná pravidla jako *). Explicitně, ať je jasné, že je neblokujeme. */
const aiBots = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "ClaudeBot",
  "PerplexityBot",
  "Applebot-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/logo",
          "/logo/",
          "/admin",
          "/admin/",
          "/api/admin",
          "/predani",
          "/predani/",
          "/faktura",
          "/faktura/",
        ],
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
        disallow: [
          "/logo",
          "/logo/",
          "/admin",
          "/admin/",
          "/api/admin",
          "/predani",
          "/predani/",
          "/faktura",
          "/faktura/",
        ],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
