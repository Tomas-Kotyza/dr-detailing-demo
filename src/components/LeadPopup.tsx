"use client";

import { FormEvent, useEffect, useState } from "react";
import type { LeadPopupConfig } from "@/lib/cms/types";

export function LeadPopup({
  config,
  forceOpen = false,
  preview = false,
  onClose,
}: {
  config: LeadPopupConfig;
  /** Pro admin náhled — rovnou otevřené */
  forceOpen?: boolean;
  preview?: boolean;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(forceOpen);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [accept, setAccept] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (forceOpen || preview) {
      setOpen(true);
      return;
    }
    const key = "drdetailing-lead-popup-dismissed";
    try {
      if (sessionStorage.getItem(key) === "1") return;
    } catch {
      /* ignore */
    }

    const delay = Math.max(5, config.delaySeconds || 20) * 1000;
    const t = window.setTimeout(() => setOpen(true), delay);

    function onLeave(e: MouseEvent) {
      if (e.clientY > 12) return;
      setOpen(true);
    }
    document.addEventListener("mouseout", onLeave);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [config.delaySeconds, forceOpen, preview]);

  function dismiss() {
    setOpen(false);
    onClose?.();
    if (preview) return;
    try {
      sessionStorage.setItem("drdetailing-lead-popup-dismissed", "1");
    } catch {
      /* ignore */
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (preview) {
      setDone(true);
      return;
    }
    if (!accept || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          source: "lead-popup",
          company,
          acceptMarketing: true,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "Odeslání selhalo.");
        setSending(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Síťová chyba — zkuste to znovu.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="lead-popup-root" role="dialog" aria-modal="true" aria-label={config.title}>
      <button type="button" className="lead-popup-backdrop" aria-label="Zavřít" onClick={dismiss} />
      <div className="lead-popup-card">
        {preview ? <p className="lead-popup-preview-tag">Náhled — není naživo</p> : null}
        {done ? (
          <>
            <h2 className="font-display text-2xl font-bold">Díky</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Máme vás v seznamu. Slevový tip a ebook pošleme / ukážeme podle
              nastavení studia.
            </p>
            <button type="button" className="btn-primary mt-6" onClick={dismiss}>
              Zavřít
            </button>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold">{config.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{config.body}</p>
            <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
              {config.discountLabel}
            </p>
            <form className="lead-popup-form mt-5" onSubmit={(e) => void onSubmit(e)}>
              <label>
                Jméno
                <input required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                E-mail
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="order-hp" aria-hidden="true">
                Firma
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
              <label className="lead-popup-consent">
                <input
                  type="checkbox"
                  checked={accept}
                  onChange={(e) => setAccept(e.target.checked)}
                  required={!preview}
                />
                <span>
                  Souhlasím se zasíláním tipů a obchodních sdělení (newsletter).
                </span>
              </label>
              {error ? <p className="order-form-error">{error}</p> : null}
              <div className="lead-popup-actions">
                <button type="button" className="btn-secondary" onClick={dismiss}>
                  Teď ne
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sending || (!preview && !accept)}
                >
                  {sending ? "Odesílám…" : config.buttonLabel}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
