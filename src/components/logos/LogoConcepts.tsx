type LogoProps = {
  className?: string;
  /** ikona samostatně */
  iconOnly?: boolean;
};

/** A — Čistý wordmark, žádná ikona. Švýcarská přesnost, studio. */
export function LogoWordmark({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 320 72"
      className={`h-14 w-auto ${className}`}
      aria-label="Dr Detailing"
      role="img"
    >
      <text
        x="0"
        y="38"
        fill="#f5f7f2"
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="-1"
      >
        DR
      </text>
      <text
        x="0"
        y="62"
        fill="#cfff3c"
        fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="0.42em"
      >
        DETAILING
      </text>
      <line x1="0" y1="46" x2="88" y2="46" stroke="#cfff3c" strokeWidth="2" />
    </svg>
  );
}

/** B — Štít / crest. Prémiové studio, faktury, uniformy. */
export function LogoCrest({ className = "", iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg viewBox="0 0 80 96" className={`h-16 w-auto ${className}`} aria-hidden>
        <path
          d="M40 4 L72 18 V48 C72 72 40 92 40 92 C40 92 8 72 8 48 V18 Z"
          fill="#0b140f"
          stroke="#cfff3c"
          strokeWidth="2.5"
        />
        <text
          x="40"
          y="58"
          textAnchor="middle"
          fill="#cfff3c"
          fontFamily="Georgia, serif"
          fontSize="28"
          fontWeight="700"
        >
          DD
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 96" className={`h-16 w-auto ${className}`} aria-label="Dr Detailing" role="img">
      <path
        d="M40 8 L68 20 V52 C68 72 40 88 40 88 C40 88 12 72 12 52 V20 Z"
        fill="#0b140f"
        stroke="#cfff3c"
        strokeWidth="2"
      />
      <text x="40" y="58" textAnchor="middle" fill="#cfff3c" fontFamily="Georgia, serif" fontSize="26" fontWeight="700">
        DD
      </text>
      <text x="88" y="44" fill="#f5f7f2" fontFamily="Georgia, serif" fontSize="26" fontWeight="600">
        Dr Detailing
      </text>
      <text x="88" y="64" fill="rgba(245,247,242,0.55)" fontFamily="system-ui, sans-serif" fontSize="10" letterSpacing="0.2em">
        PRAHA 9
      </text>
    </svg>
  );
}

