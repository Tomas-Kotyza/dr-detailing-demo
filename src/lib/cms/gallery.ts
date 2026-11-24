import { put, list, del } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import {
  GALLERY_ALBUM_MAX,
  getAlbumCover,
  type GalleryAlbum,
  type GalleryData,
  type GalleryPhoto,
  type GallerySetId,
  type GallerySlot,
  type HomepageWorkItem,
} from "@/lib/cms/gallery-types";

export type {
  GalleryAlbum,
  GalleryData,
  GalleryPhoto,
  GallerySetId,
  GallerySlot,
  HomepageWorkItem,
} from "@/lib/cms/gallery-types";
export { GALLERY_ALBUM_MAX, getAlbumCover } from "@/lib/cms/gallery-types";

const LOCAL_LEGACY = path.join(process.cwd(), "data", "gallery.json");
const LOCAL_ALBUMS = path.join(process.cwd(), "data", "gallery-albums.json");
const LOCAL_SETS = path.join(process.cwd(), "data", "gallery-sets.json");

/** Alba (složky + fotky) — odděleně od setů, ať uložení úvodu nesmaže fotky. */
const BLOB_ALBUMS = "drdetailing-gallery-albums.json";
/** Sety A/B + activeSet pro úvod. */
const BLOB_SETS = "drdetailing-gallery-sets.json";
/** Starý společný soubor (migrace). */
const BLOB_LEGACY = "drdetailing-gallery.json";

type AlbumsStore = { albums: GalleryAlbum[]; updatedAt: string };
type SetsStore = {
  setA: GalleryData["setA"];
  setB: GalleryData["setB"];
  activeSet: GalleryData["activeSet"];
  updatedAt: string;
};

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function emptySlots(): [GallerySlot, GallerySlot, GallerySlot] {
  return [
    { albumId: null, caption: "" },
    { albumId: null, caption: "" },
    { albumId: null, caption: "" },
  ];
}

function emptyAlbums(): AlbumsStore {
  return { albums: [], updatedAt: new Date().toISOString() };
}

function emptySets(): SetsStore {
  return {
    setA: emptySlots(),
    setB: emptySlots(),
    activeSet: null,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCaption(raw: unknown): string {
  return String(raw ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/^\n+|\n+$/g, "")
    .slice(0, 400);
}

function normalizePhoto(raw: unknown): GalleryPhoto | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<GalleryPhoto>;
  if (typeof p.id !== "string" || typeof p.url !== "string" || !p.url.trim()) {
    return null;
  }
  return {
    id: String(p.id),
    url: String(p.url),
    createdAt: String(p.createdAt || new Date().toISOString()),
  };
}

function normalizeAlbum(raw: unknown): GalleryAlbum | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Partial<GalleryAlbum> & { photoId?: string };
  if (typeof a.id !== "string") return null;
  const photos = (Array.isArray(a.photos) ? a.photos : [])
    .map(normalizePhoto)
    .filter((p): p is GalleryPhoto => Boolean(p))
    .slice(0, GALLERY_ALBUM_MAX);
  let coverPhotoId =
    typeof a.coverPhotoId === "string" && photos.some((p) => p.id === a.coverPhotoId)
      ? a.coverPhotoId
      : photos[0]?.id ?? null;
  return {
    id: String(a.id),
    title: String(a.title || "Bez názvu").trim().slice(0, 80) || "Bez názvu",
    photos,
    coverPhotoId,
    createdAt: String(a.createdAt || new Date().toISOString()),
  };
}

function normalizeSlots(
  raw: unknown,
): [GallerySlot, GallerySlot, GallerySlot] {
  const arr = Array.isArray(raw) ? raw : [];
  const slots: GallerySlot[] = [0, 1, 2].map((i) => {
    const s = arr[i] as Partial<GallerySlot> & { photoId?: string } | undefined;
    // migrace starého photoId → ignorovat (fotky jsou teď ve složkách)
    const albumId =
      s?.albumId && String(s.albumId).trim() ? String(s.albumId) : null;
    return {
      albumId,
      caption: normalizeCaption(s?.caption),
    };
  });
  return [slots[0], slots[1], slots[2]];
}

