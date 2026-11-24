"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import {
  formatCzDate,
  formatCzk,
  invoiceLineTotal,
  invoiceTotals,
  type Invoice,
  type InvoiceSettings,
} from "@/lib/cms/invoices-types";

type Props = { token: string };

export function InvoicePublicClient({ token }: Props) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/faktura/${token}`, { cache: "no-store" });
      if (!res.ok) {
        setError("Odkaz na fakturu není platný.");
        return;
      }
      const json = (await res.json()) as {
        item: Invoice;
        settings: Pick<InvoiceSettings, "bankAccount" | "bankCode" | "iban">;
      };
      setInvoice(json.item);
      setSettings({
        bankAccount: json.settings.bankAccount,
        bankCode: json.settings.bankCode,
        iban: json.settings.iban,
        nextSequence: 1,
        defaultTemplate: "drdetailing",
        defaultNote: "",
        defaultDueDays: 14,
      });
    })();
  }, [token]);

  if (error) {
    return (
      <main className="invoice-public">
        <p>{error}</p>
      </main>
    );
  }

  if (!invoice || !settings) {
    return (
      <main className="invoice-public">
        <p>Načítám fakturu…</p>
      </main>
    );
  }

  const isBrand = invoice.template === "drdetailing";
  const total = invoiceTotals(invoice.lines).total;
  const bankLabel =
    settings.bankAccount && settings.bankCode
      ? `${settings.bankAccount}/${settings.bankCode}`
      : "—";

  return (
    <main className="invoice-public">
      <div className="invoice-public-actions">
        <a className="admin-btn" href={`/api/faktura/${token}/pdf`}>
          Stáhnout PDF
        </a>
        <button type="button" className="admin-btn secondary" onClick={() => window.print()}>
          Tisknout
        </button>
      </div>

      <article className={`invoice-sheet invoice-sheet--${invoice.template}`}>
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
            <p className="invoice-doc-number">č. {invoice.number || "—"}</p>
            <dl className="invoice-meta-list">
              <div>
                <dt>Datum vystavení</dt>
                <dd>{formatCzDate(invoice.issueDate)}</dd>
              </div>
              <div>
                <dt>DUZP</dt>
                <dd>{formatCzDate(invoice.taxableDate)}</dd>
              </div>
              <div>
                <dt>Datum splatnosti</dt>
                <dd>{formatCzDate(invoice.dueDate)}</dd>
              </div>
              <div>
                <dt>Forma úhrady</dt>
                <dd>{invoice.paymentMethod}</dd>
              </div>
              <div>
                <dt>Variabilní symbol</dt>
                <dd>{invoice.variableSymbol || invoice.number}</dd>
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
          </section>
          <section>
            <h2>Odběratel</h2>
            <p className="invoice-party-name">
              <strong>{invoice.customer.name || "—"}</strong>
            </p>
            {invoice.customer.address ? <p>{invoice.customer.address}</p> : null}
            {invoice.customer.ico ? <p>IČO {invoice.customer.ico}</p> : null}
            {invoice.customer.dic ? <p>DIČ {invoice.customer.dic}</p> : null}
          </section>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Položka</th>
              <th>Množství</th>
              <th>Cena / mj.</th>
              <th>Celkem</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, i) => (
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
              Účet: <strong>{bankLabel}</strong>
            </p>
            {settings.iban ? <p>IBAN: {settings.iban}</p> : null}
            <p>
              VS: <strong>{invoice.variableSymbol || invoice.number}</strong>
            </p>
          </div>
          <dl className="invoice-totals">
            <div>
              <dt>Základ</dt>
              <dd>{formatCzk(total)}</dd>
            </div>
            <div>
              <dt>DPH</dt>
              <dd>0 Kč</dd>
            </div>
            <div className="invoice-totals-due">
              <dt>Celkem k úhradě</dt>
              <dd>{formatCzk(total)}</dd>
            </div>
          </dl>
        </div>

        <footer className="invoice-foot">
          {invoice.note ? <p>{invoice.note}</p> : null}
          <p className="invoice-thank">Děkujeme za důvěru.</p>
        </footer>
      </article>
    </main>
  );
}
