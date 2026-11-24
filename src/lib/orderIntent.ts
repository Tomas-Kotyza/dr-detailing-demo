import { packages, site } from "@/content/site";

export const ORDER_PACK_EVENT = "drdetailing:order-pack";

const packageIds = new Set(packages.map((p) => p.id));

/** Ceník / před-po → id balíčku ve formuláři */
const packAliases: Record<string, string> = {
  polish: "polish",
  renovate: "renovate",
  interior: "interior",
  ozone: "ozone",
  headlight: "headlight",
  ceramic1: "ceramic1",
  ceramic3: "ceramic3",
  ceramic5: "ceramic5",
  "ceramic-glass": "ceramic1",
  "ceramic-plastics": "ceramic1",
  "ceramic-wheels": "ceramic1",
  "ceramic-ppf": "ceramic1",
  lak: "polish",
  interier: "interior",
  svetlomety: "headlight",
};

export function resolveOrderPackId(raw?: string | null): string | null {
  if (!raw) return null;
  const mapped = packAliases[raw] ?? raw;
  return packageIds.has(mapped as (typeof packages)[number]["id"]) ? mapped : null;
}

export function whatsappOrderUrl(message?: string): string {
  const digits = site.phone.replace(/\D/g, "");
  const text =
    message ??
    `Dobrý den, rád/a bych termín u ${site.brandName} (${site.domain}).`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Skok na formulář; volitelně předvybere službu. */
export function goToOrder(packId?: string | null) {
  const resolved = resolveOrderPackId(packId);
  if (typeof window === "undefined") return;

  if (resolved) {
    window.dispatchEvent(
      new CustomEvent(ORDER_PACK_EVENT, { detail: { packId: resolved } }),
    );
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("pack", resolved);
      url.hash = "objednat";
      window.history.replaceState(null, "", `${url.pathname}${url.search}#objednat`);
    } catch {
      /* ignore */
    }
  } else {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("pack");
      url.hash = "objednat";
      window.history.replaceState(null, "", `${url.pathname}${url.search}#objednat`);
    } catch {
      /* ignore */
    }
  }

  const el = document.getElementById("objednat");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.assign(resolved ? `/#objednat?pack=${resolved}` : "/#objednat");
  }
}
