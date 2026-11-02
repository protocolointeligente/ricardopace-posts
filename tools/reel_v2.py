"""Reel formato v2 (tela cheia): fundo = foto com zoom lento ou clipe curto; legenda grande 2-3 palavras.

Uso: python3 build.py pasta_do_reel   (pasta com roteiro.json e audio/narracao.json)
Saídas na pasta: video-mudo.mp4, timeline.json
"""
import json, subprocess, sys, re
from pathlib import Path

D = Path(sys.argv[1]).resolve()
W, H, FPS = 1080, 1920, 30
LEAD, GAP = 0.12, 0.38
import os
NODE_MODS = os.environ.get("NODE_MODS", "/home/claude/carrossel-30mais")  # pasta com node_modules de puppeteer e @fontsource/anton
ro = json.loads((D / "roteiro.json").read_text())["scenes"]
na = {s["id"]: s for s in json.loads((D / "audio/narracao.json").read_text())["scenes"]}
work = D / "build"; work.mkdir(exist_ok=True)

def run(cmd): subprocess.run(cmd, check=True)

# 1) linha do tempo
t, scenes = 0.0, []
for s in ro:
    dur = round(LEAD + na[s["id"]]["duration"] + GAP, 3)
    scenes.append({**s, "start": round(t, 3), "dur": dur, "audioStart": round(t + LEAD, 3),
                   "audioDur": na[s["id"]]["duration"], "file": na[s["id"]]["file"]})
    t += dur
total = round(t + 0.3, 3)
scenes[-1]["dur"] = round(scenes[-1]["dur"] + 0.3, 3)

# 2) blocos de legenda (até 3 palavras), tempo proporcional ao nº de letras
caps = []
for s in scenes:
    words = s["caption"].split()
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) == 3 or w.rstrip("*").endswith((".", "?", ":", ",")) and len(cur) >= 2:
            chunks.append(cur); cur = []
    if cur:
        if chunks and len(cur) == 1: chunks[-1] += cur
        else: chunks.append(cur)
    weights = [sum(len(w.strip("*")) + 2 for w in c) for c in chunks]
    a0, ad = s["audioStart"], s["audioDur"]
    acc = 0
    for c, wt in zip(chunks, weights):
        st = a0 + ad * acc / sum(weights); acc += wt
        en = a0 + ad * acc / sum(weights)
        caps.append({"text": " ".join(c), "from": round(st, 3), "to": round(en, 3)})
    caps[-1]["to"] = round(s["start"] + s["dur"] - 0.05, 3)
for i in range(len(caps) - 1):
    caps[i]["to"] = min(caps[i]["to"], caps[i + 1]["from"])

def to_html(txt):
    out, hl = [], False
    for w in txt.split():
        open_, close = w.startswith("*"), w.endswith("*")
        core = w.strip("*")
        if open_: hl = True
        out.append(f'<span class="o">{core}</span>' if hl else core)
        if close: hl = False
    return " ".join(out)

for i, c in enumerate(caps):
    c["html"] = to_html(c["text"]); c["png"] = str(work / f"cap{i:02d}.png")
(work / "caps.json").write_text(json.dumps(caps, ensure_ascii=False))

js = f"""
const fs=require('fs');const puppeteer=require('{NODE_MODS}/node_modules/puppeteer');
const caps=JSON.parse(fs.readFileSync('{work}/caps.json','utf8'));
const F='{NODE_MODS}/node_modules/@fontsource';
(async()=>{{const b=await puppeteer.launch({{executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--allow-file-access-from-files']}});
const p=await b.newPage();await p.setViewport({{width:{W},height:700}});
for(const c of caps){{
 fs.writeFileSync('{work}/cap.html',`<html><head><style>
 @font-face{{font-family:A;src:url('file://${{F}}/anton/files/anton-latin-400-normal.woff2')}}
 html,body{{margin:0;background:transparent;width:{W}px;height:700px}}
 .c{{position:absolute;left:60px;right:60px;top:0;bottom:0;display:flex;align-items:center;justify-content:center;text-align:center;
 font-family:A;font-size:118px;line-height:1.02;text-transform:uppercase;color:#F7F7F5;
 -webkit-text-stroke:3px #0B0B0C;paint-order:stroke fill;text-shadow:0 6px 0 #0B0B0C,0 10px 30px rgba(0,0,0,.65)}}
 .o{{color:#FF6A00}}</style></head><body><div class="c"><div>${{c.html}}</div></div></body></html>`);
 await p.goto('file://{work}/cap.html',{{waitUntil:'load'}});
 await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({{path:c.png,omitBackground:true}});}}
await b.close();}})();"""
(work / "caps.js").write_text(js)
run(["node", str(work / "caps.js")])

# 3) fundos por cena
segs = []
for i, s in enumerate(scenes):
    out = work / f"bg{i}.mp4"; n = int(round(s["dur"] * FPS))
    if "clip" in s:
        vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},setsar=1"
        run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-ss", str(s.get("ss", 0)), "-i", s["clip"],
             "-t", str(s["dur"]), "-an", "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", str(out)])
    else:
        cx = s.get("cx", 0.5)
        zin = i % 2 == 0
        z = f"1+0.10*on/{n}" if zin else f"1.10-0.10*on/{n}"
        vf = (f"scale=-2:{H},crop={W}:{H}:'min(max(0,iw*{cx}-{W}/2),iw-{W})':0,scale={W*2}:{H*2},"
              f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS},"
              f"eq=brightness=-0.06,setsar=1")
        run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", s["bg"], "-frames:v", str(n), "-vf", vf,
             "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", str(out)])
    segs.append(out)
(work / "list.txt").write_text("".join(f"file '{p}'\n" for p in segs))
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"), "-c", "copy", str(work / "bg.mp4")])

# 4) degradê inferior + legendas + assinatura
inputs = ["-i", str(work / "bg.mp4")]
grad = work / "grad.png"
run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s={W}x{H}", "-vf",
     f"format=rgba,geq=r=0:g=0:b=0:a='if(lt(Y,{H*0.42}),0,min(215,(Y-{H*0.42})/({H*0.58})*260))'", "-frames:v", "1", str(grad)])
inputs += ["-i", str(grad)]
g = [f"[0:v][1:v]overlay=0:0,"
     f"drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-Bold.otf:"
     f"text='@personal.ricardopace':fontcolor=white@0.85:fontsize=34:x=(w-tw)/2:y=h-150[v0]"]
last = "v0"
for k, c in enumerate(caps):
    inputs += ["-i", c["png"]]
    g.append(f"[{last}][{k+2}:v]overlay=0:{H-1020}:enable='between(t,{c['from']},{c['to']})'[v{k+1}]")
    last = f"v{k+1}"
run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(g), "-map", f"[{last}]", "-t", str(total),
     "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), str(D / "video-mudo.mp4")])

(D / "timeline.json").write_text(json.dumps({"total": total, "scenes": [
    {"id": s["id"], "start": s["start"], "audioStart": s["audioStart"], "file": s["file"]} for s in scenes]}, indent=1))
print("ok", total, "s,", len(caps), "legendas")
