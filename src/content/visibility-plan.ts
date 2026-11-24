import { site } from "@/content/site";
import {
  collabimKeywordPages,
  collabimKeywordsSkipped,
  collabimPagesCopyPaste,
} from "@/content/collabim-keywords";

export type VisibilityPlanSection = {
  id: string;
  title: string;
  intro?: string;
  bullets?: string[];
  table?: { label: string; value: string }[];
  copyBlocks?: { id: string; label: string; text: string }[];
  links?: { label: string; href: string }[];
};

export const visibilityPlanMeta = {
  title: "Plán reklama a viditelnost",
  subtitle:
    "Jednoduchý návod, co dělat pravidelně, aby web zůstal na 1. stránce Google a přiváděl zákazníky.",
} as const;

export const visibilityPlanChecklist = [
  "Firmy.cz: doplnit kategorie + klíčová slova (viz sekce níže)",
  "Collabim: u nových KW nastavit cílovou URL (sekce Collabim → stránky)",
  "AI: 1× za měsíc ruční test promptů (ChatGPT) — sekce AI viditelnost",
  "Týden: 1 příspěvek Google Maps (text z /admin/akce)",
  "Po zakázce: výzva k recenzi (+ ozon za 1 Kč)",
  "2× měsíčně: fotka před/po na Maps",
  "Měsíc: Search Console — top dotazy",
  "Volitelně: Google Ads Návrh A (800 Kč/měsíc)",
  "Telefon vždy zvedat / volat zpět do 24 h",
] as const;

/** Collabim — přiřazení suggested KW na landing URL (export 11/2026). */
export const collabimWebLinking = {
  title: "Collabim — klíčová slova → stránky webu",
  intro:
    "Nová suggested keywords z Collabimu jsou na webu v meta + textech. V Collabimu u každého KW nastavte cílovou URL (kopírovat níže). Irrelevantní KW (lakovna, Dr Max…) nepropojujte.",
  priority: [
    "čištění interiéru vozu → /cisteni-interieru-praha (880 hledání/měs)",
    "detailing auto → /detailing-praha-9 (1000 — už top)",
    "leštění aut → /lesteni-laku-praha (260)",
    "rozleštění laku auta → /lesteni-laku-praha (110)",
    "oprava laku auta ceník → /renovace-laku-praha (140)",
    "oprava světlometů Praha → /renovace-svetlometu-praha (40)",
  ],
  skipNote: `Přeskočit v Collabimu: ${collabimKeywordsSkipped.map((s) => s.keyword).join(", ")}.`,
  copyPaste: collabimPagesCopyPaste(),
  count: collabimKeywordPages.length,
} as const;

