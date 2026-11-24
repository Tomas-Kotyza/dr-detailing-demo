import { getServiceBySlug } from "@/content/services";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";

const slug = "lesteni-laku-praha";
const svc = getServiceBySlug(slug)!;

export const metadata = serviceMetadata(svc);

export default function LesteniLakuPrahaPage() {
  return <ServiceLanding svc={svc} />;
}
