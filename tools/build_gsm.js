/* Bangun src/gsm.js dari data/gsm8k/*.jsonl (GSM8K, OpenAI, lisensi MIT).
   Tingkat/kesulitan dari jumlah langkah penyelesaian; materi dari kata kunci (heuristik, bukan label resmi). */
const fs = require('fs');
const rows = ['train', 'test'].flatMap(f => fs.readFileSync(`data/gsm8k/${f}.jsonl`, 'utf8').trim().split('\n').map(l => JSON.parse(l)));
const clean = s => s.replace(/<<[^>]*>>/g, '').replace(/[ \t]+\n/g, '\n').trim();
const MAT = [
  ['persen', /%|percent/i], ['rasio', /\bratio\b|proportion|\bscale\b|times as (many|much|long|old|tall)|twice as/i],
  ['gerak', /\b(mph|speed|miles per hour|km\/h|per hour.*(drive|travel|walk|run)|drive|driving|drove|travel|walks?|runs?|jog)\b/i],
  ['pecahan', /\bfraction|\bhalf\b|\bthird\b|\bquarter\b|\bfourth\b|\bfifth\b|\d\/\d/i], ['statistika', /\baverage\b|\bmean\b|\bmedian\b/i],
  ['geometri', /\barea\b|perimeter|\brectangle|\bsquare\b|triangle|circle|\bvolume\b|\blength\b|\bwidth\b|\bheight\b|\bfeet\b|\binches\b/i],
  ['keuangan', /\$|dollar|\bcents?\b|\bprice|\bcost|\bpaid\b|\bpay\b|\bearn|profit|\bsells?\b|\bsold\b|\bbuys?\b|\bbought\b|\bspends?\b|\bsave|\bsalary|\bbudget/i],
  ['waktu', /\bhours?\b|\bminutes?\b|\bdays?\b|\bweeks?\b|\bmonths?\b|\byears?\b|o'clock/i]
];
const cats = {}, items = [];
rows.forEach((r, i) => {
  const m = r.answer.match(/####\s*(.+)$/); const ans = +m[1].trim().replace(/,/g, ''); if (!Number.isFinite(ans)) throw new Error('jawaban tidak numerik: ' + i);
  const sol = clean(r.answer.replace(/####.*$/, '')); const steps = sol.split('\n').filter(Boolean).length;
  const level = steps <= 3 ? 'sd' : 'smp', d = steps <= 2 ? 1 : steps <= 4 ? 2 : 3;
  const materi = (MAT.find(([, re]) => re.test(r.question)) || ['aritmatika'])[0];
  const name = `gsm_${level}_${materi}`;
  items.push([r.question.trim(), sol, ans]);
  ((cats[name] = cats[name] || { name, level, materi, d: { 1: [], 2: [], 3: [] } }).d[d]).push(i);
});
const b36 = a => { let p = 0; return a.map(x => { const s = (x - p).toString(36); p = x; return s; }).join(','); };
const LV = ['sd', 'smp'], list = Object.values(cats).sort((a, b) => LV.indexOf(a.level) - LV.indexOf(b.level) || a.materi.localeCompare(b.materi));
const bank = {}; list.forEach(c => { bank[c.name] = {}; for (const d of [1, 2, 3]) if (c.d[d].length) bank[c.name][d] = b36(c.d[d]); });
const out = `'use strict';
/* GSM8K (c) 2021 OpenAI, MIT License. https://github.com/openai/grade-school-math  -- dibangun oleh tools/build_gsm.js */
const GSM = ${JSON.stringify(items)};
const GSM_CATS = ${JSON.stringify(list.map(c => ({ name: c.name, level: c.level, materi: c.materi })))};
const GSM_BANK = ${JSON.stringify(bank)};
`;
fs.writeFileSync('src/gsm.js', out);
const cnt = {}; list.forEach(c => [1, 2, 3].forEach(d => cnt[d] = (cnt[d] || 0) + c.d[d].length));
console.log('GSM8K:', items.length, 'soal;', list.length, 'kategori; per kesulitan', cnt, '; ukuran', (out.length / 1024).toFixed(0), 'KB');
list.forEach(c => console.log(' ', c.name.padEnd(22), [1, 2, 3].map(d => c.d[d].length).join(' / ')));
