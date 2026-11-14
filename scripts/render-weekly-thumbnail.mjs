// 패키지 릴리스 주간 글의 썸네일(1244x1244 PNG)을 그린다.
// 사용법: node scripts/render-weekly-thumbnail.mjs <data.json> <out.png>
//
// data.json 예시:
// {
//   "t1": "35개 패키지,",              // 제목 1줄(흰색)
//   "t2": "보안 패치 러시",            // 제목 2줄(강조색). 우측 원형 장식과 겹치지 않을 길이로
//   "size": 50,                        // 제목 글자 크기(선택, 기본 50). 영문은 44 안팎
//   "sub": "추적 중인 87개 중 35개 새 릴리스 · 11.07 ~ 11.14",
//   "cards": [                         // 정확히 3개: 보안 패치 / Breaking / 새 기능 순
//     { "h": "보안 패치", "b": ["Node.js LTS 3종 CVE", "Gradle · Podman · Grafana"] },
//     { "h": "Breaking",  "b": ["Kyverno 1.20 레거시 제거", "FastAPI Python 3.10 중단"] },
//     { "h": "새 기능",   "b": ["Rust never 타입 안정화", "TinyBase 동기화 권한"] }
//   ],
//   "foot": "Node.js · Rust · Gradle · Kyverno · Podman"
// }
//
// 글꼴은 npm의 pretendard 패키지를 임시 디렉토리에 받아 쓴다(시스템에 한글 글꼴이 없어도 동작).
// 브라우저는 @playwright/test의 chromium을 쓰고, 없으면 PLAYWRIGHT_CHROMIUM 또는
// /opt/pw-browsers/chromium으로 폴백한다.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';

const [dataPath, outPath] = process.argv.slice(2);
if (!dataPath || !outPath) {
  console.error('usage: node scripts/render-weekly-thumbnail.mjs <data.json> <out.png>');
  process.exit(1);
}
const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(d.cards) || d.cards.length !== 3) throw new Error('cards must have exactly 3 items');

async function ensureFonts() {
  const dir = path.join(os.tmpdir(), 'weekly-thumbnail-pretendard');
  const fontDir = path.join(dir, 'package/dist/public/static');
  if (fs.existsSync(path.join(fontDir, 'Pretendard-ExtraBold.otf'))) return fontDir;
  fs.mkdirSync(dir, { recursive: true });
  const meta = await (await fetch('https://registry.npmjs.org/pretendard/latest')).json();
  const tgz = Buffer.from(await (await fetch(meta.dist.tarball)).arrayBuffer());
  const tgzPath = path.join(dir, 'p.tgz');
  fs.writeFileSync(tgzPath, tgz);
  execFileSync('tar', ['xzf', tgzPath, '-C', dir]);
  return fontDir;
}

async function launch() {
  try {
    return await chromium.launch();
  } catch {
    const exe = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium';
    return chromium.launch({ executablePath: exe });
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const F = await ensureFonts();
const ff = (w, n) =>
  `@font-face{font-family:P;font-weight:${w};src:url(file://${F}/Pretendard-${n}.otf)}`;
const card = (c, i) =>
  `<div class="card"><div class="n">0${i + 1}</div><div class="h">${esc(c.h)}</div><div class="b">${c.b.map(esc).join('<br>')}</div></div>`;
const size = d.size || 50;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${ff(400, 'Regular')}${ff(500, 'Medium')}${ff(600, 'SemiBold')}${ff(700, 'Bold')}${ff(800, 'ExtraBold')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:622px;height:622px;overflow:hidden;font-family:P,sans-serif;color:#fff;
background:linear-gradient(160deg,#123a2e 0%,#0d241c 45%,#0a1712 100%);position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(120,230,190,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(120,230,190,.06) 1px,transparent 1px);background-size:22px 22px}
.eyebrow{position:absolute;left:50px;top:42px;display:flex;align-items:center;gap:19px;color:#4fdcae;font-weight:800;font-size:15px;letter-spacing:5.4px}
.dot{width:9px;height:9px;border-radius:50%;background:#4fdcae;box-shadow:0 0 10px #4fdcae}
.t1,.t2{position:absolute;left:47px;font-weight:800;letter-spacing:-2px;line-height:1;white-space:nowrap;font-size:${size}px}
.t1{top:82px}.t2{top:140px;color:#7fe3cc}
.sub{position:absolute;left:50px;top:219px;font-size:16px;font-weight:500;color:rgba(255,255,255,.62)}
.orb{position:absolute;left:405px;top:51px;width:170px;height:170px}
.box{position:absolute;left:461px;top:108px;width:58px;height:58px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:30px;font-family:'Noto Color Emoji','Apple Color Emoji',sans-serif}
.cards{position:absolute;left:50px;top:359px;display:flex;gap:20px}
.card{width:161px;height:142px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);padding:20px 17px}
.n{color:#4fdcae;font-weight:700;font-size:13.5px}.h{margin-top:13px;font-weight:800;font-size:18px;letter-spacing:-.4px}
.b{margin-top:14px;font-size:11.2px;font-weight:500;line-height:1.66;color:rgba(255,255,255,.78);white-space:nowrap}
.foot{position:absolute;left:50px;top:541px;font-size:12.8px;font-weight:500;color:rgba(255,255,255,.62)}
.btn{position:absolute;left:448px;top:534px;width:124px;height:40px;border:1.5px solid #4fdcae;border-radius:20px;color:#7fe3cc;font-weight:800;font-size:14.5px;display:flex;align-items:center;justify-content:center}
</style></head><body><div class="grid"></div>
<div class="eyebrow"><span class="dot"></span>WEEKLY RELEASES</div>
<div class="t1">${esc(d.t1)}</div><div class="t2">${esc(d.t2)}</div>
<div class="sub">${esc(d.sub)}</div>
<svg class="orb" viewBox="0 0 170 170"><circle cx="85" cy="85" r="84" fill="none" stroke="rgba(79,220,174,.18)"/><circle cx="85" cy="85" r="60" fill="none" stroke="rgba(79,220,174,.14)"/>
<path d="M 35 17 A 84 84 0 0 1 135 152" fill="none" stroke="#4fdcae" stroke-width="2"/><circle cx="160" cy="48" r="6" fill="#4fdcae"/></svg>
<div class="box">📦</div>
<div class="cards">${d.cards.map(card).join('')}</div>
<div class="foot">${esc(d.foot)}</div><div class="btn">Patch First</div></body></html>`;

// file:// 글꼴을 읽으려면 페이지도 file://로 열어야 한다(setContent의 about:blank에서는 막힌다).
const htmlPath = path.join(os.tmpdir(), `weekly-thumbnail-${process.pid}.html`);
fs.writeFileSync(htmlPath, html);
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 622, height: 622 }, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`);
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  await page.screenshot({ path: outPath });
} finally {
  await browser.close();
  fs.rmSync(htmlPath, { force: true });
}
console.log(`wrote ${outPath}`);
