// Gera o PDF "Desafio 21 Dias · Protocolo Inteligente" com a identidade Ricardo Pace.
// Uso: node build.mjs  → saida/desafio-21-dias.pdf (+ PNGs de conferência com --png)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { DIAS, SEMANAS, REFS, CHECKLIST } from "./conteudo.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const MODS = "/home/claude/carrossel-30mais";
const require = createRequire(path.join(MODS, "package.json"));
const puppeteer = require("puppeteer");
const FONTS = `${MODS}/node_modules/@fontsource`;
const FOTOS = "/home/claude/ricardopace-posts/fotos";
const OUT = path.join(HERE, "saida");
fs.mkdirSync(OUT, { recursive: true });

const C = { o: "#FF6A00", ink: "#0B0B0C", ink2: "#151518", ink3: "#232328", paper: "#F3F2EF", card: "#FFFFFF", mu: "#5E5E63", line: "#D9D8D4" };
const TOTAL = 21;

const css = `
@font-face{font-family:Anton;src:url('file://${FONTS}/anton/files/anton-latin-400-normal.woff2')}
${[400, 500, 600, 700, 800].map((w) => `@font-face{font-family:Inter;font-weight:${w};src:url('file://${FONTS}/inter/files/inter-latin-${w}-normal.woff2')}`).join("")}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,sans-serif;color:${C.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;background:${C.paper};page-break-after:always;padding:20mm 17mm 22mm;display:flex;flex-direction:column}
.pg.dark{background:${C.ink};color:#F7F7F5}
.h{font-family:Anton,sans-serif;text-transform:uppercase;line-height:.95;font-weight:400;letter-spacing:.005em}
.o{color:${C.o}}
.top{position:absolute;left:17mm;right:17mm;top:9mm;display:flex;justify-content:space-between;font-size:8.5pt;font-weight:700;letter-spacing:.16em}
.top span{opacity:.6;font-weight:500}
.bar{position:absolute;left:0;top:0;height:2.2mm;background:${C.o}}
.foot{position:absolute;left:17mm;right:17mm;bottom:9mm;display:flex;justify-content:space-between;font-size:8pt;color:${C.mu};border-top:1px solid ${C.line};padding-top:2.5mm}
.dark .foot{border-color:${C.ink3};color:#8b8b90}
.tag{display:inline-block;background:${C.o};color:${C.ink};font-weight:800;font-size:8.5pt;letter-spacing:.16em;padding:1.6mm 3mm}
.txt p{font-size:11.2pt;line-height:1.5;margin-top:3.2mm}
.txt b{font-weight:800}
.task{background:${C.card};border-left:2.2mm solid ${C.o};padding:3.6mm 4.5mm;margin-top:3.5mm;font-size:10.4pt;line-height:1.45}
.task .k{font-family:Anton,sans-serif;color:${C.o};font-size:12pt;letter-spacing:.04em;margin-right:2mm}
.lines{flex:1;min-height:14mm;margin-top:4mm;background:repeating-linear-gradient(to bottom,transparent 0,transparent 8.4mm,${C.line} 8.4mm,${C.line} 8.7mm);border-top:1px solid transparent}
.score{display:flex;align-items:center;gap:2.2mm;margin-top:3mm;font-size:8.5pt;font-weight:700;letter-spacing:.1em}
.score i{width:6.6mm;height:6.6mm;border:1.4px solid ${C.ink};border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:8pt;font-weight:600;letter-spacing:0}
.ref{font-size:7.6pt;color:${C.mu};margin-top:2.5mm;line-height:1.35}
table{width:100%;border-collapse:collapse;font-size:10pt}
td,th{border:1px solid ${C.line};padding:2.6mm 3mm;text-align:left;vertical-align:top}
th{background:${C.ink};color:#fff;font-weight:700;font-size:8.6pt;letter-spacing:.08em;text-transform:uppercase;border-color:${C.ink}}
td{background:#fff;height:10mm}
.box{background:${C.card};padding:5mm;margin-top:4mm}
.small{font-size:9.5pt;line-height:1.45}
ul.dots{list-style:none;margin-top:2mm}
ul.dots li{font-size:10.6pt;line-height:1.45;padding-left:6mm;position:relative;margin-top:1.8mm}
ul.dots li:before{content:"";position:absolute;left:0;top:2.1mm;width:2.4mm;height:2.4mm;background:${C.o}}
`;

