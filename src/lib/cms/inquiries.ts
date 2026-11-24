import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export type InquiryItem = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  vehicle: string;
  packName: string;
  packPrice?: number;
  status: "new" | "done";
};

type InquiriesFile = {
  items: InquiryItem[];
  updatedAt: string;
};

const LOCAL_PATH = path.join(process.cwd(), "data", "inquiries.json");
const BLOB_PATHNAME = "drdetailing-inquiries.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function emptyFile(): InquiriesFile {
  return { items: [], updatedAt: new Date().toISOString() };
}

async function readLocal(): Promise<InquiriesFile> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    const data = JSON.parse(raw) as InquiriesFile;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return emptyFile();
  }
}

async function writeLocal(data: InquiriesFile) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<InquiriesFile | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as InquiriesFile;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function writeBlob(data: InquiriesFile) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function readInquiries(): Promise<InquiryItem[]> {
  const fromBlob = await readBlob();
  if (fromBlob) return fromBlob.items;
  const fromLocal = await readLocal();
  return fromLocal.items;
}

export async function addInquiry(
  input: Omit<InquiryItem, "id" | "createdAt" | "status">,
): Promise<InquiryItem> {
  const items = await readInquiries();
  const item: InquiryItem = {
    ...input,
    id: `inq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const next: InquiriesFile = {
    items: [item, ...items].slice(0, 500),
    updatedAt: new Date().toISOString(),
  };

  if (hasBlob()) {
    await writeBlob(next);
  } else {
    try {
      await writeLocal(next);
    } catch {
      throw new Error(
        "Poptávku nelze uložit. Na Vercelu musí být Vercel Blob (stejný účet jako u obsahu webu).",
      );
    }
  }

  return item;
}

export async function updateInquiryStatus(
  id: string,
  status: "new" | "done",
): Promise<InquiryItem | null> {
  const items = await readInquiries();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  items[idx] = { ...items[idx], status };
  const next: InquiriesFile = {
    items,
    updatedAt: new Date().toISOString(),
  };
  if (hasBlob()) {
    await writeBlob(next);
  } else {
    await writeLocal(next);
  }
  return items[idx];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const items = await readInquiries();
  const nextItems = items.filter((i) => i.id !== id);
  if (nextItems.length === items.length) return false;
  const next: InquiriesFile = {
    items: nextItems,
    updatedAt: new Date().toISOString(),
  };
  if (hasBlob()) {
    await writeBlob(next);
  } else {
    await writeLocal(next);
  }
  return true;
}
