import { NextResponse } from "next/server";
import {
  getInvoiceByToken,
  getInvoiceSettings,
} from "@/lib/cms/invoices";
import { buildInvoicePdf, invoicePdfFilename } from "@/lib/invoices/pdf";

type Ctx = { params: Promise<{ token: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { token } = await ctx.params;
  const item = await getInvoiceByToken(token);
  if (!item) {
    return NextResponse.json({ error: "Odkaz není platný." }, { status: 404 });
  }
  if (item.status === "draft") {
    return NextResponse.json(
      { error: "Faktura ještě není vystavená." },
      { status: 404 },
    );
  }

  try {
    const settings = await getInvoiceSettings();
    const pdf = await buildInvoicePdf(item, settings);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoicePdfFilename(item)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PDF selhalo" },
      { status: 400 },
    );
  }
}
