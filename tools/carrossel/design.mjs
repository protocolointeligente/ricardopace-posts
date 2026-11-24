// Design system "Ricardo Pace — Ciência e Treinamento". Fonte única de tokens, CSS e componentes.

export const TOKENS = {
  orange: "#FF6A00",
  ink: "#0B0B0C",
  ink2: "#151518",
  ink3: "#232328",
  paper: "#F3F2EF",
  white: "#F7F7F5",
  muted: "#A6A6AB",
  mutedDark: "#5E5E63",
  handle: "@personal.ricardopace",
  series: "CIÊNCIA E TREINAMENTO",
  author: "RICARDO PACE",
  photo: "/uploads/ricardo-capa.jpg",
};

export const SIZE = { width: 1080, height: 1350 };

const T = TOKENS;
const { width: W, height: H } = SIZE;

export const BASE_CSS = `
.s{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:'Inter',sans-serif;}
.s.dark{background:${T.ink};color:${T.white};}
.s.light{background:${T.paper};color:${T.ink};}
.s.accent{background:${T.orange};color:${T.ink};}
.h{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;line-height:.94;letter-spacing:.004em;}
.o{color:${T.orange};}
.accent .o{color:${T.white};}
.pad{position:absolute;inset:0;padding:72px 72px 0 72px;display:flex;flex-direction:column;}
.top{display:flex;align-items:center;justify-content:space-between;}
.brand{font-size:22px;font-weight:700;letter-spacing:.2em;}
.brand span{font-weight:400;opacity:.75;}
.brand i{font-style:normal;color:${T.orange};margin:0 10px;}
.accent .brand i{color:${T.ink};}
.count{font-family:'Anton',sans-serif;font-size:46px;line-height:1;}
.count b{font-weight:400;color:${T.orange};}
.accent .count b{color:${T.white};}
.bar{position:absolute;left:0;top:0;height:8px;background:${T.orange};}
.accent .bar{background:${T.ink};}
.rule{width:110px;height:8px;background:${T.orange};margin:36px 0;}
.accent .rule{background:${T.ink};}
.body{font-size:38px;line-height:1.32;font-weight:500;}
.body b{font-weight:800;}
.foot{position:absolute;left:72px;right:72px;bottom:56px;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;padding-top:24px;}
.dark .foot{border-top:2px solid ${T.ink3};}
.light .foot{border-top:2px solid #D9D8D4;}
.accent .foot{border-top:2px solid rgba(11,11,12,.25);}
.ref{font-size:19px;line-height:1.45;max-width:720px;opacity:.82;}
.ref b{font-weight:800;}
.handle{font-size:24px;font-weight:700;white-space:nowrap;}
.handle::after{content:"";display:inline-block;width:4px;height:30px;background:${T.orange};margin-left:16px;vertical-align:-6px;}
.accent .handle::after{background:${T.ink};}
`;

const header = (n, total) => `
<div class="bar" style="width:${Math.round((n / total) * W)}px"></div>
<div class="top">
  <div class="brand">${T.author}<i>|</i><span>${T.series}</span></div>
  <div class="count"><b>${n}</b>/${total}</div>
</div>`;

const footer = (refs) => {
  const list = (refs ?? []).filter(Boolean);
  const label = list.length > 1 ? "Referências" : "Referência";
  return `
<div class="foot">
  <div class="ref">${list.length ? `<b>${label}:</b> ${list.join("<br>")}` : ""}</div>
  <div class="handle">${T.handle}</div>
</div>`;
};

export const slide = ({ theme, n, total, content, refs = [], behind = "" }) =>
  `<style>${BASE_CSS}</style>
<div class="s ${theme}">${behind}
<div class="pad">${header(n, total)}${content}</div>${footer(refs)}
</div>`.replace(/\n\s*/g, "\n").trim();

export const tag = (text, { mt = 36, dark = false } = {}) =>
  `<div style="margin-top:${mt}px;display:inline-flex;align-self:flex-start;background:${dark ? T.ink : T.orange};color:${dark ? T.orange : T.ink};font-weight:800;font-size:24px;letter-spacing:.16em;padding:12px 20px;">${text}</div>`;

export const title = (html, { size = 120, mt = 64, maxWidth, color } = {}) =>
  `<div class="h" style="font-size:${size}px;margin-top:${mt}px;${maxWidth ? `max-width:${maxWidth}px;` : ""}${color ? `color:${color};` : ""}">${html}</div>`;

export const text = (html, { size = 38, mt = 36, maxWidth, color } = {}) =>
  `<div class="body" style="font-size:${size}px;margin-top:${mt}px;${maxWidth ? `max-width:${maxWidth}px;` : ""}${color ? `color:${color};` : ""}">${html}</div>`;

export const kicker = (label, { mt = 110 } = {}) =>
  `<div style="margin-top:${mt}px;font-size:30px;font-weight:700;letter-spacing:.18em;color:${T.muted};">${label}</div>`;

export const stamp = (label) =>
  `<div style="margin-top:48px;align-self:flex-start;transform:rotate(-3deg);border:6px solid ${T.orange};color:${T.orange};font-family:'Anton',sans-serif;font-size:64px;padding:6px 26px;letter-spacing:.04em;">${label}</div>`;

