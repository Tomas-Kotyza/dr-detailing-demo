"use client";

import { FormEvent, useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import type { PriceItem } from "@/lib/content/types";

type Draft = {
  dbId?: number;
  key?: string;
  name: string;
  meta: string;
  price: string;
  summary: string;
  includesText: string;
  sortOrder: number;
  published: boolean;
};

const empty: Draft = {
  name: "",
  meta: "",
  price: "",
  summary: "",
  includesText: "",
  sortOrder: 0,
  published: true,
};

function isEdit(draft: Draft) {
  return draft.dbId != null || Boolean(draft.key);
}

export default function PricesAdminClient() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/prices", { credentials: "same-origin" });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const data = (await res.json()) as { items?: PriceItem[] };
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/prices", {
      method: isEdit(draft) ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        ...draft,
        id: draft.key,
        dbId: draft.dbId,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(await readAdminError(res, "Uložení selhalo"));
      return;
    }
    setDraft(empty);
    await load();
  }

  async function remove(item: PriceItem) {
    const id = item.dbId ?? item.id;
    if (!id || !confirm("Smazat položku?")) return;
    setError("");
    const res = await fetch(`/api/admin/prices?id=${encodeURIComponent(String(id))}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    await load();
  }

  return (
    <div>
      <div className="admin-card">
        <h1>Ceník</h1>
        <p className="admin-muted">Co obsahuje: jeden řádek = jedna odrážka.</p>
        <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Název
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              required
            />
          </label>
          <label>
            Meta (např. doba)
            <input
              value={draft.meta}
              onChange={(e) => setDraft({ ...draft, meta: e.target.value })}
            />
          </label>
          <label>
            Cena
            <input
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              required
            />
          </label>
          <label>
            Shrnutí
            <textarea
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </label>
          <label>
            Co obsahuje
            <textarea
              value={draft.includesText}
              onChange={(e) => setDraft({ ...draft, includesText: e.target.value })}
            />
          </label>
          <label>
            Pořadí
            <input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
            />
          </label>
          <label>
            <span>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />{" "}
              Publikováno
            </span>
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <div className="admin-actions">
            <button className="admin-btn" type="submit" disabled={saving}>
              {isEdit(draft) ? "Uložit" : "Přidat"}
            </button>
            {isEdit(draft) ? (
              <button className="admin-btn secondary" type="button" onClick={() => setDraft(empty)}>
                Nová
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.dbId ?? item.id}>
            <strong>
              {item.name} — {item.price}
            </strong>
            <p className="admin-muted">{item.summary}</p>
            <div className="admin-actions">
              <button
                className="admin-btn secondary"
                type="button"
                onClick={() => {
                  setDraft({
                    dbId: item.dbId,
                    key: item.id,
                    name: item.name,
                    meta: item.meta,
                    price: item.price,
                    summary: item.summary,
                    includesText: item.includes.join("\n"),
                    sortOrder: item.sortOrder ?? 0,
                    published: item.published !== false,
                  });
                  setError("");
                }}
              >
                Upravit
              </button>
              <button
                className="admin-btn danger"
                type="button"
                onClick={() => void remove(item)}
              >
                Smazat
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
