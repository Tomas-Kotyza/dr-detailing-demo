import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isAdmin?: boolean;
  username?: string;
};

function sessionSecret() {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit && explicit.length >= 32) return explicit;
  // Odvozené z hesla — stačí nastavit jméno + heslo (jako TechnikGO)
  const pass = process.env.ADMIN_PASSWORD?.trim() || "dev-password";
  return `${pass}::dr-detailing-admin-session-key!!`.slice(0, 64).padEnd(32, "x");
}

export function getSessionOptions(): SessionOptions {
  return {
    password: sessionSecret(),
    cookieName: "dr_admin_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 dní
    },
  };
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), getSessionOptions());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/** Výchozí jméno admin, pokud není ADMIN_USERNAME. */
export function expectedAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

export function checkAdminCredentials(username: string, password: string) {
  const expectedUser = expectedAdminUsername();
  const expectedPass = process.env.ADMIN_PASSWORD?.trim();
  if (!expectedPass) return false;
  if (username.trim().toLowerCase() !== expectedUser.toLowerCase()) return false;
  // Kraje oříznout; navíc přijmout heslo bez mezer, pokud env má mezery (nebo naopak)
  const entered = password.trim();
  if (entered === expectedPass) return true;
  const collapse = (s: string) => s.replace(/\s+/g, "");
  return collapse(entered) === collapse(expectedPass);
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}
