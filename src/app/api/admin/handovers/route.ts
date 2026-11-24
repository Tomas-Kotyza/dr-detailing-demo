import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { badRequest, unauthorized } from "@/lib/admin/api";
import {
  createHandover,
  deleteHandover,
  emptyHandoverDraft,
  getHandoverById,
  listHandovers,
  markHandoverAwaiting,
  publicHandoverUrl,
  updateHandover,
  type HandoverProtocol,
} from "@/lib/cms/handovers";
import { sendHandoverLinkEmail } from "@/lib/mail/notify";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  return NextResponse.json({ items: await listHandovers() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }

  const body = (await request.json().catch(() => null)) as
    | (Partial<HandoverProtocol> & { action?: string; id?: string })
    | null;

  if (body?.action === "sendEmail") {
    if (!body.id) return badRequest("Chybí id listu.");
    const item = await getHandoverById(body.id);
    if (!item) return badRequest("List nenalezen.");
    try {
      await markHandoverAwaiting(item.id);
      await sendHandoverLinkEmail({
        to: item.customerEmail,
        customerName: item.customerName,
        publicUrl: publicHandoverUrl(item.token),
        vehicleLabel: [item.vehicleBrand, item.vehicleModel, item.vehiclePlate]
          .filter(Boolean)
          .join(" "),
      });
      return NextResponse.json({
        ok: true,
        item: await getHandoverById(item.id),
        publicUrl: publicHandoverUrl(item.token),
      });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Odeslání selhalo");
    }
  }

  if (body?.action === "markAwaiting") {
    if (!body.id) return badRequest("Chybí id listu.");
    try {
      const item = await markHandoverAwaiting(body.id);
      return NextResponse.json({
        item,
        publicUrl: publicHandoverUrl(item.token),
      });
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "Uložení selhalo");
    }
  }

  try {
    const draft = emptyHandoverDraft();
    const item = await createHandover({
      ...draft,
      handoverDate: body?.handoverDate || draft.handoverDate,
      customerName: body?.customerName || "",
      customerPhone: body?.customerPhone || "",
      customerEmail: body?.customerEmail || "",
      vehicleBrand: body?.vehicleBrand || "",
      vehicleModel: body?.vehicleModel || "",
      vehiclePlate: body?.vehiclePlate || "",
      vehicleColor: body?.vehicleColor || "",
      vehicleMileage: body?.vehicleMileage || "",
      services: Array.isArray(body?.services) ? body!.services : [],
      servicesNote: body?.servicesNote || "",
      conditionNotes: body?.conditionNotes || "",
      reservations: body?.reservations || "",
      technicianSignature: body?.technicianSignature ?? null,
      customerSignature: body?.customerSignature ?? null,
      customerSignedAt: body?.customerSignedAt ?? null,
    });
    return NextResponse.json({
      item,
      publicUrl: publicHandoverUrl(item.token),
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
    | (Partial<HandoverProtocol> & { id?: string })
    | null;
  if (!body?.id) return badRequest("Chybí id listu.");

  try {
    const item = await updateHandover(body.id, body);
    return NextResponse.json({
      item,
      publicUrl: publicHandoverUrl(item.token),
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

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return badRequest("Chybí id listu.");
  const ok = await deleteHandover(body.id);
  if (!ok) return badRequest("List nenalezen.");
  return NextResponse.json({ ok: true });
}
