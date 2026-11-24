import { site } from "@/content/site";

/** Místa v dojezdové vzdálenosti cca 30 min od Horních Počernic. */
export const serviceArea = {
  pickupNote:
    "Po domluvě auto vyzvedneme a vrátíme — dojezd do cca 30 minut od dílny v Horních Počernicích.",
  studio: `${site.address}, Horní Počernice (Praha 9)`,
  praha9: [
    "Horní Počernice",
    "Kyje",
    "Černý Most",
    "Letňany",
    "Prosek",
    "Hloubětín",
    "Střížkov",
  ],
  praha10: [
    "Uhříněves",
    "Dolní Měcholupy",
    "Štěrboholy",
    "Hostivař",
    "Malešice",
  ],
  okoli: [
    { name: "Brandýs nad Labem", drive: "cca 15 min" },
    { name: "Stará Boleslav", drive: "cca 15 min" },
    { name: "Úvaly", drive: "cca 15 min" },
    { name: "Klánovice", drive: "cca 10 min" },
    { name: "Újezd nad Lesy", drive: "cca 10 min" },
    { name: "Radonice", drive: "cca 15 min" },
    { name: "Lysá nad Labem", drive: "cca 20 min" },
    { name: "Milovice", drive: "cca 25 min" },
    { name: "Český Brod", drive: "cca 25 min" },
    { name: "Kostelec nad Černými lesy", drive: "cca 25 min" },
  ],
} as const;

/** Text pro sekci „Kam jezdíme“ na stránkách služeb. */
export const serviceAreaIntro =
  "Studio Dr Detailing je v Horních Počernicích (Praha 9). Nejvíc zákazníků máme z Prahy 9, Prahy 10 a okolních měst — ne z celé Prahy. Auto přivezete k nám, nebo po domluvě vyzvedneme v okruhu cca 30 minut.";

/** Schema.org areaServed pro JSON-LD. */
export function buildAreaServedJsonLd() {
  const items: { "@type": string; name: string }[] = [
    { "@type": "AdministrativeArea", name: "Praha 9" },
    { "@type": "AdministrativeArea", name: "Praha 10" },
    { "@type": "AdministrativeArea", name: "Horní Počernice" },
  ];
  for (const part of serviceArea.praha9) {
    if (part !== "Horní Počernice") {
      items.push({ "@type": "AdministrativeArea", name: part });
    }
  }
  for (const part of serviceArea.praha10) {
    items.push({ "@type": "AdministrativeArea", name: part });
  }
  for (const place of serviceArea.okoli) {
    items.push({ "@type": "City", name: place.name });
  }
  return items;
}

export type LocalityPageContent = {
  slug: string;
  name: string;
  label: string;
  drive: string;
  h1: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  /** Krátký řádek pod H1 — cena + svoz (CTR) */
  priceLead?: string;
  whyBullets: string[];
  faqs: { question: string; answer: string }[];
  extraSections?: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  /** Související lokality (slug bez /) */
  nearbyLinks?: { href: string; label: string }[];
  /**
   * Indexovat v Google + dát do sitemap.
   * Thin šablony bez unikátního obsahu = false (jinak „Procházeno – neindexováno“ / soft 404).
   */
  indexable?: boolean;
};

/** Priority lokality s daty / AIO — indexovat. Ostatní šablony zatím noindex. */
export const INDEXABLE_LOCALITY_SLUGS = [
  "detailing-brandys-nad-labem",
  "detailing-uvaly",
  "detailing-stara-boleslav",
] as const;

type LocalitySeed = {
  slug: string;
  name: string;
  /** Lokál v textu: „v Brandýse“ / „v Úvalech“ */
  locative: string;
  /** Odkud: „z Brandýsa“ / „z Úval“ */
  from: string;
  drive: string;
  /** Extra keyword varianty (bez „detailing …“) */
  extraKeywords?: string[];
};

