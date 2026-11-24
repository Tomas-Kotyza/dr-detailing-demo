export const site = {
  brandLeft: "DR",
  brandRight: "DETAILING",
  brandName: "Dr Detailing",
  domain: "drdetailing.cz",
  place: "Praha 9 · Horní Počernice",
  phone: "+420739411108",
  phoneDisplay: "+420 739 411 108",
  email: "info@drdetailing.cz",
  /** Provozovna / místo služby (pro zákazníky) */
  address: "Lukavecká 1732, Horní Počernice",
  /** Právní údaje OSVČ (ARES) */
  legalName: "Patrik Doktor",
  ico: "88676234",
  registeredAddress: "Jabloňová 2882/102, Záběhlice, 106 00 Praha 10",
  /** Krátký claim ve filmové kapitole 1 */
  tagline: "Diagnostika. Léčba. Lesk",
  /** Hlavní motto — „doktorský“ tón značky */
  motto: "Vyléčíme váš zašlý lak.",
  /** Doplněk, který se líbí zákazníkovi */
  mottoSupport: "Vrátíme zpět k životu váš zašlý lak.",
  /** Proces ve 3 krocích */
  process: ["Diagnostika", "Léčba", "Lesk"] as const,
  processJoke: "Naše trojkombinace. Bez čekárny, bez receptu — jen lesk.",
  heroLead:
    "Detailing Praha — studio Praha 9 (Horní Počernice): leštění a rozleštění laku od 9 600 Kč, keramická ochrana a čištění interiéru. Dojezd Praha 10, Brandýs, Úvaly a okolí.",
  priceNote:
    "Ceny jsou orientační „od“ a liší se dle velikosti vozu, stavu laku a náročnosti.",
} as const;

/** Kapitola 2 — jedna filmová scéna práce (keramika je v ceníku, ne ve filmu) */
export const filmBeats = [
  {
    id: "interior",
    label: "02",
    title: "Čištění interiéru",
    text: "Kompletní čištění interiéru.",
    meta: "",
    price: "od 3 000 Kč",
    video: "/film/interior-work.mp4",
    /** Stejná délka, nižší bitrate — mobil bez scroll-scrubu */
    mobileVideo: "/film/interior-work-mobile.mp4",
    poster: "/film/interior-start.webp",
  },
] as const;

/** Místo druhého videa: posuvník před / po (3 páry z reálné práce) */
export const beforeAfterSlide = {
  id: "result",
  label: "01",
  title: "Před a po",
  text: "Tři výsledky vedle sebe — táhlem posuňte před a po.",
  slides: [
    {
      id: "lak",
      before: "/before-after/01-pred.webp",
      after: "/before-after/01-po.webp",
      beforeAlt: "Oxidovaná střecha před leštěním laku",
      afterAlt: "Střecha po leštění laku — zrcadlový lesk",
      name: "Leštění laku",
      car: "střecha",
      text: "Zašlý, zoxidovaný lak bez odrazu. Po strojním leštění drží světlo jako zrcadlo.",
    },
    {
      id: "interier",
      before: "/before-after/02-pred.webp",
      after: "/before-after/02-po.webp",
      beforeAlt: "Znečištěná sedačka před čištěním interiéru",
      afterAlt: "Sedačka po čištění interiéru",
      name: "Čištění interiéru",
      car: "sedačky",
      text: "Skvrny na látce pryč. Interiér znovu čistý — od 3 000 Kč.",
    },
    {
      id: "svetlomety",
      before: "/before-after/03-pred.webp",
      after: "/before-after/03-po.webp",
      beforeAlt: "Zmatnělý světlomet před renovací",
      afterAlt: "Čirý světlomet po renovaci",
      name: "Renovace světlometů (pár)",
      car: "1 300 Kč / pár",
      text: "Zmatnělá světla kazí vzhled i výhled. Standardně renovujeme oba přední — pár za 1 300 Kč.",
    },
  ],
} as const;

