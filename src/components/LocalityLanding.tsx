import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/content/site";
import type { LocalityPageContent } from "@/content/localities";
import { buildAreaServedJsonLd } from "@/content/localities";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { SubpageNav } from "@/components/SubpageNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export function localityMetadata(loc: LocalityPageContent): Metadata {
  const path = `/${loc.slug}`;
  const indexable = loc.indexable !== false;
  return {
    title: loc.title,
    description: loc.description,
    alternates: { canonical: path },
    keywords: loc.keywords,
    robots: { index: indexable, follow: true },
    openGraph: {
      title: `${loc.name} | Dr Detailing`,
      description: loc.description,
      url: `${siteUrl}${path}`,
      type: "website",
    },
  };
}

function buildJsonLd(loc: LocalityPageContent) {
  const url = `${siteUrl}/${loc.slug}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Car detailing ${loc.name}`,
    serviceType: "Automotive detailing",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: buildAreaServedJsonLd(),
    url,
    description: loc.description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CZK",
      lowPrice: "490",
      highPrice: "23900",
      offerCount: "10",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: loc.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return [service, faq];
}

export function LocalityLanding({ loc }: { loc: LocalityPageContent }) {
  const jsonLd = buildJsonLd(loc);

  return (
    <main className="prose-legal">
      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <SubpageNav
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/sluzby", label: "Přehled služeb" },
          { href: "/detailing-praha-9", label: "Detailing Praha 9" },
          { href: "/detailing-praha-10", label: "Detailing Praha 10" },
        ]}
      />
      <p className="svc-label">{loc.label}</p>
      <h1 className="font-display text-4xl font-bold">{loc.h1}</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        {site.brandName} · studio {site.address} · dojezd {loc.drive} ·{" "}
        {site.phoneDisplay}
      </p>
      {loc.priceLead ? (
        <p className="mt-4 max-w-2xl text-sm md:text-base">{loc.priceLead}</p>
      ) : null}

      <section>
        <h2>Detailing pro {loc.name}</h2>
        <p>{loc.intro}</p>
      </section>

      <section>
        <h2>Služby pro zákazníky z {loc.name}</h2>
        <ul>
          <li>
            <Link href="/lesteni-laku-praha">Leštění / rozleštění laku</Link> — od
            9 600 Kč
          </li>
          <li>
            <Link href="/renovace-laku-praha">Renovace laku</Link> — od 23 900 Kč
          </li>
          <li>
            <Link href="/keramicka-ochrana-praha">Keramická ochrana laku</Link> — od
            7 500 Kč
          </li>
          <li>
            <Link href="/cisteni-interieru-praha">Čištění interiéru auta</Link> — od
            3 000 Kč
          </li>
          <li>
            <Link href="/renovace-svetlometu-praha">Renovace světlometů</Link> — 1 300 Kč / pár
            / ks
          </li>
          <li>
            <Link href="/blog/rozlesteni-laku-cena">Rozleštění laku — cena</Link>
          </li>
          <li>
            <Link href="/sluzby">Přehled všech služeb</Link>
          </li>
        </ul>
      </section>

      {loc.extraSections?.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
          {section.bullets && section.bullets.length > 0 ? (
            <ul>
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <ServiceAreaSection focus="all" />

      <section>
        <h2>Proč jezdit k nám z {loc.name}</h2>
        <ul>
          {loc.whyBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {loc.nearbyLinks && loc.nearbyLinks.length > 0 ? (
        <section>
          <h2>Související lokality</h2>
          <ul>
            {loc.nearbyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2>Časté otázky — detailing {loc.name}</h2>
        <div className="space-y-6">
          {loc.faqs.map((item) => (
            <div key={item.question}>
              <h3 className="font-display text-lg font-bold text-[var(--fg)]">
                {item.question}
              </h3>
              <p className="mt-1">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Jak objednat</h2>
        <p>
          Formulář na webu, telefon {site.phoneDisplay} nebo e-mail {site.email}.
          Auto přivezte na {site.address}, nebo domluvte svoz z {loc.name}.
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
