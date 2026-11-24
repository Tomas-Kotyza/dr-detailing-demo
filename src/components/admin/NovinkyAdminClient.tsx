"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SeasonCampaign, SeasonId } from "@/content/seasons";
import type { NovinkyState } from "@/lib/cms/types";
import type { NewsletterSubscriber } from "@/lib/cms/newsletter";
import { LeadPopup } from "@/components/LeadPopup";
import { EbookDownloadForm } from "@/components/EbookDownloadForm";

type SeasonAdmin = {
  active: SeasonId;
  campaigns: SeasonCampaign[];
};

export default function NovinkyAdminClient() {
  const [novinky, setNovinky] = useState<NovinkyState | null>(null);
  const [season, setSeason] = useState<SeasonAdmin | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPopupPreview, setShowPopupPreview] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/novinky", { credentials: "same-origin" });
    const data = (await res.json()) as {
      novinky?: NovinkyState;
      season?: SeasonAdmin;
      subscribers?: NewsletterSubscriber[];
      error?: string;
    };
    if (!res.ok) {
      setError(data.error || "Načtení selhalo");
      return;
    }
    setNovinky(data.novinky ?? null);
    setSeason(data.season ?? null);
    setSubscribers(data.subscribers ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(patch: Partial<NovinkyState>) {
    if (!novinky) return;
    setSaving(true);
    setError("");
    setFlash("");
    const payload = { ...novinky, ...patch };
    const res = await fetch("/api/admin/novinky", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Uložení selhalo");
      return;
    }
    const data = (await res.json()) as { novinky: NovinkyState };
    setNovinky(data.novinky);
    setFlash("Uloženo.");
  }

  async function onSaveTexts(e: FormEvent) {
    e.preventDefault();
    if (!novinky) return;
    await save(novinky);
  }

  if (!novinky || !season) {
    return (
      <div className="admin-card">
        <p className="admin-muted">{error || "Načítám novinky…"}</p>
      </div>
    );
  }

  const activeSeason =
    season.campaigns.find((c) => c.id === season.active) ?? season.campaigns[0];

  return (
    <div>
      <div className="admin-card">
        <h1>Novinky — náhled</h1>
        <p className="admin-muted">
          Ahoj Patriku — tady máš ukázku připravených věcí (sezónní texty, popup
          se slevou, ebook). Na veřejný web to zatím nejde; spustíme to spolu
          osobně, až ti to bude sedět.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
      </div>

      <section className="admin-card">
        <div className="novinky-head">
          <h2>1. Sezónní věty</h2>
          <span className="novinky-badge wait">Jen ukázka</span>
        </div>
        <p className="admin-muted">
          Aktivní sezóna teď: <strong>{activeSeason?.label}</strong> (přepneš v{" "}
          <a href="/admin/sezona">Sezóna</a>). Níže všechny čtyři texty — takhle
          budou u objednávky, až je spustíme.
        </p>

        <div className="novinky-season-grid">
          {season.campaigns.map((c) => (
            <article
              key={c.id}
              className={`novinky-season-card${c.id === season.active ? " active" : ""}`}
            >
              <p className="order-promo-badge">{c.badge}</p>
              <p className="order-promo-title">{c.title}</p>
              <p className="order-promo-line">{c.body}</p>
              {c.id === season.active ? (
                <p className="novinky-mini">← právě zvolená sezóna</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="novinky-head">
          <h2>2. Popup — sleva + newsletter</h2>
          <span className="novinky-badge wait">Jen ukázka</span>
        </div>
        <p className="admin-muted">
          Až to spustíme, vyskakuje na homepage (cca po{" "}
          {novinky.leadPopup.delaySeconds} s nebo při odchodu myší nahoru).
          Kontakty ti přistanou do seznamu níže — bez cizí mail služby.
        </p>

        <form className="admin-form" onSubmit={(e) => void onSaveTexts(e)}>
          <label>
            Titulek
            <input
              value={novinky.leadPopup.title}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  leadPopup: { ...novinky.leadPopup, title: e.target.value },
                })
              }
            />
          </label>
          <label>
            Text
            <textarea
              rows={3}
              value={novinky.leadPopup.body}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  leadPopup: { ...novinky.leadPopup, body: e.target.value },
                })
              }
            />
          </label>
          <label>
            Řádek ke slevě
            <input
              value={novinky.leadPopup.discountLabel}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  leadPopup: {
                    ...novinky.leadPopup,
                    discountLabel: e.target.value,
                  },
                })
              }
            />
          </label>
          <label>
            Tlačítko
            <input
              value={novinky.leadPopup.buttonLabel}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  leadPopup: {
                    ...novinky.leadPopup,
                    buttonLabel: e.target.value,
                  },
                })
              }
            />
          </label>
          <label>
            Zpoždění (sekundy)
            <input
              type="number"
              min={5}
              value={novinky.leadPopup.delaySeconds}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  leadPopup: {
                    ...novinky.leadPopup,
                    delaySeconds: Number(e.target.value) || 20,
                  },
                })
              }
            />
          </label>
          <div className="admin-actions">
            <button type="submit" className="admin-btn secondary" disabled={saving}>
              Uložit texty popup
            </button>
            <button
              type="button"
              className="admin-btn secondary"
              onClick={() => setShowPopupPreview(true)}
            >
              Ukázat náhled popup
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card">
        <div className="novinky-head">
          <h2>3. Ebook — péče o lak a auto</h2>
          <span className="novinky-badge wait">Jen ukázka</span>
        </div>
        <p className="admin-muted">
          Až to spustíme, bude na <code>/ebook/pece-o-auto</code>. Hodí se k
          tisku (Ctrl+P) a k rozesílání lidem ze seznamu níže.
        </p>

        <div className="novinky-ebook-preview">
          <p className="svc-label">Ebook zdarma</p>
          <h3 className="font-display text-2xl font-bold">{novinky.ebook.title}</h3>
          <p className="admin-muted">{novinky.ebook.subtitle}</p>
          <EbookDownloadForm preview />
          {novinky.ebook.chapters.map((ch) => (
            <div key={ch.heading} className="novinky-ebook-ch">
              <strong>{ch.heading}</strong>
              {ch.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          ))}
        </div>

        <form className="admin-form" onSubmit={(e) => void onSaveTexts(e)}>
          <label>
            Titulek ebooku
            <input
              value={novinky.ebook.title}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  ebook: { ...novinky.ebook, title: e.target.value },
                })
              }
            />
          </label>
          <label>
            Podtitulek
            <textarea
              rows={2}
              value={novinky.ebook.subtitle}
              onChange={(e) =>
                setNovinky({
                  ...novinky,
                  ebook: { ...novinky.ebook, subtitle: e.target.value },
                })
              }
            />
          </label>
          <button type="submit" className="admin-btn secondary" disabled={saving}>
            Uložit texty ebooku
          </button>
        </form>
      </section>

      <section className="admin-card">
        <h2>Seznam e-mailů (newsletter)</h2>
        <p className="admin-muted">
          Lidé z popup / ebooku. Zatím bez automatické rozesílky — export nebo
          ruční mail, až to budeme chtít.
        </p>
        {subscribers.length === 0 ? (
          <p className="admin-muted">Zatím nikdo.</p>
        ) : (
          <ul className="novinky-subs">
            {subscribers.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> · {s.email}
                <span className="admin-muted">
                  {" "}
                  · {s.source} · {new Date(s.createdAt).toLocaleString("cs-CZ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showPopupPreview ? (
        <LeadPopup
          config={novinky.leadPopup}
          forceOpen
          preview
          onClose={() => setShowPopupPreview(false)}
        />
      ) : null}
    </div>
  );
}
