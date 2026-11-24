"use client";

import { FormEvent, useEffect, useState } from "react";
import PromoFlyerPreview from "@/components/admin/PromoFlyerPreview";
import type { PromoItem } from "@/lib/content/types";

async function copyText(label: string, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return `${label}: zkopírováno`;
  } catch {
    return `${label}: nešlo zkopírovat — označte text ručně`;
  }
}

export default function PromosAdminClient() {
  const [items, setItems] = useState<PromoItem[]>([]);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/promos");
    const data = (await res.json()) as { items?: PromoItem[]; error?: string };
    if (!res.ok) {
      setError(data.error || "Načtení selhalo");
      return;
    }
    setItems(data.items ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSave(e: FormEvent, item: PromoItem) {
    e.preventDefault();
    setSavingId(item.id);
    setError("");
    setFlash("");
    const res = await fetch("/api/admin/promos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(item),
    });
    setSavingId(null);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let message = "Uložení selhalo";
      try {
        const data = JSON.parse(text) as { error?: string };
        if (data?.error) message = data.error;
      } catch {
        if (text) message = `${message} (HTTP ${res.status})`;
      }
      setError(message);
      return;
    }
    setFlash(`Uloženo: ${item.title}`);
    await load();
  }

  function updateItem(id: string, patch: Partial<PromoItem>) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div>
      <div className="admin-card">
        <h1>Akce</h1>
        <p className="admin-muted">
          Tady si připravíš akce (texty pro Mapy, SMS, Instagram + leták). Leták
          pod poli se hned mění podle Názvu, Podtitulku, ceny a nabídky. Až
          zapneš „Aktivní“ a uložíš, na homepage vyskočí po 4&nbsp;s levý notýsek
          (křížek / Objednat / Ceník) a akce se ukáže i u objednávky.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
      </div>

      <div className="admin-promo-stack">
        {items.map((item) => (
          <form
            key={item.id}
            className="admin-card admin-promo-card admin-form"
            onSubmit={(e) => void onSave(e, item)}
          >
            <div className="admin-promo-head">
              <span className="admin-promo-badge">{item.badge}</span>
              <label className="admin-promo-active">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => updateItem(item.id, { active: e.target.checked })}
                />
                Aktivní
              </label>
            </div>

            <label>
              Název (na letáku)
              <input
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                required
              />
            </label>
            <label>
              Podtitulek (na letáku)
              <input
                value={item.subtitle}
                onChange={(e) => updateItem(item.id, { subtitle: e.target.value })}
              />
            </label>
            <label>
              Jedna věta nabídky (na letáku)
              <input
                value={item.offerLine}
                onChange={(e) => updateItem(item.id, { offerLine: e.target.value })}
              />
            </label>
            <label>
              Velká cena uprostřed letáku
              <input
                value={item.flyerPrice ?? ""}
                onChange={(e) => updateItem(item.id, { flyerPrice: e.target.value })}
                placeholder="např. 1 Kč nebo od 9 600 Kč"
              />
            </label>

            <PromoFlyerPreview
              item={item}
              saving={savingId === item.id}
            />

            <label>
              Popis akce
              <textarea
                style={{ minHeight: "8rem" }}
                value={item.body}
                onChange={(e) => updateItem(item.id, { body: e.target.value })}
              />
            </label>

            <label>
              Text pro Google Mapy / Firemní profil
              <textarea
                style={{ minHeight: "9rem" }}
                value={item.mapsText}
                onChange={(e) => updateItem(item.id, { mapsText: e.target.value })}
              />
            </label>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() =>
                  void copyText("Mapy", item.mapsText).then(setFlash)
                }
              >
                Kopírovat Mapy
              </button>
            </div>

            <label>
              SMS / WhatsApp
              <textarea
                style={{ minHeight: "5rem" }}
                value={item.smsText}
                onChange={(e) => updateItem(item.id, { smsText: e.target.value })}
              />
            </label>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => void copyText("SMS", item.smsText).then(setFlash)}
              >
                Kopírovat SMS
              </button>
            </div>

            <label>
              Instagram / Facebook
              <textarea
                style={{ minHeight: "8rem" }}
                value={item.instagramText}
                onChange={(e) =>
                  updateItem(item.id, { instagramText: e.target.value })
                }
              />
            </label>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() =>
                  void copyText("Instagram", item.instagramText).then(setFlash)
                }
              >
                Kopírovat Instagram
              </button>
              <button
                className="admin-btn"
                type="submit"
                disabled={savingId === item.id}
              >
                {savingId === item.id ? "Ukládám…" : "Uložit změny"}
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
