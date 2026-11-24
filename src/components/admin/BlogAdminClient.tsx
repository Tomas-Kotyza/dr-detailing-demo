"use client";

import { FormEvent, useEffect, useState } from "react";
import { readAdminError } from "@/lib/admin/clientError";
import type { BlogPostItem } from "@/lib/content/types";

type Draft = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  bodyText: string;
  sortOrder: number;
  published: boolean;
};

const empty: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  bodyText: "",
  sortOrder: 0,
  published: true,
};

export default function BlogAdminClient() {
  const [items, setItems] = useState<BlogPostItem[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/blog", { credentials: "same-origin" });
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const data = (await res.json()) as { items?: BlogPostItem[] };
    setItems(data.items || []);
  }

  useEffect(() => {
    void load();
  }, []);

  function edit(item: BlogPostItem) {
    setDraft({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      date: item.date,
      bodyText: item.body.join("\n\n"),
      sortOrder: item.sortOrder ?? 0,
      published: item.published !== false,
    });
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/blog", {
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
    if (!id || !confirm("Smazat článek?")) return;
    setError("");
    const res = await fetch(`/api/admin/blog?id=${id}`, {
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
        <h1>Blog</h1>
        <p className="admin-muted">Odstavce oddělte prázdným řádkem.</p>
        <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Nadpis
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              required
            />
          </label>
          <label>
            Slug (URL)
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              placeholder="automaticky z nadpisu"
            />
          </label>
          <label>
            Perex
            <textarea
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            />
          </label>
          <label>
            Datum
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </label>
          <label>
            Text článku
            <textarea
              style={{ minHeight: "12rem" }}
              value={draft.bodyText}
              onChange={(e) => setDraft({ ...draft, bodyText: e.target.value })}
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
              {draft.id ? "Uložit změny" : "Přidat článek"}
            </button>
            {draft.id ? (
              <button className="admin-btn secondary" type="button" onClick={() => setDraft(empty)}>
                Nový
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.id ?? item.slug}>
            <strong>{item.title}</strong>
            <p className="admin-muted">
              /blog/{item.slug} · {item.date}
              {item.published === false ? " · skrytý" : ""}
            </p>
            <div className="admin-actions">
              <button className="admin-btn secondary" type="button" onClick={() => edit(item)}>
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