function buildLocality(seed: LocalitySeed): LocalityPageContent {
  const { slug, name, locative, from, drive, extraKeywords = [] } = seed;
  return {
    slug,
    name,
    label: `Lokální služby · ${name}`,
    drive,
    h1: `Detailing ${name} — dojezd z Horních Počernic`,
    title: `Detailing ${name} — svoz auta, od 3 000 Kč`,
    description: `Detailing ${name}: studio Dr Detailing v Horních Počernicích, dojezd ${drive}. Leštění od 9 600 Kč, keramika od 7 500 Kč, renovace světlometů. Svoz auta po domluvě.`,
    keywords: [
      `detailing ${name}`,
      `leštění aut ${name}`,
      `keramická ochrana ${name}`,
      `čištění interiéru ${name}`,
      `renovace světlometů ${name}`,
      "detailing Horní Počernice",
      `autodetailing ${name}`,
      ...extraKeywords,
    ],
    intro: `Hledáte detailing ${locative}? Studio Dr Detailing je v Horních Počernicích (Praha 9) — ${from} je to obvykle ${drive}. Děláme rozleštění a leštění laku, renovaci laku, keramickou ochranu Gtechniq, čištění interiéru a renovaci světlometů. Auto přivezete na Lukaveckou 1732, nebo po domluvě vyzvedneme ${locative}.`,
    whyBullets: [
      `Blízký dojezd ${from} — studio na východní Praze, ne přes celé město`,
      `Svoz auta po domluvě ${from}`,
      "Keramika Gtechniq, jasné ceny „od“ na webu",
      "Proces: Diagnostika → Léčba → Lesk",
    ],
    faqs: [
      {
        question: `Děláte detailing pro ${name}?`,
        answer: `Ano. Studio je v Horních Počernicích (Praha 9) — ${from} je to obvykle ${drive}. Auto přivezete, nebo po domluvě vyzvedneme.`,
      },
      {
        question: `Kolik stojí detailing ${from}?`,
        answer:
          "Ceny jsou stejné jako pro celé studio: interiér od 3 000 Kč, leštění / rozleštění laku od 9 600 Kč, renovace od 23 900 Kč, keramika od 7 500 Kč (bez přípravy laku), světlomety pár 1 300 Kč.",
      },
      {
        question: `Vyzvednete auto ${locative}?`,
        answer: `Ano — po domluvě auto vyzvedneme ${locative} nebo okolí (do cca 30 min od dílny) a po práci vrátíme.`,
      },
    ],
  };
}

const localitySeeds: LocalitySeed[] = [
  {
    slug: "detailing-brandys-nad-labem",
    name: "Brandýs nad Labem",
    locative: "v Brandýse nad Labem",
    from: "z Brandýsa nad Labem",
    drive: "cca 15 minut",
    extraKeywords: ["detailing Brandýs", "leštění aut Brandýs"],
  },
  {
    slug: "detailing-stara-boleslav",
    name: "Stará Boleslav",
    locative: "ve Staré Boleslavi",
    from: "ze Staré Boleslavi",
    drive: "cca 15 minut",
  },
  {
    slug: "detailing-uvaly",
    name: "Úvaly",
    locative: "v Úvalech",
    from: "z Úval",
    drive: "cca 15 minut",
  },
  {
    slug: "detailing-klanovice",
    name: "Klánovice",
    locative: "v Klánovicích",
    from: "z Klánovic",
    drive: "cca 10 minut",
  },
  {
    slug: "detailing-ujezd-nad-lesy",
    name: "Újezd nad Lesy",
    locative: "v Újezdu nad Lesy",
    from: "z Újezdu nad Lesy",
    drive: "cca 10 minut",
  },
  {
    slug: "detailing-radonice",
    name: "Radonice",
    locative: "v Radonicích",
    from: "z Radonic",
    drive: "cca 15 minut",
  },
  {
    slug: "detailing-lysa-nad-labem",
    name: "Lysá nad Labem",
    locative: "v Lysé nad Labem",
    from: "z Lysé nad Labem",
    drive: "cca 20 minut",
  },
  {
    slug: "detailing-milovice",
    name: "Milovice",
    locative: "v Milovicích",
    from: "z Milovic",
    drive: "cca 25 minut",
  },
  {
    slug: "detailing-cesky-brod",
    name: "Český Brod",
    locative: "v Českém Brodě",
    from: "z Českého Brodu",
    drive: "cca 25 minut",
  },
  {
    slug: "detailing-kostelec-nad-cernymi-lesy",
    name: "Kostelec nad Černými lesy",
    locative: "v Kostelci nad Černými lesy",
    from: "z Kostelce nad Černými lesy",
    drive: "cca 25 minut",
    extraKeywords: ["detailing Kostelec"],
  },
];

