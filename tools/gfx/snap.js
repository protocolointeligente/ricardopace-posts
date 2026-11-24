// node snap.js page.html out.jpg t1,t2,...  -> folha de contato (270x480 por quadro) para conferir sem renderizar o vídeo
const [,, page, out, ts] = process.argv;
const puppeteer = require('/home/claude/carrossel-30mais/node_modules/puppeteer');
const path = require('path'), { execFileSync } = require('child_process'), fs = require('fs');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
  await p.evaluateOnNewDocument(() => { window.DUR = 0; window.A0 = 0; });
  await p.goto('file://' + path.resolve(page), { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  for (let k = 0; k < 100 && !(await p.evaluate(() => !!window.tl)); k++) await new Promise(r => setTimeout(r, 100));
  const dir = fs.mkdtempSync('/tmp/snap-'); const list = ts.split(',').map(Number);
  for (const [i, t] of list.entries()) { await p.evaluate(t => { window.tl.seek(t, false); return 0; }, t); await p.screenshot({ path: `${dir}/s${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
  await b.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `${dir}/s%02d.jpg`, '-vf', `scale=270:480,tile=${Math.min(list.length, 7)}x${Math.ceil(list.length / 7)}`, '-frames:v', '1', out]);
  fs.rmSync(dir, { recursive: true }); console.log('ok', out);
})();
