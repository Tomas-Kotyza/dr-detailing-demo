import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/content/site";
import type { ServicePageContent } from "@/content/services";
import { ServiceAreaSection } from "@/components/ServiceAreaSection";
import { SubpageNav } from "@/components/SubpageNav";
import { buildAreaServedJsonLd } from "@/content/localities";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export function serviceMetadata(svc: ServicePageContent): Metadata {
  const url = `${siteUrl}/${svc.slug}`;
  const ogImage = svc.heroImage?.src ?? "/film/polish-hero-start.jpg";
  return {
    title: svc.title,
    description: svc.description,
    alternates: { canonical: `/${svc.slug}` },
    keywords: svc.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: svc.title,
      description: svc.description,
      url,
      type: "website",
      locale: "cs_CZ",
      siteName: site.brandName,
      images: [{ url: ogImage, alt: svc.heroImage?.alt ?? svc.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: svc.title,
      description: svc.description,
      images: [ogImage],
    },
  };
}

function buildJsonLd(svc: ServicePageContent) {
  const url = `${siteUrl}/${svc.slug}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.schemaName,
    serviceType: svc.schemaName,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: buildAreaServedJsonLd(),
    url,
    description: svc.description,
    ...(svc.heroImage
      ? { image: `${siteUrl}${svc.heroImage.src}` }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "CZK",
      price: svc.schemaPrice,
      url: `${siteUrl}/#objednat`,
      availability: "https://schema.org/InStock",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Úvod",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: `${siteUrl}/sluzby`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: svc.h1,
        item: url,
      },
    ],
  };

  return [service, faq, breadcrumb];
}

export function ServiceLanding({ svc }: { svc: ServicePageContent }) {
  const jsonLd = buildJsonLd(svc);

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
          { href: "/sluzby", label: "Přehled služeb" },
          { href: "/#objednat", label: "Domluvit termín" },
          ...(svc.blogHref ? [{ href: svc.blogHref, label: "Blog" }] : []),
        ]}
      />

      <p className="svc-label">{svc.label}</p>
      <h1 className="font-display text-4xl font-bold">{svc.h1}</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        {site.brandName} · {site.address} · {svc.priceFrom}
        {svc.duration ? ` · ${svc.duration}` : ""}
      </p>

      {svc.heroImage ? (
        <figure className="my-8 overflow-hidden rounded-lg">
          <Image
            src={svc.heroImage.src}
            alt={svc.heroImage.alt}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            priority={svc.slug === "lesteni-laku-praha"}
          />
        </figure>
      ) : null}

      <p className="my-6 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm md:text-base">
        <strong>{svc.priceFrom}</strong>
        {svc.duration ? ` · ${svc.duration}` : ""} ·{" "}
        <Link href="/#objednat" className="font-semibold text-[var(--accent)]">
          Domluvit termín
        </Link>
        {" · "}
        <a href={`tel:${site.phone}`} className="font-semibold text-[var(--accent)]">
          {site.phoneDisplay}
        </a>
      </p>

      <section>
        <p>{svc.intro}</p>
      </section>

      {svc.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
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

      <ServiceAreaSection />

      <section>
        <h2>Časté otázky</h2>
        <div className="space-y-6">
          {svc.faqs.map((item) => (
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
          Auto přivezte na {site.address}, nebo domluvte svoz.
        </p>
      </section>

      <section>
        <h2>Další služby</h2>
        <ul>
          {svc.related.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>{r.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/sluzby">Přehled všech služeb</Link>
          </li>
        </ul>
      </section>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/sluzby", label: "Přehled služeb" },
          { href: "/#objednat", label: "Domluvit termín" },
          ...(svc.blogHref ? [{ href: svc.blogHref, label: "Blog" }] : []),
        ]}
      />
    </main>
  );
}
