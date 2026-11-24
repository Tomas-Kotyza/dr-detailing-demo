import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import {
  defaultInvoiceSettings,
  emptyInvoiceDraft,
  type Invoice,
  type InvoiceCustomer,
  type InvoiceCustomerSnapshot,
  type InvoiceDraft,
  type InvoiceLine,
  type InvoiceSettings,
  type InvoiceStatus,
  type InvoiceTemplateId,
  EMPTY_CUSTOMER_SNAPSHOT,
} from "@/lib/cms/invoices-types";

export type {
  Invoice,
  InvoiceCustomer,
  InvoiceCustomerSnapshot,
  InvoiceDraft,
  InvoiceLine,
  InvoiceSettings,
  InvoiceStatus,
  InvoiceTemplateId,
} from "@/lib/cms/invoices-types";

export {
  INVOICE_QUICK_ITEMS,
  INVOICE_STATUS_LABEL,
  addDaysIso,
  defaultInvoiceSettings,
  emptyInvoiceDraft,
  emptyInvoiceLine,
  formatCzDate,
  formatCzk,
  invoiceLineTotal,
  invoiceTotals,
} from "@/lib/cms/invoices-types";

type InvoicesFile = {
  settings: InvoiceSettings;
  customers: InvoiceCustomer[];
  invoices: Invoice[];
  updatedAt: string;
};

const LOCAL_PATH = path.join(process.cwd(), "data", "invoices.json");
const BLOB_PATHNAME = "drdetailing-invoices.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function emptyFile(): InvoicesFile {
  return {
    settings: defaultInvoiceSettings(),
    customers: [],
    invoices: [],
    updatedAt: new Date().toISOString(),
  };
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function newToken() {
  return randomBytes(12).toString("base64url");
}

function normalizeTemplate(v: unknown): InvoiceTemplateId {
  return v === "legal" ? "legal" : "drdetailing";
}

function normalizeStatus(v: unknown): InvoiceStatus {
  if (v === "issued" || v === "paid" || v === "cancelled") return v;
  return "draft";
}

function normalizeCustomerSnap(
  raw: Partial<InvoiceCustomerSnapshot> | null | undefined,
): InvoiceCustomerSnapshot {
  return {
    name: String(raw?.name || "").slice(0, 160),
    address: String(raw?.address || "").slice(0, 240),
    ico: String(raw?.ico || "").slice(0, 20),
    dic: String(raw?.dic || "").slice(0, 20),
    email: String(raw?.email || "").slice(0, 120),
    phone: String(raw?.phone || "").slice(0, 40),
  };
}

function normalizeLine(raw: Partial<InvoiceLine>): InvoiceLine | null {
  if (!raw || typeof raw.id !== "string") return null;
  const qty = Number(raw.qty);
  const unitPrice = Number(raw.unitPrice);
  return {
    id: raw.id.slice(0, 40),
    description: String(raw.description || "").slice(0, 240),
    qty: Number.isFinite(qty) ? Math.max(0, qty) : 0,
    unit: String(raw.unit || "ks").slice(0, 20),
    unitPrice: Number.isFinite(unitPrice) ? Math.max(0, Math.round(unitPrice)) : 0,
  };
}

function normalizeCustomer(raw: Partial<InvoiceCustomer>): InvoiceCustomer | null {
  if (!raw || typeof raw.id !== "string") return null;
  const snap = normalizeCustomerSnap(raw);
  return {
    id: raw.id,
    ...snap,
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
  };
}

function normalizeInvoice(raw: Partial<Invoice>): Invoice | null {
  if (!raw || typeof raw.id !== "string") return null;
  const lines = Array.isArray(raw.lines)
    ? raw.lines
        .map(normalizeLine)
        .filter((x): x is InvoiceLine => Boolean(x))
        .slice(0, 40)
    : [];
  return {
    id: raw.id,
    token:
      typeof raw.token === "string" && raw.token.trim()
        ? raw.token.trim().slice(0, 48)
        : newToken(),
    number: String(raw.number || "").slice(0, 20),
    variableSymbol: String(raw.variableSymbol || raw.number || "").slice(0, 20),
    template: normalizeTemplate(raw.template),
    status: normalizeStatus(raw.status),
    customerId:
      typeof raw.customerId === "string" && raw.customerId
        ? raw.customerId
        : null,
    customer: normalizeCustomerSnap(raw.customer),
    issueDate: String(raw.issueDate || "").slice(0, 12),
    taxableDate: String(raw.taxableDate || "").slice(0, 12),
    dueDate: String(raw.dueDate || "").slice(0, 12),
    paymentMethod: String(raw.paymentMethod || "Bankovní převod").slice(0, 60),
    lines,
    note: String(raw.note || "").slice(0, 800),
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
  };
}

