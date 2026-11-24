"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "drd-ga-consent";

export type GaConsent = "yes" | "no" | null;

export function readGaConsent(): GaConsent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "yes" || v === "no") return v;
  return null;
}

export function CookieConsent({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: GaConsent) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setVisible(readGaConsent() === null);
  }, [enabled]);

  if (!enabled || !visible) return null;

  function choose(value: "yes" | "no") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    onChange(value);
  }

  return (
    <div className="cookie-bar" role="dialog" aria-label="Souhlas s měřením návštěvnosti">
      <p className="cookie-bar-text">
        Abychom viděli, jestli web pomáhá zákazníkům, můžeme zapnout Google Analytics.
        Údaje jsou anonymizované.{" "}
        <Link href="/ochrana-udaju">Více v ochraně údajů</Link>.
      </p>
      <div className="cookie-bar-actions">
        <button type="button" className="cookie-bar-btn cookie-bar-btn--ghost" onClick={() => choose("no")}>
          Ne
        </button>
        <button type="button" className="cookie-bar-btn" onClick={() => choose("yes")}>
          Souhlasím
        </button>
      </div>
    </div>
  );
}
