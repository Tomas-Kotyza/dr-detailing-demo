import { getLocalityBySlug } from "@/content/localities";
import { LocalityLanding, localityMetadata } from "@/components/LocalityLanding";
import { notFound } from "next/navigation";

const loc = getLocalityBySlug("detailing-kostelec-nad-cernymi-lesy");

export const metadata = loc ? localityMetadata(loc) : {};

export default function DetailingKostelecNadCernymiLesyPage() {
  if (!loc) notFound();
  return <LocalityLanding loc={loc} />;
}