/** Firmy.cz (Seznam) — klíčová slova a texty k vyplnění profilu. */
export const firmyCzKeywords = {
  title: "Firmy.cz — klíčová slova a popis",
  intro:
    "Na Firmy.cz vybírejte slova, která lidé opravdu hledají. Preferujte Prahu 9, Horní Počernice a okolí — ne obecnou „celou Prahu“.",
  categories: [
    "Autodetailing",
    "Leštění karoserie",
    "Čištění interiérů aut",
    "Ochrana laku (keramika)",
    "Autoservis / péče o vozidla (pokud nabídne)",
  ],
  /** Priorita — přidat jako první (lokální + hlavní služby). */
  primary: [
    "detailing Praha 9",
    "detailing Horní Počernice",
    "leštění laku Praha 9",
    "leštění karoserie Praha 9",
    "keramická ochrana laku Praha 9",
    "čištění interiéru auta Praha 9",
    "renovace světlometů Praha 9",
    "autodetailing Praha 9",
    "detailing Praha 10",
    "detailing Brandýs nad Labem",
    "detailing Úvaly",
    "detailing Klánovice",
    "detailing Stará Boleslav",
    "detailing Lysá nad Labem",
  ],
  /** Doplňky — pokud systém nabídne / půjdou vyhledat. */
  secondary: [
    "leštění aut Praha 9",
    "rozleštění laku",
    "keramický povlak auto",
    "Gtechniq Praha",
    "renovace laku Praha 9",
    "leštění světlometů",
    "zmatnělé světlomety",
    "detailing Újezd nad Lesy",
    "detailing Radonice",
    "detailing Milovice",
    "detailing Český Brod",
    "detailing Kostelec nad Černými lesy",
    "detailing Černý Most",
    "detailing Uhříněves",
    "detailing Hostivař",
    "svoz auta detailing",
  ],
  /** Jedním řádkem — pro rychlé kopírování do vyhledávače klíčových slov. */
  allCopyPaste: [
    "detailing Praha 9",
    "detailing Horní Počernice",
    "leštění laku Praha 9",
    "leštění karoserie Praha 9",
    "leštění aut Praha 9",
    "keramická ochrana laku Praha 9",
    "keramický povlak auto",
    "Gtechniq Praha",
    "čištění interiéru auta Praha 9",
    "renovace světlometů Praha 9",
    "leštění světlometů",
    "renovace laku Praha 9",
    "autodetailing Praha 9",
    "detailing Praha 10",
    "detailing Brandýs nad Labem",
    "detailing Stará Boleslav",
    "detailing Úvaly",
    "detailing Klánovice",
    "detailing Újezd nad Lesy",
    "detailing Radonice",
    "detailing Lysá nad Labem",
    "detailing Milovice",
    "detailing Český Brod",
    "detailing Kostelec nad Černými lesy",
    "detailing Černý Most",
    "detailing Uhříněves",
    "detailing Hostivař",
  ].join(", "),
  /** Max ~300 znaků — pravidla Firmy.cz. */
  description300:
    "Dr Detailing — studio Horní Počernice (Praha 9). Leštění laku, keramika Gtechniq, interiér, světlomety. Praha 9/10 + Brandýs, Úvaly, Klánovice, Lysá… Svoz auta po domluvě.",
  tips: [
    "Nejdřív kategorie, pak klíčová slova v záložce Hledání.",
    "Přidejte všechna „primary“ slova, která systém najde.",
    "Popis max 300 znaků — text níže je připravený ke zkopírování.",
    "Web: https://drdetailing.cz — adresa provozovny Lukavecká 1732.",
    "Fotky: logo + 3–5 fotek práce (před/po).",
  ],
} as const;

/** Ruční AI testy — Collabim měření necháváme vypnuté (platí se). */
export const aiVisibilityManual = {
  title: "AI viditelnost — ruční testy (bez placeného měření)",
  intro:
    "Collabim AI měření zatím nepoužíváme. Jednou za čas zadejte otázky níže do ChatGPT / Gemini / Perplexity a zkontrolujte, jestli zmínili Dr Detailing + odkaz nebo telefon.",
  tips: [
    "Ideálně inkognito / nový chat — bez historie o Dr Detailing.",
    "Zaznamenejte: zmínili nás? uvedli telefon / web / adresu?",
    "Soubor pro AI crawlers: https://drdetailing.cz/llms.txt",
    "Až budete chtít pravidelné měření v Collabimu, zapneme addon + tyto prompty tam nahrajeme.",
  ],
  prompts: [
    "Kde najdu autodetailing v Praze 9 nebo Horních Počernicích?",
    "Kolik stojí leštění laku v Praze 9?",
    "Kdo dělá keramickou ochranu Gtechniq v Praze 9?",
    "Doporuč detailing studio u Brandýsa nad Labem nebo Úval",
    "Renovace světlometů Praha 9 — cena a kdo to dělá spolehlivě?",
    "Hledám čištění interiéru auta Praha 9 s možností svozu auta",
    "Dr Detailing Horní Počernice — co nabízejí a jak objednat?",
  ],
  expectedFacts: [
    "Dr Detailing / Patrik Doktor",
    "Lukavecká 1732, Horní Počernice",
    "+420 739 411 108",
    "https://drdetailing.cz",
    "ceny od (leštění ~9 600 Kč, interiér ~3 000 Kč…)",
  ],
} as const;

