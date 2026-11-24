"use client";

import { useEffect, useState } from "react";
import type { ReviewItem } from "@/lib/content/types";

export function ReviewsSlider({ reviews }: { reviews: ReviewItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const safeIndex = index % reviews.length;
  const review = reviews[safeIndex];
  const isOwner = review.role === "owner";

  return (
    <section className="after-film" aria-label="Recenze a slovo majitele">
      <div className="after-film-inner">
        <p className="svc-label">{isOwner ? "Od majitele" : "Recenze"}</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          {isOwner ? "Slovo majitele" : "Co říkají zákazníci"}
        </h2>

        <div className="review-stage mt-8" aria-live="polite">
          <blockquote className={`review-card ${isOwner ? "review-card--owner" : ""}`}>
            {isOwner ? <p className="review-badge">Majitel studia</p> : null}
            <p className="review-text">„{review.text}“</p>
            <footer className="mt-5 text-sm text-[var(--muted)]">
              <span className="font-semibold text-[var(--fg)]">{review.name}</span>
              {" · "}
              {review.car}
            </footer>
          </blockquote>
        </div>

        <div className="review-dots mt-6" role="tablist" aria-label="Výběr recenze">
          {reviews.map((r, i) => (
            <button
              key={r.dbId ?? r.id}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              className={`review-dot ${i === safeIndex ? "active" : ""} ${r.role === "owner" ? "owner" : ""}`}
              onClick={() => setIndex(i)}
            >
              <span className="sr-only">
                {r.role === "owner" ? "Majitel" : "Recenze"} {i + 1}: {r.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
