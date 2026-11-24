"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bindLenisScroll } from "@/lib/filmScroll";
import { isMobileFilmViewport } from "@/lib/filmVideo";

gsap.registerPlugin(ScrollTrigger);

/**
 * Desktop: Lenis + GSAP scrub.
 * Mobil: nativní scroll — bez Lenis; refresh hlavně při orientaci (ne address-bar resize).
 * Lenis se dynamic-importuje jen na desktopu (šetří mobilní JS).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    // Mobil / tablet touch — bez Lenis
    if (isMobileFilmViewport() || window.matchMedia("(pointer: coarse)").matches) {
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("orientationchange", refresh);
      const t1 = window.setTimeout(refresh, 500);
      return () => {
        window.clearTimeout(t1);
        window.removeEventListener("load", refresh);
        window.removeEventListener("orientationchange", refresh);
      };
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (disposed) return;

      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.35,
        autoRaf: false,
      });

      const unbindLenis = bindLenisScroll(lenis);
      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const refresh = () => {
        ScrollTrigger.refresh();
        lenis.resize();
      };
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      const t1 = window.setTimeout(refresh, 400);

      cleanup = () => {
        window.clearTimeout(t1);
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        unbindLenis();
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
