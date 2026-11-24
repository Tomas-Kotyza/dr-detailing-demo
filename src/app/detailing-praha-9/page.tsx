import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { SubpageNav } from "@/components/SubpageNav";
import { buildAreaServedJsonLd } from "@/content/localities";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export const metadata: Metadata = {
  title: "Detailing Praha — Praha 9, Horní Počernice od 3 000 Kč",
  description:
    "Detailing Praha v Praze 9 (Horní Počernice). Rozleštění laku od 9 600 Kč, keramická ochrana od 7 500 Kč, renovace světlometů (pár) od 1 300 Kč. Vyzvednutí auta. Dr Detailing.",
  alternates: { canonical: "/detailing-praha-9" },
  keywords: [
    "detailing Praha",
    "detailing Praha 9",
    "detailing auto",
    "auto detailing Praha",
    "automobile detailing",
    "detailing Horní Počernice",
    "detailing Praha 10",
    "detailing Brandýs nad Labem",
    "rozleštění laku",
    "rozleštění laku cena",
    "leštění aut",
    "leštění laku Praha",
    "leštění laku Praha 9",
    "leštění karoserie Praha 9",
    "keramická ochrana Praha 9",
    "Gtechniq Praha 9",
    "čištění interiéru Praha 9",
    "čištění interiéru vozu Praha 9",
    "renovace světlometů Praha 9",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Detailing Praha | Praha 9 — Dr Detailing",
    description:
      "Detailing Praha: rozleštění laku od 9 600 Kč, keramika od 7 500 Kč. Studio Praha 9 / Horní Počernice, vyzvednutí auta.",
    url: `${siteUrl}/detailing-praha-9`,
    type: "website",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Car detailing Praha 9",
  serviceType: "Automotive detailing",
  provider: { "@id": `${siteUrl}/#business` },
  areaServed: buildAreaServedJsonLd(),
  url: `${siteUrl}/detailing-praha-9`,
  description:
    "Leštění laku a karoserie, renovace, keramická ochrana Gtechniq, čištění interiéru auta a renovace světlometů. Studio Dr Detailing, Horní Počernice.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "CZK",
    lowPrice: "490",
    highPrice: "23900",
    offerCount: "10",
  },
};

const pageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kde najdu detailing Praha / detailing v Praze 9?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Dr Detailing, ${site.address}, Horní Počernice. Telefon ${site.phoneDisplay}, web ${site.domain}. Detailing Praha = studio Praha 9 s dojezdem do okolí.`,
      },
    },
    {
      "@type": "Question",
      name: "Kolik stojí detailing Praha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orientačně: renovace světlometů (pár) 1 300 Kč, čištění interiéru od 3 000 Kč, rozleštění / leštění laku od 9 600 Kč, renovace laku od 23 900 Kč, keramika Gtechniq od 7 500 Kč (bez přípravy laku).",
      },
    },
    {
      "@type": "Question",
      name: "Kolik stojí rozleštění laku u vás?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rozleštění laku od 9 600 Kč (1–2 dny). Detail cen: drdetailing.cz/lesteni-laku-praha a blog /blog/rozlesteni-laku-cena.",
      },
    },
    {
      "@type": "Question",
      name: "Vyzvednete auto na detailing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ano — po domluvě auto vyzvedneme a po práci vrátíme. Nebo ho přivezete do dílny v Horních Počernicích.",
      },
    },
  ],
};

export default function DetailingPraha9Page() {
  return (
    <main className="prose-legal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageFaqJsonLd) }}
      />

      <SubpageNav
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/sluzby", label: "Přehled služeb" },
          { href: "/detailing-praha-10", label: "Detailing Praha 10" },
        ]}
      />
      <p className="svc-label">Lokální služby</p>
      <h1 className="font-display text-4xl font-bold">
        Detailing Praha — Praha&nbsp;9, Horní Počernice
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        {site.brandName} · {site.address} · {site.phoneDisplay}
      </p>

      <section>
        <h2>Co děláme — detailing Praha</h2>
        <p>
          Hledáte <strong>detailing Praha</strong>,{" "}
          <strong>detailing auto</strong> nebo{" "}
          <strong>auto detailing Praha</strong>? Studio Dr Detailing
          (nepleťte si s „DG Detailing“) je v Horních Počernicích (Praha 9):{" "}
          <strong>leštění aut</strong> a rozleštění laku,{" "}
          <strong>renovace laku</strong>,{" "}
          <strong>keramická ochrana laku</strong> (Gtechniq),{" "}
          <strong>čištění interiéru vozu</strong> a{" "}
          <strong>renovace světel</strong>. Obsluhujeme Prahu 9, Prahu 10 a okolí
          do cca 30 minut. Motto: {site.motto} Proces:{" "}
          {site.process.join(" → ")}.
        </p>
        <p>
          Rozleštění laku / leštění karoserie od 9 600 Kč — ceny a FAQ:{" "}
          <Link href="/lesteni-laku-praha">leštění laku Praha</Link>
          {" · "}
          <Link href="/blog/rozlesteni-laku-cena">rozleštění laku — cena</Link>.
        </p>
      </section>

      <section>
        <h2>Služby podrobně</h2>
        <ul>
          <li>
            <Link href="/lesteni-laku-praha">Leštění / rozleštění laku Praha</Link> — od
            9 600 Kč
          </li>
          <li>
            <Link href="/renovace-laku-praha">Renovace laku</Link> — od 23
            900 Kč
          </li>
          <li>
            <Link href="/keramicka-ochrana-praha">
              Keramická ochrana laku
            </Link>{" "}
            — od 7 500 Kč
          </li>
          <li>
            <Link href="/cisteni-interieru-praha">
              Čištění interiéru vozu / auta
            </Link>{" "}
            — od 3 000 Kč
          </li>
          <li>
            <Link href="/renovace-svetlometu-praha">
              Renovace / oprava světlometů
            </Link>{" "}
            — 1 300 Kč / pár
          </li>
          <li>
            <Link href="/detailing-praha-10">
              Detailing Praha 10
            </Link>{" "}
            — Uhříněves, Hostivař, Štěrboholy (leštění, keramika, interiér)
          </li>
          <li>
            <Link href="/detailing-brandys-nad-labem">Detailing Brandýs nad Labem</Link>
          </li>
          <li>
            <Link href="/detailing-uvaly">Detailing Úvaly</Link>
          </li>
          <li>
            <Link href="/sluzby">Přehled všech služeb</Link>
          </li>
        </ul>
      </section>

      <ServiceAreaSection focus="praha9" />

      <section>
        <h2>Proč právě tady</h2>
        <ul>
          <li>Dílna přímo v Horních Počernicích (Praha 9)</li>
          <li>Keramika značky Gtechniq — až po přípravě laku</li>
          <li>Možnost vyzvednutí a vrácení auta po domluvě</li>
          <li>Jasné orientační ceny „od“ na webu</li>
          <li>Osobní přístup — {site.legalName}</li>
        </ul>
      </section>

      <section>
        <h2>Orientační ceny</h2>
        <ul>
          <li>Renovace světlometů — 1 300 Kč / pár (1 ks jen výjimečně)</li>
          <li>Čištění interiéru — od 3 000 Kč (1–2 dny)</li>
          <li>Rozleštění / leštění laku — od 9 600 Kč (1–2 dny)</li>
          <li>Renovace laku — od 23 900 Kč (3–4 dny)</li>
          <li>Keramika Gtechniq — od 7 500 Kč (bez přípravy laku)</li>
        </ul>
        <p>
          Před keramikou musí být lak v perfektním stavu. Jinak nejdřív
          dekontaminace a renovace / leštění.{" "}
          <Link href="/blog/rozlesteni-laku-cena">
            Kolik stojí rozleštění laku — podrobně
          </Link>
          .
        </p>
      </section>

      <section>
        <h2>Časté otázky — detailing Praha</h2>
        <h3 className="font-display text-lg font-bold">
          Kde najdu detailing Praha?
        </h3>
        <p>
          Studio Dr Detailing, {site.address}, Praha 9 — Horní Počernice.
          Telefon {site.phoneDisplay}.
        </p>
        <h3 className="mt-4 font-display text-lg font-bold">
          Kolik stojí detailing Praha?
        </h3>
        <p>
          Záleží na službě — rozleštění od 9 600 Kč, interiér od 3 000 Kč,
          keramika od 7 500 Kč. Přehled:{" "}
          <Link href="/sluzby">služby</Link>.
        </p>
        <h3 className="mt-4 font-display text-lg font-bold">
          Kolik stojí rozleštění laku?
        </h3>
        <p>
          Od 9 600 Kč. Detail:{" "}
          <Link href="/lesteni-laku-praha">leštění laku Praha</Link>.
        </p>
      </section>

      <section>
        <h2>Jak objednat</h2>
        <p>
          Formulář na webu, telefon {site.phoneDisplay} nebo e-mail{" "}
          {site.email}. Auto přivezte na {site.address}, nebo domluvte svoz.
        </p>
      </section>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/sluzby", label: "Přehled služeb" },
          { href: "/detailing-praha-10", label: "Detailing Praha 10" },
        ]}
      />
    </main>
  );
}
