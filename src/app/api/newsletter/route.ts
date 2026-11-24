import { NextResponse } from "next/server";
import { z } from "zod";
import { addNewsletterSubscriber } from "@/lib/cms/newsletter";
import { getNovinky } from "@/lib/content";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  source: z.enum(["lead-popup", "ebook", "other"]).default("lead-popup"),
  company: z.string().optional(), // honeypot
  acceptMarketing: z.literal(true),
});

export async function POST(request: Request) {
  const novinky = await getNovinky();
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vyplňte jméno, e-mail a souhlas." }, { status: 400 });
  }

  if (parsed.data.company?.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Veřejný zápis jen když je schválený popup nebo ebook
  if (
    (parsed.data.source === "lead-popup" && !novinky.leadPopupApproved) ||
    (parsed.data.source === "ebook" && !novinky.ebookApproved)
  ) {
    return NextResponse.json(
      { error: "Tato funkce zatím není na webu aktivní." },
      { status: 403 },
    );
  }

  try {
    const item = await addNewsletterSubscriber({
      name: parsed.data.name,
      email: parsed.data.email,
      source: parsed.data.source,
    });
    return NextResponse.json({ ok: true, id: item.id });
  } catch (err) {
    console.error("Newsletter save failed:", err);
    return NextResponse.json({ error: "Uložení selhalo." }, { status: 500 });
  }
}
