import { NextResponse } from "next/server";
import { badRequest } from "@/lib/admin/api";
import {
  getHandoverByToken,
  signHandoverByToken,
} from "@/lib/cms/handovers";

type Ctx = { params: Promise<{ token: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { token } = await ctx.params;
  const item = await getHandoverByToken(token);
  if (!item) {
    return NextResponse.json({ error: "Odkaz není platný." }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function POST(request: Request, ctx: Ctx) {
  const { token } = await ctx.params;
  const body = (await request.json().catch(() => null)) as {
    customerSignature?: string;
  } | null;
  if (!body?.customerSignature) return badRequest("Chybí podpis.");

  try {
    const item = await signHandoverByToken(token, body.customerSignature);
    return NextResponse.json({ item });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : "Podpis selhal");
  }
}
