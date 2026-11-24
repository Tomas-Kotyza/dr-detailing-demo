import { site } from "@/content/site";
import type { PromoItem } from "@/lib/content/types";

/** Výchozí marketingové akce — texty připravené ke kopírování. */
export const defaultPromos: PromoItem[] = [
  {
    id: "svetlomety-k-lesteni",
    title: "Světlomety k leštění za 1 Kč",
    subtitle: "Hlavní akce · při objednávce leštění nebo renovace laku",
    badge: "HLAVNÍ",
    offerLine: "Oba přední světlomety za 1 Kč (běžně 1 300 Kč)",
    flyerPrice: "1 Kč",
    body: `Objednejte leštění laku nebo renovaci laku a renovaci obou předních světlometů dostanete za 1 Kč.

Běžná cena: pár (oba přední) 1 300 Kč. Samostatný 1 ks jen výjimečně.
Platí v Dr Detailing, ${site.address}, Praha 9 — Horní Počernice.
Termín: ${site.phoneDisplay} nebo formulář na ${site.domain}.`,
    mapsText: `🔧 AKCE Dr Detailing — Praha 9

K leštění nebo renovaci laku
→ oba přední světlomety ZA 1 Kč
(běžně 1 300 Kč)

Vrátíme lesk karoserii i světlům.
📍 ${site.address}
📞 ${site.phoneDisplay}
🌐 ${site.domain}`,
    smsText: `Ahoj, u Dr Detailing teď běží akce: k leštění/renovaci laku jsou oba světlomety za 1 Kč (běžně 1300 Kč). Praha 9 — Horní Počernice. Termín: ${site.phoneDisplay} nebo ${site.domain}`,
    instagramText: `SVĚTLOMETY K LEŠTĚNÍ ZA 1 Kč

Objednáš leštění nebo renovaci laku → oba přední světlomety za korunu.
(běžně 1 300 Kč)

Dr Detailing · Horní Počernice · Praha 9
${site.phoneDisplay}
${site.domain}

#detailing #praha9 #lestenilaku #svetlomety #drdetailing`,
    posterUrl: "/akce/akce-svetlomety-poster.png",
    active: false,
    sortOrder: 0,
  },
  {
    id: "ozon-za-recenzi",
    title: "Ozon za recenzi za 1 Kč",
    subtitle: "Za Google recenzi · po dokončené práci",
    badge: "RECENZE",
    offerLine: "Dezinfekce ozonem za 1 Kč (běžně 490 Kč)",
    flyerPrice: "1 Kč",
    body: `Po dokončené práci napište krátkou recenzi na Google (Firemní profil Dr Detailing) a dezinfekci ozonem dostanete příště — nebo jako doplněk — za 1 Kč.

Běžná cena ozonu: 490 Kč.
Stačí screenshot / odkaz na recenzi.
Studio: ${site.address}, Praha 9.
Kontakt: ${site.phoneDisplay}.`,
    mapsText: `⭐ Děkujeme za recenzi!

Napište nám Google recenzi
→ dezinfekce ozonem ZA 1 Kč
(běžně 490 Kč)

Dr Detailing · Praha 9
📞 ${site.phoneDisplay}
🌐 ${site.domain}`,
    smsText: `Díky za návštěvu u Dr Detailing! Když napíšete krátkou Google recenzi, příště (nebo teď jako doplněk) máte ozon za 1 Kč místo 490 Kč. Stačí dát vědět. ${site.phoneDisplay}`,
    instagramText: `OZON ZA RECENZI — 1 Kč

Napiš krátkou Google recenzi Dr Detailing
→ dezinfekce ozonem za korunu (běžně 490 Kč)

Horní Počernice · Praha 9
${site.domain}

#drdetailing #praha9 #recenze #detailing`,
    posterUrl: "/akce/akce-svetlomety-poster.png",
    active: false,
    sortOrder: 1,
  },
];
