import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { SubpageNav } from "@/components/SubpageNav";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů (GDPR)",
  description: `Informace o zpracování osobních údajů — ${site.brandName}, Praha 9.`,
  alternates: { canonical: "/ochrana-udaju" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="prose-legal">
      <SubpageNav
        backHref="/#objednat"
        backLabel="Zpět k objednávce"
        extra={[{ href: "/", label: "Na úvod" }]}
      />
      <p className="svc-label">Právní informace</p>
      <h1 className="font-display text-4xl font-bold">Ochrana osobních údajů</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {site.brandName} · GDPR · platné od 29. 7. 2026
      </p>

      <section>
        <h2>1. Správce údajů</h2>
        <p>
          Správcem osobních údajů je {site.legalName}, IČO {site.ico}, sídlo{" "}
          {site.registeredAddress}, podnikající pod značkou {site.brandName}.
          Provozovna: {site.address}, {site.place}. Kontakt:{" "}
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>,{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>

      <section>
        <h2>2. Jaké údaje zpracováváme</h2>
        <p>V souvislosti s poptávkou a poskytnutím služby můžeme zpracovávat:</p>
        <ul>
          <li>jméno a příjmení,</li>
          <li>telefonní číslo a e-mailovou adresu,</li>
          <li>informace o vozidle a požadované službě,</li>
          <li>další údaje, které nám dobrovolně uvedete v poznámce.</li>
        </ul>
      </section>

      <section>
        <h2>3. Účel a právní základ</h2>
        <p>Údaje zpracováváme za účelem:</p>
        <ul>
          <li>
            vyřízení poptávky a komunikace o termínu (právní základ: plnění
            smlouvy / kroky před uzavřením smlouvy, případně váš souhlas),
          </li>
          <li>
            poskytnutí sjednané služby a evidence zakázky (plnění smlouvy),
          </li>
          <li>
            plnění zákonných povinností (např. účetní a daňové),
          </li>
          <li>
            ochrany oprávněných zájmů (např. řešení reklamací).
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Doba uchování</h2>
        <p>
          Údaje z nevyřízené poptávky uchováváme po dobu potřebnou k vyřízení
          (zpravidla do 12 měsíců, pokud nevznikne zakázka). Údaje související
          se zakázkou a doklady uchováváme po dobu stanovenou právními předpisy
          (zejména účetní a daňové povinnosti).
        </p>
      </section>

      <section>
        <h2>5. Komu údaje předáváme</h2>
        <p>
          Údaje nepředáváme třetím stranám za účelem marketingu. Mohou je
          zpracovávat pouze poskytovatelé technických služeb (např. hosting
          webu, e-mail), a to v rozsahu nezbytném pro provoz. Údaje nepředáváme
          mimo EU/EHP, pokud to není nutné a zajištěné odpovídajícími zárukami.
        </p>
      </section>

      <section>
        <h2>6. Cookies a měření webu</h2>
        <p>
          Web používá technicky nezbytné cookies pro základní fungování. Měření
          návštěvnosti (Google Analytics 4) zapneme jen když s tím na webu
          souhlasíte. Souhlas můžete odmítnout. IP anonymizace je zapnutá.
          Zpracovatelem je Google; údaje se mohou zpracovávat i mimo EU za
          podmínek Google. Podrobnosti:{" "}
          <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
            zásady ochrany osobních údajů Google
          </a>
          .
        </p>
      </section>

      <section>
        <h2>7. Vaše práva</h2>
        <p>Máte právo:</p>
        <ul>
          <li>požadovat přístup ke svým údajům,</li>
          <li>požadovat opravu nebo výmaz,</li>
          <li>požadovat omezení zpracování,</li>
          <li>vznést námitku proti zpracování,</li>
          <li>na přenositelnost údajů (kde to dává smysl),</li>
          <li>
            odvolat souhlas, pokud je zpracování na souhlasu založeno (odvolání
            nemá vliv na zákonnost zpracování před odvoláním),
          </li>
          <li>
            podat stížnost u Úřadu pro ochranu osobních údajů (
            <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">
              uoou.cz
            </a>
            ).
          </li>
        </ul>
        <p>
          Pro uplatnění práv napište na{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </section>

      <section>
        <h2>8. Související dokumenty</h2>
        <p>
          Podmínky poskytování služeb najdete v dokumentu{" "}
          <Link href="/obchodni-podminky">Obchodní podmínky</Link>.
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
