import { getServiceBySlug } from "@/content/services";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";

const slug = "keramicka-ochrana-praha";
const svc = getServiceBySlug(slug)!;

export const metadata = serviceMetadata(svc);

export default function KeramickaOchranaPrahaPage() {
  return <ServiceLanding svc={svc} />;
}