function enrichPriorityLocality(loc: LocalityPageContent): LocalityPageContent {
  if (loc.slug === "detailing-brandys-nad-labem") {
    return {
      ...loc,
      h1: "Detailing Brandýs nad Labem — leštění, keramika, svoz",
      title: "Detailing Brandýs — leštění od 9 600 Kč, svoz auta",
      description:
        "Detailing Brandýs nad Labem: leštění laku od 9 600 Kč, keramika od 7 500 Kč, interiér od 3 000 Kč. Studio Horní Počernice (cca 15 min), svoz auta. Dr Detailing.",
      priceLead:
        "Interiér od 3 000 Kč · leštění od 9 600 Kč · keramika od 7 500 Kč · svoz z Brandýsa po domluvě",
      intro: `Hledáte detailing v Brandýse nad Labem? Studio Dr Detailing je v Horních Počernicích (Praha 9) — z Brandýsa obvykle cca 15 minut po silnici. Děláme rozleštění a leštění laku, renovaci laku, keramickou ochranu Gtechniq, čištění interiéru a renovaci světlometů. Auto přivezete na Lukaveckou 1732, nebo po domluvě vyzvedneme v Brandýse / Staré Boleslavi.`,
      keywords: [
        ...loc.keywords,
        "leštění laku Brandýs",
        "keramická ochrana Brandýs",
        "čištění interiéru Brandýs",
        "detailing Stará Boleslav",
      ],
      extraSections: [
        {
          heading: "Leštění laku z Brandýsa",
          paragraphs: [
            "Leštění / rozleštění laku od 9 600 Kč (1–2 dny). Stejná služba jako pro Prahu 9 — jen dojezd nebo svoz z Brandýsa. Detail: leštění laku Praha a blog rozleštění laku — cena.",
          ],
        },
        {
          heading: "Keramika a interiér",
          paragraphs: [
            "Keramická ochrana Gtechniq od 7 500 Kč (bez přípravy laku). Čištění interiéru od 3 000 Kč. Obojí lze spojit s leštěním v jednom termínu.",
          ],
        },
      ],
      faqs: [
        ...loc.faqs,
        {
          question: "Kolik stojí leštění auta z Brandýsa nad Labem?",
          answer:
            "Od 9 600 Kč za jednokrokové leštění / rozleštění. Renovace od 23 900 Kč. Svoz z Brandýsa po domluvě — cena služby stejná jako ve studiu.",
        },
        {
          question: "Děláte detailing i pro Starou Boleslav?",
          answer:
            "Ano — Stará Boleslav je stejně blízko (cca 15 min). Máme i stránku Detailing Stará Boleslav, nebo svoz z Brandýsa / Boleslavi dohromady.",
        },
        {
          question: "Jak dlouho trvá svoz z Brandýsa?",
          answer:
            "Po domluvě auto vyzvedneme a po práci vrátíme. Samotná cesta je cca 15 minut; termín svozu domluvíme s termínem práce.",
        },
      ],
      nearbyLinks: [
        { href: "/detailing-stara-boleslav", label: "Detailing Stará Boleslav" },
        { href: "/detailing-uvaly", label: "Detailing Úvaly" },
        { href: "/detailing-praha-9", label: "Detailing Praha 9" },
        { href: "/detailing-praha-10", label: "Detailing Praha 10" },
        { href: "/lesteni-laku-praha", label: "Leštění laku Praha" },
        { href: "/keramicka-ochrana-praha", label: "Keramická ochrana Praha" },
        { href: "/detailing-lysa-nad-labem", label: "Detailing Lysá nad Labem" },
      ],
      whyBullets: [
        "Z Brandýsa cca 15 min — studio na východní Praze",
        "Svoz auta z Brandýsa / Staré Boleslavi po domluvě",
        "Keramika Gtechniq, jasné ceny „od“",
        "Proces: Diagnostika → Léčba → Lesk",
      ],
    };
  }

  if (loc.slug === "detailing-uvaly") {
    return {
      ...loc,
      h1: "Detailing Úvaly — leštění, keramika, svoz auta",
      title: "Detailing Úvaly — leštění od 9 600 Kč, svoz auta",
      description:
        "Detailing Úvaly: leštění laku od 9 600 Kč, keramika od 7 500 Kč, interiér od 3 000 Kč. Studio Horní Počernice (cca 15 min), svoz auta. Dr Detailing.",
      priceLead:
        "Interiér od 3 000 Kč · leštění od 9 600 Kč · keramika od 7 500 Kč · svoz z Úval po domluvě",
      intro: `Hledáte detailing v Úvalech? Studio Dr Detailing je v Horních Počernicích (Praha 9) — z Úval obvykle cca 15 minut. Děláme rozleštění a leštění laku, renovaci laku, keramickou ochranu Gtechniq, čištění interiéru a renovaci světlometů. Auto přivezete na Lukaveckou 1732, nebo po domluvě vyzvedneme v Úvalech.`,
      keywords: [
        ...loc.keywords,
        "leštění laku Úvaly",
        "keramická ochrana Úvaly",
        "čištění interiéru Úvaly",
        "detailing Úvaly Praha",
      ],
      extraSections: [
        {
          heading: "Leštění laku z Úval",
          paragraphs: [
            "Leštění / rozleštění laku od 9 600 Kč (1–2 dny). Stejný postup jako v Praze 9. Detail služby: leštění laku Praha. Ceny: blog rozleštění laku — cena.",
          ],
        },
        {
          heading: "Keramika a čištění interiéru",
          paragraphs: [
            "Keramika Gtechniq od 7 500 Kč (lak musí být připravený). Čištění interiéru od 3 000 Kč — vhodné i jako doplněk k leštění.",
          ],
        },
      ],
      faqs: [
        ...loc.faqs,
        {
          question: "Kolik stojí leštění auta z Úval?",
          answer:
            "Od 9 600 Kč jednokrok / rozleštění. Renovace od 23 900 Kč. Svoz z Úval po domluvě bez změny ceníku služeb.",
        },
        {
          question: "Děláte keramickou ochranu pro zákazníky z Úval?",
          answer:
            "Ano — Gtechniq od 7 500 Kč (bez přípravy). Před keramikou leštění nebo renovace. Studio Horní Počernice, svoz z Úval možný.",
        },
        {
          question: "Jak daleko je studio z Úval?",
          answer:
            "Obvykle cca 15 minut do Horních Počernic (Praha 9). Alternativa: po domluvě auto vyzvedneme v Úvalech a po práci vrátíme.",
        },
      ],
      nearbyLinks: [
        { href: "/detailing-brandys-nad-labem", label: "Detailing Brandýs" },
        { href: "/detailing-praha-9", label: "Detailing Praha 9" },
        { href: "/detailing-praha-10", label: "Detailing Praha 10" },
        { href: "/lesteni-laku-praha", label: "Leštění laku Praha" },
        { href: "/keramicka-ochrana-praha", label: "Keramická ochrana Praha" },
        { href: "/detailing-klanovice", label: "Detailing Klánovice" },
      ],
      whyBullets: [
        "Z Úval cca 15 min do studia v Horních Počernicích",
        "Svoz auta z Úval po domluvě",
        "Keramika Gtechniq, jasné ceny „od“",
        "Proces: Diagnostika → Léčba → Lesk",
      ],
    };
  }

  return loc;
}

