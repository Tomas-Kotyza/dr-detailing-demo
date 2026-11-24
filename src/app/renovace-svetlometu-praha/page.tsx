import { getServiceBySlug } from "@/content/services";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";

const slug = "renovace-svetlometu-praha";
const svc = getServiceBySlug(slug)!;

export const metadata = serviceMetadata(svc);

export default function RenovaceSvetlometuPrahaPage() {
  return <ServiceLanding svc={svc} />;
}
