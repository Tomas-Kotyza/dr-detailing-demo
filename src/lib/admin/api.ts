import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CONTENT_TAG } from "@/lib/content";

export function unauthorized() {
  return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Po uložení v adminu — hned vyprší cache (ne SWR „ještě chvíli staré“). */
export function revalidateContent() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  const paths = [
    "/",
    "/faq",
    "/blog",
    "/o-mne",
    "/galerie",
    "/detailing-praha-9",
    "/detailing-praha-10",
    "/detailing-brandys-nad-labem",
    "/detailing-uvaly",
    "/sluzby",
    "/sitemap.xml",
  ];
  for (const path of paths) {
    revalidatePath(path);
  }
}
