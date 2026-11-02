# Formato v2 (decisão do Ricardo, 02/11/2026)

Menos aula, mais linguagem que as pessoas entendem e curtem: fala de academia, em "você", frases curtas, situações do dia a dia. Ciência obrigatória por trás, mas estudo/autor/DOI ficam na LEGENDA do post e no rodapé — no vídeo, no máximo "não é achismo" + um número-chave.

## Reels — `reel_v2.py` (35–45 s, 1080×1920)
- Foto do Ricardo (pasta `fotos/`) SÓ na 1ª cena (gancho) e na última (CTA). Ele não quer foto dele no meio.
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
