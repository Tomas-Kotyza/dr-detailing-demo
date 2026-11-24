import type { Metadata } from "next";
import { site } from "@/content/site";
import { getPublicAlbums } from "@/lib/cms/gallery";
import { GalleryPageClient } from "@/components/GalleryPageClient";

export const metadata: Metadata = {
  title: `Galerie práce | ${site.brandName}`,
  description: `Fotky z dílny ${site.brandName} — leštění laku, interiéry a keramická ochrana v Praze 9.`,
  alternates: { canonical: "/galerie" },
};

export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const albums = await getPublicAlbums();
  return <GalleryPageClient albums={albums} />;
}
