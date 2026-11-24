const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const src = path.join(
  process.env.USERPROFILE,
  ".cursor/projects/c-Users-Jind-ich-Blan-Desktop-drdetailing-web/assets/A2-3b-serif.png",
);
const outPng = path.join(__dirname, "../public/brand/logo.png");
const outStamp = path.join(__dirname, "../public/brand/logo-razitko.png");

function isPaper(r, g, b) {
  return r > 208 && g > 208 && b > 208 && Math.abs(r - g) < 28 && Math.abs(g - b) < 28;
}

async function main() {
  if (!fs.existsSync(src)) throw new Error("Missing source: " + src);

  const { data, info } = await sharp(src)
    .extract({ left: 400, top: 40, width: 480, height: 620 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const px = Buffer.from(data);
  for (let i = 0; i < px.length; i += 4) {
    if (isPaper(px[i], px[i + 1], px[i + 2])) px[i + 3] = 0;
  }

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = px[(y * w + x) * 4 + 3];
      if (a < 16) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const cropped = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const si = ((minY + y) * w + (minX + x)) * 4;
      const di = (y * cw + x) * 4;
      px.copy(cropped, di, si, si + 4);
    }
  }

  await sharp(cropped, { raw: { width: cw, height: ch, channels: 4 } })
    .png()
    .toFile(outPng);

  const stampH = Math.min(ch, Math.round(ch * 0.73));
  await sharp(outPng)
    .extract({ left: 0, top: 0, width: cw, height: stampH })
    .png()
    .toFile(outStamp);

  console.log("logo.png", cw, ch);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