function normalizeSettings(raw: Partial<InvoiceSettings> | null | undefined): InvoiceSettings {
  const base = defaultInvoiceSettings();
  const seq = Number(raw?.nextSequence);
  const due = Number(raw?.defaultDueDays);
  return {
    bankAccount: String(raw?.bankAccount ?? base.bankAccount).slice(0, 40),
    bankCode: String(raw?.bankCode ?? base.bankCode).slice(0, 10),
    iban: String(raw?.iban ?? base.iban).slice(0, 40),
    nextSequence: Number.isFinite(seq) && seq > 0 ? Math.floor(seq) : 1,
    defaultTemplate: normalizeTemplate(raw?.defaultTemplate ?? base.defaultTemplate),
    defaultNote: String(raw?.defaultNote ?? base.defaultNote).slice(0, 800),
    defaultDueDays: Number.isFinite(due) && due > 0 ? Math.floor(due) : 14,
  };
}

function normalizeFile(raw: Partial<InvoicesFile> | null): {
  file: InvoicesFile;
  tokensBackfilled: boolean;
} {
  let tokensBackfilled = false;
  const invoices = Array.isArray(raw?.invoices)
    ? raw!.invoices
        .map((item) => {
          const hadToken =
            typeof item?.token === "string" && Boolean(item.token.trim());
          const normalized = normalizeInvoice(item);
          if (normalized && !hadToken) tokensBackfilled = true;
          return normalized;
        })
        .filter((x): x is Invoice => Boolean(x))
    : [];

  return {
    file: {
      settings: normalizeSettings(raw?.settings),
      customers: Array.isArray(raw?.customers)
        ? raw!.customers
            .map(normalizeCustomer)
            .filter((x): x is InvoiceCustomer => Boolean(x))
        : [],
      invoices,
      updatedAt: String(raw?.updatedAt || new Date().toISOString()),
    },
    tokensBackfilled,
  };
}

async function readLocal(): Promise<{
  file: InvoicesFile;
  tokensBackfilled: boolean;
}> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return normalizeFile(JSON.parse(raw) as InvoicesFile);
  } catch {
    return { file: emptyFile(), tokensBackfilled: false };
  }
}

async function writeLocal(data: InvoicesFile) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<{
  file: InvoicesFile;
  tokensBackfilled: boolean;
} | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return normalizeFile((await res.json()) as InvoicesFile);
  } catch {
    return null;
  }
}

async function writeBlob(data: InvoicesFile) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function persist(file: InvoicesFile): Promise<InvoicesFile> {
  const next = { ...file, updatedAt: new Date().toISOString() };
  if (hasBlob()) {
    await writeBlob(next);
  } else {
    try {
      await writeLocal(next);
    } catch {
      throw new Error(
        "Faktury nelze uložit. Na Vercelu musí být Vercel Blob.",
      );
    }
  }
  return next;
}

async function readFile(): Promise<InvoicesFile> {
  const fromBlob = await readBlob();
  const loaded = fromBlob ?? (await readLocal());
  if (loaded.tokensBackfilled) {
    try {
      return await persist(loaded.file);
    } catch {
      return loaded.file;
    }
  }
  return loaded.file;
}

function makeInvoiceNumber(year: number, sequence: number) {
  return `${year}${String(sequence).padStart(3, "0")}`;
}

function allocateNumber(file: InvoicesFile, issueDate: string) {
  const year = Number((issueDate || new Date().toISOString()).slice(0, 4)) ||
    new Date().getFullYear();
  const number = makeInvoiceNumber(year, file.settings.nextSequence);
  file.settings.nextSequence += 1;
  return number;
}

export async function getInvoicingState() {
  const file = await readFile();
  return {
    settings: file.settings,
    customers: [...file.customers].sort((a, b) =>
      a.name.localeCompare(b.name, "cs"),
    ),
    invoices: [...file.invoices].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    ),
  };
}

export async function updateInvoiceSettings(
  patch: Partial<InvoiceSettings>,
): Promise<InvoiceSettings> {
  const file = await readFile();
  file.settings = normalizeSettings({ ...file.settings, ...patch });
  await persist(file);
  return file.settings;
}

export async function listCustomers(): Promise<InvoiceCustomer[]> {
  const file = await readFile();
  return [...file.customers].sort((a, b) => a.name.localeCompare(b.name, "cs"));
}

