"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/site";
import { readAdminError } from "@/lib/admin/clientError";
import {
  INVOICE_QUICK_ITEMS,
  INVOICE_STATUS_LABEL,
  defaultInvoiceSettings,
  emptyInvoiceDraft,
  emptyInvoiceLine,
  formatCzDate,
  formatCzk,
  invoiceLineTotal,
  invoiceTotals,
  type Invoice,
  type InvoiceCustomer,
  type InvoiceDraft,
  type InvoiceLine,
  type InvoiceSettings,
  type InvoiceStatus,
  type InvoiceTemplateId,
} from "@/lib/cms/invoices-types";

type Tab = "invoices" | "customers" | "settings";

const TEMPLATES: { id: InvoiceTemplateId; label: string; hint: string }[] = [
  {
    id: "drdetailing",
    label: "Dr Detailing",
    hint: "Značka + logo, právní jméno v dodavateli",
  },
  {
    id: "legal",
    label: site.legalName,
    hint: "Klasická faktura na jméno u IČO",
  },
];

function statusClass(status: InvoiceStatus) {
  if (status === "paid") return "invoice-status is-paid";
  if (status === "issued") return "invoice-status is-issued";
  if (status === "cancelled") return "invoice-status is-cancelled";
  return "invoice-status is-draft";
}

