import QRCode from "qrcode";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "marketing", "vizitka");
const PUBLIC_OUT = path.join(ROOT, "public", "brand", "vizitka");
const DESKTOP = path.join(os.homedir(), "Desktop", "Drdetailing vizitka");
const SITE_URL = "https://drdetailing.cz";

/** Po naskenování telefon nabídne „Uložit kontakt“. */
const VCARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N;CHARSET=UTF-8:Doktor;Patrik;;;",
  "FN;CHARSET=UTF-8:Patrik Doktor",
  "ORG;CHARSET=UTF-8:Dr Detailing",
  "TITLE;CHARSET=UTF-8:autodetailing Praha 9",
  "TEL;TYPE=CELL:+420739411108",
  "EMAIL;TYPE=INTERNET:info@drdetailing.cz",
  `URL:${SITE_URL}`,
  "ADR;CHARSET=UTF-8;TYPE=WORK:;;Lukavecká 1732;Praha 9 - Horní Počernice;Praha;193 00;Česká republika",
  "END:VCARD",
].join("\n");

for (const dir of [OUT, PUBLIC_OUT, DESKTOP]) {
  fs.mkdirSync(dir, { recursive: true });
}

const qrOpts = {
  type: "png",
  width: 1024,
  margin: 2,
  errorCorrectionLevel: "M",
};

const qrPng = await QRCode.toBuffer(VCARD, {
  ...qrOpts,
  color: { dark: "#1f7a52", light: "#FFFFFF" },
});
await sharp(qrPng).png().toFile(path.join(OUT, "drdetailing-qr.png"));

const qrScan = await QRCode.toBuffer(VCARD, {
  ...qrOpts,
  margin: 3,
  color: { dark: "#000000", light: "#FFFFFF" },
});
await sharp(qrScan).png().toFile(path.join(OUT, "drdetailing-qr-sken.png"));

const qrWeb = await QRCode.toBuffer(SITE_URL, {
  ...qrOpts,
  margin: 3,
  errorCorrectionLevel: "H",
  color: { dark: "#000000", light: "#FFFFFF" },
});
await sharp(qrWeb).png().toFile(path.join(OUT, "drdetailing-qr-web.png"));

const qrDataUrl = await QRCode.toDataURL(VCARD, {
  width: 480,
  margin: 1,
  errorCorrectionLevel: "M",
  color: { dark: "#1f7a52", light: "#FFFFFF" },
});

const stampSrc = path.join(ROOT, "public", "brand", "logo-razitko.png");
const stampPng = await sharp(stampSrc).resize(220, 220).png().toBuffer();
const stampB64 = "data:image/png;base64," + stampPng.toString("base64");
const stampPrint = await sharp(stampSrc).resize(88, 88).png().toBuffer();
const stampPrintB64 = "data:image/png;base64," + stampPrint.toString("base64");

const phoneSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1620" viewBox="0 0 1080 1620">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f2e22"/>
      <stop offset="50%" stop-color="#164a35"/>
      <stop offset="100%" stop-color="#1f7a52"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#e8ebf0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1620" fill="url(#bg)"/>
  <circle cx="980" cy="110" r="220" fill="#1f7a52" opacity="0.35"/>
  <circle cx="80" cy="1500" r="280" fill="#FFFFFF" opacity="0.06"/>
  <rect x="64" y="100" width="952" height="1420" rx="48" fill="url(#card)"/>
  <image href="${stampB64}" x="430" y="140" width="220" height="220"/>
  <text x="540" y="410" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="54" fill="#12161c" letter-spacing="2">DR DETAILING</text>
  <text x="540" y="458" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#1f7a52" letter-spacing="1.5">Diagnostika · Léčba · Lesk</text>
  <line x1="280" y1="500" x2="800" y2="500" stroke="#d4d9e0" stroke-width="2"/>
  <text x="540" y="570" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="40" fill="#12161c">Patrik Doktor</text>
  <text x="540" y="616" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#5a6470">autodetailing Praha 9</text>
  <text x="540" y="680" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="32" fill="#12161c">+420 739 411 108</text>
  <text x="540" y="728" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#1f7a52">info@drdetailing.cz</text>
  <text x="540" y="774" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="28" fill="#0f2e22">drdetailing.cz</text>
  <text x="540" y="820" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#8a93a0">Lukavecká 1732 · Horní Počernice</text>
  <rect x="270" y="860" width="540" height="540" rx="28" fill="#FFFFFF" stroke="#d4d9e0" stroke-width="2"/>
  <image href="${qrDataUrl}" x="300" y="890" width="480" height="480"/>
  <text x="540" y="1470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#5a6470">Naskenujte QR → uloží kontakt do telefonu</text>
</svg>`;

await sharp(Buffer.from(phoneSvg)).png().toFile(path.join(OUT, "drdetailing-vizitka-telefon.png"));

const printQr = await QRCode.toDataURL(VCARD, {
  width: 280,
  margin: 1,
  errorCorrectionLevel: "M",
  color: { dark: "#1f7a52", light: "#FFFFFF" },
});

const printSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1004" height="650" viewBox="0 0 1004 650">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f2e22"/>
      <stop offset="100%" stop-color="#1f7a52"/>
    </linearGradient>
  </defs>
  <rect width="1004" height="650" fill="#FFFFFF"/>
  <rect width="28" height="650" fill="url(#pbg)"/>
  <image href="${stampPrintB64}" x="72" y="48" width="88" height="88"/>
  <text x="176" y="88" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="36" fill="#12161c" letter-spacing="1">DR DETAILING</text>
  <text x="176" y="122" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#1f7a52">Diagnostika · Léčba · Lesk</text>
  <text x="72" y="230" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="34" fill="#12161c">Patrik Doktor</text>
  <text x="72" y="272" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#5a6470">autodetailing Praha 9</text>
  <text x="72" y="350" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="24" fill="#12161c">+420 739 411 108</text>
  <text x="72" y="392" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#1f7a52">info@drdetailing.cz</text>
  <text x="72" y="434" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="#0f2e22">drdetailing.cz</text>
  <text x="72" y="500" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8a93a0">Lukavecká 1732 · Horní Počernice</text>
  <text x="72" y="532" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#8a93a0">IČO 88676234</text>
  <rect x="680" y="155" width="260" height="260" rx="16" fill="#f6f8f6" stroke="#d4d9e0"/>
  <image href="${printQr}" x="700" y="175" width="220" height="220"/>
  <text x="810" y="450" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#5a6470">uložit kontakt</text>
</svg>`;

await sharp(Buffer.from(printSvg)).png().toFile(path.join(OUT, "drdetailing-vizitka-tisk.png"));

const files = [
  "drdetailing-qr.png",
  "drdetailing-qr-sken.png",
  "drdetailing-qr-web.png",
  "drdetailing-vizitka-telefon.png",
  "drdetailing-vizitka-tisk.png",
];

for (const file of files) {
  const src = path.join(OUT, file);
  fs.copyFileSync(src, path.join(PUBLIC_OUT, file));
  fs.copyFileSync(src, path.join(DESKTOP, file));
}

console.log("Hotovo:", files.join(", "));
console.log("Plocha:", DESKTOP);
