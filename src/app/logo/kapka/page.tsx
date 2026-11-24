import type { Metadata } from "next";
import { dropletConcepts } from "@/components/logos/DropletConcepts";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Návrhy kapky — logo",
  description: "Šest variant loga s kapkou pro Dr Detailing — vyberte si oblíbený směr.",
  alternates: { canonical: "/logo/kapka" },
  robots: { index: false, follow: false },
};

export default function DropletLogoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--accent-line)] px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="svc-label">// Kapka — brand exploration</p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Návrhy kapky — <span className="text-[var(--accent)]">{site.brandName}</span>
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
          Šest variant <strong className="text-[var(--fg)]">stejné kapky</strong> v různých
          stylech. Vyberte číslo (E1–E6) — ten doladíme do finální verze pro web, auto a tisk.
        </p>

        <div className="mt-12 space-y-10">
          {dropletConcepts.map((c) => (
            <article
              key={c.id}
              className={`overflow-hidden rounded-2xl border bg-white ${
                "current" in c && c.current
                  ? "border-[var(--accent)] shadow-[0_12px_32px_rgba(15,46,34,0.12)]"
                  : "border-[rgba(18,22,28,0.1)]"
              }`}
            >
              <div className="flex min-h-[160px] items-center justify-center bg-[var(--bg)] p-10 md:min-h-[200px]">
                <c.Logo className="h-16 w-auto" />
              </div>
              <div className="border-t border-[rgba(18,22,28,0.08)] p-6 md:p-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-display text-lg font-bold">{c.title}</h2>
                  {"current" in c && c.current ? (
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                      Aktuální
                    </span>
                  ) : null}
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {c.vibe}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{c.note}</p>
                <div className="mt-5 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span>Ikona:</span>
                    <c.Logo iconOnly className="h-10 w-auto opacity-90" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-[var(--muted)]">
          Napište číslo (E1–E6) nebo kombinaci — např. „E2 ikona + E1 text“.
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