/** Staré flat photos → složky po 5. */
function migrateLegacyPhotos(raw: Partial<GalleryData> & { photos?: unknown }): GalleryAlbum[] {
  const legacy = Array.isArray(raw.photos) ? raw.photos : [];
  const photos = legacy
    .map(normalizePhoto)
    .filter((p): p is GalleryPhoto => Boolean(p));
  if (photos.length === 0) return [];
  const albums: GalleryAlbum[] = [];
  for (let i = 0; i < photos.length; i += GALLERY_ALBUM_MAX) {
    const chunk = photos.slice(i, i + GALLERY_ALBUM_MAX);
    const n = Math.floor(i / GALLERY_ALBUM_MAX) + 1;
    albums.push({
      id: `migrated-${n}-${chunk[0].id}`,
      title: photos.length <= GALLERY_ALBUM_MAX ? "Galerie" : `Galerie ${n}`,
      photos: chunk,
      coverPhotoId: chunk[0]?.id ?? null,
      createdAt: chunk[0]?.createdAt || new Date().toISOString(),
    });
  }
  return albums;
}

async function readJsonBlob(pathname: string): Promise<unknown | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: pathname, limit: 5 });
    const hit =
      blobs.find((b) => b.pathname === pathname) ??
      blobs.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )[0];
    if (!hit?.url) return null;
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    url.searchParams.set("r", Math.random().toString(36).slice(2));
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function writeJsonBlob(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readJsonLocal(filePath: string): Promise<unknown | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
  } catch {
    return null;
  }
}

