import { getLocalityBySlug } from "@/content/localities";
import { LocalityLanding, localityMetadata } from "@/components/LocalityLanding";
import { notFound } from "next/navigation";

const loc = getLocalityBySlug("detailing-cesky-brod");

export const metadata = loc ? localityMetadata(loc) : {};

export default function DetailingCeskyBrodPage() {
  if (!loc) notFound();
  return <LocalityLanding loc={loc} />;
}
