// Renderiza { slides: [{ html }] } em PNG 1080x1350 e JPEG (para publicar).
// Uso: node render.mjs carrossel.json pasta-saida [foto.jpg]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [, , input, outArg, photo] = process.argv;
const outDir = path.resolve(outArg);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(path.join(HERE, "package.json"));
const puppeteer = require("puppeteer");

const chrome = ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) =>
  fs.existsSync(p)
);
const font = (fam, file, w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};src:url('file://${HERE}/node_modules/@fontsource/${file}') format('woff2');}`;
const fontCss = [
  font("Anton", "anton/files/anton-latin-400-normal.woff2", 400),
  ...[400, 500, 600, 700, 800, 900].map((w) => font("Inter", `inter/files/inter-latin-${w}-normal.woff2`, w)),
].join("");

const { slides } = JSON.parse(fs.readFileSync(input, "utf-8"));
fs.mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  ...(chrome ? { executablePath: chrome } : {}),
  args: ["--no-sandbox", "--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350 });
for (const [i, s] of slides.entries()) {
  const photoUrl = photo ? `file://${path.resolve(photo)}` : "/missing.jpg";
  const body = s.html.replaceAll("/uploads/ricardo-capa.jpg", photoUrl);
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${fontCss}</style>
<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:1080px;height:1350px;overflow:hidden;}</style></head><body>${body}</body></html>`;
  const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.html`);
  fs.writeFileSync(file, doc);
  await page.goto(`file://${file}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const base = file.replace(/\.html$/, "");
  await page.screenshot({ path: `${base}.png` });
  await page.screenshot({ path: `${base}.jpg`, type: "jpeg", quality: 92 });
}
await browser.close();
console.log(`${slides.length} slides em ${outDir}`);
