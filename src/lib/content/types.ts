export type ReviewItem = {
  id: string;
  dbId?: number;
  role: "owner" | "customer" | string;
  name: string;
  car: string;
  text: string;
  sortOrder?: number;
  published?: boolean;
};

export type BlogPostItem = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string[];
  sortOrder?: number;
  published?: boolean;
};

export type FaqItem = {
  id?: number;
  question: string;
  answer: string;
  sortOrder?: number;
  published?: boolean;
};

export type PriceItem = {
  id: string;
  dbId?: number;
  name: string;
  meta: string;
  price: string;
  summary: string;
  includes: string[];
  sortOrder?: number;
  published?: boolean;
};

export type AboutContent = {
  id?: number;
  title: string;
  subtitle: string;
  paragraphs: string[];
};

/** Marketingová akce — texty ke kopírování + plakát */
export type PromoItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  offerLine: string;
  /** Velká cena uprostřed letáku (např. „1 Kč“ nebo „od 9 600 Kč“) */
  flyerPrice: string;
  body: string;
  mapsText: string;
  smsText: string;
  instagramText: string;
  posterUrl: string;
  active: boolean;
  sortOrder?: number;
};
