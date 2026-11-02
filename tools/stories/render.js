const puppeteer=require('/home/claude/carrossel-30mais/node_modules/puppeteer');const fs=require('fs'),path=require('path');
const F='/home/claude/carrossel-30mais/node_modules/@fontsource';const S=JSON.parse(fs.readFileSync('stories.json'));
const url=p=>p?('file://'+path.resolve(p)):'';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--allow-file-access-from-files']});
const pg=await b.newPage();await pg.setViewport({width:1080,height:1920});
for(const s of S){const out=path.resolve('out',s.file);fs.mkdirSync(path.dirname(out),{recursive:true});
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url('file://${F}/anton/files/anton-latin-400-normal.woff2')}
@font-face{font-family:I;font-weight:600;src:url('file://${F}/inter/files/inter-latin-600-normal.woff2')}
@font-face{font-family:I;font-weight:800;src:url('file://${F}/inter/files/inter-latin-800-normal.woff2')}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#0B0B0C;color:#F7F7F5;font-family:I;position:relative}
.bg{position:absolute;inset:0;background:${s.bg?`url('${url(s.bg)}') center/cover`:'radial-gradient(circle at 50% 30%,#2a1a0e 0%,#0B0B0C 60%)'}}
.sh{position:absolute;inset:0;background:${s.bg?'linear-gradient(180deg,rgba(11,11,12,.55) 0%,rgba(11,11,12,.35) 35%,rgba(11,11,12,.85) 62%,rgba(11,11,12,.95) 100%)':'none'}}
.w{position:absolute;left:90px;right:90px;${s.top?'top:300px':'bottom:330px'}}
.tag{display:inline-block;background:#FF6A00;color:#0B0B0C;font-weight:800;font-size:34px;letter-spacing:.12em;padding:14px 24px;margin-bottom:34px}
.t{font-family:A;text-transform:uppercase;font-size:118px;line-height:.98}.o{color:#FF6A00}
.sub{font-size:50px;font-weight:600;line-height:1.3;margin-top:36px}.sub b{color:#FF6A00;font-weight:800}
.cta{margin-top:50px;font-size:50px;font-weight:600;line-height:1.25;border-left:10px solid #FF6A00;padding-left:30px}.cta b{color:#FF6A00;font-weight:800}
.ar{font-family:A;font-size:140px;color:#FF6A00;margin-top:24px}
ul{list-style:none;margin-top:46px;display:flex;flex-direction:column;gap:30px}li{font-size:52px;font-weight:800;display:flex;gap:28px;align-items:center}
li:before{content:"✓";flex:none;width:76px;height:76px;background:#FF6A00;color:#0B0B0C;display:flex;align-items:center;justify-content:center;font-size:48px}
.card{position:absolute;left:250px;right:250px;bottom:300px;border:6px solid #FF6A00;transform:rotate(-2deg);box-shadow:0 30px 80px rgba(0,0,0,.6)}.card img{display:block;width:100%}
.h{position:absolute;left:0;right:0;bottom:120px;text-align:center;font-size:34px;font-weight:800;opacity:.8}
</style></head><body><div class="bg"></div><div class="sh"></div>
${s.card?`<div class="card"><img src="${url(s.card)}"></div>`:''}
<div class="w">${s.tag?`<div class="tag">${s.tag}</div>`:''}<div class="t">${s.title}</div>
${s.sub?`<div class="sub">${s.sub}</div>`:''}${s.list?`<ul>${s.list.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}
${s.cta?`<div class="cta">${s.cta}</div>`:''}${s.arrow&&!s.top?`<div class="ar">${s.arrow}</div>`:''}</div>
${s.top&&!s.card?`<div class="h">@personal.ricardopace</div>`:''}</body></html>`;
fs.writeFileSync('tmp.html',html);await pg.goto('file://'+path.resolve('tmp.html'),{waitUntil:'load'});await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:out,type:'jpeg',quality:90});}
await b.close();console.log('ok',S.length)})();