async function writeJsonLocal(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeAlbumsStore(raw: unknown): AlbumsStore {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Partial<AlbumsStore> &
    Partial<GalleryData> & { photos?: unknown };
  let albums = Array.isArray(obj.albums)
    ? obj.albums.map(normalizeAlbum).filter((a): a is GalleryAlbum => Boolean(a))
    : [];
  if (albums.length === 0 && "photos" in obj) {
    albums = migrateLegacyPhotos(obj);
  }
  return {
    albums,
    updatedAt: String(obj.updatedAt || new Date().toISOString()),
  };
}

function normalizeSetsStore(raw: unknown): SetsStore {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Partial<SetsStore> &
    Partial<GalleryData>;
  const active =
    obj.activeSet === "A" || obj.activeSet === "B" ? obj.activeSet : null;
  return {
    setA: normalizeSlots(obj.setA),
    setB: normalizeSlots(obj.setB),
    activeSet: active,
    updatedAt: String(obj.updatedAt || new Date().toISOString()),
  };
}

function combineStores(albums: AlbumsStore, sets: SetsStore): GalleryData {
  return {
    albums: albums.albums,
    setA: sets.setA,
    setB: sets.setB,
    activeSet: sets.activeSet,
    updatedAt:
      albums.updatedAt > sets.updatedAt ? albums.updatedAt : sets.updatedAt,
  };
}

/** Sloučí dvě složky — fotky se nesmí ztratit; pořadí zachová z bohatší verze. */
function mergeAlbumPair(a: GalleryAlbum, b: GalleryAlbum): GalleryAlbum {
  const photosById = new Map<string, GalleryPhoto>();
  for (const p of a.photos) photosById.set(p.id, p);
  for (const p of b.photos) photosById.set(p.id, p);

  // Pořadí: preferuj verzi s více fotkami (obvykle aktuálnější nastavení majitele)
  const orderSource =
    b.photos.length >= a.photos.length ? b.photos : a.photos;
  const other = b.photos.length >= a.photos.length ? a.photos : b.photos;
  const ordered: GalleryPhoto[] = [];
  const seen = new Set<string>();
  for (const p of [...orderSource, ...other]) {
    const full = photosById.get(p.id);
    if (!full || seen.has(p.id)) continue;
    ordered.push(full);
    seen.add(p.id);
  }
  const photos = ordered.slice(0, GALLERY_ALBUM_MAX);

  const cover =
    (b.coverPhotoId && photos.some((p) => p.id === b.coverPhotoId)
      ? b.coverPhotoId
      : null) ||
    (a.coverPhotoId && photos.some((p) => p.id === a.coverPhotoId)
      ? a.coverPhotoId
      : null) ||
    photos[0]?.id ||
    null;

  return {
    id: a.id,
    title:
      b.title && b.title !== "Bez názvu" && b.title !== "Nové auto"
        ? b.title
        : a.title || b.title,
    photos,
    coverPhotoId: cover,
    createdAt: a.createdAt <= b.createdAt ? a.createdAt : b.createdAt,
  };
}

function mergeAlbumsLists(
  primary: GalleryAlbum[],
  secondary: GalleryAlbum[],
): GalleryAlbum[] {
  const map = new Map<string, GalleryAlbum>();
  for (const album of primary) map.set(album.id, album);
  for (const album of secondary) {
    const existing = map.get(album.id);
    map.set(album.id, existing ? mergeAlbumPair(existing, album) : album);
  }
  return [...map.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

function mergeAlbumsStores(...stores: AlbumsStore[]): AlbumsStore {
  let albums: GalleryAlbum[] = [];
  let updatedAt = "";
  for (const store of stores) {
    albums = mergeAlbumsLists(albums, store.albums);
    if (store.updatedAt > updatedAt) updatedAt = store.updatedAt;
  }
  return {
    albums,
    updatedAt: updatedAt || new Date().toISOString(),
  };
}

function pickNewerSets(a: SetsStore, b: SetsStore): SetsStore {
  return a.updatedAt >= b.updatedAt ? a : b;
}

async function readAlbumsStore(): Promise<AlbumsStore> {
  const parts: AlbumsStore[] = [];
  if (hasBlob()) {
    const split = await readJsonBlob(BLOB_ALBUMS);
    if (split) parts.push(normalizeAlbumsStore(split));
    const legacy = await readJsonBlob(BLOB_LEGACY);
    if (legacy) parts.push(normalizeAlbumsStore(legacy));
  }
  const localSplit = await readJsonLocal(LOCAL_ALBUMS);
  if (localSplit) parts.push(normalizeAlbumsStore(localSplit));
  const localLegacy = await readJsonLocal(LOCAL_LEGACY);
  if (localLegacy) parts.push(normalizeAlbumsStore(localLegacy));
  if (parts.length === 0) return emptyAlbums();
  return mergeAlbumsStores(...parts);
}

async function readSetsStore(): Promise<SetsStore> {
  const parts: SetsStore[] = [];
  if (hasBlob()) {
    const split = await readJsonBlob(BLOB_SETS);
    if (split) parts.push(normalizeSetsStore(split));
    const legacy = await readJsonBlob(BLOB_LEGACY);
    if (legacy) parts.push(normalizeSetsStore(legacy));
  }
  const localSplit = await readJsonLocal(LOCAL_SETS);
  if (localSplit) parts.push(normalizeSetsStore(localSplit));
  const localLegacy = await readJsonLocal(LOCAL_LEGACY);
  if (localLegacy) parts.push(normalizeSetsStore(localLegacy));
  if (parts.length === 0) return emptySets();
  return parts.reduce(pickNewerSets);
}

/** Zápis alb + synchronizace legacy souboru, ať CDN nevrací starou prázdnou verzi. */
async function persistAlbums(
  albums: GalleryAlbum[],
  opts?: { replace?: boolean },
): Promise<AlbumsStore> {
  const incoming = albums
    .map(normalizeAlbum)
    .filter((a): a is GalleryAlbum => Boolean(a));
  // Výchozí: sloučit s tím, co už je uložené — nesmazat fotky při souběhu zápisů.
  // Mazání složky/fotky musí poslat replace: true.
  const finalAlbums = opts?.replace
    ? incoming
    : mergeAlbumsLists((await readAlbumsStore()).albums, incoming);

  const store: AlbumsStore = {
    albums: finalAlbums,
    updatedAt: new Date().toISOString(),
  };
  const sets = await readSetsStore();
  const legacySnapshot: GalleryData = {
    albums: store.albums,
    setA: sets.setA,
    setB: sets.setB,
    activeSet: sets.activeSet,
    updatedAt: store.updatedAt,
  };

  if (hasBlob()) {
    await writeJsonBlob(BLOB_ALBUMS, store);
    await writeJsonBlob(BLOB_LEGACY, legacySnapshot);
  } else {
    try {
      await writeJsonLocal(LOCAL_ALBUMS, store);
      await writeJsonLocal(LOCAL_LEGACY, legacySnapshot);
    } catch {
      throw new Error(
        "Galerii nelze uložit. Na Vercelu musí být Vercel Blob (BLOB_READ_WRITE_TOKEN).",
      );
    }
  }
  return store;
}

async function persistSets(sets: Omit<SetsStore, "updatedAt">): Promise<SetsStore> {
  const store: SetsStore = {
    setA: normalizeSlots(sets.setA),
    setB: normalizeSlots(sets.setB),
    activeSet:
      sets.activeSet === "A" || sets.activeSet === "B" ? sets.activeSet : null,
    updatedAt: new Date().toISOString(),
  };
  const albums = await readAlbumsStore();
  const legacySnapshot: GalleryData = {
    albums: albums.albums,
    setA: store.setA,
    setB: store.setB,
    activeSet: store.activeSet,
    updatedAt: store.updatedAt,
  };

  if (hasBlob()) {
    await writeJsonBlob(BLOB_SETS, store);
    await writeJsonBlob(BLOB_LEGACY, legacySnapshot);
  } else {
    try {
      await writeJsonLocal(LOCAL_SETS, store);
      await writeJsonLocal(LOCAL_LEGACY, legacySnapshot);
    } catch {
      throw new Error(
        "Galerii nelze uložit. Na Vercelu musí být Vercel Blob (BLOB_READ_WRITE_TOKEN).",
      );
    }
  }
  return store;
}

export type GalleryStorageStats = {
  photoCount: number;
  photoBytes: number;
  metaBytes: number;
  totalBytes: number;
  albumCount: number;
  photosInAlbums: number;
};

/** Spočítá velikost fotek + metadat v Blobu (prefix gallery/ + JSON galerie). */
export async function getGalleryStorageStats(): Promise<GalleryStorageStats> {
  const data = await readGallery();
  const albumCount = data.albums.length;
  const photosInAlbums = data.albums.reduce((n, a) => n + a.photos.length, 0);

  let photoCount = 0;
  let photoBytes = 0;
  let metaBytes = 0;

  if (hasBlob()) {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "gallery/", cursor, limit: 1000 });
      for (const b of page.blobs) {
        photoCount += 1;
        photoBytes += b.size ?? 0;
      }
      cursor = page.cursor;
    } while (cursor);

    for (const name of [BLOB_ALBUMS, BLOB_SETS, BLOB_LEGACY]) {
      const { blobs } = await list({ prefix: name, limit: 5 });
      const hit = blobs.find((b) => b.pathname === name);
      if (hit?.size) metaBytes += hit.size;
    }
  }

  return {
    photoCount,
    photoBytes,
    metaBytes,
    totalBytes: photoBytes + metaBytes,
    albumCount,
    photosInAlbums,
  };
}