export const visibilityPlanIndexUrls = [
  "https://drdetailing.cz/lesteni-laku-praha",
  "https://drdetailing.cz/keramicka-ochrana-praha",
  "https://drdetailing.cz/renovace-svetlometu-praha",
  "https://drdetailing.cz/cisteni-interieru-praha",
  "https://drdetailing.cz/renovace-laku-praha",
  "https://drdetailing.cz/detailing-praha-9",
  "https://drdetailing.cz/detailing-praha-10",
  "https://drdetailing.cz/detailing-brandys-nad-labem",
  "https://drdetailing.cz/detailing-uvaly",
  "https://drdetailing.cz/sluzby",
] as const;

/** Další kontrola indexace — cca 2 týdny po nasazení lokálních stránek. */
export const visibilityPlanIndexFollowUp = {
  dueDate: "2026-09-16",
  dueLabel: "pondělí 16. 9. 2026",
  title: "Kontrola indexace (za ~2 týdny)",
  steps: [
    "Search Console → Indexování stránek — zkontrolovat stav nových URL (Praha 10, Brandýs, Úvaly)",
    "U neindexovaných: Kontrola URL → živý test → Požádat o indexaci (max 1–2 URL denně)",
    "U leštění laku vždy správná URL: /lesteni-laku-praha (ne /lesteni-laku-praha-9 — ta je 404)",
    "Lokality okolí (Brandýs, Úvaly, Klánovice, Lysá…) — zkontrolovat indexaci nových URL",
  ],
} as const;