let page = 0;
const top = (label, pct) =>
  `${pct ? `<div class="bar" style="width:${pct}%"></div>` : ""}<div class="top"><div>RICARDO PACE <span>| DESAFIO 21 DIAS</span></div><div>${label ?? ""}</div></div>`;
const foot = () => `<div class="foot"><div>@personal.ricardopace · Protocolo Inteligente</div><div>${++page}</div></div>`;
const pg = (inner, { dark = false, label, pct } = {}) => `<section class="pg${dark ? " dark" : ""}">${top(label, pct)}${inner}${foot()}</section>`;
const score = (label = "MINHA ADESÃO HOJE") => `<div class="score">${label} ${[...Array(11)].map((_, i) => `<i>${i}</i>`).join("")}</div>`;
const rows = (labels, cols) => labels.map((l) => `<tr><td style="font-weight:700">${l}</td>${"<td></td>".repeat(cols)}</tr>`).join("");
const semanaDe = (d) => SEMANAS.find((s) => d >= s.dias[0] && d <= s.dias[1]);

const pages = [];

// 1) CAPA
page++;
pages.push(`<section class="pg dark" style="padding:0">
<div style="position:absolute;inset:0;background:url('file://${FOTOS}/foto-04.jpg') center 18%/cover"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,12,.35) 0%,rgba(11,11,12,.25) 30%,rgba(11,11,12,.85) 58%,${C.ink} 75%)"></div>
<div class="bar" style="width:100%"></div>
<div style="position:absolute;left:17mm;right:17mm;top:12mm;font-size:9pt;font-weight:700;letter-spacing:.2em">RICARDO PACE <span style="opacity:.6;font-weight:500">| CIÊNCIA E TREINAMENTO</span></div>
<div style="position:absolute;left:17mm;right:17mm;bottom:22mm">
 <span class="tag">MATERIAL DA CONSULTORIA</span>
 <div class="h" style="font-size:66pt;margin-top:6mm">Desafio<br><span class="o">21 dias</span></div>
 <div class="h" style="font-size:20pt;margin-top:4mm;color:#ddd">Protocolo Inteligente de hábitos</div>
 <div style="width:22mm;height:2mm;background:${C.o};margin:7mm 0"></div>
 <div style="font-size:12.5pt;line-height:1.5;max-width:140mm;color:#e8e8e8">10 minutos por dia para entender por que você come quando não está com fome, e construir hábitos que sustentam o seu treino e o seu plano alimentar.</div>
 <div style="margin-top:9mm;font-size:9pt;color:#9a9a9f">Ricardo Pace · CREF 014626-G/MG · Mestre em Educação Física</div>
</div></section>`);

// 2) ANTES DE COMEÇAR
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">ANTES DE COMEÇAR</span>
<div class="h" style="font-size:36pt;margin-top:5mm">Como esse material <span class="o">funciona</span></div>
<div class="txt"><p>O seu treino está no app e o seu plano alimentar já foi montado para você. Este material cuida da terceira parte, que quase ninguém trabalha: <b>o comportamento</b>. É ele que decide se o plano sai do papel numa terça-feira cansativa.</p></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:5mm">
 <div class="box" style="margin:0"><div class="h" style="font-size:15pt">O que <span class="o">é</span></div><ul class="dots">
  <li>21 dias, um tema por dia</li><li>Um texto curto e 2 tarefas</li><li>10 a 20 minutos por dia</li><li>Foco em hábito, não em dieta</li></ul></div>
 <div class="box" style="margin:0"><div class="h" style="font-size:15pt">O que <span class="o">não é</span></div><ul class="dots">
  <li>Não é dieta nova nem contagem de calorias</li><li>Não substitui o seu plano alimentar</li><li>Não é terapia nem tratamento</li><li>Não promete quilos em 21 dias</li></ul></div>
</div>
<div class="h" style="font-size:17pt;margin-top:7mm">Regras do jogo</div>
<ul class="dots">
 <li><b>Escreva.</b> Neste PDF impresso, num caderno ou no bloco de notas do celular. Registrar o que você faz é uma das estratégias mais associadas a resultado em programas de mudança de peso.</li>
 <li><b>Perdeu um dia? Faça só o dia de hoje.</b> Não tente compensar acumulando tarefas.</li>
 <li><b>Peso, medidas e fotos são opcionais.</b> O principal aqui é observar comportamento.</li>
 <li><b>Dúvidas no WhatsApp.</b> Me mande o que perceber. Isso me ajuda a ajustar seu treino e seu plano.</li>
