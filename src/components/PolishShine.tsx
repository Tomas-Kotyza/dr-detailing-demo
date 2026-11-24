"use client";

import { useEffect, useRef, useState } from "react";

type PolishShineProps = {
  className?: string;
  /** hero = větší záře, card = jemnější na fotkách */
  variant?: "hero" | "card";
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Jemný „lesk po leštění“ — záře sleduje myš s mírným zpožděním.
 * Na dotykových zařízeních a při reduced-motion vypnuto.
 */
export function PolishShine({ className = "", variant = "hero" }: PolishShineProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const streak = useRef({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const host = layerRef.current?.parentElement;
    const layer = layerRef.current;
    if (!host || !layer) return;

    let raf = 0;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.14);
      current.current.y = lerp(current.current.y, target.current.y, 0.14);
      streak.current.x = lerp(streak.current.x, target.current.x, 0.07);
      streak.current.y = lerp(streak.current.y, target.current.y, 0.07);

      layer.style.setProperty("--mx", `${current.current.x}%`);
      layer.style.setProperty("--my", `${current.current.y}%`);
      layer.style.setProperty("--sx", `${streak.current.x}%`);
      layer.style.setProperty("--sy", `${streak.current.y}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      target.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      setActive(true);
    };

    const onLeave = () => setActive(false);

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layerRef}
      className={`polish-shine polish-shine--${variant} ${active ? "is-active" : ""} ${className}`}
      aria-hidden
    />
  );
}
