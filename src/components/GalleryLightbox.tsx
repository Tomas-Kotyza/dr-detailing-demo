"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/cms/gallery-types";

type Props = {
  photos: GalleryPhoto[];
  startIndex?: number;
  title?: string;
  open: boolean;
  onClose: () => void;
};

export function GalleryLightbox({
  photos,
  startIndex = 0,
  title,
  open,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (open) setIndex(Math.min(Math.max(0, startIndex), photos.length - 1));
  }, [open, startIndex, photos.length]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (photos.length < 2) return;
      setIndex((i) => (i + dir + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  if (!open || photos.length === 0) return null;

  const photo = photos[index] ?? photos[0];

  return (
    <div
      className="glightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Prohlížení fotek"}
      onClick={onClose}
    >
      <div
        className="glightbox-panel"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          touchDeltaX.current = 0;
        }}
        onTouchMove={(e) => {
          if (touchStartX.current == null) return;
          touchDeltaX.current =
            (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        }}
        onTouchEnd={() => {
          const dx = touchDeltaX.current;
          touchStartX.current = null;
          if (Math.abs(dx) < 48) return;
          if (dx < 0) go(1);
          else go(-1);
        }}
      >
        <button
          type="button"
          className="glightbox-close"
          aria-label="Zavřít"
          onClick={onClose}
        >
          ×
        </button>

        {photos.length > 1 ? (
          <>
            <button
              type="button"
              className="glightbox-nav glightbox-prev"
              aria-label="Předchozí fotka"
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="glightbox-nav glightbox-next"
              aria-label="Další fotka"
              onClick={() => go(1)}
            >
              ›
            </button>
          </>
        ) : null}

        <div className="glightbox-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={photo.id}
            src={photo.url}
            alt={title || "Práce Dr Detailing"}
            className="glightbox-img"
            draggable={false}
          />
        </div>

        <div className="glightbox-meta">
          {title ? <p className="glightbox-title">{title}</p> : null}
          <p className="glightbox-count">
            {index + 1} / {photos.length}
            {photos.length > 1 ? " · posuňte prstem nebo šipkami" : null}
          </p>
        </div>
      </div>
    </div>
  );
}