/** Ceníkový beat — celý orientační ceník + popisy (lze doplnit) */
export const priceLines = [
  {
    id: "polish",
    name: "Leštění laku",
    meta: "1–2 dny",
    price: "od 9 600 Kč",
    summary: "Základní strojní leštění pro oživení a zlepšení vzhledu.",
    includes: [
      "umytí karoserie vč. kol, zádveří, podběhů a motorového prostoru",
      "dekontaminace laku",
      "jednokrokové leštění vč. zádveří, oken a lesklých plastů",
      "voskování laku vč. zádveří a kol",
      "tekuté stěrače na všechna skla",
      "impregnace pneu",
    ],
  },
  {
    id: "renovate",
    name: "Renovace laku",
    meta: "3–4 dny",
    price: "od 23 900 Kč",
    summary: "Vícekroková renovace pro maximální odstranění škrábanců a hologramů.",
    includes: [
      "umytí karoserie vč. kol, zádveří, podběhů a motorového prostoru",
      "dekontaminace laku",
      "vícekroková renovace",
      "voskování laku vč. zádveří a kol",
      "tekuté stěrače na všechna skla",
      "impregnace pneu",
    ],
  },
  {
    id: "interior",
    name: "Čištění interiéru",
    meta: "1–2 dny",
    price: "od 3 000 Kč",
    summary: "Kompletní čištění interiéru.",
    includes: [],
  },
  {
    id: "ozone",
    name: "Dezinfekce ozonem",
    meta: "",
    price: "490 Kč",
    summary: "Odstranění pachů a dezinfekce vzduchu v kabině ozonem.",
    includes: [
      "aplikace ozonu v uzavřené kabině",
      "vhodné po čištění interiéru nebo u ojetin",
      "pomáhá s pachy (kouř, zvířata, vlhkost)",
    ],
  },
  {
    id: "headlight",
    name: "Renovace světlometů",
    meta: "pár (oba přední)",
    price: "1 300 Kč",
    summary:
      "Obnova zmatnělých a zažloutlých předních světlometů — výchozí balíček je pár. 1 ks (650 Kč) jen výjimečně.",
    includes: [
      "oba přední světlomety (standard)",
      "broušení a leštění krytů",
      "ochranná vrstva proti UV",
      "ideálně spojit s leštěním laku / detailingem",
    ],
  },
  {
    id: "ceramic1",
    name: "Keramika 1 rok",
    meta: "bez přípravy laku",
    price: "7 500 Kč",
    summary:
      "Keramická ochrana Gtechniq s výdrží cca 1 rok — odolnost, lesk a snazší údržba. Cena bez leštění.",
    includes: [
      "aplikace keramiky Gtechniq na lak",
      "vyšší odolnost a lesk",
      "ochrana proti nečistotám a vnějším vlivům",
      "před aplikací musí být lak vyleštěn (účtováno zvlášť)",
    ],
  },
  {
    id: "ceramic3",
    name: "Keramika 3 roky",
    meta: "bez přípravy laku",
    price: "15 500 Kč",
    summary:
      "Dlouhodobá keramika Gtechniq (cca 3 roky) — silnější ochrana a lesk. Cena bez leštění.",
    includes: [
      "aplikace dlouhodobé keramiky Gtechniq",
      "vyšší odolnost a lesk",
      "ochrana proti nečistotám a vnějším vlivům",
      "před aplikací musí být lak vyleštěn (účtováno zvlášť)",
    ],
  },
  {
    id: "ceramic5",
    name: "Keramika 5 let",
    meta: "bez přípravy laku",
    price: "22 500 Kč",
    summary:
      "Nejdelší keramika Gtechniq v nabídce — maximální odolnost a lesk. Cena bez leštění.",
    includes: [
      "aplikace prémiové keramiky Gtechniq",
      "maximální odolnost a lesk podle péče",
      "ochrana proti nečistotám a vnějším vlivům",
      "před aplikací musí být lak vyleštěn (účtováno zvlášť)",
    ],
  },
  {
    id: "ceramic-glass",
    name: "Keramika skel",
    meta: "",
    price: "3 600 Kč",
    summary: "Keramická ochrana skel — lepší odtok vody, výhled a snazší čištění.",
    includes: [
      "příprava skel",
      "aplikace keramiky na skla",
      "lepší odtok vody a odolnost vůči nečistotám",
    ],
  },
  {
    id: "ceramic-plastics",
    name: "Keramika matných plastů",
    meta: "vč. motoru",
    price: "4 300 Kč",
    summary: "Ochrana matných plastů včetně prostoru motoru — delší vzhled a snazší údržba.",
    includes: [
      "očistění matných plastů",
      "aplikace keramické ochrany",
      "ochrana proti nečistotám a vnějším vlivům",
      "včetně plastů v motorovém prostoru dle stavu",
    ],
  },
  {
    id: "ceramic-wheels",
    name: "Keramika litých kol a brzdičů",
    meta: "",
    price: "8 000 Kč",
    summary: "Ochrana litých kol a brzdičů — méně brzdného prachu, snazší mytí.",
    includes: [
      "důkladné čištění kol a brzdičů",
      "aplikace keramické ochrany",
      "ochrana proti nečistotám a snazší údržba",
    ],
  },
  {
    id: "ceramic-ppf",
    name: "Keramika PPF",
    meta: "až 2 roky",
    price: "13 000 Kč",
    summary: "Keramická ochrana na PPF fólii — delší lesk a výdrž až 2 roky.",
    includes: [
      "příprava povrchu PPF",
      "aplikace kompatibilní keramiky",
      "delší životnost, lesk a snazší údržba fólie",
    ],
  },
] as const;

