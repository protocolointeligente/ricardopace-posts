#!/usr/bin/env python3
"""Reel 100% animado (sem clipe de terceiros) do @personal.ricardopace — decisão do Ricardo em 24/11/2026.

    python3 tools/reel_anim.py <pasta-do-post>          # gera reel.mp4 (sem selo/vinheta)
    python3 tools/finaliza_reel.py <pasta-do-post>      # selo + vinheta + capa.jpg + conferência

A pasta precisa ter reel.json:
{
  "voice": "pm_alex", "speed": 1.12,
  "scenes": [
    {"type": "gancho", "tag": "TREINO", "l1": "Dor no dia seguinte", "big": "NÃO MEDE", "l3": "treino bom", "x": true,
     "text": "fala da narração"},
    {"type": "frase", "kicker": "O QUE ACONTECE", "title": "texto com <o>destaque</o>", "sub": "linha menor", "text": "..."},
    {"type": "numero", "tag": "NÃO É ACHISMO", "num": 10, "dec": 0, "pre": "", "suf": "", "label": "semanas de treino",
     "note": "texto com <o>destaque</o>", "stamp": "MITO", "ref": "Autor, Revista 2016", "text": "..."},
    {"type": "versus", "title": "...", "a": {"label": "...", "val": "...", "h": 0.45}, "b": {"label": "...", "val": "...", "h": 0.9},
     "note": "...", "ref": "...", "text": "..."},
    {"type": "lista", "title": "No próximo <o>treino</o>", "items": ["...", "...", "..."], "text": "..."},
    {"type": "cta", "share": "Manda pra quem <o>...</o>", "q": "Quer seu treino montado?", "kw": "TREINO", "text": "..."}
  ]
}
- "text" é o que a voz fala (números por extenso); "caption" (opcional) é a legenda da faixa de baixo, com *destaque*.
  Cenas gancho/frase/cta mostram legenda (do "caption", ou do "text" se faltar); numero/versus/lista não (o texto já está na tela).
- Os elementos de cada cena entram distribuídos ao longo da fala ("at": lista de frações 0–1 para ajustar).
- Barras do "versus" sem número de estudo usam "val": "" e "note" dizendo que é esquema ilustrativo.
"""
import json, os, subprocess, sys, html, re, wave
import numpy as np

T = os.path.dirname(os.path.abspath(__file__))
GFX = os.path.join(T, 'gfx')
TTS_DIR = os.environ.get('TTS_DIR', '/home/claude/tts')
LEAD, GAP, SR = 0.12, 0.38, 48000


def sh(*a):
    subprocess.run(a, check=True)


# ---------- narração (Kokoro) ----------
def narrar(cfg, pasta):
    from kokoro_onnx import Kokoro
    import soundfile as sf
    k = Kokoro(os.path.join(TTS_DIR, 'kokoro-v1.0.int8.onnx'), os.path.join(TTS_DIR, 'voices-v1.0.bin'))
    os.makedirs(os.path.join(pasta, 'audio'), exist_ok=True)
    out = []
    for i, s in enumerate(cfg['scenes']):
        f = os.path.join(pasta, 'audio', f's{i + 1}.wav')
        a, sr = k.create(s['text'], voice=cfg.get('voice', 'pm_alex'), speed=cfg.get('speed', 1.12), lang='pt-br')
        # corta silêncio das pontas
        nz = np.where(np.abs(a) > 0.01)[0]
        a = a[max(nz[0] - int(.03 * sr), 0): nz[-1] + int(.08 * sr)]
        sf.write(f, a, sr)
        out.append({'file': f, 'dur': round(len(a) / sr, 3)})
    return out


# ---------- legenda ----------
def chunks(caption):
    words, res, cur = caption.split(), [], []
    for w in words:
        cur.append(w)
        if len(cur) == 3 or (w.rstrip('*').endswith(('.', '?', ':', ',', '!')) and len(cur) >= 2):
            res.append(cur); cur = []
    if cur:
        if res and len(cur) == 1: res[-1] += cur
        else: res.append(cur)
    return res


def cap_html(ws):
    out, hl = [], False
    for w in ws:
        if w.startswith('*'): hl = True
        core = html.escape(w.strip('*'))
        out.append(f'<span class="o">{core}</span>' if hl else core)
        if w.endswith('*'): hl = False
    return ' '.join(out)


def rich(t):  # <o>..</o> -> span laranja
    return (t or '').replace('<o>', '<span class="o">').replace('</o>', '</span>')