export async function upsertCustomer(
  input: Partial<InvoiceCustomer> & { id?: string },
): Promise<InvoiceCustomer> {
  const file = await readFile();
  const now = new Date().toISOString();
  const snap = normalizeCustomerSnap(input);

  if (!snap.name.trim()) {
    throw new Error("Zadejte jméno zákazníka.");
  }

  if (input.id) {
    const idx = file.customers.findIndex((c) => c.id === input.id);
    if (idx < 0) throw new Error("Zákazník nenalezen.");
    const next = normalizeCustomer({
      ...file.customers[idx],
      ...snap,
      id: file.customers[idx].id,
      createdAt: file.customers[idx].createdAt,
      updatedAt: now,
    })!;
    file.customers[idx] = next;
    await persist(file);
    return next;
  }

  const next = normalizeCustomer({
    id: newId("c"),
    ...snap,
    createdAt: now,
    updatedAt: now,
  })!;
  file.customers = [next, ...file.customers];
  await persist(file);
  return next;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const file = await readFile();
  const before = file.customers.length;
  file.customers = file.customers.filter((c) => c.id !== id);
  if (file.customers.length === before) return false;
  await persist(file);
  return true;
}

function draftToInvoice(
  file: InvoicesFile,
  draft: InvoiceDraft,
  existing?: Invoice,
): Invoice {
  const now = new Date().toISOString();
  let number = existing?.number || String(draft.number || "");
  let variableSymbol =
    existing?.variableSymbol || String(draft.variableSymbol || number);
  const status = normalizeStatus(draft.status);

  // Při prvním vystavení přiděl číslo
  if (
    status !== "draft" &&
    status !== "cancelled" &&
    !number &&
    (!existing || existing.status === "draft")
  ) {
    number = allocateNumber(file, draft.issueDate);
    variableSymbol = number;
  }

  return normalizeInvoice({
    id: existing?.id || newId("inv"),
    token: existing?.token || newToken(),
    number,
    variableSymbol: variableSymbol || number,
    template: draft.template,
    status,
    customerId: draft.customerId,
    customer: draft.customer || EMPTY_CUSTOMER_SNAPSHOT,
    issueDate: draft.issueDate,
    taxableDate: draft.taxableDate,
    dueDate: draft.dueDate,
    paymentMethod: draft.paymentMethod,
    lines: draft.lines,
    note: draft.note,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })!;
}

export async function createInvoice(draft?: Partial<InvoiceDraft>): Promise<Invoice> {
  const file = await readFile();
  const base = emptyInvoiceDraft(file.settings);
  const item = draftToInvoice(file, {
    ...base,
    ...draft,
    customer: { ...base.customer, ...draft?.customer },
    lines: draft?.lines?.length ? draft.lines : base.lines,
  });
  if (!item.customer.name.trim() && item.status !== "draft") {
    throw new Error("Vyplňte jméno odběratele.");
  }
  file.invoices = [item, ...file.invoices];
  await persist(file);
  return item;
}

export async function updateInvoice(
  id: string,
  draft: Partial<InvoiceDraft>,
): Promise<Invoice> {
  const file = await readFile();
  const idx = file.invoices.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Faktura nenalezena.");
  const current = file.invoices[idx];
  const merged: InvoiceDraft = {
    template: draft.template ?? current.template,
    status: draft.status ?? current.status,
    customerId:
      draft.customerId !== undefined ? draft.customerId : current.customerId,
    customer: { ...current.customer, ...draft.customer },
    issueDate: draft.issueDate ?? current.issueDate,
    taxableDate: draft.taxableDate ?? current.taxableDate,
    dueDate: draft.dueDate ?? current.dueDate,
    paymentMethod: draft.paymentMethod ?? current.paymentMethod,
    lines: draft.lines ?? current.lines,
    note: draft.note ?? current.note,
    number: current.number,
    variableSymbol: current.variableSymbol,
  };
  if (!merged.customer.name.trim() && merged.status !== "draft") {
    throw new Error("Vyplňte jméno odběratele.");
  }
  const next = draftToInvoice(file, merged, current);
  file.invoices[idx] = next;
  await persist(file);
  return next;
}

export async function setInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): Promise<Invoice> {
  return updateInvoice(id, { status });
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const file = await readFile();
  const before = file.invoices.length;
  file.invoices = file.invoices.filter((i) => i.id !== id);
  if (file.invoices.length === before) return false;
  await persist(file);
  return true;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const file = await readFile();
  return file.invoices.find((i) => i.id === id) ?? null;
}

export async function getInvoiceByToken(
  token: string,
): Promise<Invoice | null> {
  if (!token.trim()) return null;
  const file = await readFile();
  return file.invoices.find((i) => i.token === token) ?? null;
}

export function publicInvoiceUrl(token: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://drdetailing.cz"
  ).replace(/\/$/, "");
  return `${base}/faktura/${token}`;
}

export async function getInvoiceSettings(): Promise<InvoiceSettings> {
  const file = await readFile();
  return file.settings;
}