export const rule = () => `<div class="rule"></div>`;

export const swipe = () =>
  `<div style="margin-top:44px;display:flex;align-items:center;gap:18px;font-weight:800;font-size:26px;letter-spacing:.14em;">ARRASTA <span class="o" style="font-size:44px;line-height:1;">→</span></div>`;

export const numbered = (items, { mt = 72, gap = 60, size = 40 } = {}) =>
  `<div style="margin-top:${mt}px;display:flex;flex-direction:column;gap:${gap}px;">${items
    .map(
      (t, i) => `<div style="display:flex;gap:34px;align-items:flex-start;">
<div style="font-family:'Anton',sans-serif;font-size:64px;line-height:.9;color:${T.orange};min-width:86px;">${String(i + 1).padStart(2, "0")}</div>
<div class="body" style="border-left:4px solid ${T.orange};padding-left:30px;font-size:${size}px;">${t}</div></div>`
    )
    .join("")}</div>`;

export const compare = (cards, { mt = 44 } = {}) =>
  `<div style="margin-top:${mt}px;display:grid;grid-template-columns:repeat(${cards.length},1fr);gap:24px;">${cards
    .map(
      (c) => `<div style="background:${c.highlight ? T.ink : "#E4E3DF"};color:${c.highlight ? T.white : T.ink};padding:36px;">
<div class="h" style="font-size:84px;color:${c.highlight ? T.orange : T.mutedDark};">${c.label}</div>
<div class="body" style="font-size:31px;margin-top:18px;">${c.text}</div></div>`
    )
    .join("")}</div>`;

export const zones = (items, { mt = 46, minHeight = 330, cols } = {}) =>
  `<div style="margin-top:${mt}px;display:grid;grid-template-columns:${cols ?? items.map((z) => (z.highlight ? "1.25fr" : "1fr")).join(" ")};gap:10px;">${items
    .map(
      (z) => `<div style="background:${z.highlight ? T.orange : T.ink3};color:${z.highlight ? T.ink : T.white};padding:30px 24px;min-height:${minHeight}px;display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
<div class="h" style="font-size:${z.size ?? 72}px;">${z.label}</div><div style="font-size:31px;line-height:1.25;font-weight:700;">${z.text}</div></div>`
    )
    .join("")}</div>`;

export const rows = (items, { mt = 40, valueSize = 78 } = {}) =>
  `<div style="margin-top:${mt}px;display:flex;flex-direction:column;gap:16px;">${items
    .map(
      (r) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:24px;background:#fff;padding:32px 36px;border-left:10px solid ${T.orange};">
<div><div style="font-size:38px;font-weight:800;">${r.name}</div>${r.detail ? `<div style="font-size:26px;color:${T.mutedDark};margin-top:6px;">${r.detail}</div>` : ""}</div>
<div class="h" style="font-size:${valueSize}px;color:${T.orange};white-space:nowrap;">${r.value}</div></div>`
    )
    .join("")}</div>`;

export const checklist = (items, { mt = 48, size = 37 } = {}) =>
  `<div style="margin-top:${mt}px;display:flex;flex-direction:column;gap:30px;">${items
    .map(
      (t) => `<div style="display:flex;gap:26px;align-items:center;">
<div style="width:54px;height:54px;flex:none;background:${T.ink};color:${T.orange};display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;">✓</div>
<div class="body" style="font-size:${size}px;">${t}</div></div>`
    )
    .join("")}</div>`;

export const ctaBox = (question, keyword) =>
  `<div style="margin-top:48px;max-width:880px;border:4px solid ${T.orange};padding:34px 38px;display:flex;align-items:center;gap:30px;">
<div class="h o" style="font-size:96px;">→</div>
<div style="font-size:38px;line-height:1.25;font-weight:600;">${question}<br>Envie <b class="o" style="font-weight:900;">“${keyword}”</b> no direct.</div></div>`;

export const shareLine = (html) =>
  `<div style="margin-top:34px;font-size:30px;font-weight:600;color:${T.muted};">${html}</div>`;

export const coverPhoto = (src = T.photo) => `
<div style="position:absolute;right:-120px;top:140px;width:640px;height:calc(100% - 140px);background:url('${src}') center top/cover no-repeat, radial-gradient(circle at 60% 35%, #3a2a1f 0%, ${T.ink} 70%);"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg, ${T.ink} 44%, rgba(11,11,12,.7) 58%, rgba(11,11,12,0) 80%), linear-gradient(0deg, ${T.ink} 6%, rgba(11,11,12,0) 30%), linear-gradient(180deg, ${T.ink} 10%, rgba(11,11,12,0) 22%);"></div>`;

export const ctaPhoto = (src = T.photo) => `
<div style="position:absolute;right:-120px;bottom:0;width:620px;height:1000px;background:url('${src}') center top/cover no-repeat;opacity:.55;"></div>
<div style="position:absolute;inset:0;background:linear-gradient(90deg, ${T.ink} 45%, rgba(11,11,12,.6) 70%, rgba(11,11,12,.2) 100%), linear-gradient(0deg, ${T.ink} 8%, rgba(11,11,12,0) 35%), linear-gradient(180deg, ${T.ink} 26%, rgba(11,11,12,0) 42%);"></div>`;