export const visibilityPlanSections: VisibilityPlanSection[] = [
  {
    id: "hotove",
    title: "Co už máte hotové",
    intro: "Web je připravený pro Google. Vaše práce: pravidelná aktivita na Maps, recenze a příspěvky.",
    bullets: [
      "Samostatné stránky služeb (leštění, keramika, interiér, světlomety, renovace)",
      "Ceník s cenami „od“, blog, mapa a kontakt",
      "Sekce Akce v adminu — texty pro Maps, SMS a Instagram",
    ],
  },
  {
    id: "collabim-pages",
    title: collabimWebLinking.title,
    intro: collabimWebLinking.intro,
    bullets: [
      `Propojeno na webu: ${collabimWebLinking.count} klíčových slov`,
      "— Priorita (nejvyšší volume) —",
      ...collabimWebLinking.priority.map((p) => `• ${p}`),
      collabimWebLinking.skipNote,
    ],
    copyBlocks: [
      {
        id: "collabim-url-map",
        label: "Collabim: KW → URL (tab-oddělené)",
        text: collabimWebLinking.copyPaste,
      },
    ],
    links: [
      { label: "Collabim", href: "https://www.collabim.cz/" },
      { label: "Search Console", href: "https://search.google.com/search-console" },
    ],
  },
  {
    id: "firmy-cz",
    title: firmyCzKeywords.title,
    intro: firmyCzKeywords.intro,
    bullets: [
      ...firmyCzKeywords.tips,
      "— Kategorie (vybrat co jde) —",
      ...firmyCzKeywords.categories.map((c) => `• ${c}`),
      "— Prioritní klíčová slova —",
      ...firmyCzKeywords.primary.map((k) => `• ${k}`),
      "— Doplňková klíčová slova —",
      ...firmyCzKeywords.secondary.map((k) => `• ${k}`),
    ],
    copyBlocks: [
      {
        id: "firmy-keywords",
        label: "Klíčová slova (kopírovat)",
        text: firmyCzKeywords.allCopyPaste,
      },
      {
        id: "firmy-description",
        label: "Popis firmy (max 300 znaků)",
        text: firmyCzKeywords.description300,
      },
    ],
  },
  {
    id: "ai-viditelnost",
    title: aiVisibilityManual.title,
    intro: aiVisibilityManual.intro,
    bullets: [
      ...aiVisibilityManual.tips,
      "— Co má AI ideálně zmínit —",
      ...aiVisibilityManual.expectedFacts.map((f) => `• ${f}`),
    ],
    copyBlocks: [
      {
        id: "ai-prompts",
        label: "Prompty pro ruční test (kopírovat)",
        text: aiVisibilityManual.prompts.map((p, i) => `${i + 1}. ${p}`).join("\n"),
      },
    ],
  },
  {
    id: "indexace-followup",
    title: visibilityPlanIndexFollowUp.title,
    intro: `Termín: ${visibilityPlanIndexFollowUp.dueLabel}. První žádost o indexaci můžete poslat hned po nasazení; tato kontrola je až za ~2 týdny.`,
    bullets: [...visibilityPlanIndexFollowUp.steps],
    links: visibilityPlanIndexUrls
      .filter((url) =>
        url.includes("detailing-praha-10") ||
        url.includes("brandys") ||
        url.includes("uvaly") ||
        url.includes("lesteni-laku")
      )
      .map((href) => ({ label: href.replace("https://drdetailing.cz", ""), href })),
  },
  {
    id: "nastroje",
    title: "Dva nástroje — neplést si je",
    table: [
      {
        label: "Google Search Console",
        value: "Vidíte, jestli vás lidé nacházejí ve vyhledávání — 1× měsíčně",
      },
      {
        label: "Google Business Profile (Maps)",
        value: "Recenze, fotky, příspěvky u firmy — každý týden",
      },
    ],
    intro:
      "Search Console ≠ reklama. Maps pomáhá u lidí, kteří hledají detailing v okolí Prahy 9.",
  },
  {
    id: "tyden",
    title: "Každý týden (15–20 min)",
    table: [
      { label: "Pondělí", value: "1 příspěvek na Google Maps — text z /admin/akce" },
      { label: "Po zakázce", value: "Požádat o Google recenzi (šablona níže)" },
      { label: "1× za 14 dní", value: "1–2 fotky před/po na Maps" },
    ],
  },
  {
    id: "mesic",
    title: "Každý měsíc (30 min)",
    bullets: [
      "Search Console → Výkon → top dotazy",
      "Zkontrolovat indexaci hlavních stránek (seznam níže)",
      "Aktualizovat akci v adminu, pokud se mění cena nebo nabídka",
    ],
  },
  {
    id: "recenze",
    title: "Recenze — nejdůležitější lokální signál",
    intro: "Cíl: 2–4 nové recenze měsíčně, průměr 4,5+ hvězdiček. Ideálně zmínka služby (leštění, keramika, světlomety).",
    bullets: [
      "Po práci nabídnout akci „Ozon za recenzi za 1 Kč“ (text v /admin/akce)",
      "Kladná recenze → poděkovat a zmínit službu",
      "Záporná recenze → klidně, nabídnout telefon",
    ],
    copyBlocks: [
      {
        id: "recenze-sms",
        label: "SMS / ústní výzva k recenzi",
        text: `Děkujeme za návštěvu u Dr Detailing! Když nám napíšete krátkou recenzi na Google, máte příště ozon za 1 Kč místo 490 Kč. Odkaz: [odkaz na Google recenzi]. Díky! Patrik, Dr Detailing`,
      },
    ],
  },
  {
    id: "akce",
    title: "Akce a příspěvky",
    intro: "Hlavní tahák: světlomety k leštění za 1 Kč. Texty a plakát: /admin/akce",
    copyBlocks: [
      {
        id: "maps-akce",
        label: "Příspěvek Google Maps (světlomety)",
        text: `🔧 AKCE Dr Detailing — Praha 9

K leštění nebo renovaci laku
→ oba přední světlomety ZA 1 Kč
(běžně 1 300 Kč)

Vrátíme lesk karoserii i světlům.
📍 ${site.address}
📞 ${site.phoneDisplay}
🌐 ${site.domain}`,
      },
    ],
    bullets: [
      "Vždy přidejte 2–3 fotky před/po",
      "Instagram 1× za 14 dní — text z adminu Akce",
    ],
  },
];