/** C — Kruhová „čočka“ / světlomet. Technická přesnost, keramika. */
export function LogoLens({ className = "", iconOnly = false }: LogoProps) {
  const icon = (
    <g>
      <circle cx="48" cy="48" r="44" fill="none" stroke="#cfff3c" strokeWidth="2" opacity="0.9" />
      <circle cx="48" cy="48" r="30" fill="none" stroke="#cfff3c" strokeWidth="1" opacity="0.35" />
      <circle cx="48" cy="48" r="16" fill="#cfff3c" opacity="0.15" />
      <path
        d="M20 28 Q48 8 76 28"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <text x="48" y="54" textAnchor="middle" fill="#cfff3c" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="800">
        DR
      </text>
    </g>
  );
  if (iconOnly) {
    return (
      <svg viewBox="0 0 96 96" className={`h-16 w-16 ${className}`} aria-hidden>
        {icon}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 96" className={`h-16 w-auto ${className}`} aria-label="Dr Detailing" role="img">
      {icon}
      <text x="108" y="42" fill="#f5f7f2" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800" letterSpacing="0.06em">
        DR DETAILING
      </text>
      <text x="108" y="62" fill="rgba(207,255,60,0.8)" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" letterSpacing="0.28em">
        AUTOMOTIVE STUDIO
      </text>
    </svg>
  );
}

/** D — Motorsport slash. Agresivní, dynamický, mladší publikum. */
export function LogoSlash({ className = "", iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg viewBox="0 0 64 64" className={`h-14 w-14 ${className}`} aria-hidden>
        <rect width="64" height="64" rx="4" fill="#cfff3c" />
        <path d="M12 52 L52 12" stroke="#050805" strokeWidth="6" strokeLinecap="round" />
        <text x="32" y="40" textAnchor="middle" fill="#050805" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="900">
          DR
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 72" className={`h-14 w-auto ${className}`} aria-label="Dr Detailing" role="img">
      <rect x="0" y="8" width="56" height="56" rx="3" fill="#cfff3c" />
      <path d="M14 54 L46 18" stroke="#050805" strokeWidth="5" strokeLinecap="round" />
      <text x="28" y="42" textAnchor="middle" fill="#050805" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="900">
        DR
      </text>
      <text x="72" y="38" fill="#f5f7f2" fontFamily="system-ui, sans-serif" fontSize="32" fontWeight="900" fontStyle="italic" letterSpacing="-0.02em">
        DETAILING
      </text>
      <text x="74" y="58" fill="#cfff3c" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.35em">
        /// PRAHA
      </text>
    </svg>
  );
}

/** E — Kapka + molekula. Mytí, ochrana, věda keramiky. */
export function LogoMolecule({ className = "", iconOnly = false }: LogoProps) {
  const drop = (
    <g>
      <path
        d="M48 12 C62 32 68 44 68 56 A20 20 0 1 1 28 56 C28 44 34 32 48 12 Z"
        fill="#0b140f"
        stroke="#cfff3c"
        strokeWidth="2"
      />
      <circle cx="40" cy="52" r="3" fill="#cfff3c" opacity="0.9" />
      <circle cx="52" cy="48" r="2" fill="#cfff3c" opacity="0.6" />
      <circle cx="46" cy="58" r="2" fill="#fff" opacity="0.5" />
      <path d="M40 52 L52 48 M52 48 L46 58 M46 58 L40 52" stroke="#cfff3c" strokeWidth="1" opacity="0.4" />
    </g>
  );
  if (iconOnly) {
    return (
      <svg viewBox="0 0 96 80" className={`h-16 w-auto ${className}`} aria-hidden>
        {drop}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 80" className={`h-16 w-auto ${className}`} aria-label="Dr Detailing" role="img">
      {drop}
      <text x="88" y="36" fill="#f5f7f2" fontFamily="system-ui, sans-serif" fontSize="24" fontWeight="700">
        Dr <tspan fill="#cfff3c">Detailing</tspan>
      </text>
      <text x="88" y="56" fill="rgba(245,247,242,0.5)" fontFamily="system-ui, sans-serif" fontSize="10" letterSpacing="0.22em">
        LAK · INTERIÉR · KERAMIKA
      </text>
    </svg>
  );
}

/** F — Ručně psané „Dr“ + strohý blok. Kontrast luxus vs. řemeslo. */
export function LogoScript({ className = "", iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg viewBox="0 0 80 80" className={`h-16 w-16 ${className}`} aria-hidden>
        <text
          x="8"
          y="58"
          fill="#cfff3c"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="52"
          fontStyle="italic"
          fontWeight="400"
        >
          Dr
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 80" className={`h-16 w-auto ${className}`} aria-label="Dr Detailing" role="img">
      <text
        x="0"
        y="58"
        fill="#cfff3c"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="56"
        fontStyle="italic"
      >
        Dr
      </text>
      <rect x="72" y="18" width="4" height="44" fill="rgba(207,255,60,0.35)" />
      <text
        x="88"
        y="52"
        fill="#f5f7f2"
        fontFamily="system-ui, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="0.12em"
      >
        DETAILING
      </text>
    </svg>
  );
}

export const logoConcepts = [
  {
    id: "wordmark",
    title: "A — Čistý wordmark",
    vibe: "Minimal, studio, švýcarská přesnost",
    note: "Bez ikony — jen typografie. Funguje na webu, vizitkách i velkém poutači.",
    Logo: LogoWordmark,
    dark: true,
  },
  {
    id: "crest",
    title: "B — Crest / štít",
    vibe: "Luxus, důvěra, „staré peníze“",
    note: "Monogram DD v erbu. Silné na uniformě, faktuře, pečeti.",
    Logo: LogoCrest,
    dark: true,
  },
  {
    id: "lens",
    title: "C — Čočka / světlomet",
    vibe: "Technická přesnost, keramika, optika",
    note: "Kruhové kroužky = soustředění na detail. Vhodné pro tech značku.",
    Logo: LogoLens,
    dark: true,
  },
  {
    id: "slash",
    title: "D — Motorsport slash",
    vibe: "Dynamika, mladší, agresivní",
    note: "Šikmý řez, lime blok. Výrazné na auto, tričko, Instagram.",
    Logo: LogoSlash,
    dark: true,
  },
  {
    id: "molecule",
    title: "E — Kapka + molekula",
    vibe: "Mytí, ochrana, věda povrchu",
    note: "Voda + struktura keramiky. Jasný odkaz na detailing bez auta v logu.",
    Logo: LogoMolecule,
    dark: true,
  },
  {
    id: "script",
    title: "F — Script vs. blok",
    vibe: "Řemeslo + kontrast",
    note: "Ručně psané Dr + strohý DETAILING. Osobní, zapamatovatelné.",
    Logo: LogoScript,
    dark: true,
  },
] as const;
