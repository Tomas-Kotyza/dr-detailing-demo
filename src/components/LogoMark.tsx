import { useId } from "react";

type LogoMarkProps = {
  className?: string;
  iconOnly?: boolean;
  onLight?: boolean;
};

const GREEN = "#1f7a52";
const INK = "#12161c";

/**
 * Schválené logo A2-3b — vektorové razítko.
 */
export function LogoMark({
  className = "",
  iconOnly = false,
  onLight = true,
}: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const topId = `logo-arc-top-${uid}`;
  const bottomId = `logo-arc-bottom-${uid}`;
  const green = onLight ? GREEN : "#f5f7f2";
  const ink = onLight ? INK : "#f5f7f2";
  const font = 'var(--font-logo), Georgia, "Times New Roman", serif';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "70 50 360 380" : "0 0 500 580"}
      fill="none"
      className={className || "h-16 w-auto"}
      role="img"
      aria-label="Dr Detailing"
    >
      <defs>
        <path id={topId} d="M 118 164 A 152 152 0 0 1 382 164" fill="none" />
        <path id={bottomId} d="M 348 356 A 152 152 0 0 1 152 356" fill="none" />
      </defs>

      <circle cx="250" cy="240" r="176" stroke={green} strokeWidth="8" />
      <circle cx="250" cy="240" r="164" stroke={green} strokeWidth="1.35" />

      <g fill={green}>
        <circle cx="119" cy="205" r="3.1" />
        <circle cx="114" cy="240" r="3.1" />
        <circle cx="119" cy="275" r="3.1" />
        <circle cx="132" cy="306" r="3.1" />
        <circle cx="381" cy="205" r="3.1" />
        <circle cx="386" cy="240" r="3.1" />
        <circle cx="381" cy="275" r="3.1" />
        <circle cx="368" cy="306" r="3.1" />
      </g>

      <text fill={green} fontSize="23" letterSpacing="0.28em" style={{ fontFamily: font, fontWeight: 600 }}>
        <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
          DIAGNOSTIKA
        </textPath>
      </text>
      <text fill={green} fontSize="21" letterSpacing="0.22em" style={{ fontFamily: font, fontWeight: 600 }}>
        <textPath href={`#${bottomId}`} startOffset="50%" textAnchor="middle">
          LÉČBA · LESK
        </textPath>
      </text>

      <text
        x="250"
        y="268"
        fill={ink}
        fontSize="86"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="0.04em"
        style={{ fontFamily: font }}
      >
        DR
      </text>

      <path
        fill={green}
        d="M250 58 C250 58 221 108 221 138 C221 157 234 172 250 172 C266 172 279 157 279 138 C279 108 250 58 250 58 Z"
      />

      {iconOnly ? null : (
        <>
          <line x1="92" y1="452" x2="408" y2="452" stroke={green} strokeWidth="2.6" />
          <text
            x="250"
            y="502"
            textAnchor="middle"
            fontSize="42"
            fontWeight="700"
            letterSpacing="0.18em"
            style={{ fontFamily: font }}
          >
            <tspan fill={ink}>DETAIL</tspan>
            <tspan fill={green}>ING</tspan>
          </text>
        </>
      )}
    </svg>
  );
}