/** Rezervace — výběr služby */
export const packages = [
  { id: "interior", name: "Čištění interiéru", price: 3000, hint: "1–2 dny" },
  { id: "polish", name: "Leštění laku", price: 9600, hint: "1–2 dny" },
  { id: "renovate", name: "Renovace laku", price: 23900, hint: "3–4 dny" },
  { id: "ceramic1", name: "Keramika 1 rok", price: 7500, hint: "bez přípravy laku" },
  { id: "ceramic3", name: "Keramika 3 roky", price: 15500, hint: "bez přípravy laku" },
  { id: "ceramic5", name: "Keramika 5 let", price: 22500, hint: "bez přípravy laku" },
  {
    id: "headlight",
    name: "Renovace světlometů (pár)",
    price: 1300,
    hint: "oba přední · 1 ks jen výjimečně",
  },
  { id: "ozone", name: "Dezinfekce ozonem", price: 490, hint: "" },
] as const;

export const vehicles = ["Sedan", "SUV", "Coupé", "Kombi", "Pickup", "Ostatní"] as const;

export const reviews = [
  {
    id: "o1",
    role: "owner" as const,
    name: "Majitel Dr Detailing",
    car: "Ordinace laku · Praha 9",
    text: "Každé auto bereme jako pacienta — nejdřív diagnóza laku, pak léčba. Žádné zkratky, jen poctivá práce.",
  },
  {
    id: "o2",
    role: "owner" as const,
    name: "Majitel Dr Detailing",
    car: "Proč keramika až po leštění",
    text: "Keramika na zašlém laku nemá smysl. Nejdřív lak vyléčíme, teprve pak ho chráníme — ať výsledek vydrží.",
  },
  {
    id: "r1",
    role: "customer" as const,
    name: "Martin K.",
    car: "BMW 5",
    text: "Auto vypadá jako nové. Komunikace jasná, výsledek lepší, než jsem čekal.",
  },
  {
    id: "r2",
    role: "customer" as const,
    name: "Petra S.",
    car: "Škoda Kodiaq",
    text: "Interiér po dětech byl hotový. Vrátím se i na keramiku.",
  },
  {
    id: "r3",
    role: "customer" as const,
    name: "Tomáš H.",
    car: "Audi A6",
    text: "Leštění a keramika v jednom termínu. Lesk drží, doporučuju.",
  },
  {
    id: "r4",
    role: "customer" as const,
    name: "Jana L.",
    car: "VW Golf",
    text: "Férová cena, termín dodrželi. Studio v Horních Počernicích je v pohodě.",
  },
] as const;

