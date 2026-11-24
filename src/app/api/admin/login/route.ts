import { NextResponse } from "next/server";
import {
  adminAuthConfigured,
  checkAdminCredentials,
  getAdminSession,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  if (!adminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD není nastavené. Na Vercelu doplňte ADMIN_USERNAME + ADMIN_PASSWORD (žádná registrace jinde).",
      },
      { status: 503 },
    );
  }

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Špatné jméno nebo heslo." }, { status: 401 });
  }

  const session = await getAdminSession();
  session.isAdmin = true;
  session.username = username;
  await session.save();

  return NextResponse.json({ ok: true });
}
