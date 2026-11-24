"use client";

import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { goToOrder } from "@/lib/orderIntent";

const JUMP_LINKS = [
  { href: "#cenik", label: "Ceník", external: false },
  { href: "#nase-prace", label: "Naše práce", external: false },
  { href: "#objednat", label: "Rezervace", external: false },
  { href: "#kontakt", label: "Kontakt", external: false },
  { href: "/galerie", label: "Galerie", external: true },
  { href: "/o-mne", label: "O mně", external: true },
  { href: "/faq", label: "Časté otázky", external: true },
  { href: "/blog", label: "Blog", external: true },
  { href: "/detailing-praha-9", label: "Detailing Praha 9", external: true },
] as const;

/** Desktop pin: ceník je vlastní sekce pod slidama. */
function scrollToCenikDesktop() {
  const el = document.getElementById("cenik");
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function scrollToHash(hash: string) {
  if (hash === "#cenik") {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const el = document.getElementById("cenik");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    } else if (scrollToCenikDesktop()) {
      return;
    }
  }

  const target = document.querySelector(hash);
  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Rychlá navigace vedle loga — pro návštěvníky, kteří nechtějí scrollovat celý film.
 */
export function FilmJumpNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function onDoc(e: MouseEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  // Deep-link #cenik po načtení (až po ST / mobilní sekci)
  useEffect(() => {
    if (window.location.hash !== "#cenik") return;
    const t = window.setTimeout(() => scrollToHash("#cenik"), 500);
    return () => window.clearTimeout(t);
  }, []);

  function onHashClick(e: ReactMouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    if (href === "#objednat") {
      goToOrder();
      return;
    }
    scrollToHash(href);
    try {
      history.pushState(null, "", href);
    } catch {
      /* ignore */
    }
  }

  return (
    <div ref={rootRef} className="film-jump">
      <button
        type="button"
        className="film-jump-trigger"
        aria-label="Rychlá navigace"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>⋯</span>
      </button>
      {open ? (
        <nav id={menuId} className="film-jump-menu" aria-label="Rychlá navigace">
          <ul>
            {JUMP_LINKS.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} onClick={(e) => onHashClick(e, item.href)}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
