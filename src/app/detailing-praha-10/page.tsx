import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { SubpageNav } from "@/components/SubpageNav";
import { serviceArea } from "@/content/localities";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export const metadata: Metadata = {
  title: "Detailing Praha 10 — leštění, keramika, interiér od 3 000 Kč",
  description:
    "Detailing Praha 10 (Uhříněves, Hostivař, Štěrboholy, Malešice): leštění laku od 9 600 Kč, keramika od 7 500 Kč, čištění interiéru od 3 000 Kč. Studio Horní Počernice, svoz auta.",
  alternates: { canonical: "/detailing-praha-10" },
  keywords: [
    "detailing Praha 10",
    "leštění laku Praha 10",
    "leštění karoserie Praha 10",
    "leštění aut Praha 10",
    "rozleštění laku Praha 10",
    "keramická ochrana Praha 10",
    "keramická ochrana laku Praha 10",
    "čištění interiéru Praha 10",
    "čištění interiéru auta Praha 10",
    "čištění interiérů aut Praha 10",
    "renovace světlometů Praha 10",
    "detailing Uhříněves",
    "detailing Hostivař",
    "detailing Štěrboholy",
    "detailing Malešice",
    "detailing Horní Počernice",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Detailing Praha 10 | Leštění, keramika, interiér — Dr Detailing",
    description:
      "Detailing Praha 10 — leštění od 9 600 Kč, keramika od 7 500 Kč, interiér od 3 000 Kč. Studio Horní Počernice, svoz z Uhříněvsi a Hostivaře.",
    url: `${siteUrl}/detailing-praha-10`,
    type: "website",
  },
};

