import sharp from "sharp";
import { statSync } from "fs";

const out = "public/akce/akce-flyer-bg.webp";

const cover = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="220">
    <rect width="100%" height="100%" fill="rgb(8,10,14)"/>
  </svg>`,
);

// Výřez světlometu + zakrytí případných zbytků textu nahoře.
await sharp("public/akce/akce-svetlomety-poster.png")
  .extract({ left: 520, top: 680, width: 480, height: 600 })
  .resize(1024, 1536, { fit: "cover", position: "centre" })
  .composite([{ input: cover, top: 0, left: 0 }])
  .modulate({ brightness: 0.8, saturation: 1.1 })
  .webp({ quality: 90 })
  .toFile(out);

console.log("OK", out, statSync(out).size);
