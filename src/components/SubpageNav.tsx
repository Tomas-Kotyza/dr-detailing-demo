import Link from "next/link";
import { WebaplikCredit } from "@/components/WebaplikCredit";

export type SubpageNavLink = { href: string; label: string };

/** Viditelné Zpět nahoře i dole na podstránkách. */
export function SubpageNav({
  backHref = "/",
  backLabel = "Zpět na úvod",
  extra,
  place = "top",
}: {
  backHref?: string;
  backLabel?: string;
  extra?: SubpageNavLink[];
  place?: "top" | "bottom";
}) {
  return (
    <>
      <nav
        className={`subpage-nav${place === "bottom" ? " subpage-nav--foot" : ""}`}
        aria-label={place === "bottom" ? "Navigace na konci stránky" : "Navigace stránky"}
      >
        <Link href={backHref} className="nav-back">
          {`← ${backLabel}`}
        </Link>
        {extra?.map((item) => (
          <Link key={`${item.href}-${item.label}`} href={item.href} className="nav-extra">
            {item.label}
          </Link>
        ))}
      </nav>
      {place === "bottom" ? <WebaplikCredit className="mt-4 mb-8 text-center" /> : null}
    </>
  );
}
