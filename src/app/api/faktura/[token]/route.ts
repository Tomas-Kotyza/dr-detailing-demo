import { NextResponse } from "next/server";
import {
  getInvoiceByToken,
  getInvoiceSettings,
} from "@/lib/cms/invoices";

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

  const settings = await getInvoiceSettings();
  return NextResponse.json({
    item,
    settings: {
      bankAccount: settings.bankAccount,
      bankCode: settings.bankCode,
      iban: settings.iban,
    },
  });
}
