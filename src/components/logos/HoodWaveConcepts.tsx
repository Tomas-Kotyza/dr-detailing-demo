type LogoProps = {
  className?: string;
  iconOnly?: boolean;
};

const accent = "#1f7a52";
const ink = "#0c1016";

/**
 * Společný layout textu:
 * DR ........ DETAILING
 *             LAK · INTERIÉR · KERAMIKA
 *
 * Vlnka jde MEZI DR a DETAILING a končí ZA slovem KERAMIKA.
 */

/** A — Klasická kapota: oblouk v mezeře, sestup a vodorovný běh pod podtitulem */
function HoodLogoA({ className = "h-14 w-auto", iconOnly = false }: LogoProps) {
  const wave =
    "M 78 8 C 86 8, 92 14, 94 24 C 96 34, 100 44, 112 48 L 318 48";

  if (iconOnly) {
    return (
      <svg viewBox="0 0 72 48" className={className} fill="none" aria-hidden>
        <path
          d="M 28 6 C 36 6, 42 12, 44 22 C 46 32, 50 40, 62 42"
          stroke={accent}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="24" fontWeight="800">
          DR
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 340 64" className={className} fill="none" aria-label="Dr Detailing — návrh A" role="img">
      <path d={wave} stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="30" fontWeight="800" letterSpacing="-0.03em">
        DR
      </text>
      <text x="112" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="26" fontWeight="800" letterSpacing="0.02em">
        DETAILING
      </text>
      <text x="112" y="56" fill={accent} fontFamily="var(--font-outfit), system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.16em">
        LAK · INTERIÉR · KERAMIKA
      </text>
    </svg>
  );
}

/** B — Vlnka vystoupá zpod DR, proplete mezeru a dosedne za KERAMIKA */
function HoodLogoB({ className = "h-14 w-auto", iconOnly = false }: LogoProps) {
  const wave =
    "M 72 44 C 78 28, 84 10, 96 8 C 108 6, 114 18, 116 32 C 118 44, 128 50, 148 50 L 320 50";

  if (iconOnly) {
    return (
      <svg viewBox="0 0 72 48" className={className} fill="none" aria-hidden>
        <path
          d="M 26 40 C 32 24, 38 8, 48 6 C 56 4, 60 16, 62 28"
          stroke={accent}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="24" fontWeight="800">
          DR
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 340 64" className={className} fill="none" aria-label="Dr Detailing — návrh B" role="img">
      <path d={wave} stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="30" fontWeight="800" letterSpacing="-0.03em">
        DR
      </text>
      <line x1="4" y1="46" x2="68" y2="46" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <text x="124" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="26" fontWeight="800" letterSpacing="0.02em">
        DETAILING
      </text>
      <text x="124" y="56" fill={accent} fontFamily="var(--font-outfit), system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.16em">
        LAK · INTERIÉR · KERAMIKA
      </text>
    </svg>
  );
}

/** C — Delší kapotová linie: jemný S-oblouk v mezeře, konec až za KERAMIKA */
function HoodLogoC({ className = "h-14 w-auto", iconOnly = false }: LogoProps) {
  const wave =
    "M 74 20 C 82 8, 90 4, 100 8 C 110 12, 114 28, 118 42 C 122 52, 136 54, 158 54 L 322 54";

  if (iconOnly) {
    return (
      <svg viewBox="0 0 72 48" className={className} fill="none" aria-hidden>
        <path
          d="M 28 16 C 34 6, 42 4, 50 10 C 56 16, 58 28, 64 38"
          stroke={accent}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="24" fontWeight="800">
          DR
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 340 64" className={className} fill="none" aria-label="Dr Detailing — návrh C" role="img">
      <path d={wave} stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="4" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="30" fontWeight="800" letterSpacing="-0.03em">
        DR
      </text>
      <text x="128" y="40" fill={ink} fontFamily="var(--font-syne), system-ui, sans-serif" fontSize="26" fontWeight="800" letterSpacing="0.02em">
        DETAILING
      </text>
      <text x="128" y="56" fill={accent} fontFamily="var(--font-outfit), system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.16em">
        LAK · INTERIÉR · KERAMIKA
      </text>
    </svg>
  );
}

export const hoodWaveConcepts = [
  {
    id: "K1",
    title: "K1 — Klasická kapota",
    vibe: "Čistá · čitelná",
    note: "Vlnka začíná v mezeře mezi DR a DETAILING, klesá jako kapota a končí až za KERAMIKA.",
    Logo: HoodLogoA,
  },
  {
    id: "K2",
    title: "K2 — Propletená vlna",
    vibe: "Dynamická · značková",
    note: "Vystoupá zpod DR, proplete mezeru a dosedne pod podtitulem — konec za KERAMIKA. Pod DR zůstává krátká zelená linka.",
    Logo: HoodLogoB,
  },
  {
    id: "K3",
    title: "K3 — Dlouhá kapotová linie",
    vibe: "Prémiová · filmová",
    note: "Jemnější S-oblouk v mezeře, delší vodorovný běh pod LAK · INTERIÉR · KERAMIKA.",
    Logo: HoodLogoC,
  },
] as const;
