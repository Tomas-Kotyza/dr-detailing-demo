"use client";

import { useCallback, useId, useRef, useState, type PointerEvent } from "react";
import { goToOrder } from "@/lib/orderIntent";

export type BeforeAfterSlide = {
  id?: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  name: string;
  car: string;
  text: string;
};

function CompareCard({ slide }: { slide: BeforeAfterSlide }) {
  const [pos, setPos] = useState(52);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, next)));
  }, []);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <article className="ba-card">
      <div
        ref={stageRef}
        className="ba-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ba-img ba-img--after"
          src={slide.after}
          alt={slide.afterAlt}
          draggable={false}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ba-img ba-img--before"
          src={slide.before}
          alt={slide.beforeAlt}
          draggable={false}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden>
          <span className="ba-handle-line" />
          <span className="ba-handle-knob">↔</span>
        </div>
        <span className="ba-tag ba-tag--before">Před</span>
        <span className="ba-tag ba-tag--after">Po</span>
        <label className="sr-only" htmlFor={labelId}>
          Posuvník před a po — {slide.name}
        </label>
        <input
          id={labelId}
          className="ba-range"
          type="range"
          min={4}
          max={96}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
        />
      </div>
      <div className="ba-caption">
        <p className="ba-caption-text">{slide.text}</p>
        <footer>
          <strong>{slide.name}</strong>
          {slide.car ? ` · ${slide.car}` : null}
        </footer>
        <button
          type="button"
          className="ba-order-cta"
          onClick={() => goToOrder(slide.id)}
        >
          Chci tuto službu
        </button>
      </div>
    </article>
  );
}

export function BeforeAfterCompare({
  slides,
  layout = "film",
}: {
  slides: readonly BeforeAfterSlide[];
  layout?: "film" | "section";
}) {
  if (slides.length === 0) return null;

  return (
    <div className={`ba-block ba-block--${layout}`}>
      <div className="ba-grid">
        {slides.map((slide, i) => (
          <CompareCard key={slide.id ?? `${slide.before}-${i}`} slide={slide} />
        ))}
      </div>
    </div>
  );
}
