/**
 * Obnoví OAuth Bearer token pro Collabim MCP v ~/.cursor/mcp.json
 *
 * Potřebuje:
 *   COLLABIM_MCP_CLIENT_ID
 *   COLLABIM_MCP_CLIENT_SECRET
 *
 * Spuštění:
 *   node --env-file=.env.local scripts/collabim-refresh-mcp-token.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const clientId = process.env.COLLABIM_MCP_CLIENT_ID?.trim();
const clientSecret = process.env.COLLABIM_MCP_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    "Chybí COLLABIM_MCP_CLIENT_ID / COLLABIM_MCP_CLIENT_SECRET.\n" +
      "Najdete je v Collabimu u API klíče jako „MCP client ID“ a „MCP client secret“.\n" +
      "Dejte je do .env.local a spusťte znovu.",
  );
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: "client_credentials",
  client_id: clientId,
  client_secret: clientSecret,
});

const res = await fetch("https://mcp.oncollabim.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body,
});
const json = await res.json().catch(() => ({}));
if (!res.ok || !json.access_token) {
  console.error("Token endpoint selhal:", res.status, json);
  process.exit(1);
}

const mcpPath = join(homedir(), ".cursor", "mcp.json");
let raw = readFileSync(mcpPath, "utf8");
const bom = raw.charCodeAt(0) === 0xfeff;
if (bom) raw = raw.slice(1);
const cfg = JSON.parse(raw);
if (!cfg.mcpServers?.["collabim-api"]) {
  cfg.mcpServers = cfg.mcpServers || {};
  cfg.mcpServers["collabim-api"] = { url: "https://mcp.oncollabim.com", headers: {} };
}
cfg.mcpServers["collabim-api"].url = "https://mcp.oncollabim.com";
cfg.mcpServers["collabim-api"].headers = {
  ...(cfg.mcpServers["collabim-api"].headers || {}),
  Authorization: `Bearer ${json.access_token}`,
};

const out = `${bom ? "\uFEFF" : ""}${JSON.stringify(cfg, null, 4)}\n`;
writeFileSync(mcpPath, out, "utf8");
console.log(
  "MCP token uložen do ~/.cursor/mcp.json. Restartujte Collabim MCP v Cursor Settings → Tools & MCP.",
);
if (json.expires_in) {
  console.log(`Platnost cca ${Math.round(json.expires_in / 3600)} h.`);
}
