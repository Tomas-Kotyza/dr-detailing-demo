"use client";

import { ReactNode, useEffect, useRef } from "react";
import { site } from "@/content/site";
import type { PromoItem } from "@/lib/content/types";

const SITE_URL = `https://${site.domain}`;
const ORDER_URL = `${SITE_URL}/#objednat`;
const PRICES_URL = `${SITE_URL}/sluzby`;

/** Zvýrazní ceny (… Kč) cyanem — jako na původním plakátu. */
function highlightPrices(text: string): ReactNode {
  const parts = text.split(/(\d[\d\s]*\s*Kč)/gi);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^\d[\d\s]*\s*Kč$/i.test(part) ? (
      <span key={i} className="promo-flyer-price">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function titleSizeClass(title: string): string {
  const len = title.trim().length;
  if (len > 48) return "is-title-xl";
  if (len > 32) return "is-title-lg";
  if (len > 22) return "is-title-md";
  return "is-title-sm";
}

type Props = {
  item: PromoItem;
  saving?: boolean;
};

/** Živý náhled ve stylu původního plakátu — texty z polí akce. */
export default function PromoFlyerPreview({ item, saving = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const title = item.title || "Název akce";
  const condition = item.offerLine || item.subtitle;
  const secondary = item.offerLine && item.subtitle ? item.subtitle : "";

  useEffect(() => {
    function clearPrintTarget() {
      wrapRef.current?.classList.remove("promo-flyer-print-target");
    }
    window.addEventListener("afterprint", clearPrintTarget);
    return () => window.removeEventListener("afterprint", clearPrintTarget);
  }, []);

  function onPrint() {
    document
      .querySelectorAll(".admin-promo-flyer-wrap.promo-flyer-print-target")
      .forEach((el) => el.classList.remove("promo-flyer-print-target"));
    wrapRef.current?.classList.add("promo-flyer-print-target");
    window.print();
  }

  return (
    <div className="admin-promo-flyer-wrap" ref={wrapRef}>
      <p className="admin-promo-flyer-label">Živý náhled letáku</p>
      <div
        className={`promo-flyer ${titleSizeClass(title)}`}
        aria-label={`Leták: ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="promo-flyer-photo"
          src="/akce/akce-flyer-bg.webp"
          alt=""
          aria-hidden
        />
        <div className="promo-flyer-scrim" />
        <div className="promo-flyer-content">
          <header className="promo-flyer-top">
            <p className="promo-flyer-brand">
              <span className="promo-flyer-brand-dr">{site.brandLeft}</span>{" "}
              <span className="promo-flyer-brand-name">{site.brandRight}</span>
            </p>
            <div className="promo-flyer-rule" aria-hidden>
              <span>+</span>
            </div>
            <p className="promo-flyer-studio">DETAILING STUDIO · PRAHA 9</p>
          </header>

          <div className="promo-flyer-body">
            <h2 className="promo-flyer-title">{highlightPrices(title)}</h2>

            {item.flyerPrice?.trim() ? (
              <p className="promo-flyer-hero-price">{item.flyerPrice.trim()}</p>
            ) : null}

            {condition ? (
              <p className="promo-flyer-offer">{highlightPrices(condition)}</p>
            ) : null}
          </div>

          <footer className="promo-flyer-footer">
            {secondary ? (
              <div className="promo-flyer-secondary">
                {highlightPrices(secondary)}
              </div>
            ) : null}

            <div className="promo-flyer-rule" aria-hidden>
              <span>+</span>
            </div>

            <p className="promo-flyer-place">
              HORNÍ POČERNICE · PRAHA 9 ·{" "}
              <a
                className="promo-flyer-link"
                href={SITE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {site.domain.toUpperCase()}
              </a>
            </p>

            <a
              className="promo-flyer-phone"
              href={`tel:${site.phone}`}
            >
              <svg
                className="promo-flyer-phone-icon"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
                />
              </svg>
              {site.phoneDisplay}
            </a>

            <nav className="promo-flyer-ctas" aria-label="Odkazy na webu">
              <a href={SITE_URL} target="_blank" rel="noreferrer">
                Web
              </a>
              <a href={ORDER_URL} target="_blank" rel="noreferrer">
                Objednat
              </a>
              <a href={PRICES_URL} target="_blank" rel="noreferrer">
                Ceník
              </a>
            </nav>
          </footer>
        </div>
      </div>
      <p className="admin-muted admin-promo-flyer-hint">
        Velká cena je uprostřed (pole výše). Odkazy Web / Objednat / Ceník
        fungují v náhledu i v PDF.
      </p>
      <div className="admin-actions admin-promo-flyer-actions">
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? "Ukládám…" : "Uložit změny"}
        </button>
        <button type="button" className="admin-btn secondary" onClick={onPrint}>
          Tisknout leták
        </button>
      </div>
    </div>
  );
}
