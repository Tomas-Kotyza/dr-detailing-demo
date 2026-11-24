import type { ReactNode } from "react";

type DropletProps = {
  className?: string;
  iconOnly?: boolean;
};

const accent = "#1f7a52";
const ink = "#0c1016";
const muted = "rgba(18, 22, 28, 0.55)";
const dropFill = "#ffffff";

function DropletWordmark({
  drop,
  className = "",
  iconOnly = false,
}: DropletProps & { drop: ReactNode }) {
  if (iconOnly) {
    return (
      <svg viewBox="0 0 96 80" className={className || "h-16 w-auto"} aria-hidden>
        {drop}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 300 80"
      className={className || "h-16 w-auto"}
      aria-label="Dr Detailing"
      role="img"
    >
      {drop}
      <text
        x="88"
        y="36"
        fill={ink}
        fontFamily="var(--font-syne), system-ui, sans-serif"
        fontSize="24"
        fontWeight="800"
      >
        Dr <tspan fill={accent}>Detailing</tspan>
      </text>
      <text
        x="88"
        y="56"
        fill={muted}
        fontFamily="var(--font-outfit), system-ui, sans-serif"
        fontSize="10"
        letterSpacing="0.22em"
      >
        LAK · INTERIÉR · KERAMIKA
      </text>
    </svg>
  );
}

/** E1 — Kapka + molekula (aktuální logo na webu). */
export function DropletMolecule({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <path
        d="M48 12 C62 32 68 44 68 56 A20 20 0 1 1 28 56 C28 44 34 32 48 12 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2.5"
      />
      <circle cx="40" cy="52" r="3" fill={accent} opacity="0.95" />
      <circle cx="52" cy="48" r="2.2" fill={accent} opacity="0.7" />
      <circle cx="46" cy="58" r="2" fill={accent} opacity="0.55" />
      <path
        d="M40 52 L52 48 M52 48 L46 58 M46 58 L40 52"
        stroke={accent}
        strokeWidth="1.1"
        opacity="0.45"
      />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

/** E2 — Čistá kapka s leskem. Minimalistická, prémiová. */
export function DropletGloss({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <path
        d="M48 10 C64 32 70 46 70 58 A22 22 0 1 1 26 58 C26 46 32 32 48 10 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M38 28 C42 22 50 20 56 24"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <ellipse cx="41" cy="34" rx="4" ry="7" fill="#fff" opacity="0.65" />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

/** E3 — Kapka v kruhu (pečeť / keramická ochrana). */
export function DropletSeal({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <circle cx="48" cy="44" r="34" fill="none" stroke={accent} strokeWidth="2" opacity="0.35" />
      <circle cx="48" cy="44" r="28" fill={accent} opacity="0.08" />
      <path
        d="M48 18 C58 34 62 44 62 54 A14 14 0 1 1 34 54 C34 44 38 34 48 18 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2.2"
      />
      <path
        d="M42 30 C45 26 51 26 54 30"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

/** E4 — Dvojkapka (mytí + ochrana). */
export function DropletTwin({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <path
        d="M34 18 C42 32 44 40 44 48 A12 12 0 1 1 22 48 C22 40 26 32 34 18 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M58 22 C66 36 68 44 68 52 A12 12 0 1 1 46 52 C46 44 50 36 58 22 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2.2"
      />
      <path
        d="M44 44 C48 40 52 40 56 44"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        opacity="0.4"
      />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

/** E5 — Kapka s vlnkou (voda / detailing). */
export function DropletWave({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <path
        d="M48 12 C62 32 68 44 68 56 A20 20 0 1 1 28 56 C28 44 34 32 48 12 Z"
        fill={dropFill}
        stroke={accent}
        strokeWidth="2.5"
      />
      <path
        d="M30 62 C38 56 46 56 54 62 C62 68 70 68 78 62"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M34 70 C40 66 46 66 52 70"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

/** E6 — Plná kapka (silueta, výrazná ikona). */
export function DropletSolid({ className, iconOnly }: DropletProps) {
  const drop = (
    <g>
      <path
        d="M48 8 C66 34 72 48 72 58 A24 24 0 1 1 24 58 C24 48 30 34 48 8 Z"
        fill={accent}
      />
      <path
        d="M40 26 C44 20 52 20 58 26"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="42" cy="38" r="3" fill="#fff" opacity="0.35" />
    </g>
  );
  return <DropletWordmark drop={drop} className={className} iconOnly={iconOnly} />;
}

export const dropletConcepts = [
  {
    id: "molecule",
    title: "E1 — Kapka + molekula",
    vibe: "Aktuální logo · věda, keramika",
    note: "Kapka s molekulární strukturou — odkaz na ochranu povrchu. Používáme teď na webu.",
    Logo: DropletMolecule,
    current: true,
  },
  {
    id: "gloss",
    title: "E2 — Lesklá kapka",
    vibe: "Minimal · prémiový lesk",
    note: "Čistší silueta s odleskem. Méně detailů, víc elegance — jako vyleštěný lak.",
    Logo: DropletGloss,
  },
  {
    id: "seal",
    title: "E3 — Kapka v kruhu",
    vibe: "Pečeť · ochrana · jistota",
    note: "Kruh kolem kapky = keramická ochrana, certifikát kvality. Silné na faktuře.",
    Logo: DropletSeal,
  },
  {
    id: "twin",
    title: "E4 — Dvojkapka",
    vibe: "Mytí + ochrana",
    note: "Dvě kapky = dvě fáze péče. Vhodné, když chcete zdůraznit komplexní služby.",
    Logo: DropletTwin,
  },
  {
    id: "wave",
    title: "E5 — Kapka + vlna",
    vibe: "Voda · mytí · čistota",
    note: "Vlnka pod kapkou — jasný odkaz na detailing a mytí. Přátelštější dojem.",
    Logo: DropletWave,
  },
  {
    id: "solid",
    title: "E6 — Plná kapka",
    vibe: "Ikona · výrazná · app",
    note: "Zelená výplň, bílý lesk. Nejsilnější jako malá ikona (favicon, auto, tričko).",
    Logo: DropletSolid,
  },
] as const;
