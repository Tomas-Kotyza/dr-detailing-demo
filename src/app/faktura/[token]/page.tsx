import type { Metadata } from "next";
import { site } from "@/content/site";
import { InvoicePublicClient } from "@/components/InvoicePublicClient";
import "@/app/admin/admin.css";

export const metadata: Metadata = {
  title: `Faktura | ${site.brandName}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function FakturaPage({ params }: Props) {
  const { token } = await params;
  return <InvoicePublicClient token={token} />;
}
