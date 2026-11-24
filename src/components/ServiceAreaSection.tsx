import Link from "next/link";
import {
  localityPageLinks,
  localityPages,
  serviceArea,
  serviceAreaIntro,
} from "@/content/localities";

type ServiceAreaSectionProps = {
  /** Zvýraznit Prahu 9 nebo 10 v úvodu */
  focus?: "praha9" | "praha10" | "all";
};

export function ServiceAreaSection({ focus = "all" }: ServiceAreaSectionProps) {
  const focusLead =
    focus === "praha9"
      ? "Hledáte detailing v Praze 9? Studio máme přímo v Horních Počernicích."
      : focus === "praha10"
        ? "Hledáte detailing v Praze 10? Dílna je v sousedních Horních Počernicích — dojezd obvykle do 20 minut."
        : serviceAreaIntro;

  return (
    <section>
      <h2>Kam jezdíme — Praha 9, Praha 10 a okolí</h2>
      <p>{focusLead}</p>
      <p className="text-sm text-[var(--muted)]">{serviceArea.pickupNote}</p>

      <h3>Praha 9</h3>
      <ul>
        {serviceArea.praha9.map((place) => (
          <li key={place}>{place}</li>
        ))}
      </ul>

      <h3>Praha 10</h3>
      <ul>
        {serviceArea.praha10.map((place) => (
          <li key={place}>{place}</li>
        ))}
      </ul>

      <h3>Okolí — do cca 30 minut (vlastní stránky)</h3>
      <ul>
        {serviceArea.okoli.map((place) => {
          const href = localityPageLinks[place.name];
          return (
            <li key={place.name}>
              {href ? (
                <Link href={href}>{place.name}</Link>
              ) : (
                place.name
              )}{" "}
              ({place.drive})
            </li>
          );
        })}
      </ul>

      <p>
        Přehled lokalit:{" "}
        <Link href="/detailing-praha-9">Detailing Praha 9</Link>
        {" · "}
        <Link href="/detailing-praha-10">Detailing Praha 10</Link>
        {localityPages.map((loc) => (
          <span key={loc.slug}>
            {" · "}
            <Link href={`/${loc.slug}`}>Detailing {loc.name}</Link>
          </span>
        ))}
        {" · "}
        <Link href="/sluzby">Ceník služeb</Link>
      </p>
    </section>
  );
}
