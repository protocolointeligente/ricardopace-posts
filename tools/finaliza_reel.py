#!/usr/bin/env python3
"""Acabamento padrão dos Reels @personal.ricardopace (decisão do Ricardo em 14/11/2026).

    python3 finaliza_reel.py <pasta-do-post>

A pasta precisa ter reel.mp4 (saída do mix.py) e capa.json. O script:
  1. guarda o vídeo original como reel-base.mp4 (rodar de novo parte sempre dele, sem empilhar selo/vinheta);
  2. põe o selo de marca (gfx/selo.png) entrando JUNTO com o gancho, no topo, de 0,15 s a 3,5 s
     (a vinheta nunca abre o Reel: atrasaria o gancho e derrubaria a retenção dos 3 primeiros segundos);
  3. fecha com a vinheta (gfx/vinheta.mp4, 3,6 s);
  4. gera capa.jpg pelo modelo gfx/capa.html (tipografia gigante, sem foto do Ricardo);
  5. confere formato e loudness (−15 a −13 LUFS).

capa.json: {"tag": "COSTAS", "l1": "COSTAS", "l2": "NÃO", "l3": "CRESCEM?", "fx": "O ERRO ESTÁ NA REMADA",
            "bg_t": 0.3, "s1": 190, "s2": 290}
  bg_t = segundo do reel-base.mp4 usado como fundo escurecido (imagem do exercício); omita para fundo liso.

Assets de marca (gerados uma vez e versionados em gfx/): python3 finaliza_reel.py --assets
"""
import json, math, os, subprocess, sys, tempfile, urllib.parse, wave
import numpy as np

T = os.path.dirname(os.path.abspath(__file__))
GFX = os.path.join(T, 'gfx')
SELO, VINHETA = os.path.join(GFX, 'selo.png'), os.path.join(GFX, 'vinheta.mp4')
SR = 48000


def sh(*a, **k):
    return subprocess.run(a, check=True, **k)


def shot(url, out, w, h, transparent=False):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = b.new_page(viewport={'width': w, 'height': h})
        pg.goto(url, wait_until='load'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(150)
        pg.screenshot(path=out, omit_background=transparent, **({} if out.endswith('.png') else {'type': 'jpeg', 'quality': 92}))
        b.close()


def som_vinheta(path, dur=3.6):
    """Impacto + whoosh sintetizados (sem direitos de terceiros), sincronizados com a vinheta."""
    t = np.arange(int(SR * dur)) / SR
    rng = np.random.default_rng(7)
    def hit(t0, f0=110, f1=38, dec=5.0, amp=1.0):
        x = np.clip(t - t0, 0, None); on = t >= t0
        ph = 2 * np.pi * (f1 * x + (f0 - f1) * (1 - np.exp(-x * 18)) / 18)
        return on * amp * np.sin(ph) * np.exp(-x * dec)
    def whoosh(t0, d, amp=.35):
        x = (t - t0) / d; env = np.where((x > 0) & (x < 1), np.sin(np.pi * np.clip(x, 0, 1)) ** 2, 0)
        n = np.convolve(rng.standard_normal(len(t)), np.ones(24) / 24, 'same')
        return amp * env * n
    s = whoosh(0.0, 0.42) + hit(0.30, amp=.9) + hit(0.62, 140, 45, 4.0, 1.0) + .25 * hit(1.0, 900, 600, 9, .4)
    s += .12 * np.sin(2 * np.pi * 55 * t) * np.exp(-np.clip(t - .62, 0, None) * 1.2) * (t > .62)
    s *= np.clip((dur - t) / .3, 0, 1)
    s = np.stack([s, s * .96], 1); s /= np.abs(s).max() * 1.12
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype('<i2').tobytes())


