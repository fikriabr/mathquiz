'use strict';
/* ====== Inti: utilitas angka, format Indonesia, pembuat opsi, helper SVG ====== */
const TOPICS = {};
/* RNG ber-seed: nomor soal yang sama selalu menghasilkan soal yang sama */
let _seed = 1;
const seedRng = s => { _seed = (s >>> 0) || 1; for (let i = 0; i < 4; i++) rnd(); };
const rnd = () => { _seed = (_seed + 0x6D2B79F5) | 0; let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const R = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;
const pick = a => a[Math.floor(rnd() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const MINUS = '−';
const fact = n => n <= 1 ? 1 : n * fact(n - 1);
const nPr = (n, r) => { let v = 1; for (let i = 0; i < r; i++) v *= (n - i); return v; };
const nCr = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = v * (n - r + i) / i; return Math.round(v); };

/* ====== i18n: bahasa aktif dan penerjemah teks soal ====== */
let LANG = 'id';
const setLang = l => { LANG = l === 'en' ? 'en' : 'id'; };
/* tr(teks Indonesia, teks Inggris): jika Inggris belum ada, kembali ke Indonesia */
const tr = (id, en) => (LANG === 'en' && en != null) ? en : id;
let TR_MISS = false; /* diset true bila soal aktif belum punya terjemahan */

/* angka mengikuti bahasa: 1.250,5 (id) atau 1,250.5 (en) */
function N(n, dec = 4) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n);
  const f = Math.pow(10, dec);
  const r = Math.round(n * f) / f;
  const neg = r < 0;
  const s = Math.abs(r).toString();
  const gs = LANG === 'en' ? ',' : '.', ds = LANG === 'en' ? '.' : ',';
  let [i, d] = s.split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, gs);
  return (neg ? MINUS : '') + (d ? i + ds + d : i);
}
const Rp = n => (n < 0 ? MINUS : '') + 'Rp ' + N(Math.abs(n));
const sup = x => `<sup>${x}</sup>`;
const pw = (b, e) => `${b}<sup>${e}</sup>`;
const fr = (n, d) => `<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const rt = x => `<span class="rt">√<span class="ro">${x}</span></span>`;
function frs(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  if (d === 1) return N(n);
  return (n < 0 ? MINUS : '') + fr(Math.abs(n), d);
}
function toFrac(x, maxD = 60) { for (let d = 1; d <= maxD; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return [n, d]; } return null; }
const frv = x => { const f = toFrac(x); return f ? frs(f[0], f[1]) : N(x, 2); };
function sqrtForm(n) {
  let o = 1, i = n;
  for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) { if (n % (k * k) === 0) { o = k; i = n / (k * k); break; } }
  if (i === 1) return N(o);
  return (o > 1 ? o : '') + rt(i);
}
/* polinom: koefisien dari pangkat tertinggi */
function P(cs, v = 'x') {
  const n = cs.length - 1; let out = '';
  cs.forEach((c, i) => {
    const p = n - i; if (c === 0) return;
    const ac = Math.abs(c);
    const vs = p === 0 ? '' : (p === 1 ? v : v + '<sup>' + p + '</sup>');
    const body = p === 0 ? N(ac) : (ac === 1 ? '' : N(ac)) + vs;
    if (!out) out = (c < 0 ? MINUS : '') + body; else out += ` ${c < 0 ? MINUS : '+'} ${body}`;
  });
  return out || '0';
}
const mat = rows => `<span class="mat"><span class="mb"></span><table>${rows.map(r => `<tr>${r.map(c => `<td>${typeof c === 'number' ? N(c) : c}</td>`).join('')}</tr>`).join('')}</table><span class="mb r"></span></span>`;
const matd = rows => `<span class="mat det"><span class="mb"></span><table>${rows.map(r => `<tr>${r.map(c => `<td>${typeof c === 'number' ? N(c) : c}</td>`).join('')}</tr>`).join('')}</table><span class="mb r"></span></span>`;
/* bilangan kompleks a + bi */
function cx(a, b) {
  const im = b === 0 ? '' : (Math.abs(b) === 1 ? 'i' : N(Math.abs(b)) + 'i');
  if (b === 0) return N(a);
  if (a === 0) return (b < 0 ? MINUS : '') + im;
  return `${N(a)} ${b < 0 ? MINUS : '+'} ${im}`;
}

/* tanda hubung di depan angka (di luar tag HTML) menjadi minus matematis */
const fixMinus = h => String(h).replace(/(<[^>]*>)|(^|[\s=(,;:|]|(?<=>))-(?=\d)/g, (m, t, p) => (t ? t : p + MINUS));
const ST = (...s) => '<ol class="steps">' + s.flat().map(x => `<li>${x}</li>`).join('') + '</ol>';
const TIP = (t, en) => `<p class="tip"><b>${LANG === 'en' ? 'Tip:' : 'Trik:'}</b> ${tr(t, en)}</p>`;
const pk2 = (a, b) => { const i = Math.floor(rnd() * a.length); return tr(a[i], b[i]); };
const G = (min, fn) => ({ min, fn });

/* ----- pembuat pilihan jawaban ----- */
function opts(correct, cands, filler) {
  const seen = new Set([correct]); const list = [correct];
  for (const c of shuffle(cands.filter(x => x != null))) {
    const s = String(c);
    if (!seen.has(s) && !/NaN|undefined|Infinity/.test(s)) { seen.add(s); list.push(s); }
    if (list.length === 4) break;
  }
  let guard = 0;
  while (list.length < 4 && filler && guard++ < 80) {
    const s = String(filler());
    if (!seen.has(s) && !/NaN|undefined|Infinity/.test(s)) { seen.add(s); list.push(s); }
  }
  if (list.length < 4) return null;
  const sh = shuffle(list.map((t, i) => ({ t, c: i === 0 })));
  return { opts: sh.map(o => o.t), ans: sh.findIndex(o => o.c) };
}
function numOpts(v, cands, fmt = N, step = 1) {
  if (v >= 0 && fmt === N) cands = cands.filter(x => x >= 0); /* jawaban positif: hindari pengecoh negatif yang janggal */
  const cs = cands.filter(x => typeof x === 'number' && isFinite(x) && Math.abs(x - v) > 1e-9).map(x => fmt(x));
  return opts(fmt(v), cs, () => {
    let x = v + pick([-1, 1]) * R(1, 6) * step;
    if (v >= 0 && x < 0) x = v + R(1, 6) * step;
    return fmt(x);
  });
}

/* ----- langkah penjumlahan / pengurangan / perkalian per nilai tempat ----- */
const PL_ID = ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan', 'Puluh ribuan'], PL_EN = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands'];
const PL = p => tr(PL_ID[p], PL_EN[p]);
const pv = n => { const s = String(n); return s.split('').map((c, i) => +c * Math.pow(10, s.length - 1 - i)); };
function addSteps(a, b) {
  const L = Math.max(String(a).length, String(b).length); const st = []; const parts = [];
  for (let p = L - 1; p >= 0; p--) {
    const x = Math.floor(a / Math.pow(10, p)) % 10 * Math.pow(10, p), y = Math.floor(b / Math.pow(10, p)) % 10 * Math.pow(10, p);
    parts.push(x + y); st.push(`${PL(p)}: ${N(x)} + ${N(y)} = <b>${N(x + y)}</b>`);
  }
  st.push(tr(`Gabungkan: ${parts.map(N).join(' + ')} = <b>${N(a + b)}</b>`, `Combine: ${parts.map(N).join(' + ')} = <b>${N(a + b)}</b>`));
  return st;
}
function subSteps(a, b) {
  const st = []; let cur = a;
  for (const v of pv(b)) { if (v === 0) continue; st.push(`${N(cur)} ${MINUS} ${N(v)} = ${N(cur - v)}`); cur -= v; }
  st[st.length - 1] = st[st.length - 1].replace(/= (.+)$/, '= <b>$1</b>');
  return [tr('Kurangi sedikit demi sedikit, mulai dari nilai tempat terbesar:', 'Subtract step by step, starting from the largest place value:'), ...st];
}
function dw(a, b, f) { const A = String(a).padStart(String(b).length, '0'), B = String(b).padStart(A.length, '0'); let r = ''; for (let i = 0; i < A.length; i++) r += f(+A[i], +B[i]); return +r; }
function factorStr(n) {
  const f = {}; let m = n;
  for (let p = 2; p * p <= m; p++) while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; }
  if (m > 1) f[m] = (f[m] || 0) + 1;
  return { f, html: Object.keys(f).map(p => f[p] > 1 ? `${p}<sup>${f[p]}</sup>` : p).join(' × ') };
}

/* ================== SVG ================== */
let UID = 0;
const svg = (w, h, inner, label = 'Ilustrasi soal') => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${inner}</svg>`;
const TX = (x, y, t, a = 'middle', cls = '') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${a}" class="${cls}">${t}</text>`;
const f1 = n => n.toFixed(1);

