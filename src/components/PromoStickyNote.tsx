"use client";

import { useEffect, useState } from "react";
import type { PromoItem } from "@/lib/content/types";

const DELAY_MS = 4000;

function storageKey(id: string) {
  return `drdetailing-promo-note-dismissed:${id}`;
}

export function PromoStickyNote({ promo }: { promo: PromoItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey(promo.id)) === "1") return;
    } catch {
      /* ignore */
    }

    const t = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, [promo.id]);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(storageKey(promo.id), "1");
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null;

  return (
    <aside
      className="promo-note"
      role="dialog"
      aria-label={`Akce: ${promo.title}`}
    >
      <button
        type="button"
        className="promo-note-close"
        aria-label="Zavřít akci"
        onClick={dismiss}
      >
        ×
      </button>

      <p className="promo-note-badge">Akce</p>
      <p className="promo-note-title">{promo.title}</p>

      {promo.flyerPrice?.trim() ? (
        <p className="promo-note-price">{promo.flyerPrice.trim()}</p>
      ) : null}

      {promo.offerLine ? (
        <p className="promo-note-line">{promo.offerLine}</p>
      ) : null}

      <div className="promo-note-actions">
        <a className="promo-note-btn" href="/#objednat" onClick={dismiss}>
          Objednat
        </a>
        <a className="promo-note-btn promo-note-btn--ghost" href="/sluzby">
          Ceník
        </a>
      </div>
    </aside>
  );
}
