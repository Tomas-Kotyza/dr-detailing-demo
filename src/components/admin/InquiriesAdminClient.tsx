"use client";

import { useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import type { InquiryItem } from "@/lib/cms/inquiries";

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("cs-CZ", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("cs-CZ").format(n);
}

export default function InquiriesAdminClient() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/inquiries", { credentials: "same-origin" });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { items?: InquiryItem[] };
    setItems(data.items || []);
    setError("");
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function setStatus(id: string, status: "new" | "done") {
    setError("");
    const res = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Úprava selhala"));
      return;
    }
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Smazat poptávku?")) return;
    setError("");
    const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    await load();
  }

  const neu = items.filter((i) => i.status === "new").length;

  return (
    <div>
      <div className="admin-card">
        <h1>Poptávky</h1>
        <p className="admin-muted">
          Z webu (formulář Domluvte si termín). Uloží se sem. Když je nastavené SMTP
          vlastní schránky, přijde i e-mail majiteli. Nové: {neu}
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {loading ? <p className="admin-muted">Načítám…</p> : null}
      </div>

      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.id}>
            <strong>
              {item.name}
              {item.status === "new" ? " · nová" : " · vyřízeno"}
            </strong>
            <p className="admin-muted">{formatWhen(item.createdAt)}</p>
            <p>
              <a href={`tel:${item.phone}`}>{item.phone}</a>
              {" · "}
              {item.vehicle} · {item.packName}
              {item.packPrice != null ? ` · od ${formatPrice(item.packPrice)} Kč` : ""}
            </p>
            <div className="admin-actions">
              <a className="admin-btn" href={`tel:${item.phone}`}>
                Zavolat
              </a>
              {item.status === "new" ? (
                <button
                  className="admin-btn secondary"
                  type="button"
                  onClick={() => void setStatus(item.id, "done")}
                >
                  Označit vyřízeno
                </button>
              ) : (
                <button
                  className="admin-btn secondary"
                  type="button"
                  onClick={() => void setStatus(item.id, "new")}
                >
                  Znovu jako nová
                </button>
              )}
              <button
                className="admin-btn danger"
                type="button"
                onClick={() => void remove(item.id)}
              >
                Smazat
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && items.length === 0 ? (
        <p className="admin-muted">Zatím žádné poptávky.</p>
      ) : null}
    </div>
  );
}