</ul>
<div class="ref" style="margin-top:auto">Referência: ${REFS.burke}. A associação foi consistente, mas a qualidade da evidência foi considerada fraca pelos autores.</div>
`, { label: "INÍCIO" }));

// 3) PONTO DE PARTIDA
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">DIA 1 · PONTO DE PARTIDA</span>
<div class="h" style="font-size:34pt;margin-top:5mm">Onde você <span class="o">está hoje</span></div>
<div class="txt"><p>Dê uma nota de 0 a 10 com sinceridade. Não existe nota certa: é a sua linha de partida, e você vai refazer isso no Dia 21.</p></div>
<table style="margin-top:5mm"><tr><th style="width:62%">Indicador</th><th>Nota 0 a 10</th></tr>
${rows(["Confiança de que consigo mudar", "Qualidade do meu sono", "Regularidade das minhas refeições", "Quanto eu como por emoção (0 = nunca, 10 = sempre)", "Constância no treino", "Capacidade de retomar depois de um deslize"], 1)}</table>
<div class="h" style="font-size:16pt;margin-top:7mm">3 motivos para eu estar aqui</div>
<div style="margin-top:2mm;font-size:10.5pt;line-height:2.4">1. ____________________________________________________________________<br>2. ____________________________________________________________________<br>3. ____________________________________________________________________</div>
<div class="box" style="margin-top:6mm;border:2px solid ${C.o}">
<div class="h" style="font-size:15pt">Meu compromisso</div>
<p class="small" style="margin-top:2mm">Nos próximos 21 dias eu vou praticar, registrar e ajustar, sem transformar um deslize em abandono. Se algo passar do que este material pode ajudar, eu procuro ajuda profissional.</p>
<p class="small" style="margin-top:6mm">Assinatura ______________________________________ Data ____/____/______</p></div>
`, { label: "DIA 01/21", pct: (1 / TOTAL) * 100 }));

// 4) FICHA DE MEDIDAS
const medidas = ["Peso (kg)", "Cintura (na altura do umbigo)", "Abdome (maior circunferência)", "Quadril", "Tórax", "Braço direito", "Braço esquerdo", "Coxa direita", "Coxa esquerda", "Panturrilha direita", "Panturrilha esquerda"];
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">FICHA DE MEDIDAS · OPCIONAL</span>
<div class="h" style="font-size:34pt;margin-top:5mm">Dia 1 e <span class="o">Dia 21</span></div>
<div class="txt"><p>Meça sempre nas mesmas condições: ao acordar, depois de ir ao banheiro, antes de comer ou beber, na mesma balança e com a fita bem rente à pele, sem apertar.</p></div>
<table style="margin-top:5mm"><tr><th style="width:46%">Medida</th><th>Dia 1 · __/__</th><th>Dia 21 · __/__</th><th>Diferença</th></tr>${rows(medidas, 3)}</table>
<p class="ref" style="margin-top:4mm">Variações de 1 a 2 kg de um dia para o outro são comuns (água, sal, intestino, ciclo menstrual). Olhe a tendência, não um número isolado.</p>
`, { label: "DIA 01/21", pct: (1 / TOTAL) * 100 }));

// 5) FERRAMENTA: FOME OU VONTADE
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">FERRAMENTA · USE A QUALQUER HORA</span>
<div class="h" style="font-size:36pt;margin-top:5mm">Fome ou <span class="o">vontade?</span></div>
<div class="txt"><p>Use quando bater vontade de comer fora das refeições. Pare 1 minuto e passe pelas 5 perguntas. Não é prova com nota: são pistas para você se conhecer melhor.</p></div>
${CHECKLIST.map((c, i) => `<div class="task" style="display:flex;gap:4mm;align-items:flex-start"><div class="h o" style="font-size:24pt;min-width:9mm">${i + 1}</div><div><b style="font-size:11pt">${c.q}</b><div style="margin-top:1mm;color:${C.mu}">${c.a}</div></div></div>`).join("")}
<div class="box" style="background:${C.ink};color:#F7F7F5;margin-top:5mm">
<div class="h" style="font-size:15pt"><span class="o">Conclusão</span></div>
<p class="small" style="margin-top:2mm">É fome? Coma a refeição ou o lanche do seu plano, sentado e com calma. É outra coisa? Pergunte: <b>do que eu preciso agora?</b> Descanso, pausa, conversa, movimento. Use o atalho que você vai criar no Dia 4.</p></div>
<p class="ref">Dica: tire um print desta página e deixe no celular.</p>
`, { label: "FERRAMENTA" }));

