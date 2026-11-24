/**
 * Propojí Collabim klíčová slova s cílovými URL na drdetailing.cz.
 *
 * Potřebuje v .env.local:
 *   COLLABIM_API_KEY              (Authorization header, bez Bearer)
 *   COLLABIM_MCP_CLIENT_ID
 *   COLLABIM_MCP_CLIENT_SECRET
 *
 * Volitelně:
 *   COLLABIM_PROJECT_ID=272782
 *   COLLABIM_DRY_RUN=1
 *
 * Spuštění:
 *   node --env-file=.env.local scripts/collabim-link-keywords.mjs
 *   node --env-file=.env.local scripts/collabim-refresh-mcp-token.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://drdetailing.cz";
const API = "https://api.oncollabim.com";
const MCP = "https://mcp.oncollabim.com";
const DRY = process.env.COLLABIM_DRY_RUN === "1";

function loadMapping() {
  const src = readFileSync(join(ROOT, "src/content/collabim-keywords.ts"), "utf8");
  const pages = [];
  const re =
    /\{\s*keyword:\s*"([^"]+)"\s*,\s*volumeGoogle:\s*(\d+)\s*,\s*page:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    pages.push({
      keyword: m[1],
      volumeGoogle: Number(m[2]),
      page: m[3],
      url: `${SITE}${m[3]}`,
    });
  }
  if (!pages.length) {
    throw new Error("Nepodařilo se načíst mapování z collabim-keywords.ts");
  }
  return pages;
}

function authHeaders(apiKey) {
  return {
    Accept: "application/collabim+json",
    Authorization: apiKey,
  };
}

async function apiGet(path, apiKey, params = {}) {
  const u = new URL(path, API);
  for (const [k, v] of Object.entries(params)) {
    if (v != null) u.searchParams.set(k, String(v));
  }
  const res = await fetch(u, { headers: authHeaders(apiKey) });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Collabim ${res.status}: ${text.slice(0, 300)}`);
  }
  if (!res.ok) {
    throw new Error(`Collabim ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  }
  return json;
}

async function listAllKeywords(apiKey, projectId) {
  const out = [];
  let page = 1;
  for (;;) {
    const json = await apiGet("/keywords", apiKey, {
      projectId,
      page,
      itemsPerPage: 100,
    });
    const chunk = json.data ?? [];
    out.push(...chunk);
    if (chunk.length < 100) break;
    page += 1;
  }
  return out;
}

async function findProjectId(apiKey) {
  if (process.env.COLLABIM_PROJECT_ID) {
    return Number(process.env.COLLABIM_PROJECT_ID);
  }
  const json = await apiGet("/projects", apiKey, { itemsPerPage: 50 });
  const projects = json.data ?? [];
  const hit = projects.find((p) => {
    const hay =
      `${p.name ?? ""} ${p.website ?? ""} ${p.webSiteUrl ?? ""} ${p.url ?? ""}`.toLowerCase();
    return hay.includes("drdetailing");
  });
  if (!hit) {
    throw new Error("Nenašel jsem projekt drdetailing — nastavte COLLABIM_PROJECT_ID");
  }
  return hit.id;
}

function norm(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\/$/, "");
}

async function ensureMcpToken() {
  const clientId = process.env.COLLABIM_MCP_CLIENT_ID?.trim();
  const clientSecret = process.env.COLLABIM_MCP_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error("Chybí COLLABIM_MCP_CLIENT_ID / COLLABIM_MCP_CLIENT_SECRET");
  }
  const res = await fetch(`${MCP}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(`MCP token selhal: ${res.status} ${JSON.stringify(json).slice(0, 200)}`);
  }

  const mcpPath = join(homedir(), ".cursor", "mcp.json");
  let raw = readFileSync(mcpPath, "utf8");
  const bom = raw.charCodeAt(0) === 0xfeff;
  if (bom) raw = raw.slice(1);
  const cfg = JSON.parse(raw);
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers["collabim-api"] = {
    url: MCP,
    headers: { Authorization: `Bearer ${json.access_token}` },
  };
  writeFileSync(
    mcpPath,
    `${bom ? "\uFEFF" : ""}${JSON.stringify(cfg, null, 4)}\n`,
    "utf8",
  );
  return json.access_token;
}

async function mcpCall(token, name, args) {
  const res = await fetch(MCP, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  const text = await res.text();
  const dataLine = text.split(/\r?\n/).find((l) => l.startsWith("data: "));
  const payload = dataLine ? dataLine.slice(6) : text;
  const json = JSON.parse(payload);
  if (json.error) {
    throw new Error(`MCP ${name}: ${JSON.stringify(json.error).slice(0, 400)}`);
  }
  return json.result;
}

async function main() {
  const apiKey = process.env.COLLABIM_API_KEY?.trim();
  if (!apiKey) {
    console.error("Chybí COLLABIM_API_KEY v .env.local");
    process.exit(1);
  }

  const mapping = loadMapping();
  console.log(`Mapování: ${mapping.length} KW`);

  const projectId = await findProjectId(apiKey);
  console.log(`Projekt ID: ${projectId}`);

  const existing = await listAllKeywords(apiKey, projectId);
  console.log(`Klíčových slov v projektu: ${existing.length}`);

  const byNorm = new Map();
  for (const row of existing) {
    byNorm.set(norm(row.keyword ?? row.name), row);
  }

  const byUrl = new Map();
  const missing = [];
  let already = 0;
  for (const item of mapping) {
    const row = byNorm.get(norm(item.keyword));
    if (!row) {
      missing.push(item.keyword);
      continue;
    }
    const current = row.targetPageUrl ?? "";
    if (norm(current) === norm(item.url)) {
      already += 1;
      continue;
    }
    if (!byUrl.has(item.url)) byUrl.set(item.url, []);
    byUrl.get(item.url).push(row.id);
  }

  console.log(`Už správně: ${already}`);
  console.log(`K aktualizaci: ${[...byUrl.values()].reduce((n, a) => n + a.length, 0)}`);
  if (missing.length) {
    console.log(`Chybí v projektu (${missing.length}):`, missing.join(", "));
  }

  if (byUrl.size === 0) {
    console.log("Není co měnit.");
    return;
  }

  const token = DRY ? null : await ensureMcpToken();
  for (const [url, ids] of byUrl) {
    console.log(`→ ${url} (${ids.length})`);
    if (DRY) continue;
    const result = await mcpCall(token, "collabim_keywords_batch_update_target_page", {
      projectId,
      keywordIds: ids,
      targetPageUrl: url,
    });
    console.log(" ", JSON.stringify(result).slice(0, 220));
  }

  console.log(DRY ? "Dry-run hotov." : "Hotovo — cílové stránky jsou nastavené v Collabimu.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
