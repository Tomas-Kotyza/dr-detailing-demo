import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, revalidateContent, unauthorized } from "@/lib/admin/api";
import {
  GALLERY_ALBUM_MAX,
  addPhotosToAlbum,
  uploadGalleryBlobs,
  type GalleryPhoto,
} from "@/lib/cms/gallery";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/**
 * Nahrání: jedna fotka = jeden request (limit Vercelu ~4,5 MB body),
 * server ji zmenší (sharp, max 1600 px → WebP) a uloží do Blobu.
 * Pak client pošle JSON commit se všemi URL do alba.
 * GIF se nekomprimuje (zachová animaci).
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const contentType = request.headers.get("content-type") || "";

  // Commit metadat (JSON)
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as {
      albumId?: string;
      title?: string;
      photos?: GalleryPhoto[];
    } | null;
    if (!body?.albumId || !Array.isArray(body.photos)) {
      return badRequest("Chybí albumId nebo photos.");
    }
    try {
      const result = await addPhotosToAlbum(body.albumId, body.photos, {
        title: body.title,
      });
      revalidateContent();
      return NextResponse.json(result);
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
    }
  }

  // Jedna fotka do Blob
  const form = await request.formData().catch(() => null);
  if (!form) return badRequest("Neplatná data.");

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return badRequest("Chybí soubor.");
  }
  if (!ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
    return badRequest(`Soubor „${file.name}“ není obrázek (JPG, PNG, WebP).`);
  }
  if (file.size > MAX_BYTES) {
    return badRequest(`Soubor „${file.name}“ je větší než 8 MB.`);
  }

  try {
    const [photo] = await uploadGalleryBlobs([file]);
    return NextResponse.json({ photo, maxPerAlbum: GALLERY_ALBUM_MAX });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Nahrání selhalo");
  }
}
