"use client";

import { useEffect, useState } from "react";

/**
 * Mobilní režim filmu. Vždy startuje `false` (stejně na serveru i první
 * client render), ať nevznikne hydration mismatch (React #418).
 * Skutečný matchMedia se nastaví až v useEffect.
 */
export function useFilmMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
