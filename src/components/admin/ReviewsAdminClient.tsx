"use client";

import { FormEvent, useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import type { ReviewItem } from "@/lib/content/types";

type Draft = {
  dbId?: number;
  key?: string;
  role: string;
  name: string;
  car: string;
  text: string;
  sortOrder: number;
  published: boolean;
};

const empty: Draft = {
  role: "customer",
  name: "",
  car: "",
  text: "",
  sortOrder: 0,
  published: true,
};

function isEdit(draft: Draft) {
  return draft.dbId != null || Boolean(draft.key);
}

export default function ReviewsAdminClient() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/reviews", { credentials: "same-origin" });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const data = (await res.json()) as { items?: ReviewItem[] };
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(item: ReviewItem) {
    setDraft({
      dbId: item.dbId,
      key: item.id,
      role: item.role,
      name: item.name,
      car: item.car,
      text: item.text,
      sortOrder: item.sortOrder ?? 0,
      published: item.published !== false,
    });
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/reviews", {
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

  async function remove(item: ReviewItem) {
    const id = item.dbId ?? item.id;
    if (!id || !confirm("Smazat recenzi?")) return;
    setError("");
    const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(String(id))}`, {
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
        <h1>Recenze</h1>
        <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Typ
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            >
              <option value="customer">Zákazník</option>
              <option value="owner">Majitel</option>
            </select>
          </label>
          <label>
            Jméno
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              required
            />
          </label>
          <label>
            Auto / popis
            <input
              value={draft.car}
              onChange={(e) => setDraft({ ...draft, car: e.target.value })}
            />
          </label>
          <label>
            Text
            <textarea
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              required
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
              {isEdit(draft) ? "Uložit změny" : "Přidat"}
            </button>
            {isEdit(draft) ? (
              <button
                className="admin-btn secondary"
                type="button"
                onClick={() => setDraft(empty)}
              >
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
              {item.name} · {item.role}
            </strong>
            <p className="admin-muted">{item.car}</p>
            <p>{item.text}</p>
            <div className="admin-actions">
              <button className="admin-btn secondary" type="button" onClick={() => edit(item)}>
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