const faqs = [
  {
    question: "Děláte detailing pro Prahu 10?",
    answer: `Ano. Studio Dr Detailing je v Horních Počernicích (Praha 9) — z Prahy 10 (Uhříněves, Hostivař, Štěrboholy, Malešice…) obvykle 15–20 minut. Auto přivezete, nebo po domluvě vyzvedneme. ${site.phoneDisplay}.`,
  },
  {
    question: "Kolik stojí leštění laku Praha 10?",
    answer:
      "Stejná cena jako u nás ve studiu: jednokrokové leštění / rozleštění laku od 9 600 Kč (1–2 dny). Renovace laku od 23 900 Kč. Detail: drdetailing.cz/lesteni-laku-praha.",
  },
  {
    question: "Kolik stojí keramická ochrana Praha 10?",
    answer:
      "Keramická ochrana laku Gtechniq od 7 500 Kč (1 rok) bez přípravy laku. 3 roky 15 500 Kč, 5 let 22 500 Kč. Před keramikou musí být lak vyleštěn. Více: /keramicka-ochrana-praha.",
  },
  {
    question: "Kolik stojí čištění interiéru auta Praha 10?",
    answer:
      "Kompletní čištění interiéru od 3 000 Kč (1–2 dny), cena podle znečištění. Volitelně ozon 490 Kč. Více: /cisteni-interieru-praha.",
  },
  {
    question: "Vyzvednete auto v Praze 10 (Uhříněves, Hostivař…)?",
    answer:
      "Ano — po domluvě auto vyzvedneme v Praze 10 nebo okolí (do cca 30 min od dílny) a po práci vrátíme na domluvené místo.",
  },
  {
    question: "Kde je studio, když hledám detailing Praha 10?",
    answer: `Provozovna: ${site.address}, Horní Počernice (Praha 9). Pro Prahu 10 jsme nejbližší východní studio — nemusíte jezdit přes celé město. Objednávka: ${site.domain} nebo ${site.phoneDisplay}.`,
  },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Detailing Praha 10",
  serviceType: "Automotive detailing",
  provider: { "@id": `${siteUrl}/#business` },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Praha 10" },
    ...serviceArea.praha10.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    { "@type": "AdministrativeArea", name: "Horní Počernice" },
  ],
  url: `${siteUrl}/detailing-praha-10`,
  description:
    "Detailing Praha 10: leštění laku, keramická ochrana Gtechniq, čištění interiéru a renovace světlometů. Studio Dr Detailing, Horní Počernice — dojezd Uhříněves, Hostivař, Štěrboholy, Malešice.",
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
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function DetailingPraha10Page() {
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
          { href: "/detailing-praha-9", label: "Detailing Praha 9" },
        ]}
      />
      <p className="svc-label">Lokální služby · Praha 10</p>
      <h1 className="font-display text-4xl font-bold">
        Detailing Praha&nbsp;10 — leštění, keramika, interiér
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        {site.brandName} · studio {site.address} (Horní Počernice) ·{" "}
        {site.phoneDisplay}
      </p>
      <p className="mt-4 max-w-2xl text-sm md:text-base">
        Orientačně: čištění interiéru od <strong>3 000 Kč</strong>, leštění /
        rozleštění laku od <strong>9 600 Kč</strong>, keramika od{" "}
        <strong>7 500 Kč</strong>, světlomety <strong>1 300 Kč / pár</strong>.
        Svoz auta z Prahy 10 po domluvě.
      </p>

      <section>
        <h2>Detailing Praha 10 — studio vedle, ne na druhé straně města</h2>
        <p>
          Hledáte <strong>detailing Praha 10</strong>? Dr Detailing sídlí v
          sousedních <strong>Horních Počernicích (Praha 9)</strong>. Z
          Uhříněvsi, Hostivaře, Štěrbohol, Dolních Měcholup nebo Malešic je to
          obvykle <strong>15–20 minut</strong> — nebo auto po domluvě vyzvedneme
          a po práci vrátíme.
        </p>
        <p>
          Děláme <strong>leštění laku a karoserie</strong>,{" "}
          <strong>rozleštění laku</strong>,{" "}
          <strong>keramickou ochranu Gtechniq</strong>,{" "}
          <strong>čištění interiéru auta</strong> a{" "}
          <strong>renovaci světlometů</strong>. Proces:{" "}
          {site.process.join(" → ")}. Motto: {site.motto}
        </p>
      </section>

      <section>
        <h2>Leštění laku Praha 10</h2>
        <p>
          <strong>Leštění laku Praha 10</strong> / leštění karoserie u nás
          znamená strojní jednokrok od 9 600 Kč (1–2 dny): mytí, dekontaminace,
          leštění a vosk. Hlubší vady řeší{" "}
          <Link href="/renovace-laku-praha">renovace laku</Link> od 23 900 Kč.
          Kompletní popis a FAQ:{" "}
          <Link href="/lesteni-laku-praha">leštění laku Praha</Link>. Ceny a
          srovnání:{" "}
          <Link href="/blog/rozlesteni-laku-cena">rozleštění laku — cena</Link>.
        </p>
      </section>

      <section>
        <h2>Keramická ochrana Praha 10</h2>
        <p>
          <strong>Keramická ochrana Praha 10</strong> (Gtechniq) od 7 500 Kč —
          jen na připravený lak. Před keramikou vždy leštění nebo renovace.
          Balíčky 1 / 3 / 5 let. Detail:{" "}
          <Link href="/keramicka-ochrana-praha">keramická ochrana laku Praha</Link>.
        </p>
      </section>

      <section>
        <h2>Čištění interiéru Praha 10</h2>
        <p>
          <strong>Čištění interiéru auta Praha 10</strong> od 3 000 Kč (1–2
          dny) — sedačky, koberce, plasty, skla. Volitelně dezinfekce ozonem.
          Více:{" "}
          <Link href="/cisteni-interieru-praha">čištění interiéru Praha</Link>.
        </p>
      </section>

      <section>
        <h2>Části Prahy 10, kam jezdíme</h2>
        <ul>
          {serviceArea.praha10.map((place) => (
            <li key={place}>{place}</li>
          ))}
        </ul>
        <p className="text-sm text-[var(--muted)]">
          Plus okolí do cca 30 minut — viz{" "}
          <Link href="/detailing-praha-9">Detailing Praha 9</Link>,{" "}
          <Link href="/detailing-uvaly">Úvaly</Link>,{" "}
          <Link href="/detailing-brandys-nad-labem">Brandýs</Link>.
        </p>
      </section>

      <section>
        <h2>Služby a ceník (odkazy)</h2>
        <ul>
          <li>
            <Link href="/lesteni-laku-praha">Leštění / rozleštění laku</Link> —
            od 9 600 Kč
          </li>
          <li>
            <Link href="/renovace-laku-praha">Renovace laku</Link> — od 23 900 Kč
          </li>
          <li>
            <Link href="/keramicka-ochrana-praha">Keramická ochrana laku</Link> —
            od 7 500 Kč
          </li>
          <li>
            <Link href="/cisteni-interieru-praha">Čištění interiéru</Link> — od
            3 000 Kč
          </li>
          <li>
            <Link href="/renovace-svetlometu-praha">Renovace světel</Link> — 1
            300 Kč / pár
          </li>
          <li>
            <Link href="/sluzby">Přehled všech služeb</Link>
          </li>
          <li>
            <Link href="/detailing-praha-9">Detailing Praha 9</Link> (studio)
          </li>
        </ul>
      </section>

      <ServiceAreaSection focus="praha10" />

      <section>
        <h2>Proč z Prahy 10 k Dr Detailing</h2>
        <ul>
          <li>Blízký dojezd z východní Prahy — ne přes celé město</li>
          <li>Svoz auta po domluvě (Uhříněves, Hostivař, Štěrboholy…)</li>
          <li>Keramika Gtechniq, jasné ceny „od“ na webu</li>
          <li>Osobní přístup — {site.legalName}</li>
        </ul>
      </section>

      <section>
        <h2>Časté otázky — detailing Praha 10</h2>
        {faqs.map((item) => (
          <div key={item.question} className="mt-6">
            <h3 className="font-display text-xl font-bold">{item.question}</h3>
            <p className="mt-2 text-[var(--muted)]">{item.answer}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Jak objednat</h2>
        <p>
          Formulář na webu (#objednat), telefon {site.phoneDisplay} nebo e-mail{" "}
          {site.email}. Auto přivezte na {site.address}, nebo domluvte svoz z
          Prahy 10.
        </p>
      </section>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/detailing-praha-9", label: "Detailing Praha 9" },
          { href: "/lesteni-laku-praha", label: "Leštění laku" },
          { href: "/sluzby", label: "Přehled služeb" },
        ]}
      />
    </main>
  );
}
