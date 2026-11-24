import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description: `Obchodní podmínky služeb ${site.brandName} — detailing Praha 9.`,
  alternates: { canonical: "/obchodni-podminky" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="prose-legal">
      <SubpageNav
        backHref="/#objednat"
        backLabel="Zpět k objednávce"
        extra={[{ href: "/", label: "Na úvod" }]}
      />
      <p className="svc-label">Právní informace</p>
      <h1 className="font-display text-4xl font-bold">Obchodní podmínky</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {site.brandName} · {site.place} · platné od 29. 7. 2026
      </p>

      <section>
        <h2>1. Poskytovatel</h2>
        <p>
          Služby poskytuje {site.legalName}, IČO {site.ico}, sídlo{" "}
          {site.registeredAddress}, podnikající pod značkou {site.brandName}.
          Provozovna / místo služby: {site.address}, {site.place}. Kontakt:{" "}
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>,{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>, web {site.domain}.
        </p>
      </section>

      <section>
        <h2>2. Předmět služeb</h2>
        <p>
          Poskytujeme služby auto detailingu — zejména leštění a renovaci laku,
          keramickou ochranu, čištění interiéru a související péči o vozidlo.
          Ceny uvedené na webu jsou orientační „od“ a mohou se lišit podle velikosti
          vozu, stavu laku a náročnosti práce.
        </p>
      </section>

      <section>
        <h2>3. Objednávka a termín</h2>
        <p>
          Poptávku lze odeslat přes formulář na webu, e-mailem nebo telefonicky.
          Odesláním poptávky nevzniká závazná smlouva — termín, rozsah a finální cenu
          potvrdíme individuálně. Teprve po vzájemném odsouhlasení termínu a ceny
          je rezervace závazná.
        </p>
      </section>

      <section>
        <h2>4. Cena a platba</h2>
        <p>
          Finální cena bude potvrzena před zahájením prací (nebo po diagnostice
          stavu vozu). Platba probíhá dle dohody — hotově, převodem nebo jiným
          domluveným způsobem po dokončení služby, pokud není ujednáno jinak.
        </p>
      </section>

      <section>
        <h2>5. Zrušení termínu</h2>
        <p>
          Termín můžete zrušit nebo přesunout telefonicky či e-mailem. Při
          zrušení méně než 24 hodin před domluveným termínem si vyhrazujeme
          právo požadovat storno poplatek až do výše 20 % domluvené ceny,
          pokud jsme si pro vás blokovali kapacitu.
        </p>
      </section>

      <section>
        <h2>6. Odpovědnost a stav vozidla</h2>
        <p>
          Zákazník je povinen předat vozidlo bez cenností a upozornit na skrytá
          poškození, závady nebo specifické požadavky. Výsledek leštění a ochrany
          závisí na výchozím stavu laku; nelze zaručit úplné odstranění všech
          škrábanců. Za škody způsobené skrytou vadou vozidla, o které jsme
          nebyli informováni, neodpovídáme.
        </p>
      </section>

      <section>
        <h2>7. Reklamace</h2>
        <p>
          Případné výhrady k provedené službě uplatněte bez zbytečného odkladu,
          nejlépe do 7 dnů od převzetí vozidla, na {site.email} nebo
          telefonicky. Reklamaci posoudíme a navrhneme řešení (oprava, sleva
          nebo jiné přiměřené řešení).
        </p>
      </section>

      <section>
        <h2>8. Osobní údaje</h2>
        <p>
          Zpracování osobních údajů upravuje samostatný dokument{" "}
          <Link href="/ochrana-udaju">Ochrana osobních údajů</Link>.
        </p>
      </section>

      <section>
        <h2>9. Závěrečná ustanovení</h2>
        <p>
          Tyto podmínky se řídí právem České republiky. Vyhrazujeme si právo
          podmínky aktualizovat; aktuální znění je vždy na tomto webu.
        </p>
      </section>

      <SubpageNav
        place="bottom"
        backHref="/#objednat"
        backLabel="Zpět k objednávce"
        extra={[{ href: "/", label: "Na úvod" }]}
      />
    </main>
  );
}
