import {
  blogPosts,
  priceLines,
  reviews,
  site,
} from "@/content/site";
import { faqItems } from "@/content/faq";
import { defaultPromos } from "@/content/promos";
import {
  defaultSeasonCampaigns,
  seasonIdFromDate,
} from "@/content/seasons";
import { defaultEbook, defaultLeadPopup } from "@/content/novinky-defaults";
import type { CmsData } from "./types";

/** Výchozí obsah = současný web (bez databáze / registrace). */
export function createDefaultCms(): CmsData {
  return {
    reviews: reviews.map((r, i) => ({
      id: r.id,
      dbId: i + 1,
      role: r.role,
      name: r.name,
      car: r.car,
      text: r.text,
      sortOrder: i,
      published: true,
    })),
    blogPosts: blogPosts.map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      body: [...p.body],
      sortOrder: i,
      published: true,
    })),
    faqItems: faqItems.map((f, i) => ({
      id: i + 1,
      question: f.question,
      answer: f.answer,
      sortOrder: i,
      published: true,
    })),
    priceItems: priceLines.map((p, i) => ({
      id: p.id,
      dbId: i + 1,
      name: p.name,
      meta: p.meta,
      price: p.price,
      summary: p.summary,
      includes: [...p.includes],
      sortOrder: i,
      published: true,
    })),
    about: {
      id: 1,
      title: "O mně",
      subtitle: `${site.legalName} · ${site.brandName} · ${site.place}`,
      paragraphs: [
        "Už vás nebaví koukat na špinavý a kartáči zničený lak? Dejte auto k nám — a my z něj zase uděláme nové.",
        "Roky se věnujeme tomuto řemeslu. Za tu dobu jsme zvolili postupy i kosmetiku, která patří k nejlepším na trhu — včetně keramiky Gtechniq.",
        "Vůz můžete přivézt do dílny v Horních Počernicích. Po domluvě ho také vyzvedneme a po dokončení práce vrátíme na domluvené místo.",
        "Samozřejmostí je osobní přístup a vysoká pečlivost — na tom si zakládáme.",
      ],
    },
    ceramicNote:
      "Před každou keramickou ochranou musí být lak vyleštěn. Ceny keramiky jsou bez přípravy laku. Pokud lak není v perfektním stavu, nejdřív dekontaminace a renovace.",
    promos: defaultPromos.map((p) => ({ ...p })),
    seasonActive: seasonIdFromDate(),
    seasonCampaigns: defaultSeasonCampaigns.map((c) => ({ ...c })),
    novinky: {
      seasonApproved: false,
      leadPopupApproved: false,
      ebookApproved: false,
      leadPopup: { ...defaultLeadPopup },
      ebook: {
        title: defaultEbook.title,
        subtitle: defaultEbook.subtitle,
        chapters: defaultEbook.chapters.map((ch) => ({
          heading: ch.heading,
          paragraphs: [...ch.paragraphs],
        })),
      },
    },
    updatedAt: new Date().toISOString(),
  };
}
