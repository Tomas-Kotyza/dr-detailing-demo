"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GalleryAlbum, GalleryPhoto } from "@/lib/cms/gallery-types";
import { getAlbumCover } from "@/lib/cms/gallery-types";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export function GalleryPageClient({ albums }: { albums: GalleryAlbum[] }) {
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("album-")) return;
    const id = hash.slice("album-".length);
    const album = albums.find((a) => a.id === id);
    if (!album) return;
    setOpenAlbumId(album.id);
    setStartIndex(0);
    const el = document.getElementById(`album-${album.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.classList.add("is-target");
    const t = window.setTimeout(() => el?.classList.remove("is-target"), 2400);
    return () => window.clearTimeout(t);
  }, [albums]);

  const openAlbum = albums.find((a) => a.id === openAlbumId) ?? null;

  function open(album: GalleryAlbum, photo?: GalleryPhoto) {
    const idx = photo
      ? Math.max(
          0,
          album.photos.findIndex((p) => p.id === photo.id),
        )
      : 0;
    setStartIndex(idx >= 0 ? idx : 0);
    setOpenAlbumId(album.id);
  }

  return (
    <div className="gallery-page">
      <div className="gallery-page-inner">
        <p className="svc-label">Galerie</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">Naše práce</h1>
        <p className="mt-3 max-w-xl text-[var(--muted)]">
          Každá ukázka je jedno auto. Klepněte na náhled — fotky listujete
          šipkami nebo posunutím prstu.
        </p>
        <p className="mt-4">
          <Link
            href="/#nase-prace"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            ← Zpět na úvod
          </Link>
        </p>

        {albums.length === 0 ? (
          <p className="mt-10 text-[var(--muted)]">Galerie se právě plní.</p>
        ) : (
          <ul className="gallery-page-grid">
            {albums.map((album) => {
              const cover = getAlbumCover(album);
              if (!cover) return null;
              return (
                <li
                  key={album.id}
                  id={`album-${album.id}`}
                  className="gallery-page-item"
                >
                  <button
                    type="button"
                    className="gallery-album-card"
                    onClick={() => open(album, cover)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover.url}
                      alt={album.title}
                      className="gallery-page-img"
                      loading="lazy"
                    />
                    <span className="gallery-album-meta">
                      <span className="gallery-album-title">{album.title}</span>
                      <span className="gallery-album-count">
                        {album.photos.length}{" "}
                        {album.photos.length === 1 ? "fotka" : "fotek"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <GalleryLightbox
        open={Boolean(openAlbum)}
        photos={openAlbum?.photos ?? []}
        startIndex={startIndex}
        title={openAlbum?.title}
        onClose={() => setOpenAlbumId(null)}
      />
    </div>
  );
}
