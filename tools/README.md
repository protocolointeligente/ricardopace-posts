# Formato v2 (decisão do Ricardo, 02/11/2026)

Menos aula, mais linguagem que as pessoas entendem e curtem: fala de academia, em "você", frases curtas, situações do dia a dia. Ciência obrigatória por trás, mas estudo/autor/DOI ficam na LEGENDA do post e no rodapé — no vídeo, no máximo "não é achismo" + um número-chave.

## Reels — `reel_v2.py` (35–45 s, 1080×1920)
- **SEM foto do Ricardo no Reel** (decisão dele em 09/11/2026, até existir o avatar de IA). Foto dele só nos carrosséis.
- Modelo de referência: Reel da puxada ajoelhado (07/11) — movimento na tela desde o 1º segundo, legenda grande, destaque laranja no músculo.
- Gancho (1ª cena): clipe 3D/real do exercício ou cena gráfica de gancho (`gfx/gancho-sono.html`, `gfx/gancho-bf.html`), COM legenda (sem `nocap`).
- CTA (última cena): cena gráfica de CTA (`gfx/cta-sono.html`, `gfx/cta-bf.html`: frase de compartilhamento + caixa "TREINO" + "Segue @personal.ricardopace"), COM legenda. `window.A0` = momento em que a caixa entra.
- Capa: frame em que gancho e palavra-chave já estão na tela (~2–2,5 s), nunca o 1º frame vazio.
- Meio: clipes 3D da biblioteca do Drive (pasta 16974Jnc9--LIYPpe42KhqMWtn4KBHoVC; são de outros criadores: cortar marca d'água e propaganda final; o conector só baixa arquivos < ~2 MB) e cenas gráficas animadas de `gfx/` (contador, gráfico de barras esquemático sem números inventados, checklist).
- Cena gráfica: copie/adapte um HTML de `gfx/`, renderize com `node gfx/render.js pagina.html <duração> 0.12 saida.mp4` (duração = 0.12 + duração do áudio da cena + 0.38) e use no roteiro como `clip` com `"ss": 0, "nocap": true`.
- Legenda grande 2–3 palavras, palavra-chave em laranja com `*palavra*`.
- Passos: `python3 tts.py roteiro.json audio pm_alex 1.12` (skill reels-ricardo-pace) → renderizar gfx → `NODE_MODS=<pasta com puppeteer e @fontsource> python3 reel_v2.py <pasta>` → `python3 mix.py video-mudo.mp4 timeline.json audio reel.mp4 trilha.wav 0.20` → capa = frame em ~0,9 s. Exemplo completo: `exemplo-roteiro.json`.

## Carrosséis
Skill carrossel-ricardo-pace, texto curto e conversado: título-pergunta do dia a dia, 1 ideia por slide, no máx. 2–3 frases, referências só no rodapé. Capa `fotos/foto-04.jpg`, CTA `fotos/foto-05.jpg`.

## Stories — `stories/` (1080×1920 JPEG)
Sequências no estilo dos "Modelos Stories" do Notion (gancho → identificação → autoridade → oferta → "Responde X aqui"). A API não coloca figurinhas (enquete, caixinha, link): o CTA é sempre "responde aqui", porque resposta de story chega no direct.

## Fotos
Editadas por IA, aprovadas pelo Ricardo. Fotos com outras pessoas (01, 02, 03) são só ilustração; nunca prova/resultado de aluno.

## Notion (Academia de Posts / RICARDO PACE OS) — curadoria feita em 02/11/2026
USAR (adaptando ao tom e com fonte quando houver dado):
- Hooks "Para quem…" e "Dicotomia" (A ou B?) — base principal de temas.
- Hooks "Erros e Correções" e "Como…" — só a estrutura; tirar os "90%/97%" e números sem fonte.
- Modelos Stories — só a estrutura (dor → identificação → autoridade → oferta → "responde PALAVRA").
- Script de Conversão no Direct (7 passos) — descoberta → recomendação → prova REAL → oferta → alternativa.
- Reels Virais — só os FORMATOS (Certo x Errado, Múltiplos exercícios, Casa x Academia, "Se quer isso, faça isso", Sem falar nada); nunca repostar os vídeos.
- Modelos Carrosséis — só os temas de mito (agachamento estraga joelho? abdominal engrossa cintura? jejum destrói metabolismo?) para DESMENTIR com estudo.
- Contraintuitivos/Curiosidades — só os que têm evidência (ex.: dor muscular não mede hipertrofia; força ajuda composição corporal; compostos economizam tempo).
NÃO USAR:
- Hooks "Estatísticas Impactantes" (todos os % são inventados), "Transformações Temporais", "Storytelling" (histórias e resultados inventados), "Métodos" (siglas e promessas tipo "triplicar testosterona"), "Polêmicos" (atacam colegas — vedado pelo Código de Ética do CONFEF — e têm afirmações falsas).
- Legendas de "Posts Estáticos" (números e depoimentos inventados), Swipe File de CTAs com escassez falsa/ofensa ("últimas 10 vagas", "tá gordo… acorda", "10 kg em 8 semanas"), Gerador de Bio Z4 (promessa de kg em X dias).
- Afirmações falsas presentes no material: cafeína "esgota adrenais", proteína "destrói rins", whey "bloqueia lipólise", água gelada atrapalha digestão, treino de perna "libera hormônio" que cresce braço, cardio "inflama o coração", queimar gordura localizada.
Prova social, antes/depois e depoimentos: só reais, com autorização escrita.