function svgPie(parts, n) {
  const cx = 90, cy = 90, r = 78; let s = '';
  for (let i = 0; i < parts; i++) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / parts, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / parts;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${cx} ${cy}L${f1(x0)} ${f1(y0)}A${r} ${r} 0 ${(a1 - a0) > Math.PI ? 1 : 0} 1 ${f1(x1)} ${f1(y1)}Z" class="${i < n ? 'f1' : 'f0'}"/>`;
  }
  return svg(180, 180, s, `Lingkaran dibagi ${parts} bagian sama besar, ${n} bagian diarsir`);
}
function svgRect(w, h, lw, lh) {
  const k = Math.min(230 / w, 130 / h), rw = w * k, rh = h * k, x = 52, y = 28;
  return svg(rw + 100, rh + 56, `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" class="f1"/>` + TX(x + rw / 2, y - 9, lw) + TX(x - 9, y + rh / 2 + 5, lh, 'end'), `Persegi panjang ${lw} kali ${lh}`);
}
function svgTri(b, t) {
  const k = Math.min(240 / b, 130 / t), rw = b * k, rh = t * k, x = 30, y = 20, px = rw * 0.38;
  return svg(rw + 90, rh + 62,
    `<polygon points="${x},${y + rh} ${x + rw},${y + rh} ${x + px},${y}" class="f1"/>` +
    `<line x1="${x + px}" y1="${y}" x2="${x + px}" y2="${y + rh}" class="ln dash"/>` +
    `<path d="M${x + px} ${y + rh - 12}h12v12" class="ln" style="stroke-width:1.8"/>` +
    TX(x + rw / 2, y + rh + 24, `alas = ${b} cm`) + TX(x + px + 8, y + rh / 2 + 5, `tinggi = ${t} cm`, 'start'), `Segitiga dengan alas ${b} cm dan tinggi ${t} cm`);
}
function svgL(w, h, cw, ch) {
  const k = Math.min(210 / w, 140 / h), W = w * k, H = h * k, CW = cw * k, CH = ch * k, x = 44, y = 32;
  const pts = [[0, 0], [W - CW, 0], [W - CW, CH], [W, CH], [W, H], [0, H]].map(p => `${f1(x + p[0])},${f1(y + p[1])}`).join(' ');
  return svg(W + 100, H + 70,
    `<polygon points="${pts}" class="f1"/>` + TX(x + W / 2, y + H + 24, `${w} cm`) + TX(x - 9, y + H / 2 + 5, `${h} cm`, 'end') +
    TX(x + W - CW / 2, y + CH - 9, `${cw} cm`) + TX(x + W - CW - 8, y + CH / 2 + 5, `${ch} cm`, 'end'), `Bangun berbentuk L`);
}
const fmtT = (h, m) => String(h).padStart(2, '0') + '.' + String(m).padStart(2, '0');
function svgClock(h, m) {
  const c = 100; let s = `<circle cx="${c}" cy="${c}" r="90" class="f0"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * Math.PI / 30, l = i % 5 === 0 ? 9 : 4;
    s += `<line x1="${f1(c + (90 - l) * Math.sin(a))}" y1="${f1(c - (90 - l) * Math.cos(a))}" x2="${f1(c + 86 * Math.sin(a))}" y2="${f1(c - 86 * Math.cos(a))}" class="ln" style="stroke-width:${i % 5 === 0 ? 2.6 : 1.2}"/>`;
  }
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; s += TX(c + 68 * Math.sin(a), c - 68 * Math.cos(a) + 6, i, 'middle', 'big'); }
  const ha = ((h % 12) * 30 + m * 0.5) * Math.PI / 180, ma = m * 6 * Math.PI / 180;
  s += `<line x1="${c}" y1="${c}" x2="${f1(c + 44 * Math.sin(ha))}" y2="${f1(c - 44 * Math.cos(ha))}" class="ln" style="stroke-width:7"/>`;
  s += `<line x1="${c}" y1="${c}" x2="${f1(c + 68 * Math.sin(ma))}" y2="${f1(c - 68 * Math.cos(ma))}" class="ln" style="stroke-width:4"/>`;
  s += `<circle cx="${c}" cy="${c}" r="6" class="dot"/>`;
  return svg(200, 200, s, 'Jam analog');
}
function svgRightTri(L, o = {}) {
  /* siku-siku di kiri bawah; a = alas, b = tegak, c = miring */
  const a = o.a || 4, b = o.b || 3, k = Math.min(170 / a, 120 / b), ra = a * k, rb = b * k, x0 = 44, y0 = 24;
  const A = [x0, y0 + rb], B = [x0 + ra, y0 + rb], C = [x0, y0];
  let s = `<polygon points="${A} ${B} ${C}" class="f1"/><path d="M${x0} ${y0 + rb - 14}h14v14" class="ln" style="stroke-width:1.8"/>`;
  s += TX(x0 + ra / 2, y0 + rb + 24, L.a || '') + TX(x0 - 9, y0 + rb / 2 + 5, L.b || '', 'end');
  const len = Math.hypot(ra, rb), nx = rb / len, ny = -ra / len;
  s += TX(x0 + ra / 2 + nx * 16, y0 + rb / 2 + ny * 16 + 5, L.c || '', 'middle', 'acc');
  if (o.theta) {
    s += `<path d="M${f1(B[0] - 34)} ${f1(B[1])}A34 34 0 0 0 ${f1(B[0] - 34 * ra / len)} ${f1(B[1] - 34 * rb / len)}" class="ln" style="stroke-width:2"/>` + TX(B[0] - 46, B[1] - 8, o.theta, 'middle', 'acc');
  }
  return svg(ra + 110, rb + 64, s, 'Segitiga siku-siku');
}
function svgCircle(o) {
  const cx = 100, cy = 100, r = 76; let s = '';
  if (o.mode === 'sector') {
    const t = o.angle * Math.PI / 180, ex = cx + r * Math.cos(t), ey = cy - r * Math.sin(t);
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" class="f0"/><path d="M${cx} ${cy}L${cx + r} ${cy}A${r} ${r} 0 ${o.angle > 180 ? 1 : 0} 0 ${f1(ex)} ${f1(ey)}Z" class="f1"/>`;
    s += TX(cx + r / 2, cy + 20, o.label) + TX(cx + 26 * Math.cos(t / 2) + 8, cy - 26 * Math.sin(t / 2) + 5, o.angle + '°', 'middle', 'acc');
  } else {
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" class="f1"/>`;
    if (o.mode === 'diameter') s += `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" class="ln"/>` + TX(cx, cy - 10, o.label, 'middle', 'big');
    else s += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" class="ln"/>` + TX(cx + r / 2, cy - 10, o.label, 'middle', 'big');
  }
  s += `<circle cx="${cx}" cy="${cy}" r="4.5" class="dot"/>`;
  return svg(200, 200, s, 'Lingkaran');
}
/* grafik fungsi serbaguna */
function plot(o) {
  const w = o.w || 320, h = o.h || 220, xr = o.xr || [-5, 5], yr = o.yr || [-5, 5], xs = o.xs || 1, ys = o.ys || 1;
  const id = 'cp' + (++UID), pl = 30, pr = 12, pt = 12, pb = 26;
  const X = x => pl + (x - xr[0]) / (xr[1] - xr[0]) * (w - pl - pr), Y = y => h - pb - (y - yr[0]) / (yr[1] - yr[0]) * (h - pt - pb);
  let s = `<defs><clipPath id="${id}"><rect x="${pl}" y="${pt}" width="${w - pl - pr}" height="${h - pt - pb}"/></clipPath></defs>`;
  for (let i = Math.ceil(xr[0] / xs); i * xs <= xr[1] + 1e-9; i++) { const v = i * xs; s += `<line x1="${f1(X(v))}" y1="${pt}" x2="${f1(X(v))}" y2="${h - pb}" class="grid"/>` + TX(X(v), h - pb + 16, N(v), 'middle', 'tick'); }
  for (let i = Math.ceil(yr[0] / ys); i * ys <= yr[1] + 1e-9; i++) { const v = i * ys; s += `<line x1="${pl}" y1="${f1(Y(v))}" x2="${w - pr}" y2="${f1(Y(v))}" class="grid"/>` + TX(pl - 5, Y(v) + 4, N(v), 'end', 'tick'); }
  if (xr[0] <= 0 && xr[1] >= 0) s += `<line x1="${f1(X(0))}" y1="${pt}" x2="${f1(X(0))}" y2="${h - pb}" class="ln" style="stroke-width:1.8"/>`;
  if (yr[0] <= 0 && yr[1] >= 0) s += `<line x1="${pl}" y1="${f1(Y(0))}" x2="${w - pr}" y2="${f1(Y(0))}" class="ln" style="stroke-width:1.8"/>`;
  s += `<g clip-path="url(#${id})">`;
  if (o.shade) {
    const { f, g = () => 0, x0, x1 } = o.shade, n = 70; let top = '', bot = '';
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; top += `${f1(X(x))},${f1(Y(f(x)))} `; }
    for (let i = n; i >= 0; i--) { const x = x0 + (x1 - x0) * i / n; bot += `${f1(X(x))},${f1(Y(g(x)))} `; }
    s += `<polygon points="${top}${bot}" class="shade"/>`;
  }
  (o.fns || []).forEach((fn, k) => {
    let d = '', pen = false; for (let i = 0; i <= 140; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 140, y = fn(x); if (!isFinite(y)) { pen = false; continue; } d += (pen ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(y)); pen = true; }
    s += `<path d="${d}" class="ln ${k ? 'c2' : ''}" style="stroke-width:3"/>`;
  });
  s += '</g>';
  (o.pts || []).forEach(p => { s += `<circle cx="${f1(X(p.x))}" cy="${f1(Y(p.y))}" r="5.5" class="dot acc"/>`; if (p.label) s += TX(X(p.x) + (p.dx ?? 10), Y(p.y) + (p.dy ?? -10), p.label, p.anchor || 'start', 'acc'); });
  return svg(w, h, s, o.label || 'Grafik');
}
function svgBars(data, o = {}) {
  const bw = 34, gap = 14, H = 150, pad = 28, W = data.length * (bw + gap) + gap + 10, mx = Math.max(...data) * 1.15;
  let s = '';
  data.forEach((v, i) => {
    const x = gap + i * (bw + gap), hh = v / mx * H;
    s += `<rect x="${x}" y="${pad + H - hh}" width="${bw}" height="${hh}" class="f1"/>` + TX(x + bw / 2, pad + H - hh - 6, v) + TX(x + bw / 2, pad + H + 18, o.names ? o.names[i] : i + 1, 'middle', 'tick');
  });
  if (o.mean != null) { const y = pad + H - o.mean / mx * H; s += `<line x1="0" y1="${f1(y)}" x2="${W}" y2="${f1(y)}" class="ln dash c2"/>` + TX(W - 2, y - 6, 'rata-rata ' + N(o.mean), 'end', 'acc'); }
  s += `<line x1="0" y1="${pad + H}" x2="${W}" y2="${pad + H}" class="ln" style="stroke-width:2"/>`;
  return svg(W, pad + H + 30, s, 'Diagram batang data');
}
function svgDots(rows, cols) {
  const gap = 20; let s = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<circle cx="${14 + c * gap}" cy="${14 + r * gap}" r="6.5" class="${r % 2 ? 'dot acc' : 'dot'}"/>`;
  return svg(cols * gap + 8, rows * gap + 8, s, `${rows} baris, tiap baris ${cols} titik`);
}
