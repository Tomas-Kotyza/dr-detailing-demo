import type {
  AboutContent,
  BlogPostItem,
  FaqItem,
  PriceItem,
  PromoItem,
  ReviewItem,
} from "@/lib/content/types";
import type { SeasonCampaign, SeasonId } from "@/content/seasons";

export type LeadPopupConfig = {
  title: string;
  body: string;
  discountLabel: string;
  buttonLabel: string;
  delaySeconds: number;
};

export type EbookChapter = {
  heading: string;
  paragraphs: string[];
};

export type EbookConfig = {
  title: string;
  subtitle: string;
  chapters: EbookChapter[];
};

/** Novinky — náhled v adminu; na veřejný web až po osobním spuštění. */
export type NovinkyState = {
  seasonApproved: boolean;
  leadPopupApproved: boolean;
  ebookApproved: boolean;
  leadPopup: LeadPopupConfig;
  ebook: EbookConfig;
};

export type CmsData = {
  reviews: ReviewItem[];
  blogPosts: BlogPostItem[];
  faqItems: FaqItem[];
  priceItems: PriceItem[];
  about: AboutContent;
  ceramicNote: string;
  promos: PromoItem[];
  /** Jednorázově vypnuto živé akce (světlomety 1 Kč atd.) — slot na webu zůstává. */
  promosClearedAt?: string;
  /** Aktivní sezónní výzva na homepage (přepíná se v adminu). */
  seasonActive?: SeasonId;
  seasonCampaigns?: SeasonCampaign[];
  novinky?: NovinkyState;
  /** Slugy článků smazaných v adminu — ať se znovu nedoplní z výchozího obsahu. */
  deletedBlogSlugs?: string[];
  /** Otázky FAQ smazané v adminu (lowercase). */
  deletedFaqQuestions?: string[];
  updatedAt: string;
};
