import { getServiceBySlug } from "@/content/services";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";

const slug = "cisteni-interieru-praha";
const svc = getServiceBySlug(slug)!;

export const metadata = serviceMetadata(svc);

export default function CisteniInterieruPrahaPage() {
  return <ServiceLanding svc={svc} />;
}
