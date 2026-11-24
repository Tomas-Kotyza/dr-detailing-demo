import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export type NewsletterSubscriber = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  source: "lead-popup" | "ebook" | "other";
  status: "new" | "sent" | "unsubscribed";
};

type NewsletterFile = {
  items: NewsletterSubscriber[];
  updatedAt: string;
};

const LOCAL_PATH = path.join(process.cwd(), "data", "newsletter.json");
const BLOB_PATHNAME = "drdetailing-newsletter.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function emptyFile(): NewsletterFile {
  return { items: [], updatedAt: new Date().toISOString() };
}

async function readLocal(): Promise<NewsletterFile> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    const data = JSON.parse(raw) as NewsletterFile;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return emptyFile();
  }
}

async function writeLocal(data: NewsletterFile) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function readBlob(): Promise<NewsletterFile | null> {
  if (!hasBlob()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 });
    const hit = blobs.find((b) => b.pathname === BLOB_PATHNAME) ?? blobs[0];
    if (!hit?.url) return null;
    const url = new URL(hit.url);
    url.searchParams.set("v", String(Date.now()));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as NewsletterFile;
    return {
      items: Array.isArray(data.items) ? data.items : [],
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function writeBlob(data: NewsletterFile) {
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readAll(): Promise<NewsletterFile> {
  const fromBlob = await readBlob();
  if (fromBlob) return fromBlob;
  return readLocal();
}

async function writeAll(data: NewsletterFile) {
  if (hasBlob()) {
    await writeBlob(data);
    return;
  }
  await writeLocal(data);
}

export async function readNewsletter(): Promise<NewsletterSubscriber[]> {
  return (await readAll()).items;
}

export async function addNewsletterSubscriber(input: {
  name: string;
  email: string;
  source: NewsletterSubscriber["source"];
}): Promise<NewsletterSubscriber> {
  const file = await readAll();
  const email = input.email.trim().toLowerCase();
  const existing = file.items.find((i) => i.email === email);
  if (existing) {
    return existing;
  }
  const item: NewsletterSubscriber = {
    id: `nl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    email,
    source: input.source,
    status: "new",
  };
  await writeAll({
    items: [item, ...file.items].slice(0, 2000),
    updatedAt: new Date().toISOString(),
  });
  return item;
}