# ---------- cenas ----------
def scene_html(i, s):
    t = s['type']
    if t == 'gancho':
        x = '<div class="xm" id="x%d">✗</div>' % i if s.get('x') else ''
        return f'''<div class="sc gancho" id="c{i}"><div class="stripes" id="st{i}"></div><div class="ring" id="rg{i}"></div>
<div class="w"><span class="tag e">{s.get("tag","")}</span>
<div class="h l1 e">{rich(s.get("l1",""))}</div><div class="h big o e" id="bg{i}">{rich(s.get("big",""))}</div>
<div class="h l1 e">{rich(s.get("l3",""))}</div></div>{x}</div>'''
    if t == 'frase':
        return f'''<div class="sc frase" id="c{i}"><div class="w">{f'<div class="kick e">{s["kicker"]}</div>' if s.get("kicker") else ''}
<div class="h ti e">{rich(s["title"])}</div>{f'<div class="sub e">{rich(s["sub"])}</div>' if s.get("sub") else ''}</div></div>'''
    if t == 'numero':
        return f'''<div class="sc numero" id="c{i}"><div class="w"><span class="tag e">{s.get("tag","NÃO É ACHISMO")}</span>
<div class="h num o e" id="n{i}">{s.get("pre","")}0{s.get("suf","")}</div><div class="h lbl e">{rich(s.get("label",""))}</div>
{f'<div class="note e">{rich(s["note"])}</div>' if s.get("note") else ''}</div>
{f'<div class="stamp e2" id="sp{i}"><div>{s["stamp"]}</div></div>' if s.get("stamp") else ''}
{f'<div class="ref">{s["ref"]}</div>' if s.get("ref") else ''}</div>'''
    if t == 'versus':
        def col(c, k):
            return f'''<div class="col"><div class="val h {"o" if k=="b" else ""}">{c.get("val","")}</div>
<div class="barw"><div class="bar {k}" id="b{k}{i}" style="height:{int(520*c.get("h",.5))}px"></div></div><div class="cl">{rich(c["label"])}</div></div>'''
        return f'''<div class="sc versus" id="c{i}"><div class="w"><div class="h ti2 e">{rich(s.get("title",""))}</div>
<div class="cols e">{col(s["a"],"a")}{col(s["b"],"b")}</div>{f'<div class="note e">{rich(s["note"])}</div>' if s.get("note") else ''}</div>
{f'<div class="ref">{s["ref"]}</div>' if s.get("ref") else ''}</div>'''
    if t == 'lista':
        its = ''.join(f'<li class="e"><b>✓</b><span>{rich(x)}</span></li>' for x in s['items'])
        return f'''<div class="sc lista" id="c{i}"><div class="w"><span class="tag e">{s.get("tag","SALVA ESSA")}</span>
<div class="h ti e">{rich(s["title"])}</div><ul>{its}</ul></div></div>'''
    if t == 'cta':
        return f'''<div class="sc cta" id="c{i}"><div class="w"><div class="h ti e">{rich(s["share"])}</div>
<div class="box e" id="bx{i}"><div class="h ar">→</div><div>{s.get("q","Quer o seu treino montado?")}<br>Manda <b class="o">“{s.get("kw","TREINO")}”</b> no direct.</div></div>
<div class="seg e">Segue <b>@personal.ricardopace</b></div></div></div>'''
    raise ValueError(t)


