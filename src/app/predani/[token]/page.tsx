import type { Metadata } from "next";
import { site } from "@/content/site";
import { HandoverPublicClient } from "@/components/HandoverPublicClient";

export const metadata: Metadata = {
  title: `Předávací list | ${site.brandName}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function PredaniPage({ params }: Props) {
  const { token } = await params;
  return <HandoverPublicClient token={token} />;
}
