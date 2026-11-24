/** Společné parsování chyb z admin API (JSON i HTML fallback). */
export async function readAdminError(res: Response, fallback: string) {
  const text = await res.text().catch(() => "");
  if (!text) return `${fallback} (HTTP ${res.status})`;
  try {
    const data = JSON.parse(text) as { error?: string };
    if (data?.error) return data.error;
  } catch {
    /* HTML / jiné */
  }
  if (text.includes("Buderus") || text.includes("Schaltbild")) {
    return "Otevřel se cizí dokument (není z adminu). Zavřete ho a zkuste Uložit znovu v prohlížeči na drdetailing.cz/admin.";
  }
  const snippet = text.replace(/\s+/g, " ").slice(0, 120);
  return `${fallback} (HTTP ${res.status}: ${snippet})`;
}
