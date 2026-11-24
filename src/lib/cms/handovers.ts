import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type {
  HandoverDraft,
  HandoverProtocol,
  HandoverStatus,
} from "@/lib/cms/handovers-types";

export type {
  HandoverDraft,
  HandoverProtocol,
  HandoverStatus,
} from "@/lib/cms/handovers-types";
export {
  HANDOVER_SERVICES,
  emptyHandoverDraft,
} from "@/lib/cms/handovers-types";

type HandoversFile = {
  items: HandoverProtocol[];
  updatedAt: string;
};

const LOCAL_PATH = path.join(process.cwd(), "data", "handovers.json");
const BLOB_PATHNAME = "drdetailing-handovers.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function emptyFile(): HandoversFile {
  return { items: [], updatedAt: new Date().toISOString() };
}

function newToken() {
  return randomBytes(12).toString("base64url");
}

function newId() {
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeItem(raw: Partial<HandoverProtocol>): HandoverProtocol | null {
  if (!raw || typeof raw.id !== "string" || typeof raw.token !== "string") {
    return null;
  }
  const status: HandoverStatus =
    raw.status === "signed" || raw.status === "awaiting_signature"
      ? raw.status
      : "draft";
  return {
    id: raw.id,
    token: raw.token,
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
    status,
    handoverDate: String(raw.handoverDate || "").slice(0, 12),
    customerName: String(raw.customerName || "").slice(0, 120),
    customerPhone: String(raw.customerPhone || "").slice(0, 40),
    customerEmail: String(raw.customerEmail || "").slice(0, 120),
    vehicleBrand: String(raw.vehicleBrand || "").slice(0, 60),
    vehicleModel: String(raw.vehicleModel || "").slice(0, 60),
    vehiclePlate: String(raw.vehiclePlate || "").slice(0, 20),
    vehicleColor: String(raw.vehicleColor || "").slice(0, 40),
    vehicleMileage: String(raw.vehicleMileage || "").slice(0, 20),
    services: Array.isArray(raw.services)
      ? raw.services.map((s) => String(s).slice(0, 80)).slice(0, 20)
      : [],
    servicesNote: String(raw.servicesNote || "").slice(0, 800),
    conditionNotes: String(raw.conditionNotes || "").slice(0, 1200),
    reservations: String(raw.reservations || "").slice(0, 800),
    technicianSignature:
      typeof raw.technicianSignature === "string" &&
      raw.technicianSignature.startsWith("data:image")
        ? raw.technicianSignature.slice(0, 400_000)
        : null,
    customerSignature:
      typeof raw.customerSignature === "string" &&
      raw.customerSignature.startsWith("data:image")
        ? raw.customerSignature.slice(0, 400_000)
        : null,
    customerSignedAt: raw.customerSignedAt
      ? String(raw.customerSignedAt)
      : null,
  };
}

async function readLocal(): Promise<HandoversFile> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    const data = JSON.parse(raw) as HandoversFile;
    return {
      items: Array.isArray(data.items)
        ? data.items
            .map(normalizeItem)
            .filter((x): x is HandoverProtocol => Boolean(x))
        : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return emptyFile();
  }
}

async function writeLocal(data: HandoversFile) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<HandoversFile | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as HandoversFile;
    return {
      items: Array.isArray(data.items)
        ? data.items
            .map(normalizeItem)
            .filter((x): x is HandoverProtocol => Boolean(x))
        : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function writeBlob(data: HandoversFile) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function persist(file: HandoversFile): Promise<HandoversFile> {
  const next = { ...file, updatedAt: new Date().toISOString() };
  if (hasBlob()) {
    await writeBlob(next);
  } else {
    try {
      await writeLocal(next);
    } catch {
      throw new Error(
        "Předávací listy nelze uložit. Na Vercelu musí být Vercel Blob.",
      );
    }
  }
  return next;
}

async function readFile(): Promise<HandoversFile> {
  const fromBlob = await readBlob();
  if (fromBlob) return fromBlob;
  return readLocal();
}

export async function listHandovers(): Promise<HandoverProtocol[]> {
  const file = await readFile();
  return [...file.items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getHandoverById(
  id: string,
): Promise<HandoverProtocol | null> {
  const file = await readFile();
  return file.items.find((i) => i.id === id) ?? null;
}

export async function getHandoverByToken(
  token: string,
): Promise<HandoverProtocol | null> {
  const file = await readFile();
  return file.items.find((i) => i.token === token) ?? null;
}

export async function createHandover(
  input: HandoverDraft,
): Promise<HandoverProtocol> {
  const file = await readFile();
  const now = new Date().toISOString();
  const item = normalizeItem({
    ...input,
    id: newId(),
    token: newToken(),
    createdAt: now,
    updatedAt: now,
    status: "draft",
  })!;
  file.items = [item, ...file.items];
  await persist(file);
  return item;
}

export async function updateHandover(
  id: string,
  patch: Partial<HandoverProtocol>,
): Promise<HandoverProtocol> {
  const file = await readFile();
  const idx = file.items.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("List nenalezen.");
  const current = file.items[idx];
  const next = normalizeItem({
    ...current,
    ...patch,
    id: current.id,
    token: current.token,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  })!;
  if (next.customerSignature && next.status !== "signed") {
    next.status = "signed";
    next.customerSignedAt = next.customerSignedAt || new Date().toISOString();
  }
  file.items[idx] = next;
  await persist(file);
  return next;
}

export async function markHandoverAwaiting(id: string): Promise<HandoverProtocol> {
  return updateHandover(id, { status: "awaiting_signature" });
}

export async function signHandoverByToken(
  token: string,
  customerSignature: string,
): Promise<HandoverProtocol> {
  const file = await readFile();
  const idx = file.items.findIndex((i) => i.token === token);
  if (idx < 0) throw new Error("Odkaz není platný.");
  if (!customerSignature.startsWith("data:image")) {
    throw new Error("Chybí podpis.");
  }
  const current = file.items[idx];
  const next = normalizeItem({
    ...current,
    customerSignature,
    customerSignedAt: new Date().toISOString(),
    status: "signed",
    updatedAt: new Date().toISOString(),
  })!;
  file.items[idx] = next;
  await persist(file);
  return next;
}

export async function deleteHandover(id: string): Promise<boolean> {
  const file = await readFile();
  const before = file.items.length;
  file.items = file.items.filter((i) => i.id !== id);
  if (file.items.length === before) return false;
  await persist(file);
  return true;
}

export function publicHandoverUrl(token: string): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://drdetailing.cz"
  ).replace(/\/$/, "");
  return `${base}/predani/${token}`;
}