export const localityPages: LocalityPageContent[] = localitySeeds
  .map(buildLocality)
  .map(enrichPriorityLocality)
  .map((loc) => ({
    ...loc,
    indexable: (INDEXABLE_LOCALITY_SLUGS as readonly string[]).includes(loc.slug),
  }));

export const localitySlugs = localityPages.map((p) => p.slug);

/** Jen lokality, které mají jít do sitemap / indexu. */
export const indexableLocalitySlugs = localityPages
  .filter((p) => p.indexable !== false)
  .map((p) => p.slug);

export function getLocalityBySlug(slug: string): LocalityPageContent | undefined {
  return localityPages.find((p) => p.slug === slug);
}

/** Odkazy na stránky obcí v okolí (pro ServiceAreaSection). */
export const localityPageLinks: Record<string, string> = Object.fromEntries(
  localityPages.map((p) => [p.name, `/${p.slug}`]),
);

/** Klíčová slova „detailing + místo“ — Firmy.cz, Collabim, meta. */
export const localitySeoKeywords: string[] = [
  ...localityPages.map((p) => `detailing ${p.name}`),
  "detailing Praha 9",
  "detailing Praha 10",
  "detailing Horní Počernice",
  "detailing Černý Most",
  "detailing Uhříněves",
  "detailing Hostivař",
];
