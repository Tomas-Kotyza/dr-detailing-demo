"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { goToOrder } from "@/lib/orderIntent";

/** Spodní lišta na mobilu — Rezervovat + Zavolat (po odscrollování hero). */
export function StickyOrderBar() {
  const [visible, setVisible] = useState(false);
  const [nearForm, setNearForm] = useState(false);

  useEffect(() => {
    const order = document.getElementById("objednat");
    const hero = document.querySelector(".chapter-open");

    const onScroll = () => {
      const pastHero = hero
        ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.35
        : window.scrollY > 280;
      setVisible(pastHero);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | null = null;
    if (order) {
      io = new IntersectionObserver(
        ([entry]) => setNearForm(entry.isIntersecting),
        { rootMargin: "0px 0px -20% 0px", threshold: 0.12 },
      );
      io.observe(order);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  if (!visible || nearForm) return null;

  return (
    <div className="sticky-order-bar md:hidden" role="region" aria-label="Rychlá rezervace">
      <a className="sticky-order-call" href={`tel:${site.phone}`}>
        Zavolat
      </a>
      <button type="button" className="sticky-order-book" onClick={() => goToOrder()}>
        Rezervovat
      </button>
    </div>
  );
}
