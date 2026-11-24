"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SeasonCampaign, SeasonId } from "@/content/seasons";

export default function SeasonAdminClient() {
  const [active, setActive] = useState<SeasonId>("autumn");
  const [campaigns, setCampaigns] = useState<SeasonCampaign[]>([]);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/season");
    const data = (await res.json()) as {
      active?: SeasonId;
      campaigns?: SeasonCampaign[];
      error?: string;
    };
    if (!res.ok) {
      setError(data.error || "Načtení selhalo");
      return;
    }
    setActive(data.active ?? "autumn");
    setCampaigns(data.campaigns ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  function updateCampaign(id: SeasonId, patch: Partial<SeasonCampaign>) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFlash("");
    const res = await fetch("/api/admin/season", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ active, campaigns }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Uložení selhalo");
      return;
    }
    setFlash("Sezóna uložena — uvidíte ji u objednávky na webu.");
    await load();
  }

  return (
    <div>
      <div className="admin-card">
        <h1>Sezónní výzva</h1>
        <p className="admin-muted">
          Čtyři roční období — tady přepneš aktivní text. Náhled všech vět máš
          v <a href="/admin/novinky">Novinky</a>. Na web to zatím nejde; spustíme
          spolu osobně.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
      </div>

      <form className="admin-card admin-form" onSubmit={(e) => void onSave(e)}>
        <p className="admin-muted" style={{ marginTop: 0 }}>
          Co je teď aktivní na webu
        </p>
        <div className="admin-actions" style={{ flexWrap: "wrap" }}>
          {campaigns.map((c) => (
            <button
              key={c.id}
              type="button"
              className={active === c.id ? "admin-btn" : "admin-btn secondary"}
              onClick={() => setActive(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {campaigns.map((c) => (
          <div
            key={c.id}
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid rgba(15, 46, 34, 0.12)",
              opacity: active === c.id ? 1 : 0.72,
            }}
          >
            <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.75rem" }}>
              {c.label}
              {active === c.id ? " · aktivní" : ""}
            </h2>
            <label>
              Štítek
              <input
                value={c.badge}
                onChange={(e) => updateCampaign(c.id, { badge: e.target.value })}
              />
            </label>
            <label>
              Titulek
              <input
                value={c.title}
                onChange={(e) => updateCampaign(c.id, { title: e.target.value })}
              />
            </label>
            <label>
              Text
              <textarea
                rows={3}
                value={c.body}
                onChange={(e) => updateCampaign(c.id, { body: e.target.value })}
              />
            </label>
            <label>
              Po kliknutí předvybrat službu (id)
              <input
                value={c.packId}
                onChange={(e) => updateCampaign(c.id, { packId: e.target.value })}
                placeholder="polish / interior / ozone…"
              />
            </label>
          </div>
        ))}

        <div className="admin-actions" style={{ marginTop: "1.5rem" }}>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? "Ukládám…" : "Uložit sezónu"}
          </button>
        </div>
      </form>
    </div>
  );
}
