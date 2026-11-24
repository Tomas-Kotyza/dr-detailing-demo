/**
 * Collabim suggested keywords (export 2026-11-16) → landing URL na webu.
 * Meta keywords + přirozené použití v H1/FAQ/textu na cílových stránkách.
 *
 * SKIP = nesedí na detailing (lakovna, Dr Max, přestřik…) — v Collabimu
 * je lepší archivovat / nepropojovat, ať nekazí reporty.
 */

export type CollabimKeywordMap = {
  keyword: string;
  volumeGoogle: number;
  /** Cílová stránka (relativní path) */
  page: string;
  note?: string;
};

/** Relevantní KW z Collabimu → stránka na drdetailing.cz */
export const collabimKeywordPages: CollabimKeywordMap[] = [
  // —— Detailing hub ——
  { keyword: "detailing auto", volumeGoogle: 1000, page: "/detailing-praha-9" },
  {
    keyword: "auto detailing praha",
    volumeGoogle: 90,
    page: "/detailing-praha-9",
  },
  {
    keyword: "automobile detailing",
    volumeGoogle: 260,
    page: "/detailing-praha-9",
  },
  {
    keyword: "auto detailig",
    volumeGoogle: 260,
    page: "/detailing-praha-9",
    note: "překlep v hledání — na webu používáme správný tvar „auto detailing“",
  },

  // —— Leštění / rozleštění ——
  { keyword: "leštění aut", volumeGoogle: 260, page: "/lesteni-laku-praha" },
  {
    keyword: "rozleštění laku auta",
    volumeGoogle: 110,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "rozlesteni auta cena",
    volumeGoogle: 70,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "rozleštění škrábanců na autě cena",
    volumeGoogle: 50,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "rozleštění laku auta cena",
    volumeGoogle: 40,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "kolik stojí rozleštění laku",
    volumeGoogle: 30,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "lesteni laku praha",
    volumeGoogle: 20,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "lakování a leštění",
    volumeGoogle: 20,
    page: "/lesteni-laku-praha",
    note: "lakování neděláme — text vysvětluje rozdíl vs. leštění",
  },
  {
    keyword: "jednokrokové leštění cena",
    volumeGoogle: 20,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "cena rozlesteni auta",
    volumeGoogle: 10,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "cena rozleštění laku",
    volumeGoogle: 10,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "kolik stoji lesteni auta",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "kolik stoji rozlesteni laku auta",
    volumeGoogle: 10,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "kolik stojí rozleštění auta",
    volumeGoogle: 10,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "lesteni auta praha",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "lesteni vozidel",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "leštění karoserie cena",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "leštění karoserie praha",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "rozlesteni laku cena",
    volumeGoogle: 10,
    page: "/blog/rozlesteni-laku-cena",
  },
  {
    keyword: "rozleštění karoserie",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "strojní leštění laku",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
  },
  {
    keyword: "voskování auta praha",
    volumeGoogle: 10,
    page: "/lesteni-laku-praha",
    note: "voskování je součástí leštění — zmíněno v ceníku služby",
  },

  // —— Interiér ——
  {
    keyword: "cisteni interieru vozu",
    volumeGoogle: 880,
    page: "/cisteni-interieru-praha",
    note: "nejvyšší volume v exportu — H1/title stránky interiéru",
  },
  {
    keyword: "čištění interiéru aut praha 9",
    volumeGoogle: 40,
    page: "/cisteni-interieru-praha",
  },
  {
    keyword: "čištění interiéru auta praha 9",
    volumeGoogle: 40,
    page: "/cisteni-interieru-praha",
  },
  {
    keyword: "čištění interiérů aut praha 9",
    volumeGoogle: 40,
    page: "/cisteni-interieru-praha",
  },
  {
    keyword: "čištění interiéru vozu praha 9",
    volumeGoogle: 20,
    page: "/cisteni-interieru-praha",
  },
  {
    keyword: "čištění interiérů aut praha 10",
    volumeGoogle: 20,
    page: "/detailing-praha-10",
  },
  {
    keyword: "renovace interiéru auta",
    volumeGoogle: 20,
    page: "/cisteni-interieru-praha",
  },

  // —— Keramika ——
  {
    keyword: "keramická ochrana laku praha",
    volumeGoogle: 40,
    page: "/keramicka-ochrana-praha",
  },
  {
    keyword: "kolik stoji keramika na auto",
    volumeGoogle: 10,
    page: "/keramicka-ochrana-praha",
  },

  // —— Světlomety ——
  {
    keyword: "renovace světlometů praha",
    volumeGoogle: 50,
    page: "/renovace-svetlometu-praha",
  },
  {
    keyword: "oprava světlometů praha",
    volumeGoogle: 40,
    page: "/renovace-svetlometu-praha",
  },
  {
    keyword: "renovace světel praha",
    volumeGoogle: 20,
    page: "/renovace-svetlometu-praha",
  },
  {
    keyword: "leštění světlometů praha",
    volumeGoogle: 10,
    page: "/renovace-svetlometu-praha",
  },
  {
    keyword: "rozlesteni svetel praha",
    volumeGoogle: 10,
    page: "/renovace-svetlometu-praha",
  },
  {
    keyword: "rozleštění světlometů cena",
    volumeGoogle: 10,
    page: "/renovace-svetlometu-praha",
  },

  // —— Renovace / „oprava laku“ ——
  {
    keyword: "oprava laku auta ceník",
    volumeGoogle: 140,
    page: "/renovace-laku-praha",
    note: "v FAQ: oprava laku = renovace nebo leštění dle hloubky",
  },
  {
    keyword: "oprava laku praha",
    volumeGoogle: 40,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "broušení karoserie",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "cena opravy laku",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "obnova laku karoserie",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "oprava laku cena",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "oprava skrabancu laku cena",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "renovace laku auta praha",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
  {
    keyword: "renovace laku cena",
    volumeGoogle: 10,
    page: "/renovace-laku-praha",
  },
];

/** Nepropojovat — cizí záměr (lakovna, lékárna, přestřik…). */
export const collabimKeywordsSkipped = [
  { keyword: "autolaky praha 9", reason: "lakovna / prodej barev, ne detailing" },
  {
    keyword: "barvy laky ujezd nad lesy",
    reason: "prodejna barev",
  },
  { keyword: "dr max sterboholy", reason: "lékárna Dr Max, ne Dr Detailing" },
  {
    keyword: "kolik stoji prebarvit auto",
    reason: "přebarvení / lakování",
  },
  {
    keyword: "kolik stoji prestrik auta",
    reason: "přestřik",
  },
  {
    keyword: "kolik stojí lakování dveří auta",
    reason: "lakování dílu",
  },
  {
    keyword: "kolik stojí oprava kufru",
    reason: "oprava kufru (karosárna)",
  },
  {
    keyword: "kolik stojí přebarvení auta",
    reason: "přebarvení",
  },
  {
    keyword: "oprava karoserie praha",
    reason: "karosárna / klempířina",
  },
] as const;

/** Text pro admin / Collabim — cílová URL u každého KW. */
export function collabimPagesCopyPaste(): string {
  return collabimKeywordPages
    .map((k) => `${k.keyword}\thttps://drdetailing.cz${k.page}`)
    .join("\n");
}

/** KW pro danou path (bez query). */
export function collabimKeywordsForPage(path: string): string[] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return collabimKeywordPages
    .filter((k) => k.page === normalized)
    .map((k) => k.keyword);
}
