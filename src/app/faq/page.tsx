import type { Metadata } from "next";
import { getFaqItems } from "@/lib/content";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drdetailing.cz";

export const metadata: Metadata = {
  title: "Časté otázky — detailing Praha 9",
  description:
    "Odpovědi o leštění laku, keramice Gtechniq, přípravě laku, vyzvednutí auta a objednávce u Dr Detailing v Praze 9 — Horní Počernice.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Časté otázky | Dr Detailing",
    description:
      "Ceny, keramika Gtechniq, vyzvednutí auta a jak objednat detailing v Praze 9.",
    url: `${siteUrl}/faq`,
  },
};

export default async function FaqPage() {
  const faqItems = await getFaqItems();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="prose-legal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SubpageNav
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/sluzby", label: "Přehled služeb" },
        ]}
      />
      <p className="svc-label">Pomoc zákazníkům</p>
      <h1 className="font-display text-4xl font-bold">Časté otázky</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)] md:text-base">
        Krátké odpovědi o službách {site.brandName} v Praze 9 — vhodné i pro
        vyhledávání a AI asistenty.
      </p>

      <div className="mt-10 space-y-8">
        {faqItems.map((item) => (
          <section key={item.id ?? item.question}>
            <h2 className="font-display text-xl font-bold md:text-2xl">{item.question}</h2>
            <p className="mt-2 text-[var(--muted)]">{item.answer}</p>
          </section>
        ))}
      </div>

      <SubpageNav
        place="bottom"
        extra={[
          { href: "/#objednat", label: "Domluvit termín" },
          { href: "/sluzby", label: "Přehled služeb" },
        ]}
      />
    </main>
  );
}
