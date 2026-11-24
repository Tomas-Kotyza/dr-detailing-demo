"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PriceItem } from "@/lib/content/types";
import { useFilmMobile } from "@/hooks/useFilmMobile";
import { goToOrder } from "@/lib/orderIntent";

/** Interní SEO odkazy z ceníku na landing stránky služeb */
const priceServiceLinks: Record<string, { href: string; label: string }> = {
  polish: { href: "/lesteni-laku-praha", label: "Leštění laku Praha — cena a postup" },
  renovate: { href: "/renovace-laku-praha", label: "Více o renovaci laku" },
  interior: { href: "/cisteni-interieru-praha", label: "Více o čištění interiéru" },
  ceramic1: { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  ceramic3: { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  ceramic5: { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  "ceramic-glass": { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  "ceramic-plastics": { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  "ceramic-wheels": { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  "ceramic-ppf": { href: "/keramicka-ochrana-praha", label: "Více o keramické ochraně" },
  headlight: { href: "/renovace-svetlometu-praha", label: "Více o renovaci světlometů" },
};

export function PriceListInteractive({
  items,
  layout = "film",
}: {
  items: PriceItem[];
  /** `section` = standalone page block (mobile ceník mimo pin). */
  layout?: "film" | "section";
}) {
  const isMobile = useFilmMobile();
  const [openId, setOpenId] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const open = items.find((r) => r.id === openId) ?? null;
  const useSheet = isMobile || layout === "section";
  const openLink = open ? priceServiceLinks[open.id] : undefined;

  function openRow(row: PriceItem) {
    setOpenId((cur) => (cur === row.id ? null : row.id));
  }

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!openId) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }

    function onDoc(e: MouseEvent) {
      if (useSheet) return;
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setOpenId(null);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [openId, useSheet]);

  useEffect(() => {
    if (!openId || !useSheet) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.classList.add("price-sheet-open");
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.classList.remove("price-sheet-open");
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [openId, useSheet]);

  const detail = open ? (
    <>
      <div className="price-detail-top">
        <p className="svc-label">Obsah služby</p>
        <button type="button" className="price-detail-close" onClick={() => setOpenId(null)}>
          Zavřít
        </button>
      </div>
      <h3 className="font-display text-xl font-bold text-[#0c1016]">{open.name}</h3>
      <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{open.price}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#3a424c]">{open.summary}</p>
      {open.includes.length > 0 ? (
        <ul className="price-includes mt-4">
          {open.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {openLink ? (
        <p className="mt-4">
          <Link
            href={openLink.href}
            className="text-sm font-semibold text-[var(--accent)] underline underline-offset-2"
          >
            {openLink.label} →
          </Link>
        </p>
      ) : null}
      <button
        type="button"
        className="price-order-cta"
        onClick={() => {
          setOpenId(null);
          goToOrder(open.id);
        }}
      >
        Chci tuto službu
      </button>
    </>
  ) : null;

  return (
    <div
      ref={rootRef}
      className={`price-interactive${layout === "section" ? " price-interactive--section" : ""}`}
    >
      <div className="price-panel-inner">
        <div className="price-panel-head">
          <p className="svc-label">Ceník</p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Orientační ceny</h2>
          <p className="price-panel-note mt-2 max-w-md text-sm">
            Klikněte na šipku — ukáže se, co služba obsahuje.{" "}
            <Link
              href="/sluzby"
              className="font-semibold text-[var(--accent)] underline underline-offset-2"
            >
              Přehled služeb
            </Link>
          </p>
        </div>

        <ul className="price-list">
          {items.map((row) => {
            const isOpen = openId === row.id;
            return (
              <li key={row.id} data-price-row className={`price-row-wrap ${isOpen ? "open" : ""}`}>
                <div className={`price-row ${isOpen ? "active" : ""}`}>
                  <span className="min-w-0 text-left">
                    <span className="block font-semibold text-[#0c1016]">{row.name}</span>
                    {row.meta ? (
                      <span className="mt-0.5 block text-xs text-[#5a6470]">{row.meta}</span>
                    ) : null}
                  </span>
                  <span className="price-row-right">
                    <span className="price-row-price">{row.price}</span>
                    <button
                      type="button"
                      className={`price-row-chevron ${isOpen ? "open" : ""}`}
                      aria-label={
                        isOpen ? `Zavřít detail: ${row.name}` : `Zobrazit detail: ${row.name}`
                      }
                      aria-expanded={isOpen}
                      onClick={() => openRow(row)}
                    >
                      →
                    </button>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {open && useSheet && portalReady
        ? createPortal(
            <div className="price-sheet-root" role="presentation">
              <button
                type="button"
                className="price-sheet-backdrop"
                aria-label="Zavřít detail služby"
                onClick={() => setOpenId(null)}
              />
              <div
                key={open.id}
                className="price-sheet"
                role="dialog"
                aria-modal="true"
                aria-label={`Obsah: ${open.name}`}
              >
                <div className="price-sheet-handle" aria-hidden />
                {detail}
              </div>
            </div>,
            document.body,
          )
        : null}

      {open && !useSheet ? (
        <div
          key={open.id}
          className="price-pop-card"
          role="dialog"
          aria-label={`Obsah: ${open.name}`}
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
}
