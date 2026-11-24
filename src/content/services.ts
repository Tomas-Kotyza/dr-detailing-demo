import { site } from "@/content/site";

export type ServiceFaq = { question: string; answer: string };

export type ServicePageContent = {
  slug: string;
  /** Krátký štítek nad H1 */
  label: string;
  h1: string;
  /** Meta title (bez „| Dr Detailing“ — přidá template) */
  title: string;
  description: string;
  keywords: string[];
  /** Orientační cena „od“ */
  priceFrom: string;
  duration?: string;
  intro: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
  faqs: ServiceFaq[];
  related: { href: string; label: string }[];
  blogHref?: string;
  /** Hero obrázek služby (SEO alt + OG) */
  heroImage?: { src: string; alt: string };
  /** Schema.org Service name */
  schemaName: string;
  schemaPrice: string;
};

/**
 * SEO stránky služeb — titulky a H1 kopírují přesné dotazy z Search Console.
 */
export const servicePages: ServicePageContent[] = [
  {
    slug: "lesteni-laku-praha",
    label: "Strojní leštění karoserie · Praha 9",
    h1: "Leštění laku Praha — rozleštění od 9 600 Kč",
    title: "Leštění laku Praha — rozleštění od 9 600 Kč (1–2 dny)",
    description:
      "Leštění laku Praha a rozleštění laku od 9 600 Kč · 1–2 dny · Horní Počernice. Strojní leštění karoserie, svoz auta. Dr Detailing Praha 9.",
    keywords: [
      "leštění laku Praha",
      "leštění laku",
      "leštění laku Praha 9",
      "leštění aut",
      "leštění auta Praha",
      "leštění vozidel",
      "rozleštění laku",
      "rozleštění laku cena",
      "cena rozleštění laku",
      "cena rozleštění auta",
      "kolik stojí rozleštění laku",
      "kolik stojí rozleštění auta",
      "kolik stojí leštění auta",
      "rozleštění laku auta",
      "rozleštění laku auta cena",
      "rozleštění karoserie",
      "rozleštění škrábanců na autě cena",
      "leštění karoserie Praha",
      "leštění karoserie Praha 9",
      "leštění karoserie cena",
      "leštění aut Praha",
      "leštění aut Praha 9",
      "jednokrokové leštění cena",
      "strojní leštění laku",
      "voskování auta Praha",
      "leštění laku okolí Prahy",
      "detailing Praha",
      "detailing Horní Počernice",
      "leštění laku Praha 10",
      "leštění karoserie Praha 10",
      "strojní leštění auta Praha 9",
    ],
    priceFrom: "od 9 600 Kč",
    duration: "1–2 dny",
    heroImage: {
      src: "/film/polish-hero-start.jpg",
      alt: "Strojní leštění laku a karoserie auta v Dr Detailing Praha 9",
    },
    intro: `Leštění laku Praha a rozleštění laku u ${site.brandName} (Praha 9, Horní Počernice): strojní jednokrokové leštění karoserie — mytí, dekontaminace, leštění a voskování. Od 9 600 Kč, obvykle 1–2 dny. Toto je stránka služby leštění / rozleštění — ne renovace laku (ta je vícekroková korekce od 23 900 Kč). Obsluhujeme i Prahu 10 (Uhříněves, Hostivař…) — auto na Lukaveckou 1732, nebo po domluvě vyzvednutí v okruhu cca 30 minut.`,
    sections: [
      {
        heading: "Jak probíhá leštění laku Praha u nás",
        bullets: [
          "Diagnostika — zhodnotíme stav laku a řekneme, jestli stačí leštění / rozleštění, nebo renovace",
          "Léčba — mytí, dekontaminace, strojní leštění karoserie včetně zádveří a plastů",
          "Lesk — voskování, impregnace pneu, finální kontrola před předáním",
        ],
      },
      {
        heading: "Co zahrnuje leštění karoserie / leštění aut",
        bullets: [
          "umytí karoserie včetně kol, zádveří, podběhů a motorového prostoru",
          "dekontaminace laku",
          "jednokrokové strojní leštění včetně zádveří, oken a lesklých plastů",
          "voskování laku včetně zádveří a kol",
          "tekuté stěrače na všechna skla",
          "impregnace pneu",
        ],
      },
      {
        heading: "Rozleštění laku — cena a význam",
        paragraphs: [
          "Rozleštění laku = u nás totéž co jednokrokové leštění laku Praha / leštění aut. Cena od 9 600 Kč (jednokrokové leštění cena); roste s velikostí vozu a stavem laku — proto „od“. Po diagnostice řekneme konkrétní částku. Podrobný přehled: blog Rozleštění laku — cena.",
          "Leštění aut, leštění vozidel i strojní leštění laku bez „Prahy“ v dotazu řešíme stejně — studio je v Horních Počernicích, obsluhujeme východní Prahu a okolí do 30 min. Voskování auta Praha je součástí balíčku leštění (ne samostatná „jen vosk“ nabídka online). Detailing Praha = stejné studio, více služeb (keramika, interiér, světlomety).",
          "Hledáte lakování a leštění? Lakování / přestřik neděláme — opravujeme vzhled laku strojním leštěním a renovací. Karosárnu doporučíme, když je potřeba nový lak.",
        ],
      },
      {
        heading: "Leštění laku ≠ renovace laku",
        paragraphs: [
          "Leštění laku / rozleštění (tato stránka, od 9 600 Kč, 1–2 dny) stačí u jemných škrábanců a matného laku. Vrátí barvu a lesk bez vícekrokové korekce.",
          "Hologramy a hlubší vady řeší samostatná služba renovace laku (od 23 900 Kč, 3–4 dny) — to není „běžné leštění“. Po diagnostice vždy doporučíme, co dává smysl — neprodáváme zbytečně dražší balíček.",
        ],
      },
      {
        heading: "Proč Dr Detailing v Praze 9",
        bullets: [
          "Dílna v Horních Počernicích — Lukavecká 1732",
          "Proces Diagnostika → Léčba → Lesk",
          "Jasná cena leštění laku Praha „od“ na webu",
          "Svoz auta po domluvě",
          "Před keramikou vždy správná příprava laku",
        ],
      },
    ],
    faqs: [
      {
        question: "Kolik stojí leštění laku Praha?",
        answer:
          "U Dr Detailing od 9 600 Kč za jednokrokové leštění laku / rozleštění (1–2 dny). Studio Horní Počernice, Praha 9 — svoz po domluvě. Renovace laku je jiná služba od 23 900 Kč.",
      },
      {
        question: "Kolik stojí leštění laku v Praze 9?",
        answer:
          "Od 9 600 Kč za jednokrokové leštění laku / leštění karoserie (1–2 dny). Stejná služba jako „leštění laku Praha“ — studio Horní Počernice.",
      },
      {
        question: "Kolik stojí leštění karoserie Praha 9?",
        answer:
          "Leštění karoserie = strojní leštění laku od 9 600 Kč. Stejná služba, jiný název dotazu. Studio Horní Počernice, Praha 9.",
      },
      {
        question: "Kolik stojí rozleštění laku?",
        answer:
          "Rozleštění laku (jednokrok) od 9 600 Kč na této stránce. Hlubší vícekroková korekce je renovace laku od 23 900 Kč (jiná URL). Více: drdetailing.cz/blog/rozlesteni-laku-cena.",
      },
      {
        question: "Kolik stojí rozleštění laku auta?",
        answer:
          "Cena rozleštění laku auta od 9 600 Kč. Závisí na velikosti vozu a stavu laku — po diagnostice dostanete přesný odhad.",
      },
      {
        question: "Jaká je cena rozleštění laku / rozleštění auta?",
        answer:
          "Cena rozleštění laku i rozleštění auta začíná na 9 600 Kč (1–2 dny). Renovace od 23 900 Kč. Studio Praha 9 — Horní Počernice.",
      },
      {
        question: "Jaký je rozdíl mezi leštěním laku a renovací laku?",
        answer:
          "Leštění / rozleštění = jednokrok od 9 600 Kč (tato stránka). Renovace laku = vícekroková korekce od 23 900 Kč na /renovace-laku-praha. Po diagnostice doporučíme správnou variantu.",
      },
      {
        question: "Jak dlouho trvá leštění auta?",
        answer:
          "Jednokrokové leštění laku obvykle 1–2 dny. Auto u nás zůstane — termín domluvíte telefonem nebo formulářem na webu.",
      },
      {
        question: "Děláte i leštění aut bez objednávky online?",
        answer: `Ano — zavolejte ${site.phoneDisplay} nebo napište na ${site.email}. Studio ${site.address}, Praha 9.`,
      },
      {
        question: "Kolik stojí leštění auta / leštění vozidel?",
        answer:
          "Leštění aut (leštění vozidel) od 9 600 Kč za jednokrok — stejná služba jako leštění laku Praha. Studio Horní Počernice.",
      },
      {
        question: "Jaká je cena leštění karoserie / jednokrokové leštění?",
        answer:
          "Leštění karoserie cena = jednokrokové leštění cena od 9 600 Kč (1–2 dny). Strojní leštění laku včetně voskování. Renovace od 23 900 Kč.",
      },
      {
        question: "Děláte voskování auta Praha samostatně?",
        answer:
          "Voskování je součástí balíčku leštění laku. Samostatné „jen vosk“ online nenabízíme — po diagnostice řekneme, co dává smysl.",
      },
      {
        question: "Je leštění laku součástí detailingu Praha?",
        answer:
          "Ano — detailing Praha u nás zahrnuje leštění / rozleštění laku, keramiku, čištění interiéru a renovaci světel. Přehled: detailing Praha 9 a /sluzby.",
      },
    ],
    related: [
      {
        href: "/renovace-laku-praha",
        label: "Renovace laku Praha (ne leštění — vícekroková korekce)",
      },
      { href: "/keramicka-ochrana-praha", label: "Keramická ochrana laku Praha" },
      { href: "/detailing-praha-9", label: "Detailing Praha 9" },
      { href: "/detailing-praha-10", label: "Detailing Praha 10" },
      { href: "/blog/rozlesteni-laku-cena", label: "Blog: rozleštění laku — cena" },
    ],
    blogHref: "/blog/rozlesteni-laku-cena",
    schemaName: "Leštění laku Praha",
    schemaPrice: "9600",
  },
  {
    slug: "keramicka-ochrana-praha",
    label: "Služba · Gtechniq",
    h1: "Keramická ochrana laku Praha — Praha 9 · okolí",
    title: "Keramická ochrana laku Praha — od 7 500 Kč (Gtechniq)",
    description:
      "Keramická ochrana laku Praha od 7 500 Kč (Gtechniq, 1–5 let). Kolik stojí keramika na auto? Studio Praha 9 / Horní Počernice. Keramický povlak — leštění zvlášť. Dr Detailing.",
    keywords: [
      "keramická ochrana",
      "keramická ochrana laku",
      "keramická ochrana laku Praha",
      "keramická ochrana laku Praha 9",
      "keramická ochrana Praha 9",
      "keramický povlak Praha 9",
      "keramika auto Praha 9",
      "kolik stojí keramika na auto",
      "Gtechniq Praha 9",
      "nano keramika Praha 9",
      "keramická ochrana Praha 10",
    ],
    priceFrom: "od 7 500 Kč",
    duration: "po přípravě laku",
    intro: `Keramická ochrana laku v Praze 9 a okolí u ${site.brandName}: značka Gtechniq na 1, 3 nebo 5 let. Ceny od 7 500 Kč bez přípravy laku — před keramickým povlakem musí být lak vyleštěný, jinak se „uzamknou“ i vady.`,
    sections: [
      {
        heading: "Cena keramické ochrany laku v Praze",
        bullets: [
          "Keramická ochrana laku 1 rok — 7 500 Kč (bez leštění)",
          "Keramická ochrana 3 roky — 15 500 Kč",
          "Keramická ochrana 5 let — 22 500 Kč",
          "Doplňky: skla 3 600 Kč, matné plasty 4 300 Kč, kola a brzdiče 8 000 Kč, PPF 13 000 Kč",
        ],
      },
      {
        heading: "Co keramický povlak na laku dělá",
        paragraphs: [
          "Keramická ochrana laku zvyšuje odolnost a drží hluboký lesk. Voda a nečistoty se méně lepí — mytí je snazší. Pomáhá proti soli, UV, ptačímu trusu a pryskyřici v Praze.",
          "Chrání lak, volitelně i skla, plasty, kola nebo PPF fólii.",
        ],
      },
      {
        heading: "Proč nejdřív leštění karoserie",
        paragraphs: [
          "Keramická ochrana laku není náhrada za leštění aut. Nanáší se na čistý a vyleštěný lak. Leštění nebo renovaci účtujeme zvlášť podle stavu vozu.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kolik stojí keramická ochrana laku Praha?",
        answer:
          "Od 7 500 Kč (1 rok), 15 500 Kč (3 roky), 22 500 Kč (5 let). Bez přípravy laku — leštění karoserie se účtuje zvlášť.",
      },
      {
        question: "Je keramický povlak totéž co keramická ochrana laku?",
        answer:
          "Ano — stejná služba. U nás Gtechniq s výdrží 1–5 let. Studio Praha 9, Horní Počernice.",
      },
      {
        question: "Musí se před keramikou leštit lak?",
        answer:
          "Ano. Jinak keramická ochrana laku uzavře i škrábance a oxidaci.",
      },
      {
        question: "Kolik stojí keramika na auto?",
        answer:
          "Keramická ochrana laku Praha: 1 rok od 7 500 Kč, 3 roky 15 500 Kč, 5 let 22 500 Kč — bez přípravy laku. Leštění se účtuje zvlášť.",
      },
    ],
    related: [
      { href: "/lesteni-laku-praha", label: "Leštění karoserie Praha" },
      { href: "/renovace-laku-praha", label: "Renovace laku Praha" },
      { href: "/detailing-praha-9", label: "Detailing Praha 9" },
      { href: "/detailing-praha-10", label: "Detailing Praha 10" },
    ],
    blogHref: "/blog/keramicka-ochrana-co-cekat",
    schemaName: "Keramická ochrana laku Praha 9",
    schemaPrice: "7500",
  },
  {
    slug: "cisteni-interieru-praha",
    label: "Služba · Interiér",
    h1: "Čištění interiéru vozu / auta — Praha 9 · okolí",
    title: "Čištění interiéru vozu Praha — od 3 000 Kč",
    description:
      "Čištění interiéru vozu a auta v Praze od 3 000 Kč — sedačky, koberce, plasty, skla. Studio Praha 9 / Horní Počernice. Ozon 490 Kč. Dr Detailing.",
    keywords: [
      "čištění interiéru vozu",
      "čištění interiéru",
      "čištění interiéru auta",
      "čištění interiéru auta Praha 9",
      "čištění interiéru aut Praha 9",
      "čištění interiérů aut Praha 9",
      "čištění interiéru vozu Praha 9",
      "čištění interiérů Praha 9",
      "čištění interiérů aut Praha 10",
      "renovace interiéru auta",
      "detailing interiér Praha 9",
      "vyčištění auta Praha 9",
      "čištění interiéru Praha 10",
    ],
    priceFrom: "od 3 000 Kč",
    duration: "1–2 dny",
    intro: `Čištění interiéru vozu (čištění interiéru auta) v Praze — ${site.brandName}, Praha 9 / Horní Počernice. Sedačky, koberce, kufr, plasty a skla. Od 3 000 Kč (1–2 dny). U silného znečištění cena roste. Hledáte renovaci interiéru auta? U nás jde o kompletní vyčištění a oživení interiéru — ne čalounickou dílnu.`,
    sections: [
      {
        heading: "Co zahrnuje čištění interiérů / čištění interiéru vozu",
        bullets: [
          "sedačky a čalounění",
          "koberce a podlaha",
          "plasty a palubní deska",
          "skla zevnitř",
          "kufr dle stavu",
        ],
      },
      {
        heading: "Jak naplánovat čištění interiéru",
        paragraphs: [
          "Termín čištění interiérů (Praha 9 i Praha 10 — svoz) rezervujte formulářem nebo telefonem. Počítejte 1–2 dny — auto u nás zůstane. Po domluvě auto vyzvedneme a vrátíme. K čištění interiéru často přidáváme ozon (490 Kč) u pachů z kouře, zvířat nebo vlhkosti.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kolik stojí čištění interiéru auta v Praze?",
        answer:
          "Od 3 000 Kč (1–2 dny). Cena podle znečištění. Ozon 490 Kč.",
      },
      {
        question: "Kolik stojí čištění interiéru vozu Praha 9?",
        answer:
          "Čištění interiéru vozu / aut Praha 9 od 3 000 Kč. Studio Horní Počernice — svoz i z Prahy 10.",
      },
      {
        question: "Děláte renovaci interiéru auta?",
        answer:
          "Renovace interiéru auta u nás = kompletní čištění interiéru (sedačky, koberce, plasty, skla). Neopravujeme protržené čalounění — to je čalouník.",
      },
      {
        question: "Jak naplánovat čištění interiérů u vás?",
        answer: `Zavolejte ${site.phoneDisplay} nebo vyplňte formulář na ${site.domain}. Řekneme termín a orientační cenu.`,
      },
    ],
    related: [
      { href: "/lesteni-laku-praha", label: "Leštění karoserie Praha" },
      { href: "/renovace-svetlometu-praha", label: "Renovace světel Praha" },
      { href: "/detailing-praha-9", label: "Detailing Praha 9" },
      { href: "/detailing-praha-10", label: "Detailing Praha 10" },
    ],
    blogHref: "/blog/cisteni-interieru-detailing",
    schemaName: "Čištění interiéru auta Praha 9",
    schemaPrice: "3000",
  },
  {
    slug: "renovace-svetlometu-praha",
    label: "Služba · Světlomety",
    h1: "Renovace světlometů Praha 9 · okolí",
    title: "Renovace světlometů Praha — pár od 1 300 Kč",
    description:
      "Renovace světlometů v Praze: balíček obou předních od 1 300 Kč (broušení, leštění, UV). Ne DIY sada ani výměna LED. Studio Praha 9. Dr Detailing.",
    keywords: [
      "renovace světlometů",
      "renovace světlometů Praha",
      "renovace světlometů Praha 9",
      "renovace světel Praha",
      "renovace světel Praha 9",
      "oprava světlometů Praha",
      "leštění světlometů Praha",
      "leštění světlometů Praha 9",
      "leštění světel Praha 9",
      "rozleštění světel Praha",
      "rozleštění světlometů cena",
      "zmatnělé světlomety",
      "renovace světel Praha 10",
      "čištění světlometů Praha",
    ],
    priceFrom: "1 300 Kč / pár",
    duration: "obvykle stejný den",
    intro: `Renovace světlometů Praha (oprava světlometů / leštění světlometů) u ${site.brandName} (Praha 9, Horní Počernice): zmatnělé nebo zažloutlé přední světlomety brousíme, leštíme a chráníme UV vrstvou. Základní balíček je pár (oba přední) za 1 300 Kč — vzhled auta drží jen když jsou obě světla stejná. Samostatný 1 ks (650 Kč) jen výjimečně po domluvě.`,
    sections: [
      {
        heading: "Balíček páru — co je v ceně 1 300 Kč",
        bullets: [
          "oba přední světlomety (standard)",
          "broušení a leštění plastových krytů",
          "ochranná vrstva proti UV",
          "1 ks zvlášť (650 Kč) jen výjimečně — např. po výměně jednoho světla",
        ],
      },
      {
        heading: "Co to NENÍ (ať nečekáte špatnou službu)",
        paragraphs: [
          "Nejsme e-shop na DIY pasty, LED žárovky ani výměnu celých světlometů. Děláme profesionální renovaci zmatnělých plastových krytů ve studiu. Když je světlo prasklé nebo uvnitř zničené, řekneme to rovnou — renovace nestačí.",
        ],
      },
      {
        heading: "Proč spojit světlomety s leštěním / detailingem",
        paragraphs: [
          "Samotná renovace světel auto „nevyléčí“ — zmatnělá světla často jdou ruku v ruce se zašlým lakem. Nejlepší výsledek (a méně jízd) je světlomety + leštění karoserie (od 9 600 Kč) nebo čištění interiéru (od 3 000 Kč) v jednom termínu. Rádi navrhneme kombinaci po fotkách / telefonu.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kolik stojí renovace světel Praha?",
        answer:
          "Základní balíček je pár (oba přední) za 1 300 Kč. Jeden světlomet zvlášť 650 Kč jen výjimečně. Studio Dr Detailing, Praha 9 — Horní Počernice.",
      },
      {
        question: "Proč doporučujete vždy oba světlomety?",
        answer:
          "Jeden vyleštěný a druhý matný vypadá nestejně a kazí dojem z auta. Proto je výchozí nabídka pár. Výjimka: když jste právě vyměnili jedno světlo a druhé potřebuje doladit.",
      },
      {
        question: "Děláte i výměnu LED / prodej světel?",
        answer:
          "Ne. Neprodáváme díly ani DIY sady. Renovujeme zmatnělé kryty. Na výměnu celého světlometu vás odkážeme jinam.",
      },
      {
        question: "Je renovace světlometů totéž co renovace světel?",
        answer:
          "Ano — lidé hledají obě formulace. Jde o leštění a obnovu plastových krytů předních světel, ne o výměnu žárovek.",
      },
      {
        question: "Vyplatí se světlomety spojit s leštěním laku?",
        answer:
          "Ano. Zákazníci, kteří řeší jen jedno světlo, často později stejně chtějí detailing. V jednom termínu ušetříte čas i dopravu — leštění od 9 600 Kč, interiér od 3 000 Kč.",
      },
      {
        question: "Kolik stojí oprava světlometů / rozleštění světlometů Praha?",
        answer:
          "Oprava světlometů Praha = renovace / leštění světlometů. Rozleštění světlometů cena: pár od 1 300 Kč. Studio Praha 9.",
      },
    ],
    related: [
      { href: "/lesteni-laku-praha", label: "Leštění karoserie Praha" },
      { href: "/cisteni-interieru-praha", label: "Čištění interiéru" },
      { href: "/detailing-praha-9", label: "Detailing Praha 9" },
      { href: "/detailing-praha-10", label: "Detailing Praha 10" },
    ],
    blogHref: "/blog/renovace-svetlometu-praha-9",
    schemaName: "Renovace světlometů Praha 9 — pár",
    schemaPrice: "1300",
  },
  {
    slug: "renovace-laku-praha",
    label: "Služba · Korekce laku",
    h1: "Renovace laku Praha — vícekroková korekce",
    title: "Renovace laku Praha — vícekroková korekce od 23 900 Kč",
    description:
      "Renovace laku Praha / oprava laku auta: vícekroková korekce škrábanců a hologramů od 23 900 Kč, 3–4 dny. Studio Praha 9 Horní Počernice. Dr Detailing — ideální před keramikou. (Běžné leštění / rozleštění = jiná služba od 9 600 Kč.)",
    keywords: [
      "renovace laku",
      "renovace laku Praha",
      "renovace laku Praha 9",
      "renovace laku auta Praha",
      "renovace laku cena",
      "oprava laku Praha",
      "oprava laku auta ceník",
      "oprava laku cena",
      "cena opravy laku",
      "oprava škrábanců laku cena",
      "obnova laku karoserie",
      "broušení karoserie",
      "korekce laku Praha",
      "korekce laku Praha 9",
      "vícekroková korekce laku Praha",
      "odstranění škrábanců lak Praha 9",
      "hluboká korekce laku Praha",
    ],
    priceFrom: "od 23 900 Kč",
    duration: "3–4 dny",
    intro: `Renovace laku Praha (obnova laku karoserie) u ${site.brandName} (Praha 9, Horní Počernice): vícekroková korekce hlubších škrábanců a hologramů. Od 23 900 Kč, 3–4 dny. Hledáte opravu laku auta ceník? U jemných vad stačí leštění od 9 600 Kč; hlubší „oprava laku“ = tato renovace. Toto NENÍ lakování ani přestřik — lak neobnovujeme barvou, ale strojní korekcí.`,
    sections: [
      {
        heading: "Co zahrnuje renovace laku",
        bullets: [
          "umytí karoserie včetně kol, zádveří, podběhů a motorového prostoru",
          "dekontaminace laku",
          "vícekroková renovace / korekce (ne jednokrokové leštění)",
          "voskování laku včetně zádveří a kol",
          "tekuté stěrače na všechna skla",
          "impregnace pneu",
        ],
      },
      {
        heading: "Renovace laku ≠ leštění / rozleštění",
        paragraphs: [
          "Hledáte „leštění laku Praha“ nebo „rozleštění laku“? To je jednokroková služba od 9 600 Kč na stránce leštění laku Praha — ne tato URL.",
          "Renovace laku Praha jde hlouběji: více kroků (včetně broušení karoserie dle potřeby), více času, čistší povrch u silnějších vad. Po diagnostice řekneme, co auto potřebuje — levnější leštění nabídneme, když stačí.",
        ],
      },
      {
        heading: "Oprava laku Praha — ceník v kostce",
        paragraphs: [
          "Oprava laku cena / cena opravy laku: leštění (jemné vady) od 9 600 Kč, renovace laku (hlubší škrábance, hologramy) od 23 900 Kč. Oprava škrábanců laku cena závisí na hloubce — po diagnostice konkrétní číslo. Přestřik a lakování neděláme.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kolik stojí renovace laku Praha?",
        answer:
          "Orientačně od 23 900 Kč (3–4 dny). Závisí na velikosti vozu a stavu laku. Běžné leštění / rozleštění je od 9 600 Kč na /lesteni-laku-praha.",
      },
      {
        question: "Jaký je oprava laku auta ceník / cena opravy laku?",
        answer:
          "Oprava laku Praha u nás = leštění od 9 600 Kč nebo renovace laku od 23 900 Kč (ne lakování). Oprava škrábanců laku cena podle hloubky — po diagnostice.",
      },
      {
        question: "Je renovace totéž co leštění laku Praha?",
        answer:
          "Ne. Leštění laku Praha / rozleštění = jednokrok od 9 600 Kč. Renovace laku = vícekroková korekce od 23 900 Kč. Jsou to dvě různé stránky služeb.",
      },
      {
        question: "Je renovace nutná před keramickou ochranou laku?",
        answer:
          "Pokud lak není v perfektním stavu, ano — nebo alespoň jednokrokové leštění karoserie. Keramika jen na připravený povrch.",
      },
      {
        question: "Kdy stačí leštění místo renovace?",
        answer:
          "U jemných vad a matného laku stačí leštění / rozleštění od 9 600 Kč. Renovaci doporučíme jen když jednokrok nestačí. Detail leštění: /lesteni-laku-praha.",
      },
    ],
    related: [
      {
        href: "/lesteni-laku-praha",
        label: "Leštění laku Praha / rozleštění (od 9 600 Kč)",
      },
      { href: "/keramicka-ochrana-praha", label: "Keramická ochrana laku Praha" },
      { href: "/detailing-praha-9", label: "Detailing Praha 9" },
      { href: "/detailing-praha-10", label: "Detailing Praha 10" },
    ],
    schemaName: "Renovace laku Praha",
    schemaPrice: "23900",
  },
];

export const serviceSlugs = servicePages.map((s) => s.slug);

export function getServiceBySlug(slug: string): ServicePageContent | undefined {
  return servicePages.find((s) => s.slug === slug);
}

export const servicesHub = {
  title: "Služby — leštění karoserie, keramika, detailing Praha 9 · okolí",
  description:
    "Ceník Dr Detailing Praha 9 a okolí: leštění karoserie od 9 600 Kč, keramická ochrana laku od 7 500 Kč, renovace laku, čištění interiéru vozu, renovace světlometů (pár) od 1 300 Kč. Dojezd Praha 10.",
  keywords: [
    "detailing Praha 9",
    "detailing Praha 10",
    "detailing auto",
    "auto detailing Praha",
    "leštění aut",
    "leštění karoserie Praha 9",
    "keramická ochrana laku Praha",
    "čištění interiéru vozu",
    "renovace laku Praha 9",
  ],
} as const;
