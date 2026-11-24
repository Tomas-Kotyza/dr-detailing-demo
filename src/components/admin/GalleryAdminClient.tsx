"use client";

import { useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import {
  GALLERY_ALBUM_MAX,
  type GalleryAlbum,
  type GalleryData,
  type GallerySetId,
  type GallerySlot,
} from "@/lib/cms/gallery-types";

type StorageStats = {
  photoCount: number;
  photoBytes: number;
  metaBytes: number;
  totalBytes: number;
  albumCount: number;
  photosInAlbums: number;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function emptySlots(): [GallerySlot, GallerySlot, GallerySlot] {
  return [
    { albumId: null, caption: "" },
    { albumId: null, caption: "" },
    { albumId: null, caption: "" },
  ];
}

function SetEditor({
  setId,
  slots,
  albums,
  isActive,
  activating,
  onUpdate,
  onActivate,
}: {
  setId: GallerySetId;
  slots: [GallerySlot, GallerySlot, GallerySlot];
  albums: GalleryAlbum[];
  isActive: boolean;
  activating: boolean;
  onUpdate: (index: number, patch: Partial<GallerySlot>) => void;
  onActivate: () => void;
}) {
  const withPhotos = albums.filter((a) => a.photos.length > 0);
  return (
    <div className={`admin-gallery-set ${isActive ? "is-active" : ""}`}>
      <div className="admin-gallery-set-head">
        <strong>
          Set {setId}
          {isActive ? " · na webu" : ""}
        </strong>
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn"
            disabled={activating}
            onClick={onActivate}
          >
            {activating ? "Aktivuji…" : `Aktivovat set ${setId}`}
          </button>
        </div>
      </div>
      <div className="admin-gallery-slots">
        {slots.map((slot, i) => {
          const album = slot.albumId
            ? albums.find((a) => a.id === slot.albumId)
            : undefined;
          const cover = album
            ? album.photos.find((p) => p.id === album.coverPhotoId) ??
              album.photos[0]
            : undefined;
          return (
            <div key={`${setId}-${i}`} className="admin-gallery-slot">
              <p className="admin-muted">Pole {i + 1}</p>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover.url} alt="" className="admin-gallery-thumb" />
              ) : (
                <div className="admin-gallery-empty">Bez složky</div>
              )}
              <label>
                Složka (auto)
                <select
                  value={slot.albumId ?? ""}
                  onChange={(e) =>
                    onUpdate(i, { albumId: e.target.value || null })
                  }
                >
                  <option value="">— vyberte —</option>
                  {withPhotos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.photos.length} fotek)
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Popisek (každý řádek = zelená tečka)
                <textarea
                  value={slot.caption}
                  maxLength={400}
                  rows={3}
                  placeholder={"Audi A6\nLeštění laku\nKeramická ochrana"}
                  onChange={(e) => onUpdate(i, { caption: e.target.value })}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GalleryAdminClient() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [storage, setStorage] = useState<StorageStats | null>(null);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState<GallerySetId | null>(null);
  const [newTitle, setNewTitle] = useState("");

  async function load() {
    const res = await fetch("/api/admin/gallery?stats=1", {
      credentials: "same-origin",
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const json = (await res.json()) as {
      data: GalleryData;
      storage?: StorageStats;
    };
    setData(json.data);
    if (json.storage) setStorage(json.storage);
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  async function createAlbum() {
    setError("");
    setFlash("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createAlbum",
        title: newTitle.trim() || "Nové auto",
      }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Vytvoření selhalo"));
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
    setNewTitle("");
    setFlash("Složka vytvořena. Nahrajte do ní až 5 fotek.");
  }

  async function renameAlbum(albumId: string, title: string) {
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateAlbum", albumId, title }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Přejmenování selhalo"));
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
  }

  async function movePhoto(albumId: string, index: number, dir: -1 | 1) {
    if (!data) return;
    const album = data.albums.find((a) => a.id === albumId);
    if (!album) return;
    const nextIndex = index + dir;
    if (nextIndex < 0 || nextIndex >= album.photos.length) return;

    const photos = [...album.photos];
    const tmp = photos[index];
    photos[index] = photos[nextIndex];
    photos[nextIndex] = tmp;
    const photoIds = photos.map((p) => p.id);

    setError("");
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        albums: prev.albums.map((a) =>
          a.id === albumId ? { ...a, photos } : a,
        ),
      };
    });

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorderPhotos", albumId, photoIds }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Změna pořadí selhala"));
      await load();
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
    setFlash("Pořadí fotek uloženo.");
  }

  async function setCover(albumId: string, coverPhotoId: string) {
    setError("");
    // Okamžitě v UI (server může chvíli vracet starou verzi)
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        albums: prev.albums.map((a) =>
          a.id === albumId ? { ...a, coverPhotoId } : a,
        ),
      };
    });
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateAlbum", albumId, coverPhotoId }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Nastavení náhledu selhalo"));
      await load();
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    const saved = json.data.albums.find((a) => a.id === albumId);
    if (saved && saved.coverPhotoId !== coverPhotoId) {
      // Stale odpověď — necháme lokální cover, znovu pošleme
      setData((prev) => {
        if (!prev) return json.data;
        return {
          ...json.data,
          albums: json.data.albums.map((a) =>
            a.id === albumId ? { ...a, coverPhotoId } : a,
          ),
        };
      });
      await fetch("/api/admin/gallery", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateAlbum", albumId, coverPhotoId }),
      });
    } else {
      setData(json.data);
    }
    setFlash("Náhledová fotka nastavena.");
  }

  async function deactivateHomepage() {
    if (
      !confirm(
        "Skrýt 3 náhledy z úvodu? Složky a fotky v galerii zůstanou beze změny.",
      )
    ) {
      return;
    }
    setError("");
    setFlash("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deactivate" }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Vypnutí selhalo"));
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
    setFlash(
      "Úvod už neukazuje 3 náhledy. Celá galerie (/galerie) zůstává beze změny.",
    );
  }

  async function onUpload(albumId: string, files: FileList | null) {
    if (!files?.length) return;
    const album = data?.albums.find((a) => a.id === albumId);
    const room = album ? GALLERY_ALBUM_MAX - album.photos.length : 0;
    if (room <= 0) {
      setError(`Složka už má ${GALLERY_ALBUM_MAX} fotek.`);
      return;
    }

    setUploadingId(albumId);
    setError("");
    setFlash("");
    try {
      const list = Array.from(files).slice(0, room);
      const uploaded: { id: string; url: string; createdAt: string }[] = [];
      for (let i = 0; i < list.length; i++) {
        setFlash(`Nahrávám ${i + 1} / ${list.length}…`);
        const body = new FormData();
        body.append("file", list[i]);
        const res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          credentials: "same-origin",
          body,
        });
        if (!res.ok) {
          setError(await readAdminError(res, `Nahrání fotky ${i + 1} selhalo`));
          setFlash("");
          return;
        }
        const json = (await res.json()) as {
          photo: { id: string; url: string; createdAt: string };
        };
        uploaded.push(json.photo);
      }

      if (uploaded.length === 0) return;

      setFlash("Ukládám fotky do složky…");
      const commit = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          albumId,
          title: album?.title,
          photos: uploaded,
        }),
      });
      if (!commit.ok) {
        setError(await readAdminError(commit, "Uložení do složky selhalo"));
        setFlash("");
        return;
      }
      const json = (await commit.json()) as {
        data: GalleryData;
        added: number;
        skipped: string[];
      };
      setData(json.data);
      const extra = json.skipped?.length ? ` ${json.skipped.join(" ")}` : "";
      setFlash(`Nahráno ${json.added} fotek do složky.${extra}`);
    } finally {
      setUploadingId(null);
    }
  }

  async function deletePhoto(albumId: string, photoId: string) {
    if (!confirm("Smazat tuto fotku?")) return;
    setError("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deletePhoto", albumId, photoId }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
  }

  async function deleteAlbum(albumId: string) {
    if (!confirm("Smazat celou složku včetně fotek?")) return;
    setError("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteAlbum", albumId }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    const json = (await res.json()) as { data: GalleryData };
    setData(json.data);
  }

  function updateSet(
    setId: GallerySetId,
    index: number,
    patch: Partial<GallerySlot>,
  ) {
    setData((prev) => {
      if (!prev) return prev;
      const key = setId === "A" ? "setA" : "setB";
      const nextSlots = [...prev[key]] as [GallerySlot, GallerySlot, GallerySlot];
      nextSlots[index] = { ...nextSlots[index], ...patch };
      return { ...prev, [key]: nextSlots };
    });
  }

  async function saveSets() {
    if (!data) return;
    setSaving(true);
    setError("");
    setFlash("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setA: data.setA, setB: data.setB }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Uložení selhalo"));
        return;
      }
      const json = (await res.json()) as { data: GalleryData };
      setData(json.data);
      setFlash("Sety uloženy (ještě nejsou na webu, dokud je neaktivujete).");
    } finally {
      setSaving(false);
    }
  }

  async function activate(setId: GallerySetId) {
    if (!data) return;
    if (
      !confirm(
        `Aktivovat set ${setId}? Náhledy vybraných složek se zobrazí na úvodu pod ceníkem.`,
      )
    ) {
      return;
    }
    setActivating(setId);
    setError("");
    setFlash("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activate",
          setId,
          setA: data.setA,
          setB: data.setB,
        }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Aktivace selhala"));
        return;
      }
      const json = (await res.json()) as { data: GalleryData };
      setData(json.data);
      setFlash(`Set ${setId} je aktivní na webu. Obnovte úvod (Ctrl+F5).`);
    } finally {
      setActivating(null);
    }
  }

  if (!data) {
    return (
      <div className="admin-card">
        <h1>Galerie</h1>
        {error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <p className="admin-muted">Načítám…</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="admin-card">
        <h1>Galerie</h1>
        <p className="admin-muted">
          1) Vytvořte složku (jedno auto). 2) Nahrajte až {GALLERY_ALBUM_MAX}{" "}
          fotek. 3) Šipkami nastavte pořadí a označte náhled. 4) Do setu A/B
          vyberte 3 složky a aktivujte — na úvodu jsou náhledy, po klepnutí
          listování fotek v nastaveném pořadí.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
        {storage ? (
          <p className="admin-muted" style={{ marginTop: "0.75rem" }}>
            Úložiště fotek: <strong>{formatBytes(storage.totalBytes)}</strong>
            {" · "}
            {storage.photoCount} souborů v Blobu
            {" · "}
            {storage.albumCount} složek / {storage.photosInAlbums} fotek v
            metadatech.
            <br />
            Limit Vercel Blob: Hobby cca <strong>1 GB</strong>, Pro obvykle{" "}
            <strong>5 GB</strong> v ceně (pak se platí za GB). Stav účtu:
            Vercel → Storage / Usage.
          </p>
        ) : null}
      </div>

      <div className="admin-card">
        <h2>1. Nová složka</h2>
        <div className="admin-actions" style={{ alignItems: "flex-end" }}>
          <label style={{ flex: 1, minWidth: "12rem" }}>
            Název (např. Audi A6)
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Audi A6 · leštění"
              maxLength={80}
            />
          </label>
          <button type="button" className="admin-btn" onClick={() => void createAlbum()}>
            Vytvořit složku
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2>2. Složky ({data.albums.length})</h2>
        {data.albums.length === 0 ? (
          <p className="admin-muted">Zatím žádná složka.</p>
        ) : null}
        {data.albums.map((album) => (
          <div key={album.id} className="admin-album">
            <div className="admin-gallery-set-head">
              <label style={{ flex: 1 }}>
                Název složky
                <input
                  defaultValue={album.title}
                  maxLength={80}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== album.title) {
                      void renameAlbum(album.id, e.target.value);
                    }
                  }}
                />
              </label>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => void deleteAlbum(album.id)}
              >
                Smazat složku
              </button>
            </div>
            <p className="admin-muted">
              {album.photos.length} / {GALLERY_ALBUM_MAX} fotek
              {album.coverPhotoId
                ? " · náhled nastaven (zelený rámeček)"
                : " · vyberte náhled"}
              {" · "}
              šipkami ↑↓ měníte pořadí při listování
            </p>
            <label className="admin-btn secondary" style={{ display: "inline-flex" }}>
              {uploadingId === album.id
                ? "Nahrávám…"
                : `Nahrát fotky (max ${GALLERY_ALBUM_MAX - album.photos.length})`}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                hidden
                disabled={
                  uploadingId !== null || album.photos.length >= GALLERY_ALBUM_MAX
                }
                onChange={(e) => {
                  void onUpload(album.id, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <ul className="admin-gallery-pool">
              {album.photos.map((p, idx) => {
                const isCover = album.coverPhotoId === p.id;
                return (
                  <li
                    key={p.id}
                    className={isCover ? "is-cover" : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={`Fotka ${idx + 1}`} />
                    <span className="admin-muted">
                      {idx + 1}. {isCover ? "Náhled" : "Fotka"}
                    </span>
                    <div className="admin-actions" style={{ marginTop: 0 }}>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        disabled={idx === 0}
                        aria-label="Posunout nahoru"
                        onClick={() => void movePhoto(album.id, idx, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        disabled={idx === album.photos.length - 1}
                        aria-label="Posunout dolů"
                        onClick={() => void movePhoto(album.id, idx, 1)}
                      >
                        ↓
                      </button>
                      {!isCover ? (
                        <button
                          type="button"
                          className="admin-btn secondary"
                          onClick={() => void setCover(album.id, p.id)}
                        >
                          Náhled
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="admin-btn danger"
                        onClick={() => void deletePhoto(album.id, p.id)}
                      >
                        Smazat
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-gallery-set-head">
          <h2>3. Sety pro úvod (2 × 3 složky)</h2>
          <div className="admin-actions">
            {data.activeSet ? (
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => void deactivateHomepage()}
              >
                Vypnout z úvodu
              </button>
            ) : null}
            <button
              type="button"
              className="admin-btn secondary"
              disabled={saving}
              onClick={() => void saveSets()}
            >
              {saving ? "Ukládám…" : "Uložit sety"}
            </button>
          </div>
        </div>
        <p className="admin-muted">
          Vypnutí setu schová jen 3 náhledy na úvodu. Složky a fotky v galerii
          zůstanou.
        </p>
        <SetEditor
          setId="A"
          slots={data.setA ?? emptySlots()}
          albums={data.albums}
          isActive={data.activeSet === "A"}
          activating={activating === "A"}
          onUpdate={(i, patch) => updateSet("A", i, patch)}
          onActivate={() => void activate("A")}
        />
        <SetEditor
          setId="B"
          slots={data.setB ?? emptySlots()}
          albums={data.albums}
          isActive={data.activeSet === "B"}
          activating={activating === "B"}
          onUpdate={(i, patch) => updateSet("B", i, patch)}
          onActivate={() => void activate("B")}
        />
      </div>
    </div>
  );
}
