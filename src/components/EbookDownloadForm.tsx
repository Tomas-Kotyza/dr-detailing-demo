"use client";

import { FormEvent, useState } from "react";

/** Lehký záchyt e-mailu u ebooku — stejný newsletter store. */
export function EbookDownloadForm({ preview = false }: { preview?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accept, setAccept] = useState(false);
  const [company, setCompany] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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
          source: "ebook",
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
      setError("Síťová chyba.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <p className="ebook-thanks mt-6" role="status">
        Díky — jste v seznamu. Níže je celý průvodce (vhodný i k tisku / Ctrl+P).
      </p>
    );
  }

  return (
    <form className="ebook-gate mt-6" onSubmit={(e) => void onSubmit(e)}>
      {preview ? <p className="lead-popup-preview-tag">Náhled formuláře</p> : null}
      <p className="text-sm text-[var(--muted)]">
        Nechte e-mail — dostanete se na seznam tipů (newsletter). Obsah ebooku je
        hned pod formulářem.
      </p>
      <div className="ebook-gate-grid mt-4">
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
      </div>
      <label className="order-hp" aria-hidden="true">
        Firma
        <input
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>
      <label className="lead-popup-consent mt-3">
        <input
          type="checkbox"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          required={!preview}
        />
        <span>Souhlasím se zasíláním tipů a obchodních sdělení.</span>
      </label>
      {error ? <p className="order-form-error mt-2">{error}</p> : null}
      <button
        type="submit"
        className="btn-primary mt-4"
        disabled={sending || (!preview && !accept)}
      >
        {sending ? "Odesílám…" : "Odemknout ebook"}
      </button>
    </form>
  );
}