// 6..) DIAS + REVISÕES
const revisao = (n) => pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">REVISÃO DA SEMANA ${n}</span>
<div class="h" style="font-size:34pt;margin-top:5mm">Ajustar a <span class="o">rota</span></div>
<div class="txt"><p>${n === 1 ? "Progresso é tendência, não perfeição. Olhe para os 7 dias como um todo." : "O plano precisa caber na sua vida. Se algo está difícil demais, o problema não é você: é o tamanho da tarefa."}</p></div>
<table style="margin-top:5mm"><tr><th style="width:52%">Hábito</th><th>Nota 0 a 10</th><th>Ajuste mínimo</th></tr>
${rows(["Treinos da semana", "Refeições do plano", "Sono", "Pausa antes de comer", "Registro no caderno"], 2)}</table>
<div class="h" style="font-size:15pt;margin-top:6mm">Minha maior barreira foi</div><div class="lines" style="flex:0 0 18mm"></div>
<div class="h" style="font-size:15pt;margin-top:4mm">${n === 1 ? "O hábito que vou manter na semana 2" : "O hábito com pior nota, em versão simplificada"}</div><div class="lines" style="flex:0 0 18mm"></div>
<div class="box" style="border:2px solid ${C.o};margin-top:auto"><p class="small"><b>Mande esta página no meu WhatsApp.</b> Com ela eu consigo ajustar seu treino e seu plano para a próxima semana.</p></div>
`, { label: `SEMANA ${n}` });

DIAS.forEach((d, i) => {
  const n = i + 1;
  const s = semanaDe(n);
  pages.push(pg(`
<div style="display:flex;align-items:flex-end;gap:5mm;margin-top:3mm">
 <div class="h o" style="font-size:62pt;line-height:.82">${String(n).padStart(2, "0")}</div>
 <div style="padding-bottom:1mm"><span class="tag">SEMANA ${s.n} · ${s.nome.toUpperCase()}</span></div>
</div>
<div class="h" style="font-size:${d.t.length > 30 ? 25 : 30}pt;margin-top:5mm">${d.t}</div>
<div class="txt">${d.txt.map((p) => `<p>${p}</p>`).join("")}</div>
${d.ref ? `<div class="ref">Referência: ${REFS[d.ref]}</div>` : ""}
${d.tarefas.map((t, k) => `<div class="task"><span class="k">TAREFA ${k + 1}</span>${t}</div>`).join("")}
<div class="lines"></div>
${score()}
`, { label: `DIA ${String(n).padStart(2, "0")}/21`, pct: (n / TOTAL) * 100 }));
  if (d.revisao) pages.push(revisao(d.revisao));
});

// FECHAMENTO: avaliação final + plano 30 dias
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">DIA 21 · FECHAMENTO</span>
<div class="h" style="font-size:34pt;margin-top:5mm">Antes e <span class="o">agora</span></div>
<div class="txt"><p>Copie as notas do Dia 1 e dê as notas de hoje. Compare comportamento, não só balança.</p></div>
<table style="margin-top:4mm"><tr><th style="width:56%">Indicador</th><th>Dia 1</th><th>Dia 21</th></tr>
${rows(["Confiança de que consigo mudar", "Qualidade do meu sono", "Regularidade das minhas refeições", "Quanto eu como por emoção", "Constância no treino", "Capacidade de retomar depois de um deslize"], 2)}</table>
<div class="h" style="font-size:20pt;margin-top:7mm">Meus 3 hábitos para os <span class="o">próximos 30 dias</span></div>
<table style="margin-top:3mm"><tr><th>Hábito</th><th>Frequência mínima</th><th>Quando / gatilho</th><th>Plano B</th></tr>
${[1, 2, 3].map((x) => `<tr><td style="height:14mm;font-weight:800">${x}.</td><td></td><td></td><td></td></tr>`).join("")}</table>
<p class="ref" style="margin-top:3mm">Frequência mínima é a versão que você consegue cumprir num dia ruim. Ex.: “treino 2x/semana, mesmo que curto”.</p>
`, { label: "DIA 21/21", pct: 100 }));

pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">DIA 21 · CARTA</span>
<div class="h" style="font-size:34pt;margin-top:5mm">Para ler quando <span class="o">pensar em desistir</span></div>
<div class="txt"><p>Escreva para você mesmo, daqui a algumas semanas, num dia difícil. Comece com: <b>“Nesses 21 dias eu aprendi que…”</b></p></div>
<div class="lines"></div>
<p class="small" style="margin-top:3mm">Assinatura ______________________________________ Data ____/____/______</p>
`, { label: "DIA 21/21", pct: 100 }));

// QUANDO BUSCAR AJUDA + SOBRE + REFERÊNCIAS
pages.push(pg(`
<span class="tag" style="align-self:flex-start;margin-top:4mm">IMPORTANTE</span>
<div class="h" style="font-size:30pt;margin-top:5mm">Quando buscar <span class="o">ajuda profissional</span></div>
<div class="txt"><p>Este é um material educativo de hábitos. Ele não diagnostica nem trata nenhuma condição. Procure um psicólogo, nutricionista ou médico se você perceber:</p></div>
<ul class="dots">
 <li>episódios frequentes de comer grandes quantidades com sensação de perda de controle;</li>
 <li>vômito, laxantes, jejuns longos ou exercício para “compensar” o que comeu;</li>
 <li>sofrimento intenso, tristeza persistente ou ansiedade que atrapalha o dia a dia;</li>
 <li>tontura, desmaios ou piora de alguma condição de saúde.</li>
</ul>
<p class="small" style="margin-top:3mm">Se acontecer, me conte sem receio. A gente ajusta o treino e eu te ajudo a encontrar o profissional certo. Em urgência, procure o serviço de emergência mais próximo.</p>
<div class="box" style="display:flex;gap:5mm;align-items:center;margin-top:7mm">
 <div style="width:26mm;height:26mm;border-radius:50%;flex:none;border:2px solid ${C.o};background:url('file://${FOTOS}/foto-05.jpg') center 20%/cover"></div>
 <div><div class="h" style="font-size:17pt">Ricardo <span class="o">Pace</span></div>
 <p class="small" style="margin-top:1.5mm">Personal trainer (CREF 014626-G/MG), professor universitário e mestre em Educação Física. Treino e hábitos com base em ciência, não em moda.</p></div>
</div>
<div class="h" style="font-size:14pt;margin-top:7mm">Referências</div>
<div class="ref" style="font-size:8pt;line-height:1.55">${Object.values(REFS).map((r) => `• ${r}`).join("<br>")}</div>
<p class="ref" style="margin-top:3mm">Os temas comportamentais deste material foram adaptados e reescritos a partir de práticas de educação alimentar e de mudança de hábito. Não há garantia de resultado individual: resultados dependem de vários fatores.</p>
`, { label: "FIM" }));

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}</style></head><body>${pages.join("")}</body></html>`;
const htmlFile = path.join(OUT, "desafio.html");
fs.writeFileSync(htmlFile, html);

const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
const p = await browser.newPage();
await p.goto(`file://${htmlFile}`, { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(OUT, "desafio-21-dias-ricardo-pace.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });

// conferência: overflow + PNGs
const over = await p.evaluate(() =>
  [...document.querySelectorAll(".pg")].map((s, i) => {
    const lim = s.getBoundingClientRect().bottom - 22 * 3.78;
    const kids = [...s.children].filter((c) => !c.classList.contains("foot") && !c.classList.contains("top") && !c.classList.contains("bar") && getComputedStyle(c).position !== "absolute");
    const maxB = Math.max(0, ...kids.map((c) => c.getBoundingClientRect().bottom));
    const lines = s.querySelector(".lines");
    return { i: i + 1, overflow: Math.round(maxB - lim), lines: lines ? Math.round(lines.getBoundingClientRect().height) : null };
  })
);
console.log(JSON.stringify(over.filter((o) => o.overflow > 0 || (o.lines !== null && o.lines < 50))));
if (process.argv.includes("--png")) {
  await p.setViewport({ width: 794, height: 1123 });
  const n = over.length;
  for (let i = 0; i < n; i++) {
    const el = (await p.$$(".pg"))[i];
    await el.screenshot({ path: path.join(OUT, `p${String(i + 1).padStart(2, "0")}.png`) });
  }
}
await browser.close();
console.log("páginas:", over.length);