export async function readGallery(): Promise<GalleryData> {
  const [albums, sets] = await Promise.all([readAlbumsStore(), readSetsStore()]);
  return combineStores(albums, sets);
}

/** Uloží jen sety úvodu — alba/fotky se nemění. */
export async function writeGallery(data: GalleryData): Promise<GalleryData> {
  await persistSets({
    setA: data.setA,
    setB: data.setB,
    activeSet: data.activeSet,
  });
  return readGallery();
}

async function readGalleryAfterAlbumsWrite(
  albums: AlbumsStore,
): Promise<GalleryData> {
  const sets = await readSetsStore();
  return combineStores(albums, sets);
}

const GALLERY_MAX_EDGE = 1600;
const GALLERY_WEBP_QUALITY = 80;

type PreparedGalleryImage = {
  bytes: Buffer;
  ext: string;
  contentType: string;
};

/**
 * Zmenší fotku před Blobem (max 1600 px na delší straně, WebP ~80).
 * GIF nechá beze změny (animace).
 */
async function prepareGalleryImage(file: File): Promise<PreparedGalleryImage> {
  const input = Buffer.from(await file.arrayBuffer());
  const mime = (file.type || "").toLowerCase();
  const nameExt =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";

  if (mime === "image/gif" || nameExt === "gif") {
    return {
      bytes: input,
      ext: "gif",
      contentType: "image/gif",
    };
  }

  try {
    const sharp = (await import("sharp")).default;
    const bytes = await sharp(input)
      .rotate()
      .resize({
        width: GALLERY_MAX_EDGE,
        height: GALLERY_MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: GALLERY_WEBP_QUALITY })
      .toBuffer();
    return {
      bytes,
      ext: "webp",
      contentType: "image/webp",
    };
  } catch {
    // Fallback: původní bajty (např. nepodporovaný formát)
    const ext = nameExt || "jpg";
    return {
      bytes: input,
      ext,
      contentType: file.type || "image/jpeg",
    };
  }
}

