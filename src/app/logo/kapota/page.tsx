import type { Metadata } from "next";
import { hoodWaveConcepts } from "@/components/logos/HoodWaveConcepts";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Návrhy loga — kapota",
  description: "Tři varianty zelené kapotové vlnky mezi DR a DETAILING.",
  alternates: { canonical: "/logo/kapota" },
  robots: { index: false, follow: false },
};

export default function HoodLogoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--accent-line)] px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="svc-label">// Kapota — brand exploration</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Návrhy kapoty — <span className="text-[var(--accent)]">{site.brandName}</span>
            </h1>
          </div>
          <SubpageNav
            backHref="/logo"
            backLabel="Zpět na loga"
            extra={[{ href: "/", label: "Na úvod" }]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          Zelená vlnka barvou webu (<strong className="text-[var(--fg)]">#1f7a52</strong>) jde{" "}
          <strong className="text-[var(--fg)]">mezi DR a DETAILING</strong> a končí{" "}
          <strong className="text-[var(--fg)]">za slovem KERAMIKA</strong>. Vyberte K1 / K2 / K3.
        </p>

        <div className="mt-12 space-y-10">
          {hoodWaveConcepts.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden rounded-2xl border border-[rgba(18,22,28,0.1)] bg-white"
            >
              <div className="flex min-h-[160px] items-center justify-center bg-[var(--bg)] p-10 md:min-h-[200px]">
                <c.Logo className="h-16 w-auto" />
              </div>
              <div className="border-t border-[rgba(18,22,28,0.08)] p-6 md:p-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-display text-lg font-bold">{c.title}</h2>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {c.vibe}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{c.note}</p>
                <div className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>Ikona:</span>
                  <c.Logo iconOnly className="h-10 w-auto opacity-90" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-[var(--muted)]">
          Napište K1, K2 nebo K3 — ten nasadíme do hlavičky a patičky webu.
        </p>
        <SubpageNav
          place="bottom"
          backHref="/logo"
          backLabel="Zpět na loga"
          extra={[{ href: "/", label: "Na úvod" }]}
        />
      </main>
    </div>
  );
}
