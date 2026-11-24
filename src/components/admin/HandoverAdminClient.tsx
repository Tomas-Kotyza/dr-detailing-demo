"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { readAdminError } from "@/lib/admin/clientError";
import {
  HANDOVER_SERVICES,
  emptyHandoverDraft,
  type HandoverProtocol,
  type HandoverStatus,
} from "@/lib/cms/handovers-types";
import { SignaturePad } from "@/components/SignaturePad";
import { QrCodeImage } from "@/components/QrCodeImage";

function statusLabel(s: HandoverStatus) {
  if (s === "signed") return "Podepsáno";
  if (s === "awaiting_signature") return "Čeká na podpis";
  return "Koncept";
}

function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function vehicleLabel(h: Partial<HandoverProtocol>) {
  return [h.vehicleBrand, h.vehicleModel, h.vehiclePlate].filter(Boolean).join(" ");
}

export default function HandoverAdminClient() {
  const [items, setItems] = useState<HandoverProtocol[]>([]);
  const [current, setCurrent] = useState<HandoverProtocol | null>(null);
  const [draft, setDraft] = useState(emptyHandoverDraft());
  const [publicUrl, setPublicUrl] = useState("");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/handovers", { credentials: "same-origin" });
    setLoading(false);
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const json = (await res.json()) as { items: HandoverProtocol[] };
    setItems(json.items);
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  function startNew() {
    setCurrent(null);
    setDraft(emptyHandoverDraft());
    setPublicUrl("");
    setFlash("");
    setError("");
  }

  function openItem(item: HandoverProtocol) {
    setCurrent(item);
    setDraft({
      handoverDate: item.handoverDate,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerEmail: item.customerEmail,
      vehicleBrand: item.vehicleBrand,
      vehicleModel: item.vehicleModel,
      vehiclePlate: item.vehiclePlate,
      vehicleColor: item.vehicleColor,
      vehicleMileage: item.vehicleMileage,
      services: item.services,
      servicesNote: item.servicesNote,
      conditionNotes: item.conditionNotes,
      reservations: item.reservations,
      technicianSignature: item.technicianSignature,
      customerSignature: item.customerSignature,
      customerSignedAt: item.customerSignedAt,
    });
    setPublicUrl(
      `${typeof window !== "undefined" ? window.location.origin : `https://${site.domain}`}/predani/${item.token}`,
    );
    setFlash("");
    setError("");
  }

  function patchDraft<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleService(name: string) {
    setDraft((prev) => {
      const has = prev.services.includes(name);
      return {
        ...prev,
        services: has
          ? prev.services.filter((s) => s !== name)
          : [...prev.services, name],
      };
    });
  }

  async function save(): Promise<HandoverProtocol | null> {
    setSaving(true);
    setError("");
    setFlash("");
    try {
      const res = await fetch("/api/admin/handovers", {
        method: current ? "PUT" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current ? { id: current.id, ...draft } : draft),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Uložení selhalo"));
        return null;
      }
      const json = (await res.json()) as {
        item: HandoverProtocol;
        publicUrl: string;
      };
      setCurrent(json.item);
      setPublicUrl(json.publicUrl);
      setFlash("Předávací list uložen.");
      await load();
      return json.item;
    } finally {
      setSaving(false);
    }
  }

  async function sendEmail() {
    if (!draft.customerEmail.trim()) {
      setError("Vyplňte e-mail zákazníka.");
      return;
    }
    const saved = await save();
    if (!saved) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/handovers", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendEmail", id: saved.id }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Odeslání e-mailu selhalo"));
        return;
      }
      const json = (await res.json()) as {
        item: HandoverProtocol;
        publicUrl: string;
      };
      setCurrent(json.item);
      setPublicUrl(json.publicUrl);
      setFlash("E-mail se odkazem odeslán zákazníkovi.");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function prepareShare() {
    const saved = current ?? (await save());
    if (!saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/handovers", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAwaiting", id: saved.id }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Příprava odkazu selhala"));
        return;
      }
      const json = (await res.json()) as {
        item: HandoverProtocol;
        publicUrl: string;
      };
      setCurrent(json.item);
      setPublicUrl(json.publicUrl);
      setFlash("Odkaz je připravený ke sdílení.");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Smazat tento předávací list?")) return;
    const res = await fetch("/api/admin/handovers", {
      method: "DELETE",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    if (current?.id === id) startNew();
    await load();
  }

  const adminAccessUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/admin/predavaci-list`;
    }
    return `https://${site.domain}/admin/predavaci-list`;
  }, []);

  const shareText = useMemo(() => {
    const url = publicUrl || "…";
    const who = draft.customerName || "zákazníku";
    const car = vehicleLabel(draft) || "vozidlo";
    return `Dobrý den, ${who}, předávací list k ${car}: ${url}`;
  }, [publicUrl, draft]);

  const waHref = useMemo(() => {
    const digits = phoneDigits(draft.customerPhone || "");
    const q = encodeURIComponent(shareText);
    if (digits.length >= 9) {
      const intl = digits.startsWith("420") ? digits : `420${digits.replace(/^0/, "")}`;
      return `https://wa.me/${intl}?text=${q}`;
    }
    return `https://wa.me/?text=${q}`;
  }, [draft.customerPhone, shareText]);

  const smsHref = useMemo(() => {
    const digits = phoneDigits(draft.customerPhone || "");
    const body = encodeURIComponent(shareText);
    if (digits) return `sms:${digits}?&body=${body}`;
    return `sms:?&body=${body}`;
  }, [draft.customerPhone, shareText]);

  return (
    <div className="handover-admin">
      <div className="admin-card handover-screen-only">
        <h1>Předávací list</h1>
        <p className="admin-muted">
          Vyplníte údaje, podepíšete, vytisknete nebo pošlete zákazníkovi odkaz
          (WhatsApp / SMS / e-mail). Zákazník může podepsat na telefonu.
        </p>
        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
        <div className="admin-actions">
          <button type="button" className="admin-btn secondary" onClick={startNew}>
            Nový list
          </button>
          <button
            type="button"
            className="admin-btn"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? "Ukládám…" : "Uložit"}
          </button>
          <button
            type="button"
            className="admin-btn secondary"
            disabled={!current}
            onClick={() => window.print()}
          >
            Tisknout
          </button>
        </div>
      </div>

      <div className="admin-card handover-screen-only">
        <h2>Rychlý přístup z telefonu</h2>
        <p className="admin-muted">
          Admin se přihlásí jednou — přihlášení drží až 14 dní. Nemusí se
          přihlašovat pokaždé. Na telefonu: otevřete odkaz → v prohlížeči{" "}
          <strong>Přidat na plochu</strong> (iPhone: Sdílet → Na plochu; Android:
          menu ⋮ → Přidat na plochu).
        </p>
        <div className="handover-qr-row">
          <QrCodeImage
            value={adminAccessUrl}
            size={160}
            alt="QR na předávací list v adminu"
          />
          <div>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              QR pro dílnu / telefon majitele — otevře vyplňování listu.
            </p>
            <p>
              <a href={adminAccessUrl}>{adminAccessUrl}</a>
            </p>
            <button
              type="button"
              className="admin-btn secondary"
              onClick={() => {
                void navigator.clipboard.writeText(adminAccessUrl);
                setFlash("Odkaz na admin zkopírován.");
              }}
            >
              Kopírovat odkaz na admin
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card handover-screen-only">
        <h2>Uložené listy</h2>
        {loading ? <p className="admin-muted">Načítám…</p> : null}
        {!loading && items.length === 0 ? (
          <p className="admin-muted">Zatím žádný list.</p>
        ) : null}
        <ul className="handover-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="handover-list-open"
                onClick={() => openItem(item)}
              >
                <strong>
                  {item.customerName || "Bez jména"} ·{" "}
                  {vehicleLabel(item) || "bez vozidla"}
                </strong>
                <span className="admin-muted">
                  {item.handoverDate} · {statusLabel(item.status)}
                </span>
              </button>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => void removeItem(item.id)}
              >
                Smazat
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section className="handover-sheet" aria-label="Předávací list">
        <header className="handover-sheet-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt={site.brandName}
            className="handover-logo"
          />
          <div>
            <h2>Předávací list vozidla</h2>
            <p>
              {site.brandName} · {site.address}
              <br />
              {site.phoneDisplay} · {site.email}
              <br />
              IČO {site.ico} · {site.legalName}
            </p>
          </div>
        </header>

        <div className="handover-grid">
          <label>
            Datum předání
            <input
              type="date"
              value={draft.handoverDate}
              onChange={(e) => patchDraft("handoverDate", e.target.value)}
            />
          </label>
          <label>
            Jméno zákazníka
            <input
              value={draft.customerName}
              onChange={(e) => patchDraft("customerName", e.target.value)}
              placeholder="Jan Novák"
            />
          </label>
          <label>
            Telefon
            <input
              value={draft.customerPhone}
              onChange={(e) => patchDraft("customerPhone", e.target.value)}
              placeholder="+420 …"
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={draft.customerEmail}
              onChange={(e) => patchDraft("customerEmail", e.target.value)}
              placeholder="email@…"
            />
          </label>
        </div>

        <h3>Vozidlo</h3>
        <div className="handover-grid">
          <label>
            Značka
            <input
              value={draft.vehicleBrand}
              onChange={(e) => patchDraft("vehicleBrand", e.target.value)}
            />
          </label>
          <label>
            Model
            <input
              value={draft.vehicleModel}
              onChange={(e) => patchDraft("vehicleModel", e.target.value)}
            />
          </label>
          <label>
            SPZ
            <input
              value={draft.vehiclePlate}
              onChange={(e) => patchDraft("vehiclePlate", e.target.value)}
            />
          </label>
          <label>
            Barva
            <input
              value={draft.vehicleColor}
              onChange={(e) => patchDraft("vehicleColor", e.target.value)}
            />
          </label>
          <label>
            Stav km
            <input
              value={draft.vehicleMileage}
              onChange={(e) => patchDraft("vehicleMileage", e.target.value)}
            />
          </label>
        </div>

        <h3>Provedené služby</h3>
        <div className="handover-checks">
          {HANDOVER_SERVICES.map((s) => (
            <label key={s} className="handover-check">
              <input
                type="checkbox"
                checked={draft.services.includes(s)}
                onChange={() => toggleService(s)}
              />
              {s}
            </label>
          ))}
        </div>
        <label>
          Poznámka ke službám
          <textarea
            rows={2}
            value={draft.servicesNote}
            onChange={(e) => patchDraft("servicesNote", e.target.value)}
          />
        </label>

        <label>
          Stav vozidla při odevzdání
          <textarea
            rows={3}
            value={draft.conditionNotes}
            onChange={(e) => patchDraft("conditionNotes", e.target.value)}
            placeholder="Čistota, viditelné poškození, stav interiéru…"
          />
        </label>
        <label>
          Výhrady / dohody
          <textarea
            rows={2}
            value={draft.reservations}
            onChange={(e) => patchDraft("reservations", e.target.value)}
          />
        </label>

        <div className="handover-signs">
          <SignaturePad
            label="Podpis technika"
            value={draft.technicianSignature}
            onChange={(v) => patchDraft("technicianSignature", v)}
          />
          <div>
            <SignaturePad
              label="Podpis zákazníka"
              value={draft.customerSignature}
              onChange={(v) => patchDraft("customerSignature", v)}
            />
            {draft.customerSignedAt ? (
              <p className="admin-muted" style={{ fontSize: "0.85rem" }}>
                Podepsáno: {new Date(draft.customerSignedAt).toLocaleString("cs-CZ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="handover-sheet-footer">
          <p className="handover-legal">
            Předáním vozidla zákazník potvrzuje převzetí a souhlasí s uvedenými
            údaji. {site.brandName}, {site.domain}.
          </p>
          {publicUrl ? (
            <div className="handover-print-qr">
              <QrCodeImage
                value={publicUrl}
                size={96}
                alt="QR pro podpis zákazníka"
              />
              <span>Naskenujte → digitální podpis</span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="admin-card handover-screen-only">
        <h2>Odeslat zákazníkovi</h2>
        <p className="admin-muted">
          Nejdřív uložte list. Pak pošlete odkaz — zákazník otevře na telefonu a
          podepíše. Nebo mu ukážete QR níže.
        </p>
        {publicUrl ? (
          <div className="handover-qr-row">
            <QrCodeImage
              value={publicUrl}
              size={160}
              alt="QR předávacího listu pro zákazníka"
            />
            <div>
              <p>
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  {publicUrl}
                </a>
              </p>
              <p className="admin-muted">
                Zákazník naskenuje → otevře list a podepíše. Bez adminu.
              </p>
            </div>
          </div>
        ) : (
          <p className="admin-muted">Po uložení se tu objeví odkaz a QR.</p>
        )}
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn secondary"
            disabled={saving}
            onClick={() => void prepareShare()}
          >
            Připravit odkaz
          </button>
          <a className="admin-btn" href={waHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="admin-btn secondary" href={smsHref}>
            SMS
          </a>
          <button
            type="button"
            className="admin-btn secondary"
            disabled={saving}
            onClick={() => void sendEmail()}
          >
            E-mail (SMTP)
          </button>
          {publicUrl ? (
            <button
              type="button"
              className="admin-btn secondary"
              onClick={() => {
                void navigator.clipboard.writeText(publicUrl);
                setFlash("Odkaz zkopírován.");
              }}
            >
              Kopírovat odkaz
            </button>
          ) : null}
        </div>
        <p className="admin-muted" style={{ marginTop: "0.75rem" }}>
          <Link href="/admin">← Zpět na přehled</Link>
        </p>
      </div>
    </div>
  );
}
