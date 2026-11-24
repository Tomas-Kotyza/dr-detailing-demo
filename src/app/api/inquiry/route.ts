import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/content/site";
import { addInquiry } from "@/lib/cms/inquiries";
import { notifyOwnerNewInquiry } from "@/lib/mail/notify";

export const runtime = "nodejs";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Vyplňte jméno.").max(120),
  phone: z.string().trim().min(9, "Vyplňte telefon.").max(40),
  vehicle: z.string().trim().min(1).max(80),
  packName: z.string().trim().min(1).max(120),
  packPrice: z.number().finite().nonnegative().optional(),
  acceptTerms: z.literal(true, { error: "Je potřeba souhlas s podmínkami." }),
  acceptPrivacy: z.literal(true, { error: "Je potřeba souhlas se zpracováním údajů." }),
  /** Honeypot — boti vyplní, lidé ne. */
  company: z.string().max(200).optional().default(""),
});

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Neplatná poptávka.";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const data = parsed.data;
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  try {
    const item = await addInquiry({
      name: data.name,
      phone: data.phone,
      vehicle: data.vehicle,
      packName: data.packName,
      packPrice: data.packPrice,
    });

    // E-mail majiteli je doplněk — když SMTP selže, poptávka v adminu zůstane.
    try {
      await notifyOwnerNewInquiry(item);
    } catch (mailErr) {
      console.error("Inquiry notify email failed:", mailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inquiry save failed:", err);
    return NextResponse.json(
      {
        error:
          (err instanceof Error ? err.message : null) ||
          `Poptávku se nepodařilo uložit. Zavolejte prosím na ${site.phoneDisplay}.`,
      },
      { status: 502 },
    );
  }
}
