"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import type { HandoverProtocol } from "@/lib/cms/handovers-types";
import { SignaturePad } from "@/components/SignaturePad";

export function HandoverPublicClient({ token }: { token: string }) {
  const [item, setItem] = useState<HandoverProtocol | null>(null);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetch(`/api/handovers/${encodeURIComponent(token)}`);
      setLoading(false);
      if (!res.ok) {
        setError("Odkaz není platný nebo list už neexistuje.");
        return;
      }
      const json = (await res.json()) as { item: HandoverProtocol };
      setItem(json.item);
      setSignature(json.item.customerSignature);
    })();
  }, [token]);

  async function submitSign() {
    if (!signature) {
      setError("Nejdřív se prosím podepište.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/handovers/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerSignature: signature }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error || "Podpis se nepodařil uložit.");
        return;
      }
      const json = (await res.json()) as { item: HandoverProtocol };
      setItem(json.item);
      setFlash("Děkujeme, podpis je uložený.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="handover-public">
        <p>Načítám předávací list…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="handover-public">
        <p>{error || "List nenalezen."}</p>
        <p>
          <Link href="/">← Zpět na web</Link>
        </p>
      </div>
    );
  }

  const alreadySigned = item.status === "signed" && item.customerSignature;

  return (
    <div className="handover-public">
      <div className="handover-sheet">
        <header className="handover-sheet-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.svg"
            alt={site.brandName}
            className="handover-logo"
          />
          <div>
            <h1>Předávací list vozidla</h1>
            <p>
              {site.brandName} · {site.phoneDisplay}
              <br />
              {site.address}
            </p>
          </div>
        </header>

        <dl className="handover-readonly">
          <div>
            <dt>Datum</dt>
            <dd>{item.handoverDate || "—"}</dd>
          </div>
          <div>
            <dt>Zákazník</dt>
            <dd>{item.customerName || "—"}</dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{item.customerPhone || "—"}</dd>
          </div>
          <div>
            <dt>Vozidlo</dt>
            <dd>
              {[item.vehicleBrand, item.vehicleModel].filter(Boolean).join(" ") ||
                "—"}
              {item.vehiclePlate ? ` · ${item.vehiclePlate}` : ""}
              {item.vehicleColor ? ` · ${item.vehicleColor}` : ""}
              {item.vehicleMileage ? ` · ${item.vehicleMileage} km` : ""}
            </dd>
          </div>
          <div>
            <dt>Služby</dt>
            <dd>
              {item.services.length ? item.services.join(", ") : "—"}
              {item.servicesNote ? ` — ${item.servicesNote}` : ""}
            </dd>
          </div>
          <div>
            <dt>Stav při odevzdání</dt>
            <dd>{item.conditionNotes || "—"}</dd>
          </div>
          <div>
            <dt>Výhrady / dohody</dt>
            <dd>{item.reservations || "—"}</dd>
          </div>
        </dl>

        {item.technicianSignature ? (
          <div className="handover-sign-view">
            <p>Podpis technika</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.technicianSignature} alt="Podpis technika" />
          </div>
        ) : null}

        {alreadySigned ? (
          <div className="handover-sign-view">
            <p>Váš podpis</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.customerSignature!} alt="Podpis zákazníka" />
            {item.customerSignedAt ? (
              <p className="handover-muted">
                Podepsáno {new Date(item.customerSignedAt).toLocaleString("cs-CZ")}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="handover-public-sign">
            <SignaturePad
              label="Váš podpis"
              value={signature}
              onChange={setSignature}
            />
            {error ? <p className="handover-error">{error}</p> : null}
            {flash ? <p className="handover-muted">{flash}</p> : null}
            <button
              type="button"
              className="handover-btn"
              disabled={saving}
              onClick={() => void submitSign()}
            >
              {saving ? "Ukládám…" : "Potvrdit a podepsat"}
            </button>
          </div>
        )}

        {flash && alreadySigned ? (
          <p className="handover-muted">{flash}</p>
        ) : null}

        <p className="handover-legal">
          Předáním vozidla potvrzujete převzetí a souhlasíte s uvedenými údaji.
        </p>
        <p>
          <button type="button" className="handover-btn-secondary" onClick={() => window.print()}>
            Tisknout
          </button>
        </p>
      </div>
    </div>
  );
}