async function putImageFile(file: File): Promise<GalleryPhoto> {
  const prepared = await prepareGalleryImage(file);
  const id = `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const pathname = `gallery/${id}.${prepared.ext}`;

  let url: string;
  if (hasBlob()) {
    const uploaded = await put(pathname, prepared.bytes, {
      access: "public",
      contentType: prepared.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    url = uploaded.url;
  } else {
    const dir = path.join(process.cwd(), "public", "uploads", "gallery");
    await fs.mkdir(dir, { recursive: true });
    const filename = `${id}.${prepared.ext}`;
    await fs.writeFile(path.join(dir, filename), prepared.bytes);
    url = `/uploads/gallery/${filename}`;
  }

  return {
    id,
    url,
    createdAt: new Date().toISOString(),
  };
}

export async function createGalleryAlbum(title: string): Promise<GalleryData> {
  const store = await readAlbumsStore();
  const album: GalleryAlbum = {
    id: `alb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title: title.trim().slice(0, 80) || "Nové auto",
    photos: [],
    coverPhotoId: null,
    createdAt: new Date().toISOString(),
  };
  const saved = await persistAlbums([album, ...store.albums]);
  return readGalleryAfterAlbumsWrite(saved);
}

export async function updateGalleryAlbum(
  albumId: string,
  patch: { title?: string; coverPhotoId?: string | null },
): Promise<GalleryData> {
  const { albums, album } = await resolveAlbumForWrite(
    albumId,
    typeof patch.title === "string" ? patch.title : undefined,
  );
  if (typeof patch.title === "string") {
    album.title = patch.title.trim().slice(0, 80) || album.title;
  }
  if (patch.coverPhotoId !== undefined) {
    if (
      patch.coverPhotoId &&
      !album.photos.some((p) => p.id === patch.coverPhotoId)
    ) {
      throw new Error("Náhled musí být fotka z této složky.");
    }
    album.coverPhotoId = patch.coverPhotoId;
  }
  const saved = await persistAlbums(albums);
  return readGalleryAfterAlbumsWrite(saved);
}

