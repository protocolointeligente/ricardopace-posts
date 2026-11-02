// node render.js page.html dur a0 out.mp4
const [,, page, dur, a0, out] = process.argv;
const puppeteer = require('/home/claude/carrossel-30mais/node_modules/puppeteer');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
(async () => {
  const dir = fs.mkdtempSync('/tmp/gfx-'); const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
  await p.evaluateOnNewDocument((d, a) => { window.DUR = d; window.A0 = a; }, +dur, +a0);
  await p.goto('file://' + path.resolve(page), { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  const n = Math.round(dur * 30);
  for (let i = 0; i < n; i++) { await p.evaluate(t => { window.tl.seek(t, false); return 0; }, i / 30); await p.screenshot({ path: `${dir}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 }); }
  await b.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', `${dir}/f%04d.jpg`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', out]);
  fs.rmSync(dir, { recursive: true }); console.log('ok', out, n);
})();