export default function InvoiceAdminClient() {
  const [tab, setTab] = useState<Tab>("invoices");
  const [settings, setSettings] = useState<InvoiceSettings>(defaultInvoiceSettings());
  const [customers, setCustomers] = useState<InvoiceCustomer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [current, setCurrent] = useState<Invoice | null>(null);
  const [draft, setDraft] = useState<InvoiceDraft>(emptyInvoiceDraft());
  const [editing, setEditing] = useState(false);
  const [customerForm, setCustomerForm] = useState<Partial<InvoiceCustomer> | null>(null);
  const [settingsForm, setSettingsForm] = useState<InvoiceSettings>(defaultInvoiceSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const totals = useMemo(() => invoiceTotals(draft.lines), [draft.lines]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/invoices", { credentials: "same-origin" });
    setLoading(false);
    if (!res.ok) {
      setError(await readAdminError(res, "Načtení selhalo"));
      return;
    }
    const json = (await res.json()) as {
      settings: InvoiceSettings;
      customers: InvoiceCustomer[];
      invoices: Invoice[];
    };
    setSettings(json.settings);
    setSettingsForm(json.settings);
    setCustomers(json.customers);
    setInvoices(json.invoices);
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  function invoicePublicUrl(item: Invoice) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : `https://${site.domain}`;
    return `${origin}/faktura/${item.token}`;
  }

  function startNew() {
    setCurrent(null);
    setDraft(emptyInvoiceDraft(settings));
    setEditing(true);
    setTab("invoices");
    setPublicUrl("");
    setFlash("");
    setError("");
  }

  function openInvoice(item: Invoice) {
    setCurrent(item);
    setDraft({
      template: item.template,
      status: item.status,
      customerId: item.customerId,
      customer: { ...item.customer },
      issueDate: item.issueDate,
      taxableDate: item.taxableDate,
      dueDate: item.dueDate,
      paymentMethod: item.paymentMethod,
      lines: item.lines.length ? item.lines.map((l) => ({ ...l })) : [emptyInvoiceLine()],
      note: item.note,
      number: item.number,
      variableSymbol: item.variableSymbol,
    });
    setPublicUrl(invoicePublicUrl(item));
    setEditing(true);
    setTab("invoices");
    setFlash("");
    setError("");
  }

  function patchDraft<K extends keyof InvoiceDraft>(key: K, value: InvoiceDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function patchCustomerField<K extends keyof InvoiceDraft["customer"]>(
    key: K,
    value: InvoiceDraft["customer"][K],
  ) {
    setDraft((prev) => ({
      ...prev,
      customer: { ...prev.customer, [key]: value },
    }));
  }

  function selectCustomer(id: string) {
    if (!id) {
      patchDraft("customerId", null);
      return;
    }
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    setDraft((prev) => ({
      ...prev,
      customerId: c.id,
      customer: {
        name: c.name,
        address: c.address,
        ico: c.ico,
        dic: c.dic,
        email: c.email,
        phone: c.phone,
      },
    }));
  }

  function patchLine(id: string, patch: Partial<InvoiceLine>) {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  function addLine(preset?: { description: string; unitPrice: number; unit?: string }) {
    const line = emptyInvoiceLine();
    if (preset) {
      line.description = preset.description;
      line.unitPrice = preset.unitPrice;
      if (preset.unit) line.unit = preset.unit;
    }
    setDraft((prev) => ({ ...prev, lines: [...prev.lines, line] }));
  }

  function removeLine(id: string) {
    setDraft((prev) => ({
      ...prev,
      lines: prev.lines.length <= 1 ? prev.lines : prev.lines.filter((l) => l.id !== id),
    }));
  }

  async function saveInvoice(statusOverride?: InvoiceStatus) {
    setSaving(true);
    setError("");
    setFlash("");
    try {
      const payload = {
        ...draft,
        status: statusOverride ?? draft.status,
      };
      const res = await fetch("/api/admin/invoices", {
        method: current ? "PUT" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current ? { id: current.id, ...payload } : payload),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Uložení selhalo"));
        return null;
      }
      const json = (await res.json()) as { item: Invoice; publicUrl?: string };
      setCurrent(json.item);
      setPublicUrl(json.publicUrl || invoicePublicUrl(json.item));
      setDraft({
        template: json.item.template,
        status: json.item.status,
        customerId: json.item.customerId,
        customer: { ...json.item.customer },
        issueDate: json.item.issueDate,
        taxableDate: json.item.taxableDate,
        dueDate: json.item.dueDate,
        paymentMethod: json.item.paymentMethod,
        lines: json.item.lines.map((l) => ({ ...l })),
        note: json.item.note,
        number: json.item.number,
        variableSymbol: json.item.variableSymbol,
      });
      setFlash(
        statusOverride === "issued"
          ? `Faktura ${json.item.number || ""} vystavena`
          : "Uloženo",
      );
      await load();
      return json.item;
    } finally {
      setSaving(false);
    }
  }

  async function downloadPdf() {
    const saved = current ?? (await saveInvoice());
    if (!saved) return;
    setError("");
    const res = await fetch(
      `/api/admin/invoices?id=${encodeURIComponent(saved.id)}&download=pdf`,
      { credentials: "same-origin" },
    );
    if (!res.ok) {
      setError(await readAdminError(res, "Stažení PDF selhalo"));
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `faktura-${saved.number || "koncept"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setFlash("PDF staženo");
  }

  async function sendEmail() {
    if (!draft.customer.email.trim()) {
      setError("Vyplňte e-mail odběratele.");
      return;
    }
    const saved =
      current?.status === "draft" || !current
        ? await saveInvoice("issued")
        : current ?? (await saveInvoice());
    if (!saved) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendEmail", id: saved.id }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Odeslání e-mailu selhalo"));
        return;
      }
      const json = (await res.json()) as { item: Invoice; publicUrl?: string };
      setCurrent(json.item);
      setPublicUrl(json.publicUrl || invoicePublicUrl(json.item));
      setFlash("Faktura odeslána e-mailem (PDF v příloze).");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removeInvoice(id: string) {
    if (!confirm("Smazat tuto fakturu?")) return;
    const res = await fetch("/api/admin/invoices", {
      method: "DELETE",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: "invoice" }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    if (current?.id === id) {
      setEditing(false);
      setCurrent(null);
    }
    setFlash("Faktura smazána");
    await load();
  }

  async function saveCustomer() {
    if (!customerForm) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: customerForm.id ? "PUT" : "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveCustomer", customer: customerForm }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Uložení zákazníka selhalo"));
        return;
      }
      setCustomerForm(null);
      setFlash("Zákazník uložen");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removeCustomer(id: string) {
    if (!confirm("Smazat zákazníka?")) return;
    const res = await fetch("/api/admin/invoices", {
      method: "DELETE",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: "customer" }),
    });
    if (!res.ok) {
      setError(await readAdminError(res, "Smazání selhalo"));
      return;
    }
    setFlash("Zákazník smazán");
    await load();
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSettings", settings: settingsForm }),
      });
      if (!res.ok) {
        setError(await readAdminError(res, "Uložení nastavení selhalo"));
        return;
      }
      const json = (await res.json()) as { settings: InvoiceSettings };
      setSettings(json.settings);
      setSettingsForm(json.settings);
      setFlash("Nastavení uloženo");
    } finally {
      setSaving(false);
    }
  }

  const previewNumber = current?.number || draft.number || "—";
  const previewVs = current?.variableSymbol || draft.variableSymbol || previewNumber;
  const bankLabel =
    settings.bankAccount && settings.bankCode
      ? `${settings.bankAccount}/${settings.bankCode}`
      : "doplňte v Nastavení";

  const shareUrl = publicUrl || (current ? invoicePublicUrl(current) : "");
  const waText = encodeURIComponent(
    `Dobrý den, posílám fakturu${previewNumber !== "—" ? ` č. ${previewNumber}` : ""}:\n${shareUrl || "(nejprve uložte / vystavte fakturu)"}`,
  );
  const phoneDigits = draft.customer.phone.replace(/\D/g, "");
  const waHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${waText}`
    : `https://wa.me/?text=${waText}`;
  const smsHref = phoneDigits
    ? `sms:${phoneDigits}?&body=${waText}`
    : `sms:?&body=${waText}`;

  return (
    <div className="invoice-admin">
      <div className="admin-card invoice-screen-help">
        <h1>Fakturace</h1>
        <p className="admin-muted">
          Klasická fakturace ve stylu iDokladu — historie, zákazníci, položky a dvě
          šablony ({site.brandName} / {site.legalName}).
        </p>

        <div className="invoice-tabs" role="tablist">
          {(
            [
              ["invoices", "Faktury"],
              ["customers", "Zákazníci"],
              ["settings", "Nastavení"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={tab === id ? "admin-btn" : "admin-btn secondary"}
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                if (id !== "invoices") setEditing(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? <p className="admin-error">{error}</p> : null}
        {flash ? <p className="admin-muted">{flash}</p> : null}
        {loading ? <p className="admin-muted">Načítám…</p> : null}
      </div>

      {tab === "invoices" && !editing ? (
        <div className="admin-card">
          <div className="admin-actions">
            <button type="button" className="admin-btn" onClick={startNew}>
              Nová faktura
            </button>
          </div>
          {invoices.length === 0 ? (
            <p className="admin-muted">Zatím žádné faktury.</p>
          ) : (
            <ul className="invoice-list">
              {invoices.map((inv) => {
                const sum = invoiceTotals(inv.lines).total;
                return (
                  <li key={inv.id}>
                    <button
                      type="button"
                      className="invoice-list-open"
                      onClick={() => openInvoice(inv)}
                    >
                      <strong>
                        {inv.number || "Koncept"} · {inv.customer.name || "Bez odběratele"}
                      </strong>
                      <span className="admin-muted">
                        {formatCzDate(inv.issueDate)} · {formatCzk(sum)} ·{" "}
                        {inv.template === "drdetailing" ? site.brandName : site.legalName}
                      </span>
                      <span className={statusClass(inv.status)}>
                        {INVOICE_STATUS_LABEL[inv.status]}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={() => void removeInvoice(inv.id)}
                    >
                      Smazat
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "invoices" && editing ? (
        <>
          <div className="admin-card invoice-editor invoice-screen-help">
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => {
                  setEditing(false);
                  setCurrent(null);
                }}
              >
                ← Zpět na seznam
              </button>
              <button
                type="button"
                className="admin-btn"
                disabled={saving}
                onClick={() => void saveInvoice()}
              >
                {saving ? "Ukládám…" : "Uložit koncept"}
              </button>
              <button
                type="button"
                className="admin-btn"
                disabled={saving}
                onClick={() => void saveInvoice("issued")}
              >
                Vystavit
              </button>
              {current && current.status !== "paid" ? (
                <button
                  type="button"
                  className="admin-btn secondary"
                  disabled={saving}
                  onClick={() => void saveInvoice("paid")}
                >
                  Označit uhrazeno
                </button>
              ) : null}
              {current ? (
                <button
                  type="button"
                  className="admin-btn secondary"
                  disabled={saving}
                  onClick={() => void saveInvoice("cancelled")}
                >
                  Storno
                </button>
              ) : null}
              <button
                type="button"
                className="admin-btn secondary"
                disabled={saving}
                onClick={() => void downloadPdf()}
              >
                Stáhnout PDF
              </button>
              <button type="button" className="admin-btn secondary" onClick={() => window.print()}>
                Tisknout
              </button>
            </div>

            <div className="invoice-template-switch" role="group" aria-label="Šablona">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={
                    draft.template === t.id
                      ? "admin-btn invoice-template-btn is-active"
                      : "admin-btn secondary invoice-template-btn"
                  }
                  onClick={() => patchDraft("template", t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="admin-muted">
              {TEMPLATES.find((t) => t.id === draft.template)?.hint}
              {current?.number ? ` · Číslo ${current.number}` : " · Číslo se přidělí při vystavení"}
            </p>

            <div className="admin-form invoice-form-grid">
              <label>
                Datum vystavení
                <input
                  type="date"
                  value={draft.issueDate}
                  onChange={(e) => patchDraft("issueDate", e.target.value)}
                />
              </label>
              <label>
                DUZP
                <input
                  type="date"
                  value={draft.taxableDate}
                  onChange={(e) => patchDraft("taxableDate", e.target.value)}
                />
              </label>
              <label>
                Splatnost
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => patchDraft("dueDate", e.target.value)}
                />
              </label>
              <label>
                Forma úhrady
                <input
                  value={draft.paymentMethod}
                  onChange={(e) => patchDraft("paymentMethod", e.target.value)}
                />
              </label>
            </div>

            <h2>Odběratel</h2>
            <div className="admin-form">
              <label>
                Ze zákazníků
                <select
                  value={draft.customerId || ""}
                  onChange={(e) => selectCustomer(e.target.value)}
                >
                  <option value="">— ručně / nový —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Jméno / firma
                <input
                  value={draft.customer.name}
                  onChange={(e) => patchCustomerField("name", e.target.value)}
                />
              </label>
              <label>
                Adresa
                <input
                  value={draft.customer.address}
                  onChange={(e) => patchCustomerField("address", e.target.value)}
                />
              </label>
              <div className="invoice-form-grid">
                <label>
                  IČO
                  <input
                    value={draft.customer.ico}
                    onChange={(e) => patchCustomerField("ico", e.target.value)}
                  />
                </label>
                <label>
                  DIČ
                  <input
                    value={draft.customer.dic}
                    onChange={(e) => patchCustomerField("dic", e.target.value)}
                  />
                </label>
                <label>
                  E-mail
                  <input
                    value={draft.customer.email}
                    onChange={(e) => patchCustomerField("email", e.target.value)}
                  />
                </label>
                <label>
                  Telefon
                  <input
                    value={draft.customer.phone}
                    onChange={(e) => patchCustomerField("phone", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <h2>Položky</h2>
            <div className="invoice-quick-items">
              {INVOICE_QUICK_ITEMS.map((q) => (
                <button
                  key={q.description}
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => addLine(q)}
                >
                  + {q.description}
                </button>
              ))}
            </div>

            <div className="invoice-lines-editor">
              {draft.lines.map((line, idx) => (
                <div key={line.id} className="invoice-line-row">
                  <span className="invoice-line-idx">{idx + 1}</span>
                  <input
                    placeholder="Popis"
                    value={line.description}
                    onChange={(e) => patchLine(line.id, { description: e.target.value })}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    title="Množství"
                    value={line.qty}
                    onChange={(e) => patchLine(line.id, { qty: Number(e.target.value) })}
                  />
                  <input
                    placeholder="mj."
                    value={line.unit}
                    onChange={(e) => patchLine(line.id, { unit: e.target.value })}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    title="Cena"
                    value={line.unitPrice}
                    onChange={(e) =>
                      patchLine(line.id, { unitPrice: Number(e.target.value) })
                    }
                  />
                  <span className="invoice-line-sum">{formatCzk(invoiceLineTotal(line))}</span>
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => removeLine(line.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="admin-actions">
              <button type="button" className="admin-btn secondary" onClick={() => addLine()}>
                Přidat řádek
              </button>
              <strong>Celkem {formatCzk(totals.total)}</strong>
            </div>

            <label className="admin-form">
              Poznámka na faktuře
              <textarea
                rows={3}
                value={draft.note}
                onChange={(e) => patchDraft("note", e.target.value)}
              />
            </label>

            <div className="invoice-send-box">
              <h2>Odeslat zákazníkovi</h2>
              <p className="admin-muted">
                PDF ke stažení, odkaz na fakturu, WhatsApp / SMS / e-mail (SMTP s PDF
                přílohou). Pro veřejný odkaz fakturu nejdřív vystavte.
              </p>
              {shareUrl && current && current.status !== "draft" ? (
                <p>
                  <a href={shareUrl} target="_blank" rel="noreferrer">
                    {shareUrl}
                  </a>
                </p>
              ) : (
                <p className="admin-muted">
                  Po vystavení se tu objeví odkaz pro zákazníka.
                </p>
              )}
              <div className="admin-actions">
                <button
                  type="button"
                  className="admin-btn"
                  disabled={saving}
                  onClick={() => void downloadPdf()}
                >
                  Stáhnout PDF
                </button>
                <a className="admin-btn secondary" href={waHref} target="_blank" rel="noreferrer">
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
                  E-mail (SMTP + PDF)
                </button>
                {shareUrl && current && current.status !== "draft" ? (
                  <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(shareUrl);
                      setFlash("Odkaz zkopírován");
                    }}
                  >
                    Kopírovat odkaz
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <InvoiceSheet
            template={draft.template}
            number={String(previewNumber)}
            variableSymbol={String(previewVs)}
            issueDate={draft.issueDate}
            taxableDate={draft.taxableDate}
            dueDate={draft.dueDate}
            paymentMethod={draft.paymentMethod}
            customer={draft.customer}
            lines={draft.lines}
            note={draft.note}
            bankLabel={bankLabel}
            iban={settings.iban}
            total={totals.total}
          />
        </>
      ) : null}

      {tab === "customers" ? (
        <div className="admin-card">
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() =>
                setCustomerForm({
                  name: "",
                  address: "",
                  ico: "",
                  dic: "",
                  email: "",
                  phone: "",
                })
              }
            >
              Nový zákazník
            </button>
          </div>

          {customerForm ? (
            <div className="admin-form" style={{ marginBottom: "1.25rem" }}>
              <h2>{customerForm.id ? "Upravit zákazníka" : "Nový zákazník"}</h2>
              <label>
                Jméno / firma
                <input
                  value={customerForm.name || ""}
                  onChange={(e) =>
                    setCustomerForm((p) => ({ ...p!, name: e.target.value }))
                  }
                />
              </label>
              <label>
                Adresa
                <input
                  value={customerForm.address || ""}
                  onChange={(e) =>
                    setCustomerForm((p) => ({ ...p!, address: e.target.value }))
                  }
                />
              </label>
              <div className="invoice-form-grid">
                <label>
                  IČO
                  <input
                    value={customerForm.ico || ""}
                    onChange={(e) =>
                      setCustomerForm((p) => ({ ...p!, ico: e.target.value }))
                    }
                  />
                </label>
                <label>
                  DIČ
                  <input
                    value={customerForm.dic || ""}
                    onChange={(e) =>
                      setCustomerForm((p) => ({ ...p!, dic: e.target.value }))
                    }
                  />
                </label>
                <label>
                  E-mail
                  <input
                    value={customerForm.email || ""}
                    onChange={(e) =>
                      setCustomerForm((p) => ({ ...p!, email: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Telefon
                  <input
                    value={customerForm.phone || ""}
                    onChange={(e) =>
                      setCustomerForm((p) => ({ ...p!, phone: e.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="admin-actions">
                <button
                  type="button"
                  className="admin-btn"
                  disabled={saving}
                  onClick={() => void saveCustomer()}
                >
                  Uložit zákazníka
                </button>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setCustomerForm(null)}
                >
                  Zrušit
                </button>
              </div>
            </div>
          ) : null}

          {customers.length === 0 ? (
            <p className="admin-muted">Zatím žádní zákazníci.</p>
          ) : (
            <ul className="invoice-list">
              {customers.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="invoice-list-open"
                    onClick={() => setCustomerForm({ ...c })}
                  >
                    <strong>{c.name}</strong>
                    <span className="admin-muted">
                      {[c.address, c.ico ? `IČO ${c.ico}` : "", c.phone, c.email]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => void removeCustomer(c.id)}
                  >
                    Smazat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="admin-card">
          <h2>Platební údaje a výchozí hodnoty</h2>
          <div className="admin-form invoice-form-grid">
            <label>
              Číslo účtu
              <input
                value={settingsForm.bankAccount}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, bankAccount: e.target.value }))
                }
                placeholder="123456789"
              />
            </label>
            <label>
              Kód banky
              <input
                value={settingsForm.bankCode}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, bankCode: e.target.value }))
                }
                placeholder="0100"
              />
            </label>
            <label>
              IBAN
              <input
                value={settingsForm.iban}
                onChange={(e) =>
                  setSettingsForm((s) => ({ ...s, iban: e.target.value }))
                }
              />
            </label>
            <label>
              Příští číslo v řadě
              <input
                type="number"
                min={1}
                value={settingsForm.nextSequence}
                onChange={(e) =>
                  setSettingsForm((s) => ({
                    ...s,
                    nextSequence: Number(e.target.value) || 1,
                  }))
                }
              />
            </label>
            <label>
              Splatnost (dny)
              <input
                type="number"
                min={1}
                value={settingsForm.defaultDueDays}
                onChange={(e) =>
                  setSettingsForm((s) => ({
                    ...s,
                    defaultDueDays: Number(e.target.value) || 14,
                  }))
                }
              />
            </label>
            <label>
              Výchozí šablona
              <select
                value={settingsForm.defaultTemplate}
                onChange={(e) =>
                  setSettingsForm((s) => ({
                    ...s,
                    defaultTemplate: e.target.value as InvoiceTemplateId,
                  }))
                }
              >
                <option value="drdetailing">{site.brandName}</option>
                <option value="legal">{site.legalName}</option>
              </select>
            </label>
          </div>
          <label className="admin-form">
            Výchozí poznámka
            <textarea
              rows={3}
              value={settingsForm.defaultNote}
              onChange={(e) =>
                setSettingsForm((s) => ({ ...s, defaultNote: e.target.value }))
              }
            />
          </label>
          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              disabled={saving}
              onClick={() => void saveSettings()}
            >
              Uložit nastavení
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InvoiceSheet(props: {
  template: InvoiceTemplateId;
  number: string;
  variableSymbol: string;
  issueDate: string;
  taxableDate: string;
  dueDate: string;
  paymentMethod: string;
  customer: Invoice["customer"];
  lines: InvoiceLine[];
  note: string;
  bankLabel: string;
  iban: string;
  total: number;
}) {
  const isBrand = props.template === "drdetailing";

  return (
    <article
      className={`invoice-sheet invoice-sheet--${props.template}`}
      aria-label="Náhled faktury"
    >
      <header className="invoice-head">
        <div className="invoice-brand-block">
          {isBrand ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="invoice-logo" src="/brand/logo.svg" alt={site.brandName} />
          ) : null}
          <div>
            <p className="invoice-brand-name">
              {isBrand ? site.brandName : site.legalName}
            </p>
            <p className="invoice-brand-sub">
              {isBrand ? "Detailing · Praha 9" : "OSVČ"}
            </p>
          </div>
        </div>
        <div className="invoice-doc-meta">
          <p className="invoice-doc-title">Faktura</p>
          <p className="invoice-doc-number">č. {props.number}</p>
          <dl className="invoice-meta-list">
            <div>
              <dt>Datum vystavení</dt>
              <dd>{formatCzDate(props.issueDate)}</dd>
            </div>
            <div>
              <dt>DUZP</dt>
              <dd>{formatCzDate(props.taxableDate)}</dd>
            </div>
            <div>
              <dt>Datum splatnosti</dt>
              <dd>{formatCzDate(props.dueDate)}</dd>
            </div>
            <div>
              <dt>Forma úhrady</dt>
              <dd>{props.paymentMethod}</dd>
            </div>
            <div>
              <dt>Variabilní symbol</dt>
              <dd>{props.variableSymbol}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="invoice-parties">
        <section>
          <h2>Dodavatel</h2>
          <p className="invoice-party-name">
            {isBrand ? (
              <>
                <strong>{site.brandName}</strong>
                <span className="invoice-party-legal">
                  provozovatel: {site.legalName}
                </span>
              </>
            ) : (
              <strong>{site.legalName}</strong>
            )}
          </p>
          <p>{site.registeredAddress}</p>
          <p>
            IČO {site.ico}
            <span className="invoice-party-note"> · Neplátce DPH</span>
          </p>
          <p>
            {site.email} · {site.phoneDisplay}
          </p>
          <p className="invoice-party-place">Provozovna: {site.address}</p>
        </section>
        <section>
          <h2>Odběratel</h2>
          <p className="invoice-party-name">
            <strong>{props.customer.name || "—"}</strong>
          </p>
          {props.customer.address ? <p>{props.customer.address}</p> : null}
          {props.customer.ico ? <p>IČO {props.customer.ico}</p> : null}
          {props.customer.dic ? <p>DIČ {props.customer.dic}</p> : null}
          {props.customer.email ? <p>{props.customer.email}</p> : null}
          {props.customer.phone ? <p>{props.customer.phone}</p> : null}
        </section>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Položka</th>
            <th scope="col">Množství</th>
            <th scope="col">Cena / mj.</th>
            <th scope="col">Celkem</th>
          </tr>
        </thead>
        <tbody>
          {props.lines.map((line, i) => (
            <tr key={line.id}>
              <td>{i + 1}</td>
              <td>{line.description || "—"}</td>
              <td>
                {line.qty} {line.unit}
              </td>
              <td>{formatCzk(line.unitPrice)}</td>
              <td>{formatCzk(invoiceLineTotal(line))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-summary">
        <div className="invoice-payment">
          <h2>Platební údaje</h2>
          <p>
            Účet: <strong>{props.bankLabel}</strong>
          </p>
          {props.iban ? <p>IBAN: {props.iban}</p> : null}
          <p>
            VS: <strong>{props.variableSymbol}</strong>
          </p>
        </div>
        <dl className="invoice-totals">
          <div>
            <dt>Základ</dt>
            <dd>{formatCzk(props.total)}</dd>
          </div>
          <div>
            <dt>DPH</dt>
            <dd>0 Kč</dd>
          </div>
          <div className="invoice-totals-due">
            <dt>Celkem k úhradě</dt>
            <dd>{formatCzk(props.total)}</dd>
          </div>
        </dl>
      </div>

      <footer className="invoice-foot">
        {props.note ? <p>{props.note}</p> : null}
        <p className="invoice-thank">Děkujeme za důvěru.</p>
      </footer>
    </article>
  );
}