/** Nastaví pořadí fotek ve složce (id v požadovaném pořadí). */
export async function reorderGalleryPhotos(
  albumId: string,
  photoIds: string[],
): Promise<GalleryData> {
  const store = await readAlbumsStore();
  const album = store.albums.find((a) => a.id === albumId);
  if (!album) throw new Error("Složka nenalezena.");

  const byId = new Map(album.photos.map((p) => [p.id, p]));
  const next: GalleryPhoto[] = [];
  for (const id of photoIds) {
    const photo = byId.get(id);
    if (!photo) continue;
    next.push(photo);
    byId.delete(id);
  }
  for (const leftover of byId.values()) next.push(leftover);
  album.photos = next.slice(0, GALLERY_ALBUM_MAX);

  const saved = await persistAlbums(store.albums, { replace: true });
  return readGalleryAfterAlbumsWrite(saved);
}

export async function deleteGalleryAlbum(albumId: string): Promise<GalleryData> {
  const store = await readAlbumsStore();
  const album = store.albums.find((a) => a.id === albumId);
  if (!album) throw new Error("Složka nenalezena.");

  for (const photo of album.photos) {
    if (hasBlob() && photo.url.includes("blob.vercel-storage.com")) {
      try {
        await del(photo.url);
      } catch {
        /* ignore */
      }
    }
  }

  const albumsSaved = await persistAlbums(
    store.albums.filter((a) => a.id !== albumId),
    { replace: true },
  );

  const sets = await readSetsStore();
  const clear = (s: GallerySlot): GallerySlot =>
    s.albumId === albumId ? { albumId: null, caption: s.caption } : s;
  await persistSets({
    setA: [clear(sets.setA[0]), clear(sets.setA[1]), clear(sets.setA[2])],
    setB: [clear(sets.setB[0]), clear(sets.setB[1]), clear(sets.setB[2])],
    activeSet: sets.activeSet,
  });

  return readGalleryAfterAlbumsWrite(albumsSaved);
}

/**
 * Nahraje soubory do Blob/úložiště BEZ zápisu metadat složek
 * (kvůli limitu velikosti requestu a race při více zápisech).
 */
export async function uploadGalleryBlobs(files: File[]): Promise<GalleryPhoto[]> {
  const out: GalleryPhoto[] = [];
  for (const file of files) {
    out.push(await putImageFile(file));
  }
  return out;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Blob JSON umí chvíli vracet starou verzi po zápisu.
 * Hledá složku s retry; když pořád chybí, založí ji se stejným id (fotky se neztratí).
 */
async function resolveAlbumForWrite(
  albumId: string,
  title?: string,
): Promise<{ albums: GalleryAlbum[]; album: GalleryAlbum }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const store = await readAlbumsStore();
    const album = store.albums.find((a) => a.id === albumId);
    if (album) return { albums: store.albums, album };
    await sleep(300 * (attempt + 1));
  }

  const store = await readAlbumsStore();
  const existing = store.albums.find((a) => a.id === albumId);
  if (existing) return { albums: store.albums, album: existing };

  const album: GalleryAlbum = {
    id: albumId,
    title: (title || "Nové auto").trim().slice(0, 80) || "Nové auto",
    photos: [],
    coverPhotoId: null,
    createdAt: new Date().toISOString(),
  };
  return { albums: [album, ...store.albums], album };
}

/** Připojí už nahrané fotky do složky — jeden zápis metadat alb. */
export async function addPhotosToAlbum(
  albumId: string,
  photos: GalleryPhoto[],
  opts?: { title?: string },
): Promise<{ data: GalleryData; added: number; skipped: string[] }> {
  if (!photos.length) throw new Error("Chybí fotky.");
  const { albums, album } = await resolveAlbumForWrite(albumId, opts?.title);

  const room = GALLERY_ALBUM_MAX - album.photos.length;
  if (room <= 0) {
    throw new Error(
      `Složka už má ${GALLERY_ALBUM_MAX} fotek. Smažte nějakou nebo založte novou.`,
    );
  }

  const toAdd = photos.slice(0, room);
  const skipped: string[] = [];
  if (photos.length > room) {
    skipped.push(
      `${photos.length - room} fotek přeskočeno — ve složce je místo jen pro ${room}.`,
    );
  }

  album.photos = [...album.photos, ...toAdd].slice(0, GALLERY_ALBUM_MAX);
  if (!album.coverPhotoId && album.photos[0]) {
    album.coverPhotoId = album.photos[0].id;
  }
  if (opts?.title?.trim()) {
    album.title = opts.title.trim().slice(0, 80);
  }

  const saved = await persistAlbums(albums);
  return {
    data: await readGalleryAfterAlbumsWrite(saved),
    added: toAdd.length,
    skipped,
  };
}

