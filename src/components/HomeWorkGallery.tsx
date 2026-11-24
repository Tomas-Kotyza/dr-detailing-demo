"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomepageWorkItem } from "@/lib/cms/gallery-types";
import { GalleryLightbox } from "@/components/GalleryLightbox";

function CaptionLines({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <ul className="work-gallery-caption-list">
      {lines.map((line, i) => (
        <li key={`${i}-${line}`}>{line}</li>
      ))}
    </ul>
  );
}

export function HomeWorkGallery({ items }: { items: HomepageWorkItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = items.find((i) => i.albumId === openId) ?? null;

  if (items.length === 0) return null;

  return (
    <section id="nase-prace" className="work-gallery" aria-label="Naše práce">
      <div className="work-gallery-inner">
        <p className="svc-label">Galerie</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          <Link href="/galerie" className="work-gallery-title-link">
            Naše práce
          </Link>
        </h2>
        <p className="mt-2 max-w-lg text-sm work-gallery-lead">
          Tři aktuální ukázky. Klepnutím otevřete fotky auta — listujte šipkami
          nebo prstem.
        </p>

        <ul className="work-gallery-grid">
          {items.map((item) => (
            <li key={item.albumId}>
              <button
                type="button"
                className="work-gallery-card"
                onClick={() => setOpenId(item.albumId)}
              >
                <span className="work-gallery-frame">
                  <Image
                    src={item.url}
                    alt={item.title || "Práce Dr Detailing"}
                    fill
                    className="work-gallery-img"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    quality={70}
                  />
                </span>
                <CaptionLines text={item.caption} />
              </button>
            </li>
          ))}
        </ul>

        <p className="work-gallery-more">
          <Link href="/galerie">Další práce →</Link>
        </p>
      </div>

      <GalleryLightbox
        open={Boolean(openItem)}
        photos={openItem?.photos ?? []}
        startIndex={Math.max(
          0,
          openItem?.photos.findIndex((p) => p.id === openItem.coverPhotoId) ?? 0,
        )}
        title={openItem?.title}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
