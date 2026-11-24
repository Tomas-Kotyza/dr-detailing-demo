import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, unauthorized } from "@/lib/admin/api";
import {
  createInvoice,
  deleteCustomer,
  deleteInvoice,
  getInvoiceById,
  getInvoiceSettings,
  getInvoicingState,
  publicInvoiceUrl,
  updateInvoice,
  updateInvoiceSettings,
  upsertCustomer,
  type InvoiceDraft,
  type InvoiceSettings,
  type InvoiceStatus,
} from "@/lib/cms/invoices";
import { buildInvoicePdf, invoicePdfFilename } from "@/lib/invoices/pdf";
import { sendInvoiceEmail } from "@/lib/mail/notify";
import { formatCzk, invoiceTotals } from "@/lib/cms/invoices-types";
import { site } from "@/content/site";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const download = searchParams.get("download");

  if (id && download === "pdf") {
    const item = await getInvoiceById(id);
    if (!item) return badRequest("Faktura nenalezena.");
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
      return badRequest(e instanceof Error ? e.message : "PDF se nepodařilo vytvořit");
    }
  }

  return NextResponse.json(await getInvoicingState());
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as
    | (Partial<InvoiceDraft> & {
        action?: string;
        id?: string;
        customer?: Parameters<typeof upsertCustomer>[0];
        settings?: Partial<InvoiceSettings>;
      })
    | null;

  if (body?.action === "saveCustomer") {
    try {
      const customer = await upsertCustomer(body.customer || {});
      return NextResponse.json({ customer });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení zákazníka selhalo");
    }
  }

  if (body?.action === "saveSettings") {
    try {
      const settings = await updateInvoiceSettings(body.settings || {});
      return NextResponse.json({ settings });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení nastavení selhalo");
    }
  }

  if (body?.action === "sendEmail") {
    if (!body.id) return badRequest("Chybí id faktury.");
    const item = await getInvoiceById(body.id);
    if (!item) return badRequest("Faktura nenalezena.");
    try {
      const settings = await getInvoiceSettings();
      const pdf = await buildInvoicePdf(item, settings);
      const fromBrand =
        item.template === "drdetailing" ? site.brandName : site.legalName;
      await sendInvoiceEmail({
        to: item.customer.email,
        customerName: item.customer.name,
        invoiceNumber: item.number,
        publicUrl: publicInvoiceUrl(item.token),
        amountLabel: formatCzk(invoiceTotals(item.lines).total),
        pdf,
        pdfFilename: invoicePdfFilename(item),
        fromBrand,
      });
      return NextResponse.json({
        ok: true,
        item,
        publicUrl: publicInvoiceUrl(item.token),
      });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Odeslání selhalo");
    }
  }

  try {
    const item = await createInvoice(body || {});
    return NextResponse.json({
      item,
      publicUrl: publicInvoiceUrl(item.token),
    });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Vytvoření selhalo");
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as
    | (Partial<InvoiceDraft> & {
        id?: string;
        action?: string;
        status?: InvoiceStatus;
        customer?: Parameters<typeof upsertCustomer>[0];
      })
    | null;

  if (body?.action === "saveCustomer") {
    try {
      const customer = await upsertCustomer(body.customer || {});
      return NextResponse.json({ customer });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení zákazníka selhalo");
    }
  }

  if (!body?.id) return badRequest("Chybí id faktury.");

  try {
    const item = await updateInvoice(body.id, body);
    return NextResponse.json({
      item,
      publicUrl: publicInvoiceUrl(item.token),
    });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    type?: "invoice" | "customer";
  } | null;

  if (!body?.id) return badRequest("Chybí id.");

  if (body.type === "customer") {
    const ok = await deleteCustomer(body.id);
    if (!ok) return badRequest("Zákazník nenalezen.");
    return NextResponse.json({ ok: true });
  }

  const ok = await deleteInvoice(body.id);
  if (!ok) return badRequest("Faktura nenalezena.");
  return NextResponse.json({ ok: true });
}
