export type InvoiceTemplateId = "drdetailing" | "legal";

export type InvoiceStatus = "draft" | "issued" | "paid" | "cancelled";

export type InvoiceLine = {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
};

export type InvoiceCustomerSnapshot = {
  name: string;
  address: string;
  ico: string;
  dic: string;
  email: string;
  phone: string;
};

export type InvoiceCustomer = InvoiceCustomerSnapshot & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  token: string;
  number: string;
  variableSymbol: string;
  template: InvoiceTemplateId;
  status: InvoiceStatus;
  customerId: string | null;
  customer: InvoiceCustomerSnapshot;
  issueDate: string;
  taxableDate: string;
  dueDate: string;
  paymentMethod: string;
  lines: InvoiceLine[];
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceSettings = {
  bankAccount: string;
  bankCode: string;
  iban: string;
  nextSequence: number;
  defaultTemplate: InvoiceTemplateId;
  defaultNote: string;
  defaultDueDays: number;
};

export type InvoiceDraft = Omit<
  Invoice,
  "id" | "token" | "createdAt" | "updatedAt" | "number" | "variableSymbol"
> & {
  number?: string;
  variableSymbol?: string;
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Koncept",
  issued: "Vystavená",
  paid: "Uhrazená",
  cancelled: "Stornovaná",
};

export const EMPTY_CUSTOMER_SNAPSHOT: InvoiceCustomerSnapshot = {
  name: "",
  address: "",
  ico: "",
  dic: "",
  email: "",
  phone: "",
};

export function defaultInvoiceSettings(): InvoiceSettings {
  return {
    bankAccount: "",
    bankCode: "",
    iban: "",
    nextSequence: 1,
    defaultTemplate: "drdetailing",
    defaultNote: "Nejsem plátce DPH. Ceny jsou uvedeny bez DPH.",
    defaultDueDays: 14,
  };
}

export function emptyInvoiceDraft(
  settings: InvoiceSettings = defaultInvoiceSettings(),
): InvoiceDraft {
  const today = new Date().toISOString().slice(0, 10);
  const due = addDaysIso(today, settings.defaultDueDays);
  return {
    template: settings.defaultTemplate,
    status: "draft",
    customerId: null,
    customer: { ...EMPTY_CUSTOMER_SNAPSHOT },
    issueDate: today,
    taxableDate: today,
    dueDate: due,
    paymentMethod: "Bankovní převod",
    lines: [emptyInvoiceLine()],
    note: settings.defaultNote,
  };
}

export function emptyInvoiceLine(): InvoiceLine {
  return {
    id: `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    description: "",
    qty: 1,
    unit: "ks",
    unitPrice: 0,
  };
}

export function addDaysIso(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatCzk(amount: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCzDate(isoDate: string) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}. ${m}. ${y}`;
}

export function invoiceLineTotal(line: InvoiceLine) {
  return Math.round((Number(line.qty) || 0) * (Number(line.unitPrice) || 0));
}

export function invoiceTotals(lines: InvoiceLine[]) {
  const total = lines.reduce((sum, line) => sum + invoiceLineTotal(line), 0);
  return { total, vat: 0, totalWithVat: total };
}

/** Rychlé položky z ceníku Dr Detailing */
export const INVOICE_QUICK_ITEMS: { description: string; unitPrice: number; unit?: string }[] = [
  { description: "Leštění laku", unitPrice: 9600 },
  { description: "Renovace laku", unitPrice: 23900 },
  { description: "Čištění interiéru", unitPrice: 3000 },
  { description: "Renovace světlometů (pár)", unitPrice: 1300, unit: "pár" },
  { description: "Renovace světlometu (1 ks)", unitPrice: 650, unit: "ks" },
  { description: "Dezinfekce ozonem", unitPrice: 490 },
  { description: "Keramická ochrana 1 rok", unitPrice: 7500 },
  { description: "Keramická ochrana 3 roky", unitPrice: 15500 },
  { description: "Keramická ochrana 5 let", unitPrice: 22500 },
];
