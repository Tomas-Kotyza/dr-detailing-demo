import type { Metadata } from "next";
import { getAbout } from "@/lib/content";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export const metadata: Metadata = {
  title: "O mně — Patrik Doktor, detailing Praha 9",
  description:
    "Kdo stojí za Dr Detailing: osobní přístup, pečlivá práce a ověřené postupy. Dílna v Horních Počernicích — auto přivezete, nebo ho po domluvě vyzvedneme a vrátíme.",
  alternates: { canonical: "/o-mne" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "O mně | Dr Detailing",
    description:
      "Detailing Praha 9 — Horní Počernice. Osobní přístup, pečlivost a možnost vyzvednutí auta.",
    url: `${siteUrl}/o-mne`,
    type: "profile",
  },
};

export default async function AboutPage() {
  const about = await getAbout();

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/o-mne#about`,
    name: `${about.title} — Dr Detailing`,
    url: `${siteUrl}/o-mne`,
    description: about.paragraphs[0] ?? "",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#business` },
    mainEntity: {
      "@type": "Person",
      name: site.legalName,
      jobTitle: "Detailer",
      worksFor: { "@id": `${siteUrl}/#business` },
      url: `${siteUrl}/o-mne`,
    },
  };

  return (
    <main className="prose-legal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <SubpageNav
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/faq", label: "Časté otázky" },
        ]}
      />
      <p className="svc-label">Dr Detailing</p>
      <h1 className="font-display text-4xl font-bold">{about.title}</h1>
      {about.subtitle ? (
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">{about.subtitle}</p>
      ) : null}

      <section>
        {about.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </section>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/faq", label: "Časté otázky" },
        ]}
      />
    </main>
  );
}