export const blogPosts = [
  {
    slug: "lesteni-laku-praha-9",
    title: "Leštění karoserie Praha 9 — kdy stačí jednokrokové a kdy renovace",
    excerpt:
      "Jak poznat, jestli autu stačí oživení laku (leštění karoserie), nebo potřebuje vícekrokovou renovaci. Orientační ceny a doba práce.",
    date: "2026-07-10",
    body: [
      "Zašlý lak nemusí hned znamenat přelakování. U většiny vozů stačí profesionální leštění laku — mytí, dekontaminace a strojní leštění, které vrátí hloubku barvy a lesk. Stejnou službu lidé často hledají jako leštění karoserie Praha.",
      "Jednokrokové leštění (od 9 600 Kč, 1–2 dny) je vhodné, když jsou škrábance jemné a lak není silně oxidovaný. Renovace laku (od 23 900 Kč, 3–4 dny) řeší hlubší vady a hologramy vícekrokově.",
      "V Dr Detailing v Horních Počernicích (Praha 9) vždy nejdřív zhodnotíme stav laku a navrhneme postup. Před keramickou ochranou musí být lak vyleštěn — ceny keramiky jsou bez této přípravy. Kompletní popis služby: leštění laku Praha.",
    ],
  },
  {
    slug: "keramicka-ochrana-co-cekat",
    title: "Keramická ochrana laku Praha — co očekávat a proč nejdřív leštit",
    excerpt:
      "Keramika Gtechniq (keramický povlak) drží 1–5 let, ale jen na připraveném laku. Co chrání, proč se vyplatí a tipy před objednávkou.",
    date: "2026-07-18",
    body: [
      "Keramická ochrana (keramický povlak) není náhrada za leštění. Nanáší se na čistý a vyleštěný lak — jinak „uzamkne“ i vady. Proto v ceníku uvádíme ceny keramiky bez přípravy laku. Lak musí být v perfektním stavu; pokud není, nejdřív dekontaminace a renovace, teprve potom keramika.",
      "Keramika zvyšuje mechanickou odolnost laku a drží vysoký lesk. Chrání nejen lak, ale i skla, plasty, kola a světlomety. Pomáhá proti jemným škrábancům a vnějším vlivům — sůl, voda, ptačí trus, pryskyřice a další nečistoty. Pracujeme s keramikou Gtechniq.",
      "Volíte podle výdrže: 1 rok od 7 500 Kč, 3 roky od 15 500 Kč, 5 let od 22 500 Kč. Doplňkově skla, matné plasty, kola nebo PPF. Kompletní popis: keramická ochrana laku Praha.",
      "Po aplikaci doporučujeme šetrné mytí a pravidelnou péči. Termín domluvíte přes formulář na webu nebo telefonem.",
    ],
  },
  {
    slug: "cisteni-interieru-detailing",
    title: "Čištění interiéru vozu — co zahrnuje a jak dlouho trvá",
    excerpt:
      "Čištění interiéru vozu / auta trvá 1–2 dny. Cena od 3 000 Kč podle znečištění. Kdy přidat ozon — Dr Detailing Praha 9.",
    date: "2026-07-22",
    body: [
      "Čištění interiéru vozu řeší sedačky, koberce, plasty a skla. U silně znečištěných vozů (děti, zvířata, kouření) cena roste — proto uvádíme „od“. Stejná služba jako čištění interiéru auta Praha 9 / renovace interiéru auta (vyčištění, ne čalounění).",
      "Dezinfekce ozonem (490 Kč) pomůže s pachy. Kombinace s čištěním interiéru dává smysl u ojetin a firemních flotil. Svoz i z Prahy 10.",
      "Studio Dr Detailing najdete na Lukavecké 1732, Praha 9 — Horní Počernice. Více: čištění interiéru Praha.",
    ],
  },
  {
    slug: "renovace-svetlometu-praha-9",
    title: "Renovace světel Praha 9 — zmatnělá světla bez výměny",
    excerpt:
      "Oprava světlometů / leštění světlometů Praha? Balíček páru od 1 300 Kč — broušení, leštění, UV. Ne DIY sada.",
    date: "2026-08-04",
    body: [
      "Zažloutlé světlomety kazí vzhled i viditelnost. V Dr Detailing (Praha 9) je výchozí nabídka renovace páru (oba přední) za 1 300 Kč — broušení, leštění a UV ochrana. Oprava světlometů Praha = stejná služba; rozleštění světlometů cena je pár od 1 300 Kč. Jeden kus (650 Kč) jen výjimečně.",
      "Neprodáváme DIY pasty ani LED žárovky — renovujeme zmatnělé plastové kryty ve studiu. U běžného zmatnění výsledek stojí za to a je levnější než výměna. Praskliny nebo zničené vnitřky už renovací nespravíme — řekneme po prohlídce.",
      "Nejlepší dojem je světlomety + leštění karoserie (od 9 600 Kč) nebo interiér (od 3 000 Kč) v jednom termínu. Objednávka: formulář na webu (#objednat) nebo telefon. Detail: renovace světel Praha.",
    ],
  },
  {
    slug: "rozlesteni-laku-cena",
    title: "Rozleštění laku cena: od 9 600 Kč (Praha 9) — co zahrnuje",
    excerpt:
      "Rozleštění laku cena / rozleštění auta cena od 9 600 Kč · renovace od 23 900 Kč. Kolik stojí leštění auta — Dr Detailing Praha 9.",
    date: "2026-08-18",
    body: [
      "Hledáte rozleštění laku cena? U Dr Detailing v Praze 9 (Horní Počernice) začíná jednokrokové leštění aut / leštění karoserie na 9 600 Kč a trvá obvykle 1–2 dny. Vícekroková renovace laku je od 23 900 Kč (3–4 dny).",
      "Kolik stojí rozleštění laku auta / kolik stojí rozleštění auta? Orientačně od 9 600 Kč. Cena rozleštění auta / cena rozleštění laku roste s velikostí vozu a stavem laku — proto „od“, ne paušál. Po diagnostice dostanete konkrétní odhad.",
      "Rozleštění škrábanců na autě cena: jemné škrábance často řeší jednokrok od 9 600 Kč; hlubší vady = renovace. V ceně je mytí, dekontaminace, strojní leštění včetně zádveří a voskování.",
      "Leštění karoserie Praha (i bez slova „rozleštění“) je u nás stejná služba. Před keramickou ochranou musí být lak vyleštěný — keramika se účtuje zvlášť.",
      "Kompletní popis: leštění laku Praha. Hlubší korekce: renovace laku Praha. Studio: detailing Praha 9. Objednávka: formulář na drdetailing.cz nebo telefon.",
      "Termín a svoz: Lukavecká 1732, Horní Počernice — auto přivezete, nebo po domluvě vyzvedneme (Praha 10, Brandýs, Úvaly a okolí).",
    ],
  },
  {
    slug: "detailing-praha-9-horni-pocernice",
    title: "Detailing Praha 9 (Horní Počernice) — co nabízíme a jak objednat",
    excerpt:
      "Lokální průvodce: leštění karoserie, keramika Gtechniq, interiér, světlomety, vyzvednutí auta a orientační ceny u Dr Detailing.",
    date: "2026-08-03",
    body: [
      "Hledáte detailing Praha nebo detailing v Praze 9 / Horních Počernicích? Dr Detailing (Patrik Doktor) sídlí na Lukavecké 1732. Specializace: leštění a rozleštění laku, renovace laku, keramická ochrana Gtechniq, čištění interiéru auta a renovace světlometů.",
      "Proces je vždy stejný: Diagnostika → Léčba → Lesk. Nejdřív zhodnotíme lak, pak zvolíme postup. Keramiku nanášíme až na připravený povrch — ceny keramiky jsou bez přípravy laku.",
      "Orientační ceny: světlomety pár 1 300 Kč, interiér od 3 000 Kč, rozleštění / leštění od 9 600 Kč, renovace od 23 900 Kč, keramika od 7 500 Kč. Auto můžete přivézt do dílny, nebo po domluvě vyzvedneme a po práci vrátíme.",
      "Kolik stojí rozleštění laku? Detail cen: blog rozleštění laku cena a stránka leštění laku Praha. Přehled služeb: /sluzby. Lokální stránka: detailing Praha 9.",
      "Termín domluvíte na drdetailing.cz (#objednat) nebo telefonem. Více o nás na stránce O mně a v častých otázkách.",
    ],
  },
] as const;