def assets():
    shot('file://' + os.path.join(GFX, 'selo.html'), SELO, 900, 96, transparent=True)
    from PIL import Image
    im = Image.open(SELO); im.crop(im.getchannel('A').getbbox()).save(SELO)  # recorta a área transparente
    with tempfile.TemporaryDirectory() as d:
        mudo, wav = os.path.join(d, 'v.mp4'), os.path.join(d, 'v.wav')
        sh('node', os.path.join(GFX, 'render.js'), os.path.join(GFX, 'vinheta.html'), '3.6', '0', mudo)
        som_vinheta(wav)
        sh('ffmpeg', '-v', 'error', '-y', '-i', mudo, '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000',
           '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', VINHETA)
    print('ok', SELO, VINHETA)


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))


def lufs(f):
    r = subprocess.run(['ffmpeg', '-i', f, '-af', 'ebur128=framelog=quiet', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(r.rsplit('I:', 1)[1].split('LUFS')[0])


def finaliza(pasta):
    pasta = os.path.abspath(pasta)
    base, reel = os.path.join(pasta, 'reel-base.mp4'), os.path.join(pasta, 'reel.mp4')
    if not os.path.exists(base):
        os.rename(reel, base)
    if not (os.path.exists(SELO) and os.path.exists(VINHETA)):
        assets()
    cfg = json.load(open(os.path.join(pasta, 'capa.json')))
    d = dur(base); fade = d - .25
    # selo centralizado no topo (y=196, abaixo da interface do Instagram e acima da tag do gancho):
    # desliza da esquerda (0,15–0,5 s, ease-out cúbico) e some em 3,2–3,5 s
    from PIL import Image
    sw = Image.open(SELO).width; x0 = (1080 - sw) // 2
    x = f"if(lt(t,0.15),-{sw},{x0}-{x0 + sw}*pow(1-min((t-0.15)/0.35,1),3))"
    fc = (f"[1:v]format=rgba,fade=in:st=0.15:d=0.2:alpha=1,fade=out:st=3.2:d=0.3:alpha=1[s];"
          f"[0:v][s]overlay=x='{x}':y=196:eof_action=pass,fps=30,format=yuv420p,setsar=1[a];"
          f"[0:a]afade=t=out:st={fade:.3f}:d=0.25,aresample=48000[aa];"
          f"[2:v]fps=30,format=yuv420p,setsar=1[b];[2:a]aresample=48000[ba];"
          f"[a][aa][b][ba]concat=n=2:v=1:a=1[v][o]")
    sh('ffmpeg', '-v', 'error', '-y', '-i', base, '-loop', '1', '-t', '3.6', '-i', SELO, '-i', VINHETA,
       '-filter_complex', fc, '-map', '[v]', '-map', '[o]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
       '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', reel)
    # capa
    with tempfile.TemporaryDirectory() as tmp:
        c = {k: cfg[k] for k in ('tag', 'l1', 'l2', 'l3', 'fx', 's1', 's2') if k in cfg}
        if 'bg_t' in cfg:
            bg = os.path.join(tmp, 'bg.jpg')
            # só a parte de cima do frame (y 0–1080): fica fora a faixa de legenda e o @ do vídeo
            sh('ffmpeg', '-v', 'error', '-y', '-ss', str(cfg['bg_t']), '-i', base, '-frames:v', '1',
               '-vf', 'crop=1080:1080:0:0,gblur=sigma=2', '-q:v', '2', bg)
            c['bg'] = 'file://' + bg
        shot('file://' + os.path.join(GFX, 'capa.html') + '#' + urllib.parse.quote(json.dumps(c)), os.path.join(pasta, 'capa.jpg'), 1080, 1920)
    # conferência
    info = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,sample_rate',
                                    '-of', 'compact', reel], text=True)
    L = lufs(reel)
    ok = 'h264' in info and '1080' in info and '30/1' in info and '48000' in info and -15 <= L <= -13
    print(f"{'ok' if ok else 'CONFERIR'} {reel} {dur(reel):.2f}s {L:.1f} LUFS\n{info}")
    if not ok:
        sys.exit(1)


if __name__ == '__main__':
    if sys.argv[1:] == ['--assets']:
        assets()
    elif len(sys.argv) == 2:
        finaliza(sys.argv[1])
    else:
        sys.exit(__doc__)