CSS = '''
.sc{position:absolute;inset:0;opacity:0}
.w{position:absolute;left:80px;right:80px;top:340px;text-align:center}
#prog{position:absolute;left:0;top:0;height:10px;background:#FF6A00;width:1080px;transform-origin:0 0;z-index:9}
.l1{font-size:118px;line-height:1.02;white-space:nowrap}.big{font-size:232px;line-height:.92;margin:14px 0;white-space:nowrap}
.stripes{position:absolute;left:-400px;right:-400px;top:1120px;height:120px;background:repeating-linear-gradient(-45deg,#FF6A00 0 34px,transparent 34px 80px);opacity:.16}
.ring{position:absolute;left:540px;top:760px;width:900px;height:900px;margin:-450px 0 0 -450px;border:6px solid #FF6A00;border-radius:50%;opacity:0}
.xm{position:absolute;left:465px;top:1000px;width:150px;height:150px;border-radius:50%;background:#E53935;color:#fff;font-size:110px;line-height:150px;text-align:center;font-weight:900}
.w>.tag{display:table;margin:0 auto 34px}
.box>div:last-child{flex:1}
.kick{font-size:38px;letter-spacing:.18em;color:#A6A6AB;margin-bottom:34px}
.ti{font-size:128px;line-height:1.0}.ti2{font-size:104px;line-height:1.0}
.sub{font-size:54px;line-height:1.28;font-weight:700;margin-top:46px;color:#E9E9E6}
.num{font-size:300px;line-height:.95;margin-top:40px}.lbl{font-size:84px;margin-top:6px}
.note{font-size:50px;line-height:1.25;font-weight:700;margin-top:56px;color:#E9E9E6}
.stamp{position:absolute;left:0;right:0;top:1080px;text-align:center}
.stamp div{display:inline-block;border:10px solid #FF6A00;color:#FF6A00;font-family:A;font-size:120px;padding:2px 44px;transform:rotate(-4deg)}
.ref{position:absolute;left:90px;right:90px;top:1238px;font-size:28px;color:#A6A6AB;font-weight:600;text-align:center}
.cols{display:flex;justify-content:center;gap:90px;margin-top:50px;align-items:flex-end}
.col{width:330px;text-align:center}.val{font-size:96px;margin-bottom:16px;min-height:10px}
.barw{height:520px;display:flex;align-items:flex-end;justify-content:center}
.bar{width:230px;transform-origin:50% 100%}.bar.a{background:#3A3A40}.bar.b{background:#FF6A00}
.cl{font-size:44px;line-height:1.15;margin-top:22px}
ul{list-style:none;margin-top:60px;display:flex;flex-direction:column;gap:40px;text-align:left}
li{display:flex;gap:30px;align-items:center;font-size:56px;line-height:1.15}
li b{flex:none;width:92px;height:92px;background:#FF6A00;color:#0B0B0C;display:flex;align-items:center;justify-content:center;font-size:58px}
.cta .ti{font-size:110px}
.box{margin:70px auto 0;width:920px;border:8px solid #FF6A00;padding:34px 36px;display:flex;align-items:center;gap:30px;text-align:left;font-size:46px;line-height:1.25}
.box .ar{font-size:100px;color:#FF6A00}
.seg{margin-top:60px;font-size:46px;color:#A6A6AB}.seg b{color:#F7F7F5}
#cap{position:absolute;left:60px;right:60px;top:1300px;height:170px;display:flex;align-items:center;justify-content:center;text-align:center}
.cp{position:absolute;opacity:0;font-family:A;font-size:104px;line-height:1.02;text-transform:uppercase;color:#F7F7F5;
 -webkit-text-stroke:3px #0B0B0C;paint-order:stroke fill;text-shadow:0 6px 0 #0B0B0C,0 10px 30px rgba(0,0,0,.65)}
#brand{position:absolute;left:0;right:0;top:1560px;text-align:center;font-size:30px;letter-spacing:.2em;color:#A6A6AB}
#brand b{font-family:A;font-weight:400;font-size:36px;color:#F7F7F5;letter-spacing:.04em;margin-right:12px}
'''


def build(pasta):
    pasta = os.path.abspath(pasta)
    cfg = json.load(open(os.path.join(pasta, 'reel.json')))
    sc = cfg['scenes']
    cache = os.path.join(pasta, 'audio', 'cache.json')
    key = json.dumps([cfg.get('voice'), cfg.get('speed')] + [s['text'] for s in sc])
    if os.path.exists(cache) and json.load(open(cache)).get('key') == key:
        au = json.load(open(cache))['au']
    else:
        au = narrar(cfg, pasta); json.dump({'key': key, 'au': au}, open(cache, 'w'))
    t, tl = 0.0, []
    for s, a in zip(sc, au):
        d = round(LEAD + a['dur'] + GAP, 3)
        tl.append({'start': round(t, 3), 'dur': d, 'a0': round(t + LEAD, 3), 'ad': a['dur'], 'file': a['file']})
        t += d
    tl[-1]['dur'] = round(tl[-1]['dur'] + 0.9, 3)  # CTA fica na tela depois da fala
    total = round(t + 0.9, 3)
    caps = []
    for s, x in zip(sc, tl):
        if s['type'] not in ('gancho', 'frase', 'cta') or s.get('nocap'):
            continue
        cs = chunks(s.get('caption') or s['text'])
        wts = [sum(len(w.strip('*')) + 2 for w in c) for c in cs]
        acc = 0
        for c, wt in zip(cs, wts):
            st = x['a0'] + x['ad'] * acc / sum(wts); acc += wt
            caps.append({'h': cap_html(c), 'f': round(st, 3), 't': round(x['a0'] + x['ad'] * acc / sum(wts), 3)})
        caps[-1]['t'] = round(x['start'] + x['dur'] - .05, 3)
    for i in range(len(caps) - 1):
        caps[i]['t'] = min(caps[i]['t'], caps[i + 1]['f'])
    body = ''.join(scene_html(i, s) for i, s in enumerate(sc))
    capdiv = ''.join(f'<div class="cp" id="k{j}">{c["h"]}</div>' for j, c in enumerate(caps))
    meta = [{'type': s['type'], 'at': s.get('at'), **x} for s, x in zip(sc, tl)]
    page = f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="{GFX}/base.css">
