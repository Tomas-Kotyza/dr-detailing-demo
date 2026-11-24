"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AboutContent } from "@/lib/content/types";

export default function AboutAdminClient() {
  const [title, setTitle] = useState("O mně");
  const [subtitle, setSubtitle] = useState("");
  const [paragraphsText, setParagraphsText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/about");
      const data = (await res.json()) as { item?: AboutContent; error?: string };
      if (!res.ok) {
        setError(data.error || "Načtení selhalo");
        return;
      }
      if (data.item) {
        setTitle(data.item.title);
        setSubtitle(data.item.subtitle);
        setParagraphsText(data.item.paragraphs.join("\n\n"));
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk(false);
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subtitle, paragraphsText }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Uložení selhalo");
      return;
    }
    setOk(true);
  }

  return (
    <div className="admin-card">
      <h1>O mně</h1>
      <p className="admin-muted">Odstavce oddělte prázdným řádkem.</p>
      <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
        <label>
          Nadpis
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Podtitulek
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
        <label>
          Text
          <textarea
            style={{ minHeight: "14rem" }}
            value={paragraphsText}
            onChange={(e) => setParagraphsText(e.target.value)}
            required
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        {ok ? <p className="admin-muted">Uloženo.</p> : null}
        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={saving}>
            {saving ? "Ukládám…" : "Uložit"}
          </button>
        </div>
      </form>
    </div>
  );
}
