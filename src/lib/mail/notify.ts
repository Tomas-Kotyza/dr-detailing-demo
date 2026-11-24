import nodemailer from "nodemailer";
import { site } from "@/content/site";
import type { InquiryItem } from "@/lib/cms/inquiries";

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

export function inquiryEmailConfigured() {
  return smtpConfigured();
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("cs-CZ").format(n);
}

/** Upozornění majiteli — vlastní SMTP schránka (Wedos/Seznam), bez Resendu. */
export async function notifyOwnerNewInquiry(item: InquiryItem): Promise<void> {
  if (!smtpConfigured()) return;

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" || port === 465;
  const from = process.env.SMTP_FROM?.trim() || `${site.brandName} <${user}>`;
  const to = process.env.INQUIRY_NOTIFY_EMAIL?.trim() || site.email;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const price =
    item.packPrice != null ? `od ${formatPrice(item.packPrice)} Kč` : "—";
  const adminUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || `https://${site.domain}`).replace(/\/$/, "")}/admin/poptavky`;

  const text = [
    `Nová poptávka z webu ${site.domain}`,
    "",
    `Jméno: ${item.name}`,
    `Telefon: ${item.phone}`,
    `Vozidlo: ${item.vehicle}`,
    `Služba: ${item.packName}`,
    `Orientace: ${price}`,
    "",
    `Admin: ${adminUrl}`,
  ].join("\n");

  await transporter.sendMail({
    from,
    to,
    subject: `Poptávka — ${item.packName} / ${item.name}`,
    text,
    html: `
      <p><strong>Nová poptávka z webu ${site.domain}</strong></p>
      <p>
        <strong>Jméno:</strong> ${escapeHtml(item.name)}<br/>
        <strong>Telefon:</strong> <a href="tel:${escapeHtml(item.phone)}">${escapeHtml(item.phone)}</a><br/>
        <strong>Vozidlo:</strong> ${escapeHtml(item.vehicle)}<br/>
        <strong>Služba:</strong> ${escapeHtml(item.packName)}<br/>
        <strong>Orientace:</strong> ${escapeHtml(price)}
      </p>
      <p><a href="${escapeHtml(adminUrl)}">Otevřít v adminu</a></p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Odeslání odkazu na předávací list zákazníkovi (vlastní SMTP). */
export async function sendHandoverLinkEmail(opts: {
  to: string;
  customerName: string;
  publicUrl: string;
  vehicleLabel: string;
}): Promise<void> {
  if (!smtpConfigured()) {
    throw new Error("SMTP není nastavené (SMTP_HOST / SMTP_USER / SMTP_PASS).");
  }
  if (!opts.to.trim() || !opts.to.includes("@")) {
    throw new Error("Zadejte platný e-mail zákazníka.");
  }

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" || port === 465;
  const from = process.env.SMTP_FROM?.trim() || `${site.brandName} <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const name = opts.customerName.trim() || "zákazníku";
  const vehicle = opts.vehicleLabel.trim() || "vozidlo";

  await transporter.sendMail({
    from,
    to: opts.to.trim(),
    subject: `Předávací list — ${site.brandName}`,
    text: [
      `Dobrý den, ${name},`,
      "",
      `připravili jsme předávací list k vozidlu ${vehicle}.`,
      `Otevřete odkaz, zkontrolujte údaje a případně podepište:`,
      opts.publicUrl,
      "",
      site.brandName,
      site.phoneDisplay,
      site.domain,
    ].join("\n"),
    html: `
      <p>Dobrý den, <strong>${escapeHtml(name)}</strong>,</p>
      <p>připravili jsme předávací list k vozidlu <strong>${escapeHtml(vehicle)}</strong>.</p>
      <p><a href="${escapeHtml(opts.publicUrl)}">Otevřít předávací list a podepsat</a></p>
      <p>${escapeHtml(site.brandName)} · ${escapeHtml(site.phoneDisplay)} · ${escapeHtml(site.domain)}</p>
    `,
  });
}

/** Faktura zákazníkovi — vlastní SMTP + PDF příloha. */
export async function sendInvoiceEmail(opts: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  publicUrl: string;
  amountLabel: string;
  pdf: Buffer;
  pdfFilename: string;
  fromBrand: string;
}): Promise<void> {
  if (!smtpConfigured()) {
    throw new Error("SMTP není nastavené (SMTP_HOST / SMTP_USER / SMTP_PASS).");
  }
  if (!opts.to.trim() || !opts.to.includes("@")) {
    throw new Error("Zadejte platný e-mail zákazníka.");
  }

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "587");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" || port === 465;
  const from = process.env.SMTP_FROM?.trim() || `${site.brandName} <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  const name = opts.customerName.trim() || "zákazníku";
  const number = opts.invoiceNumber.trim() || "—";

  await transporter.sendMail({
    from,
    to: opts.to.trim(),
    subject: `Faktura ${number} — ${opts.fromBrand}`,
    text: [
      `Dobrý den, ${name},`,
      "",
      `posíláme fakturu č. ${number} na částku ${opts.amountLabel}.`,
      `Náhled online: ${opts.publicUrl}`,
      "",
      "PDF je v příloze.",
      "",
      opts.fromBrand,
      site.phoneDisplay,
      site.domain,
    ].join("\n"),
    html: `
      <p>Dobrý den, <strong>${escapeHtml(name)}</strong>,</p>
      <p>posíláme fakturu <strong>č. ${escapeHtml(number)}</strong> na částku <strong>${escapeHtml(opts.amountLabel)}</strong>.</p>
      <p><a href="${escapeHtml(opts.publicUrl)}">Otevřít fakturu online</a></p>
      <p>PDF je v příloze.</p>
      <p>${escapeHtml(opts.fromBrand)} · ${escapeHtml(site.phoneDisplay)} · ${escapeHtml(site.domain)}</p>
    `,
    attachments: [
      {
        filename: opts.pdfFilename,
        content: opts.pdf,
        contentType: "application/pdf",
      },
    ],
  });
}
