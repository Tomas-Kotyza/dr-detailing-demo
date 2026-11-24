import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import {
  activateGallerySet,
  createGalleryAlbum,
  deactivateHomepageSet,
  deleteGalleryAlbum,
  deleteGalleryPhoto,
  getGalleryStorageStats,
  readGallery,
  reorderGalleryPhotos,
  updateGalleryAlbum,
  writeGallery,
  type GalleryData,
  type GallerySetId,
  type GallerySlot,
} from "@/lib/cms/gallery";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const url = new URL(request.url);
  const data = await readGallery();
  if (url.searchParams.get("stats") === "1") {
    const storage = await getGalleryStorageStats();
    return NextResponse.json({ data, storage });
  }
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as Partial<GalleryData> | null;
  if (!body) return badRequest("Neplatná data.");

  const current = await readGallery();
  const next: GalleryData = {
    ...current,
    setA: body.setA ?? current.setA,
    setB: body.setB ?? current.setB,
    activeSet: current.activeSet,
    albums: current.albums,
  };

  try {
    const saved = await writeGallery(next);
    revalidateContent();
    return NextResponse.json({ data: saved });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as {
    action?: string;
    setId?: GallerySetId;
    albumId?: string;
    photoId?: string;
    photoIds?: string[];
    title?: string;
    coverPhotoId?: string | null;
    setA?: [GallerySlot, GallerySlot, GallerySlot];
    setB?: [GallerySlot, GallerySlot, GallerySlot];
  } | null;

  if (body?.action === "createAlbum") {
    try {
      const data = await createGalleryAlbum(body.title || "Nové auto");
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Vytvoření selhalo");
    }
  }

  if (body?.action === "updateAlbum") {
    if (!body.albumId) return badRequest("Chybí složka.");
    try {
      const data = await updateGalleryAlbum(body.albumId, {
        title: body.title,
        coverPhotoId: body.coverPhotoId,
      });
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
    }
  }

  if (body?.action === "reorderPhotos") {
    if (!body.albumId || !Array.isArray(body.photoIds)) {
      return badRequest("Chybí složka nebo pořadí fotek.");
    }
    try {
      const data = await reorderGalleryPhotos(body.albumId, body.photoIds);
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Řazení selhalo");
    }
  }

  if (body?.action === "deleteAlbum") {
    if (!body.albumId) return badRequest("Chybí složka.");
    try {
      const data = await deleteGalleryAlbum(body.albumId);
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Smazání selhalo");
    }
  }

  if (body?.action === "deletePhoto") {
    if (!body.albumId || !body.photoId) {
      return badRequest("Chybí složka nebo fotka.");
    }
    try {
      const data = await deleteGalleryPhoto(body.albumId, body.photoId);
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Smazání selhalo");
    }
  }

  if (body?.action === "activate") {
    if (body.setId !== "A" && body.setId !== "B") {
      return badRequest("Vyberte set A nebo B.");
    }
    try {
      const data = await activateGallerySet(body.setId, {
        setA: body.setA,
        setB: body.setB,
      });
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Aktivace selhala");
    }
  }

  if (body?.action === "deactivate") {
    try {
      const data = await deactivateHomepageSet();
      revalidateContent();
      return NextResponse.json({ data });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Vypnutí selhalo");
    }
  }

  return badRequest("Neznámá akce.");
}