/** Plný ceník — kontext */
export const fullPriceList = {
  headlights: { name: "Renovace světlometů", price: "1 300 Kč / pár" },
  polish: {
    name: "Leštění laku",
    duration: "1–2 dny",
    priceFrom: 9600,
    includes: [
      "umytí karoserie vč. kol, zádveří, podběhů a motorového prostoru",
      "dekontaminace laku",
      "jednokrokové leštění vč. zádveří, oken a lesklých plastů",
      "voskování laku vč. zádveří a kol",
      "tekuté stěrače na všechna skla",
      "impregnace pneu",
    ],
  },
  renovate: {
    name: "Renovace laku",
    duration: "3–4 dny",
    priceFrom: 23900,
    includes: [
      "umytí karoserie vč. kol, zádveří, podběhů a motorového prostoru",
      "dekontaminace laku",
      "vícekroková renovace",
      "voskování laku vč. zádveří a kol",
      "tekuté stěrače na všechna skla",
      "impregnace pneu",
    ],
  },
  wax: {
    name: "Voskování karoserie",
    note: "mytí + dekontaminace + vosk (cena v podkladu neuvedena)",
  },
  interior: {
    name: "Kompletní čištění interiéru",
    duration: "1–2 dny",
    priceFrom: 3000,
    note: "cena dle znečištění",
  },
  ozone: { name: "Dezinfekce ozonem", price: 490 },
  ceramic: [
    { name: "Keramická ochrana 1 rok", price: 7500 },
    { name: "Keramická ochrana 3 roky", price: 15500 },
    { name: "Keramická ochrana 5 let", price: 22500 },
    { name: "Keramická ochrana skel", price: 3600 },
    { name: "Keramická ochrana matných plastů vč. motoru", price: 4300 },
    { name: "Keramická ochrana SPZ", price: null },
    { name: "Keramická ochrana litých kol a brzdičů", price: 8000 },
    { name: "Keramická ochrana PPF (až 2 roky)", price: 13000 },
  ],
  ceramicNote:
    "Před keramikou musí být lak v perfektním stavu. Pokud není, nejdřív dekontaminace a renovace (nebo leštění). Ceny keramiky jsou bez přípravy laku.",
} as const;
