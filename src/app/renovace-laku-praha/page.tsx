import { getServiceBySlug } from "@/content/services";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";

const slug = "renovace-laku-praha";
const svc = getServiceBySlug(slug)!;

export const metadata = serviceMetadata(svc);

export default function RenovaceLakuPrahaPage() {
  return <ServiceLanding svc={svc} />;
}
