"use client";

import { FormEvent, useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import type { FaqItem } from "@/lib/content/types";

type Draft = {
  id?: number;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
};

const empty: Draft = { question: "", answer: "", sortOrder: 0, published: true };

export default function FaqAdminClient() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/faq", { credentials: "same-origin" });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const data = (await res.json()) as { items?: FaqItem[] };
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/faq", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!res.ok) {
      setError(await readAdminError(res, "Uložení selhalo"));
      return;
    }
    setDraft(empty);
    await load();
  }

  async function remove(id?: number) {
    if (!id || !confirm("Smazat otázku?")) return;
    setError("");
    const res = await fetch(`/api/admin/faq?id=${id}`, {
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
        <h1>FAQ</h1>
        <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Otázka
            <input
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              required
            />
          </label>
          <label>
            Odpověď
            <textarea
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
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
              {draft.id ? "Uložit" : "Přidat"}
            </button>
            {draft.id ? (
              <button className="admin-btn secondary" type="button" onClick={() => setDraft(empty)}>
                Nová
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.id ?? item.question}>
            <strong>{item.question}</strong>
            <p className="admin-muted">{item.answer}</p>
            <div className="admin-actions">
              <button
                className="admin-btn secondary"
                type="button"
                onClick={() => {
                  setDraft({
                    id: item.id,
                    question: item.question,
                    answer: item.answer,
                    sortOrder: item.sortOrder ?? 0,
                    published: item.published !== false,
                  });
                  setError("");
                }}
              >
                Upravit
              </button>
              <button className="admin-btn danger" type="button" onClick={() => void remove(item.id)}>
                Smazat
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