<script src="{GFX}/gsap.min.js"></script><style>{CSS}</style></head><body><div class="bg"></div><div class="grid" id="grid"></div>
<div id="prog"></div>{body}<div id="cap">{capdiv}</div><div id="brand"><b>RICARDO PACE</b>| CIÊNCIA E TREINAMENTO</div>
<script>
const M={json.dumps(meta)},C={json.dumps([{k: c[k] for k in ('f', 't')} for c in caps])},TOT={total};
document.fonts.ready.then(()=>{{
document.querySelectorAll('.l1,.big').forEach(e=>{{let z=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+2&&z>40){{z-=4;e.style.fontSize=z+'px'}}}});
const tl=gsap.timeline({{paused:true}});
tl.fromTo('#prog',{{scaleX:0}},{{scaleX:1,duration:TOT,ease:'none'}},0);
tl.fromTo('#grid',{{backgroundPosition:'0px 0px'}},{{backgroundPosition:'0px 900px',duration:TOT,ease:'none'}},0);
M.forEach((m,i)=>{{
  const c='#c'+i, A=m.a0, D=m.ad, end=m.start+m.dur;
  tl.set(c,{{opacity:1}},m.start); if(i<M.length-1) tl.set(c,{{opacity:0}},end);
  tl.fromTo(c,{{clipPath:'inset(0 0 100% 0)'}},{{clipPath:'inset(0 0 0% 0)',duration:.3,ease:'power3.out'}},m.start);
  const els=[...document.querySelectorAll(c+' .e')], n=els.length;
  const at=m.at||els.map((_,k)=> i===0? k*0.09 : (n<=1?0:Math.min(.6,k/n*0.5)));
  els.forEach((e,k)=>{{
    const t0=(i===0? m.start+0.02+at[k] : A+D*at[k]);
    if(e.classList.contains('big')) {{
      tl.fromTo(e,{{scale:2.4,opacity:0,rotation:-6,filter:'blur(12px)'}},{{scale:1,opacity:1,rotation:0,filter:'blur(0px)',duration:.34,ease:'back.out(2.2)'}},t0);
      tl.to(e,{{x:9,duration:.05,yoyo:true,repeat:5}},t0+.34);
    }} else tl.fromTo(e,{{y:70,opacity:0}},{{y:0,opacity:1,duration:.32,ease:'power4.out'}},t0);
  }});
  if(m.type==='gancho'){{
    tl.fromTo('#st'+i,{{x:-160}},{{x:160,duration:m.dur,ease:'none'}},m.start);
    tl.fromTo('#rg'+i,{{scale:.3,opacity:.5}},{{scale:1.3,opacity:0,duration:1.1,repeat:Math.ceil(m.dur/1.1),ease:'power2.out'}},m.start);
    const x=document.getElementById('x'+i); if(x) tl.fromTo(x,{{scale:0,rotation:-30}},{{scale:1,rotation:0,duration:.3,ease:'back.out(3)'}},m.start+0.5);
  }}
  if(m.type==='numero'){{
    const el=document.getElementById('n'+i), s=el.textContent, mm=s.match(/^(.*?)0(.*)$/), o={{v:0}};
    const tgt=+el.dataset.v;
    tl.to(o,{{v:tgt,duration:1.3,ease:'power2.out',onUpdate:()=>{{el.textContent=mm[1]+o.v.toFixed(+el.dataset.d).replace('.',',')+mm[2]}}}},A+D*(at[1]||0.12));
    const sp=document.getElementById('sp'+i); if(sp){{tl.fromTo(sp,{{scale:2.4,opacity:0}},{{scale:1,opacity:1,duration:.3,ease:'power3.in'}},A+D*0.78);tl.to(sp,{{x:7,duration:.05,yoyo:true,repeat:3}},A+D*0.78+.3);}}
  }}
  if(m.type==='versus'){{
    tl.fromTo('#ba'+i,{{scaleY:0}},{{scaleY:1,duration:.7,ease:'power3.out'}},A+D*0.3);
    tl.fromTo('#bb'+i,{{scaleY:0}},{{scaleY:1,duration:.9,ease:'power3.out'}},A+D*0.5);
  }}
  if(m.type==='cta') tl.to('#bx'+i,{{scale:1.05,duration:.35,yoyo:true,repeat:Math.ceil(m.dur/.35),ease:'sine.inOut'}},A+D*0.5);
}});
C.forEach((c,j)=>{{tl.fromTo('#k'+j,{{opacity:0,scale:.82}},{{opacity:1,scale:1,duration:.12,ease:'back.out(3)'}},c.f);tl.set('#k'+j,{{opacity:0}},c.t);}});
tl.to({{}},{{duration:0.01}},TOT); window.tl=tl;}});
</script></body></html>'''
    # valores dos contadores
    for i, s in enumerate(sc):
        if s['type'] == 'numero':
            page = page.replace(f'id="n{i}"', f'id="n{i}" data-v="{s["num"]}" data-d="{s.get("dec", 0)}"')
    os.makedirs(os.path.join(pasta, 'build'), exist_ok=True)
    pg = os.path.join(pasta, 'build', 'reel.html')
    open(pg, 'w').write(page)
    json.dump({'total': total, 'scenes': tl}, open(os.path.join(pasta, 'timeline.json'), 'w'), indent=1)
    if os.environ.get('PREVIEW'):  # só a folha de contato: início e fim de cada cena
        ts = sorted({round(x['start'] + f * x['dur'], 2) for x in tl for f in (.15, .9)})
        sh('node', os.path.join(GFX, 'snap.js'), pg, os.path.join(pasta, 'build', 'preview.jpg'), ','.join(map(str, ts)))
        return
    mudo = os.path.join(pasta, 'video-mudo.mp4')
    sh('node', os.path.join(GFX, 'render.js'), pg, str(total), '0', mudo)
    mix(pasta, tl, total, mudo)


# ---------- trilha sintetizada + mixagem ----------
def trilha(total, bpm=100, seed=3):
    n = int(SR * total); t = np.arange(n) / SR; beat = 60 / bpm
    rng = np.random.default_rng(seed); y = np.zeros(n)
    for k in range(int(total / beat) + 1):
        t0 = k * beat; x = np.clip(t - t0, 0, None); on = (t >= t0) & (t < t0 + .5)
        y += on * .9 * np.sin(2 * np.pi * (45 * x + 60 * (1 - np.exp(-x * 30)) / 30)) * np.exp(-x * 9)  # bumbo
        t1 = t0 + beat / 2; x1 = np.clip(t - t1, 0, None); on1 = (t >= t1) & (t < t1 + .08)
        y += on1 * .18 * rng.standard_normal(n) * np.exp(-x1 * 60)  # chimbal
    roots = [55.0, 43.65, 49.0, 41.2]  # A1 F1 G1 E1
    bar = beat * 4
    for k in range(int(total / bar) + 1):
        f = roots[k % 4]; x = np.clip(t - k * bar, 0, None); on = (t >= k * bar) & (t < (k + 1) * bar)
        y += on * .22 * (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2 * x)) * (1 - np.exp(-x * 20))
        for m in (2, 2.5198, 3):  # acorde (tônica, terça menor, quinta)
            y += on * .05 * np.sin(2 * np.pi * f * 4 * m / 2 * x) * np.exp(-x * .8)
    y *= np.clip(t / .5, 0, 1) * np.clip((total - t) / .8, 0, 1)
    return y / np.abs(y).max()


def mix(pasta, tl, total, mudo):
    import soundfile as sf
    n = int(SR * total); voz = np.zeros(n)
    for x in tl:
        a, sr = sf.read(x['file'])
        if a.ndim > 1: a = a.mean(1)
        a = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a)
        i0 = int(x['a0'] * SR); voz[i0:i0 + len(a)] += a[: n - i0]
    env = np.convolve(np.abs(voz), np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
    duck = 1 - .65 * np.clip(env / (env.max() * .15 + 1e-9), 0, 1)
    mus = trilha(total) * duck * .16
    for nome, y in (('reel', voz + mus), ('reel-sem-trilha', voz)):
        wav = os.path.join(pasta, 'build', nome + '.wav')
        with wave.open(wav, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(y / np.abs(y).max() * .9, -1, 1) * 32767).astype('<i2').tobytes())
        r = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True).stderr
        m = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
        ln = f"volume={-12.9 - float(m['input_i']):.2f}dB,alimiter=limit=0.85:level=false:attack=2:release=60,aresample=48000"
        sh('ffmpeg', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-af', ln,
           '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest',
           os.path.join(pasta, ('build/' if nome != 'reel' else '') + nome + '.mp4'))
    print('ok', pasta, total)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    build(sys.argv[1])
