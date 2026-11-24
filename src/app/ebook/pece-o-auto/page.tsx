import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNovinky } from "@/lib/content";
import { site } from "@/content/site";
import { EbookDownloadForm } from "@/components/EbookDownloadForm";

export async function generateMetadata(): Promise<Metadata> {
  const novinky = await getNovinky();
  if (!novinky.ebookApproved) {
    return { title: "Ebook | Dr Detailing", robots: { index: false, follow: false } };
  }
  return {
    title: `${novinky.ebook.title} | ${site.brandName}`,
    description: novinky.ebook.subtitle,
  };
}

export default async function EbookPage() {
  const novinky = await getNovinky();
  if (!novinky.ebookApproved) notFound();

  const { ebook } = novinky;

  return (
    <main className="ebook-page">
      <div className="ebook-inner">
        <p className="svc-label">Ebook zdarma</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{ebook.title}</h1>
        <p className="mt-3 text-[var(--muted)]">{ebook.subtitle}</p>

        <EbookDownloadForm />

        <div className="ebook-chapters mt-10">
          {ebook.chapters.map((ch) => (
            <section key={ch.heading} className="ebook-chapter">
              <h2 className="font-display text-xl font-bold">{ch.heading}</h2>
              {ch.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm">
          <Link href="/#objednat" className="font-semibold text-[var(--accent)]">
            Domluvit termín →
          </Link>
        </p>
      </div>
    </main>
  );
}