/**
 * @deprecated prefer uploadGalleryBlobs + addPhotosToAlbum
 */
export async function uploadPhotosToAlbum(
  albumId: string,
  files: File[],
): Promise<{ data: GalleryData; added: number; skipped: string[] }> {
  const photos = await uploadGalleryBlobs(files);
  return addPhotosToAlbum(albumId, photos);
}

export async function deleteGalleryPhoto(
  albumId: string,
  photoId: string,
): Promise<GalleryData> {
  const store = await readAlbumsStore();
  const album = store.albums.find((a) => a.id === albumId);
  if (!album) throw new Error("Složka nenalezena.");
  const photo = album.photos.find((p) => p.id === photoId);
  if (!photo) throw new Error("Fotka nenalezena.");

  album.photos = album.photos.filter((p) => p.id !== photoId);
  if (album.coverPhotoId === photoId) {
    album.coverPhotoId = album.photos[0]?.id ?? null;
  }

  if (hasBlob() && photo.url.includes("blob.vercel-storage.com")) {
    try {
      await del(photo.url);
    } catch {
      /* ignore */
    }
  }

  const saved = await persistAlbums(store.albums, { replace: true });
  return readGalleryAfterAlbumsWrite(saved);
}

export async function activateGallerySet(
  setId: GallerySetId,
  sets?: { setA?: GalleryData["setA"]; setB?: GalleryData["setB"] },
): Promise<GalleryData> {
  const current = await readSetsStore();
  const next = {
    setA: sets?.setA ? normalizeSlots(sets.setA) : current.setA,
    setB: sets?.setB ? normalizeSlots(sets.setB) : current.setB,
    activeSet: setId as GallerySetId,
  };
  const chosen = setId === "A" ? next.setA : next.setB;
  if (chosen.filter((s) => s.albumId).length === 0) {
    throw new Error("V setu není žádná složka. Nejdřív vyberte alba do polí.");
  }
  await persistSets(next);
  return readGallery();
}

/** Jen skryje 3 náhledy z úvodu — složky a fotky v galerii zůstanou. */
export async function deactivateHomepageSet(): Promise<GalleryData> {
  const current = await readSetsStore();
  await persistSets({
    setA: current.setA,
    setB: current.setB,
    activeSet: null,
  });
  return readGallery();
}

export async function getHomepageWorkItems(): Promise<HomepageWorkItem[]> {
  const data = await readGallery();
  if (!data.activeSet) return [];
  const set = data.activeSet === "A" ? data.setA : data.setB;
  const byId = new Map(data.albums.map((a) => [a.id, a]));
  return set
    .map((s) => {
      if (!s.albumId) return null;
      const album = byId.get(s.albumId);
      if (!album) return null;
      const cover = getAlbumCover(album);
      if (!cover) return null;
      return {
        albumId: album.id,
        coverPhotoId: cover.id,
        url: cover.url,
        caption: s.caption || album.title,
        title: album.title,
        photos: album.photos,
      };
    })
    .filter((x): x is HomepageWorkItem => Boolean(x));
}

export async function getPublicAlbums(): Promise<GalleryAlbum[]> {
  const store = await readAlbumsStore();
  return store.albums.filter((a) => a.photos.length > 0);
}
