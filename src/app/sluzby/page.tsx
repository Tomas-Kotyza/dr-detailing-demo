import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { servicePages, servicesHub } from "@/content/services";
import { SubpageNav } from "@/components/SubpageNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export const metadata: Metadata = {
  title: servicesHub.title,
  description: servicesHub.description,
  alternates: { canonical: "/sluzby" },
  keywords: [...servicesHub.keywords],
  robots: { index: true, follow: true },
  openGraph: {
    title: servicesHub.title,
    description: servicesHub.description,
    url: `${siteUrl}/sluzby`,
    type: "website",
    locale: "cs_CZ",
    siteName: site.brandName,
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Služby Dr Detailing Praha 9",
  itemListElement: servicePages.map((svc, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: svc.h1,
    url: `${siteUrl}/${svc.slug}`,
  })),
};

export default function SluzbyPage() {
  return (
    <main className="prose-legal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <SubpageNav
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/#cenik", label: "Ceník na úvodu" },
          { href: "/faq", label: "Časté otázky" },
        ]}
      />
      <p className="svc-label">Ceník služeb</p>
      <h1 className="font-display text-4xl font-bold">
        Služby detailing Praha&nbsp;9
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        {site.brandName} · {site.address} · {site.phoneDisplay}
      </p>

      <section>
        <p>
          Kompletní ceník: leštění karoserie od 9 600 Kč, renovace laku,
          keramická ochrana laku od 7 500 Kč, čištění interiérů a renovace
          světlometů (pár) od 1 300 Kč. Studio v Horních Počernicích — obsluhujeme Prahu 9,
          Prahu 10 a okolí do cca 30 minut. Auto přivezete, nebo po domluvě
          vyzvedneme.
        </p>
      </section>

      <section>
        <h2>Vyberte službu</h2>
        <ul>
          {servicePages.map((svc) => (
            <li key={svc.slug}>
              <Link href={`/${svc.slug}`}>{svc.h1}</Link>
              {" — "}
              {svc.priceFrom}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Lokální detailing — kam jezdíme</h2>
        <p>
          Studio je v Horních Počernicích. Pro každou lokalitu máte stránku se
          svozem a cenami:
        </p>
        <ul>
          <li>
            <Link href="/detailing-praha-9">Detailing Praha 9</Link>
          </li>
          <li>
            <Link href="/detailing-praha-10">Detailing Praha 10</Link>
          </li>
          <li>
            <Link href="/detailing-brandys-nad-labem">Brandýs nad Labem</Link>
          </li>
          <li>
            <Link href="/detailing-stara-boleslav">Stará Boleslav</Link>
          </li>
          <li>
            <Link href="/detailing-uvaly">Úvaly</Link>
          </li>
          <li>
            <Link href="/detailing-klanovice">Klánovice</Link>
          </li>
          <li>
            <Link href="/detailing-ujezd-nad-lesy">Újezd nad Lesy</Link>
          </li>
          <li>
            <Link href="/detailing-radonice">Radonice</Link>
          </li>
          <li>
            <Link href="/detailing-lysa-nad-labem">Lysá nad Labem</Link>
          </li>
          <li>
            <Link href="/detailing-milovice">Milovice</Link>
          </li>
          <li>
            <Link href="/detailing-cesky-brod">Český Brod</Link>
          </li>
          <li>
            <Link href="/detailing-kostelec-nad-cernymi-lesy">
              Kostelec nad Černými lesy
            </Link>
          </li>
        </ul>
      </section>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/#cenik", label: "Ceník na úvodu" },
          { href: "/faq", label: "Časté otázky" },
        ]}
      />
    </main>
  );
}
