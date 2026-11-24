import PDFDocument from "pdfkit";
import path from "path";
import { site } from "@/content/site";
import {
  formatCzDate,
  formatCzk,
  invoiceLineTotal,
  invoiceTotals,
  type Invoice,
  type InvoiceSettings,
} from "@/lib/cms/invoices-types";

function fontPaths() {
  const dir = path.join(process.cwd(), "public", "fonts");
  return {
    regular: path.join(dir, "DejaVuSans.ttf"),
    bold: path.join(dir, "DejaVuSans-Bold.ttf"),
  };
}

export function invoicePdfFilename(invoice: Invoice) {
  const num = invoice.number || "koncept";
  return `faktura-${num}.pdf`;
}

export async function buildInvoicePdf(
  invoice: Invoice,
  settings: InvoiceSettings,
): Promise<Buffer> {
  const fonts = fontPaths();
  const isBrand = invoice.template === "drdetailing";
  const accent = isBrand ? "#1f7a52" : "#1e3a5f";
  const { total } = invoiceTotals(invoice.lines);
  const bankLabel =
    settings.bankAccount && settings.bankCode
      ? `${settings.bankAccount}/${settings.bankCode}`
      : "—";

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: `Faktura ${invoice.number || ""}`.trim(),
        Author: isBrand ? site.brandName : site.legalName,
      },
    });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      doc.registerFont("Regular", fonts.regular);
      doc.registerFont("Bold", fonts.bold);
    } catch (e) {
      reject(
        e instanceof Error
          ? e
          : new Error("Chybí font DejaVuSans pro PDF s háčky."),
      );
      return;
    }

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;

    doc
      .moveTo(left, 36)
      .lineTo(left + pageWidth, 36)
      .lineWidth(3)
      .strokeColor(accent)
      .stroke();

    doc.fillColor(accent).font("Bold").fontSize(16);
    doc.text(isBrand ? site.brandName : site.legalName, left, 48, {
      width: pageWidth * 0.55,
    });
    doc.fillColor("#5a6470").font("Regular").fontSize(9);
    doc.text(isBrand ? "Detailing · Praha 9" : "OSVČ", {
      width: pageWidth * 0.55,
    });

    doc.fillColor("#12161c").font("Bold").fontSize(18);
    doc.text("FAKTURA", left + pageWidth * 0.55, 48, {
      width: pageWidth * 0.45,
      align: "right",
    });
    doc.fillColor(accent).font("Bold").fontSize(11);
    doc.text(`č. ${invoice.number || "—"}`, {
      width: pageWidth * 0.45,
      align: "right",
    });

    doc.fillColor("#5a6470").font("Regular").fontSize(9);
    const metaY = 95;
    const meta = [
      ["Datum vystavení", formatCzDate(invoice.issueDate)],
      ["DUZP", formatCzDate(invoice.taxableDate)],
      ["Datum splatnosti", formatCzDate(invoice.dueDate)],
      ["Forma úhrady", invoice.paymentMethod],
      ["Variabilní symbol", invoice.variableSymbol || invoice.number || "—"],
    ];
    meta.forEach(([label, value], i) => {
      const y = metaY + i * 14;
      doc.text(label, left + pageWidth * 0.55, y, {
        width: pageWidth * 0.28,
        align: "left",
      });
      doc.fillColor("#12161c").font("Bold").text(value, left + pageWidth * 0.78, y, {
        width: pageWidth * 0.22,
        align: "right",
      });
      doc.fillColor("#5a6470").font("Regular");
    });

    let y = 185;
    doc.fillColor("#5a6470").font("Bold").fontSize(8);
    doc.text("DODAVATEL", left, y);
    doc.text("ODBĚRATEL", left + pageWidth * 0.5, y);
    y += 14;

    doc.fillColor("#12161c").font("Bold").fontSize(11);
    if (isBrand) {
      doc.text(site.brandName, left, y, { width: pageWidth * 0.45 });
      doc.font("Regular").fontSize(9).fillColor("#5a6470");
      doc.text(`provozovatel: ${site.legalName}`, left, y + 14, {
        width: pageWidth * 0.45,
      });
      y += 28;
    } else {
      doc.text(site.legalName, left, y, { width: pageWidth * 0.45 });
      y += 16;
    }

    const supplierY = isBrand ? 213 : 199;
    doc.fillColor("#12161c").font("Regular").fontSize(9);
    doc.text(site.registeredAddress, left, supplierY, { width: pageWidth * 0.45 });
    doc.text(`IČO ${site.ico} · Neplátce DPH`, { width: pageWidth * 0.45 });
    doc.text(`${site.email} · ${site.phoneDisplay}`, { width: pageWidth * 0.45 });
    doc.fillColor("#5a6470").text(`Provozovna: ${site.address}`, {
      width: pageWidth * 0.45,
    });

    let cy = 199;
    doc.fillColor("#12161c").font("Bold").fontSize(11);
    doc.text(invoice.customer.name || "—", left + pageWidth * 0.5, cy, {
      width: pageWidth * 0.45,
    });
    cy += 16;
    doc.font("Regular").fontSize(9);
    if (invoice.customer.address) {
      doc.text(invoice.customer.address, left + pageWidth * 0.5, cy, {
        width: pageWidth * 0.45,
      });
      cy += 12;
    }
    if (invoice.customer.ico) {
      doc.text(`IČO ${invoice.customer.ico}`, left + pageWidth * 0.5, cy, {
        width: pageWidth * 0.45,
      });
      cy += 12;
    }
    if (invoice.customer.dic) {
      doc.text(`DIČ ${invoice.customer.dic}`, left + pageWidth * 0.5, cy, {
        width: pageWidth * 0.45,
      });
      cy += 12;
    }
    if (invoice.customer.email) {
      doc.text(invoice.customer.email, left + pageWidth * 0.5, cy, {
        width: pageWidth * 0.45,
      });
      cy += 12;
    }
    if (invoice.customer.phone) {
      doc.text(invoice.customer.phone, left + pageWidth * 0.5, cy, {
        width: pageWidth * 0.45,
      });
    }

    y = 300;
    const cols = {
      n: left,
      desc: left + 28,
      qty: left + pageWidth * 0.58,
      price: left + pageWidth * 0.7,
      sum: left + pageWidth * 0.84,
    };

    doc
      .rect(left, y - 4, pageWidth, 18)
      .fillColor(isBrand ? "#eef6f1" : "#eef2f7")
      .fill();
    doc.fillColor("#5a6470").font("Bold").fontSize(8);
    doc.text("#", cols.n, y, { width: 20 });
    doc.text("POLOŽKA", cols.desc, y, { width: pageWidth * 0.4 });
    doc.text("MNOŽSTVÍ", cols.qty, y, { width: 70, align: "right" });
    doc.text("CENA", cols.price, y, { width: 70, align: "right" });
    doc.text("CELKEM", cols.sum, y, { width: 70, align: "right" });
    y += 22;

    doc.font("Regular").fontSize(9).fillColor("#12161c");
    invoice.lines.forEach((line, i) => {
      if (y > 700) {
        doc.addPage();
        y = 48;
      }
      const lineH = Math.max(
        16,
        doc.heightOfString(line.description || "—", {
          width: pageWidth * 0.4,
        }),
      );
      doc.text(String(i + 1), cols.n, y, { width: 20 });
      doc.text(line.description || "—", cols.desc, y, { width: pageWidth * 0.4 });
      doc.text(`${line.qty} ${line.unit}`, cols.qty, y, {
        width: 70,
        align: "right",
      });
      doc.text(formatCzk(line.unitPrice), cols.price, y, {
        width: 70,
        align: "right",
      });
      doc.text(formatCzk(invoiceLineTotal(line)), cols.sum, y, {
        width: 70,
        align: "right",
      });
      y += lineH + 8;
      doc
        .moveTo(left, y - 4)
        .lineTo(left + pageWidth, y - 4)
        .lineWidth(0.5)
        .strokeColor("#d0d5db")
        .stroke();
    });

    y += 16;
    doc.fillColor("#5a6470").font("Bold").fontSize(8);
    doc.text("PLATEBNÍ ÚDAJE", left, y);
    y += 12;
    doc.fillColor("#12161c").font("Regular").fontSize(9);
    doc.text(`Účet: ${bankLabel}`, left, y);
    y += 12;
    if (settings.iban) {
      doc.text(`IBAN: ${settings.iban}`, left, y);
      y += 12;
    }
    doc.text(`VS: ${invoice.variableSymbol || invoice.number || "—"}`, left, y);

    const boxX = left + pageWidth * 0.55;
    const boxW = pageWidth * 0.45;
    doc
      .roundedRect(boxX, y - 36, boxW, 70, 4)
      .lineWidth(1)
      .strokeColor("#d0d5db")
      .stroke();
    doc.font("Regular").fontSize(9).fillColor("#5a6470");
    doc.text("Základ", boxX + 10, y - 26, { width: boxW - 20 });
    doc.fillColor("#12161c").text(formatCzk(total), boxX + 10, y - 26, {
      width: boxW - 20,
      align: "right",
    });
    doc.fillColor("#5a6470").text("DPH", boxX + 10, y - 10, { width: boxW - 20 });
    doc.fillColor("#12161c").text("0 Kč", boxX + 10, y - 10, {
      width: boxW - 20,
      align: "right",
    });
    doc.fillColor(accent).font("Bold").fontSize(11);
    doc.text("Celkem k úhradě", boxX + 10, y + 10, { width: boxW - 20 });
    doc.text(formatCzk(total), boxX + 10, y + 10, {
      width: boxW - 20,
      align: "right",
    });

    y += 50;
    doc.fillColor("#5a6470").font("Regular").fontSize(9);
    if (invoice.note) {
      doc.text(invoice.note, left, y, { width: pageWidth });
      y += doc.heightOfString(invoice.note, { width: pageWidth }) + 8;
    }
    doc.fillColor("#12161c").font("Bold").text("Děkujeme za důvěru.", left, y);

    doc.end();
  });
}