export type GoogleAdsProposal = {
  id: string;
  name: string;
  badge: string;
  budget: string;
  keywords: string;
  landingPage: string;
  headlines: string[];
  description: string;
  extensions: string;
  note?: string;
};

export const googleAdsProposals: GoogleAdsProposal[] = [
  {
    id: "ads-a",
    name: "Návrh A — Leštění laku",
    badge: "START TADY",
    budget: "800–1 200 Kč / měsíc",
    keywords:
      "leštění laku Praha, leštění karoserie Praha, leštění aut, leštění aut Praha, rozleštění laku cena, rozleštění laku auta, kolik stojí rozleštění laku",
    landingPage: "https://drdetailing.cz/lesteni-laku-praha",
    headlines: [
      "Leštění laku Praha od 9600 Kč",
      "Dr Detailing · Praha 9",
      "Světlomety k leštění za 1 Kč",
    ],
    description:
      "Strojní leštění karoserie v Horních Počernicích. 1–2 dny, vyzvednutí auta po domluvě. Diagnostika → Léčba → Lesk. Zavolejte nebo objednejte termín online.",
    extensions: "Lukavecká 1732 · Keramika Gtechniq · Renovace světel",
  },
  {
    id: "ads-b",
    name: "Návrh B — Světlomety",
    badge: "LEVNÉ KLIKY",
    budget: "400–700 Kč / měsíc",
    keywords:
      "renovace světlometů Praha, leštění světlometů Praha, oprava světlometů Praha, renovace světel Praha, zmatnělé světlomety Praha, rozleštění světlometů cena",
    landingPage: "https://drdetailing.cz/renovace-svetlometu-praha",
    headlines: [
      "Renovace světlometů Praha",
      "Pár od 1 300 Kč · Praha 9",
      "K leštění laku za 1 Kč",
    ],
    description:
      "Balíček páru (oba přední) — broušení, leštění, UV. Ne DIY sada. Dr Detailing Horní Počernice. Akce: oba světlomety za 1 Kč k leštění laku.",
    extensions: "",
    note: "Levné kliky, ale hodně e-shopů (Alza/Lidl). Text musí říct „studio / pár / ne DIY“. Upsell na leštění.",
  },
  {
    id: "ads-c",
    name: "Návrh C — Keramika Gtechniq",
    badge: "VYŠŠÍ MARŽE",
    budget: "600–1 000 Kč / měsíc",
    keywords:
      "keramická ochrana laku Praha, keramický povlak Praha, Gtechniq Praha, keramika auto Praha, kolik stojí keramika na auto",
    landingPage: "https://drdetailing.cz/keramicka-ochrana-praha",
    headlines: ["Keramika laku Praha Gtechniq", "Od 7500 Kč · 1–5 let", "Příprava laku v ceně"],
    description:
      "Keramická ochrana laku Gtechniq v Praze 9. Výdrž 1, 3 nebo 5 let. Lak vždy nejdřív připravíme (leštění zvlášť). Studio Horní Počernice — domluvte termín.",
    extensions: "",
    note: "Méně hledání než u leštění — spíš doplněk k Návrhu A.",
  },
];

export const googleAdsSettings = {
  intro:
    "Reklama nenahrazuje SEO — doplňuje ho, když chcete rychleji objednávky. Start: 500–1 500 Kč/měsíc, 2–4 týdny test.",
  bullets: [
    "Lokalita: Praha + okolí (cca 25 km od Horních Počernic)",
    "Jazyk: čeština",
    "Landing page: konkrétní stránka služby",
    "Denní limit např. 50 Kč (= cca 1 500 Kč/měsíc)",
  ],
  order: [
    "Nejdřív Návrh A (leštění)",
    "Po 2 týdnech Návrh B (světlomety)",
    "Návrh C až při kapacitě na keramiku",
  ],
  links: [
    { label: "Google Ads", href: "https://ads.google.com" },
    { label: "Search Console", href: "https://search.google.com/search-console" },
    { label: "Firma na Googlu", href: "https://business.google.com" },
  ],
} as const;
