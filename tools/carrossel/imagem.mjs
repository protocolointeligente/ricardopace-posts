// Post estático "Imagem" 1080x1350 (modelo da Imagem de 23/11 "Antes de puxar o terra"), vários de uma vez.
// Uso: node imagem.mjs specs.json  -> imprime {slides:[...]} para o render.mjs; cada spec vira um slide, na ordem.
// spec: {tag, title (com <o>), items: [4 itens com <o>], share, ref, photo (caminho absoluto), pos: "45% 30%"}
import fs from "node:fs";
import { TOKENS as T, BASE_CSS, tag, title, rule, shareLine } from "./design.mjs";
const rich = (s) => (s || "").replaceAll("<o>", '<b class="o">').replaceAll("</o>", "</b>");
const item = (n, h) => `<div style="display:flex;gap:26px;align-items:center;">
<div style="width:66px;height:66px;flex:none;background:${T.orange};color:${T.ink};display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:42px;">${n}</div>
<div class="body" style="font-size:36px;line-height:1.2;">${rich(h)}</div></div>`;
const one = (s) => `<style>${BASE_CSS}</style>
<div class="s dark">
<div style="position:absolute;right:-60px;top:0;width:620px;height:100%;background:url('file://${s.photo}') ${s.pos || "45% 30%"}/cover no-repeat;"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg, ${T.ink} 46%, rgba(11,11,12,.75) 60%, rgba(11,11,12,.05) 82%), linear-gradient(0deg, ${T.ink} 4%, rgba(11,11,12,0) 26%), linear-gradient(180deg, ${T.ink} 2%, rgba(11,11,12,0) 16%);"></div>
<div class="pad">
  <div class="top"><div class="brand">${T.author}<i>|</i><span>${T.series}</span></div></div>
  ${tag(s.tag, { mt: 56 })}
  ${title(s.title.replaceAll("<o>", '<span class="o">').replaceAll("</o>", "</span>"), { size: s.size || 112, mt: 30, maxWidth: 640 })}
  ${rule()}
  <div style="display:flex;flex-direction:column;gap:30px;max-width:640px;">${s.items.map((x, i) => item(i + 1, x)).join("")}</div>
  ${s.share ? `<div style="max-width:640px">` + shareLine(rich(s.share).replaceAll('class="o"', `style="color:${T.white}"`)) + `</div>` : ""}
  ${s.ref ? `<div style="position:absolute;left:72px;right:72px;bottom:150px;font-size:20px;line-height:1.4;color:${T.muted};"><b>Ref.:</b> ${s.ref}</div>` : ""}
</div>
<div class="foot"><div class="ref" style="font-size:26px;opacity:1;max-width:none;white-space:nowrap;">${s.cta || `Quer seu treino montado? Manda <b class="o">TREINO</b> no direct.`}</div><div class="handle">${T.handle}</div></div>
</div>`.replace(/\n\s*/g, "\n").trim();
const specs = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
process.stdout.write(JSON.stringify({ slides: specs.map((s, i) => ({ html: one(s), order: i })) }));
