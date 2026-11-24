export const GALLERY_ALBUM_MAX = 5;

export type GalleryPhoto = {
  id: string;
  url: string;
  createdAt: string;
};

/** Složka = jedno auto / jedna práce, max 5 fotek. */
export type GalleryAlbum = {
  id: string;
  title: string;
  photos: GalleryPhoto[];
  coverPhotoId: string | null;
  createdAt: string;
};

export type GallerySlot = {
  albumId: string | null;
  caption: string;
};

export type GallerySetId = "A" | "B";

export type GalleryData = {
  albums: GalleryAlbum[];
  setA: [GallerySlot, GallerySlot, GallerySlot];
  setB: [GallerySlot, GallerySlot, GallerySlot];
  activeSet: GallerySetId | null;
  updatedAt: string;
};

export type HomepageWorkItem = {
  albumId: string;
  coverPhotoId: string;
  url: string;
  caption: string;
  title: string;
  photos: GalleryPhoto[];
};

export function getAlbumCover(album: GalleryAlbum): GalleryPhoto | null {
  if (!album.photos.length) return null;
  return (
    album.photos.find((p) => p.id === album.coverPhotoId) ??
    album.photos[0] ??
    null
  );
}
