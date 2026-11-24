import type { Metadata } from "next";
import { logoConcepts } from "@/components/logos/LogoConcepts";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Návrhy loga",
  description: "Šest odlišných konceptů loga pro Dr Detailing — výběr směru.",
  robots: { index: false, follow: false },
};

export default function LogoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-white/10 px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="tag">// Brand exploration</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
              Návrhy loga — <span className="text-[var(--lime)]">{site.brandName}</span>
            </h1>
          </div>
          <SubpageNav
            extra={[
              { href: "/logo/kapota", label: "Kapota" },
              { href: "/logo/kapka", label: "Kapka" },
            ]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          Šest <strong className="text-white">úplně jiných</strong> směrů. Každý má jinou
          osobnost — vyberte písmeno (A–F), ten doladíme do finální verze pro web, auto a
          tisk.
        </p>

        <div className="mt-12 space-y-10">
          {logoConcepts.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden border border-white/10 bg-[var(--surface)]"
            >
              <div className="flex min-h-[160px] items-center justify-center bg-[#050805] p-10 md:min-h-[200px]">
                <c.Logo />
              </div>
              <div className="border-t border-white/10 p-6 md:p-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-lg font-extrabold text-white">{c.title}</h2>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--lime)]">
                    {c.vibe}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{c.note}</p>
                <div className="mt-5 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>Ikona:</span>
                    <c.Logo iconOnly className="h-10 w-auto opacity-90" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-white/40">
          Napište písmeno (A–F) nebo kombinaci — např. „C ikona + A text“.
        </p>
        <SubpageNav
          place="bottom"
          extra={[
            { href: "/logo/kapota", label: "Kapota" },
            { href: "/logo/kapka", label: "Kapka" },
          ]}
        />
      </main>
    </div>
  );
}
