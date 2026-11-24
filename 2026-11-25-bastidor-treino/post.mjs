// Carrossel 25/11 18:45 — Bastidor: como eu monto o seu treino (treino de pernas do próprio Ricardo).
import path from "node:path";
import { TOKENS as T, slide, tag, title, text, rule, swipe, kicker, numbered, compare, zones, rows, checklist, ctaBox, shareLine, coverPhoto, ctaPhoto } from "./design.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const total = 8;
const R = {
  z16: "Zourdos et al. J Strength Cond Res, 2016. doi:10.1519/JSC.0000000000001049",
  s17: "Schoenfeld, Ogborn & Krieger. J Sports Sci, 2017. doi:10.1080/02640414.2016.1210197",
};

const screen = `<div style="margin-top:40px;background:#fff;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);transform:rotate(-1deg);">
<img src="file://${HERE}/tela-treino.jpg" style="display:block;width:100%;"></div>`;

const slides = [
  slide({
    theme: "dark", n: 1, total, behind: coverPhoto(),
    refs: ["Zourdos 2016 · Schoenfeld 2017 (DOIs nos slides 4–5)"],
    content:
      tag("BASTIDOR") +
      title(`Como eu monto o <span class="o">seu treino</span>`, { size: 124, mt: 40, maxWidth: 560 }) +
      rule() +
      text("Abri o <b>meu treino de pernas</b> desta semana pra te mostrar o que vai em cada linha.", { size: 38, mt: 0, maxWidth: 560 }) +
      swipe(),
  }),
  slide({
    theme: "dark", n: 2, total,
    content:
      kicker("O MEU TREINO DE PERNAS", { mt: 70 }) +
      title(`Nada de <span class="o">“faz 3x12”</span> pra tudo`, { size: 110, mt: 24 }) +
      screen +
      text(`Cada exercício tem <b style="color:${T.white};">séries, repetições e carga</b> definidas. E tem mais coisa que não cabe na foto.`, { size: 34, mt: 48, color: T.muted }),
  }),
  slide({
    theme: "dark", n: 3, total,
    content:
      title(`Cada linha<br>tem <span class="o">4 números</span>`, { size: 120, mt: 70 }) +
      numbered([
        "<b>Séries × repetições</b>: quanto trabalho o músculo faz.",
        "<b>Carga</b>: anotada, pra saber quando subir.",
        "<b>Esforço</b>: quantas repetições sobram no fim da série.",
        "<b>Descanso</b>: quanto tempo até a próxima.",
      ], { mt: 64, gap: 48, size: 38 }),
  }),
  slide({
    theme: "light", n: 4, total, refs: [R.z16],
    content:
      title(`Esforço: quantas <span class="o">sobraram?</span>`, { size: 112, mt: 70 }) +
      text("Não peço “vai até a falha” em tudo. Peço que você termine a série sabendo <b>quantas repetições ainda daria pra fazer</b>.", { size: 34, mt: 32 }) +
      compare([
        { label: "1–2", text: "<b>Hack e leg press:</b> terminar com 1 ou 2 sobrando.", highlight: true },
        { label: "Folga", text: "<b>Extensora e flexora:</b> mais folga neste bloco." },
      ]) +
      text("Essa escala (repetições em reserva) foi testada no agachamento com 29 pessoas.", { size: 28, mt: 32, color: T.mutedDark }),
  }),
  slide({
    theme: "dark", n: 5, total, refs: [R.s17],
    content:
      title(`Volume: eu conto <span class="o">séries por músculo</span>`, { size: 112, mt: 70 }) +
      text(`Neste treino, o quadríceps leva <b style="color:${T.white};">10 séries</b>. Somo isso na semana toda.`, { size: 34, mt: 32, color: T.muted }) +
      zones([
        { size: 110, label: "15", text: "estudos numa meta-análise sobre séries por semana" },
        { size: 110, label: "+0,37%", text: "de ganho muscular a cada série semanal a mais", highlight: true },
      ], { cols: "1fr 1.25fr", minHeight: 300 }) +
      text(`Mais séries, mais ganho, <b style="color:${T.white};">até onde você recupera</b>. Por isso eu conto.`, { size: 31, mt: 40, color: T.muted }),
  }),
  slide({
    theme: "light", n: 6, total,
    content:
      title(`E você,<br><span class="o">anota o quê?</span>`, { size: 120, mt: 70 }) +
      text("Exemplo de uma série do hack:", { size: 34, mt: 28 }) +
      rows([
        { name: "Carga", detail: "o peso que você usou", value: "80 kg" },
        { name: "Repetições", detail: "quantas fez de verdade", value: "10" },
        { name: "Sobraram", detail: "quantas ainda daria pra fazer", value: "2" },
      ]) +
      text("Com esses 3 números, o próximo treino <b>já sai ajustado</b>.", { size: 34, mt: 36 }),
  }),
  slide({
    theme: "accent", n: 7, total,
    content:
      tag("SALVE PARA O PRÓXIMO TREINO", { mt: 70, dark: true }) +
      title("Checklist<br>do treino montado", { size: 124, mt: 36, color: T.ink }) +
      checklist([
        "Anote <b>carga e repetições</b>.",
        "Termine sabendo <b>quantas sobraram</b>.",
        "Some as <b>séries por músculo</b> na semana.",
        "Bateu o topo das reps? <b>Sobe a carga.</b>",
      ]),
  }),
  slide({
    theme: "dark", n: 8, total, behind: ctaPhoto(`file://${HERE}/cta.jpg`),
    content:
      title(`Treino bom é <span class="o">treino montado</span>, não copiado`, { size: 112, mt: 70, maxWidth: 900 }) +
      rule() +
      text("Eu monto o seu do mesmo jeito: <b>pra sua rotina e o seu objetivo</b>.", { size: 36, mt: 0, maxWidth: 660 }) +
      ctaBox("Quer o seu treino montado?", "TREINO") +
      shareLine(`Manda pra quem treina <b style="color:${T.white};">sem anotar nada</b>.`),
  }),
];

process.stdout.write(JSON.stringify({ slides: slides.map((html, i) => ({ html, order: i })) }));
