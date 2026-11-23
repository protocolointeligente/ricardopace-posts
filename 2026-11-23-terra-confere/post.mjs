// Imagem única 1080x1350 — 23/11/2026 18:45 — complementa o Reel "Stiff, terra ou sumô".
// Reaproveita tokens, CSS e componentes do design system (design.mjs); sem contador de slides.
import { TOKENS as T, BASE_CSS, tag, title, rule, text, shareLine } from "./design.mjs";

const photo = `
<div style="position:absolute;right:-60px;top:0;width:620px;height:100%;background:url('/uploads/ricardo-capa.jpg') 45% 30%/cover no-repeat;"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg, ${T.ink} 46%, rgba(11,11,12,.75) 60%, rgba(11,11,12,.05) 82%), linear-gradient(0deg, ${T.ink} 4%, rgba(11,11,12,0) 26%), linear-gradient(180deg, ${T.ink} 2%, rgba(11,11,12,0) 16%);"></div>`;

const item = (n, html) => `<div style="display:flex;gap:26px;align-items:center;">
<div style="width:66px;height:66px;flex:none;background:${T.orange};color:${T.ink};display:flex;align-items:center;justify-content:center;font-family:'Anton',sans-serif;font-size:42px;">${n}</div>
<div class="body" style="font-size:38px;line-height:1.2;">${html}</div></div>`;

const html = `<style>${BASE_CSS}</style>
<div class="s dark">${photo}
<div class="pad">
  <div class="top"><div class="brand">${T.author}<i>|</i><span>${T.series}</span></div></div>
  ${tag("LEVANTAMENTO TERRA", { mt: 64 })}
  ${title(`Antes de puxar, <span class="o">confere</span>`, { size: 124, mt: 34, maxWidth: 620 })}
  ${rule()}
  <div style="display:flex;flex-direction:column;gap:34px;max-width:640px;">
    ${item(1, `Barra em cima do <b class="o">meio do pé</b>`)}
    ${item(2, `Mãos logo <b class="o">fora das pernas</b>`)}
    ${item(3, `<b class="o">Costas firmes</b> antes de sair do chão`)}
    ${item(4, `<b class="o">Empurra o chão</b>, não arranca com a lombar`)}
  </div>
  ${shareLine(`Manda pro parceiro que puxa terra <b style="color:${T.white};">no susto</b>.`)}
</div>
<div class="foot"><div class="ref" style="font-size:26px;opacity:1;max-width:none;white-space:nowrap;">Quer seu treino montado? Manda <b class="o">TREINO</b> no direct.</div><div class="handle">${T.handle}</div></div>
</div>`.replace(/\n\s*/g, "\n").trim();

process.stdout.write(JSON.stringify({ slides: [{ html, order: 0 }] }));
