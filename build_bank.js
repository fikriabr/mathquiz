/* Bangun bank soal: jalankan semua generator, buang duplikat, simpan seed unik */
const fs = require('fs'), vm = require('vm');
const CAP = +process.env.CAP || 1200;
const order = ['core', 'gen_sd', 'gen_smp', 'gen_sma', 'gen_trig', 'gen_sd2', 'gen_smp2', 'gen_sma2', 'gen_kuliah', 'gen_kuliah2', 'gen_umum', 'gen_ext1', 'gen_ext2', 'gen_ext3', 'gen_extra', 'meta'];
const files = order.filter(f => fs.existsSync(`src/${f}.js`));
const code = files.map(f => fs.readFileSync(`src/${f}.js`, 'utf8')).join('\n') + '\n;this.__ = { TOPICS, LEVELS, seedRng, setLang };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { TOPICS, LEVELS, seedRng, setLang } = ctx.__; setLang('id');
const seen = new Set(), data = {}, stats = [];
let total = 0;
const strip = s => String(s).replace(/<[^>]+>/g, '');
/* generator perluasan (g.ext) diproses paling akhir agar seed soal yang sudah ada tidak berubah */
for (const pass of [false, true]) for (const lv of LEVELS) for (const tp of (TOPICS[lv.id] || [])) for (const g of tp.gens) {
  if (!!g.ext !== pass) continue;
  const name = g.fn.name; data[name] = {};
  for (let d = g.min; d <= 3; d++) {
    const seeds = []; let tries = 0, miss = 0;
    for (let s = 1; seeds.length < CAP && tries < CAP * 8; s++, tries++) {
      seedRng(s * 2654435761 % 4294967296 || s); let r;
      try { r = g.fn(d); } catch (e) { continue; }
      if (!r || !r.o) continue;
      const key = strip(r.q) + '||' + strip(r.o.opts[r.o.ans]) + '||' + (r.viz ? r.viz.length : 0);
      if (seen.has(key)) { miss++; continue; }
      seen.add(key); seeds.push(s * 2654435761 % 4294967296 || s);
    }
    seeds.sort((a, b) => a - b);
    let prev = 0; data[name][d] = seeds.map(v => { const x = (v - prev).toString(36); prev = v; return x; }).join(',');
    total += seeds.length; stats.push([lv.id, name, d, seeds.length]);
  }
}
fs.writeFileSync('src/bank.js', 'const BANK_DATA = ' + JSON.stringify(data) + ';\n');
console.log('TOTAL UNIK', total);
const byLv = {}; stats.forEach(([l, n, d, c]) => byLv[l] = (byLv[l] || 0) + c); console.log(byLv);
const small = stats.filter(s => s[3] < CAP * 0.5).map(s => `${s[1]}/d${s[2]}:${s[3]}`); console.log('kapasitas kecil:', small.join(' '));
fs.writeFileSync('bank_stats.json', JSON.stringify(stats));
