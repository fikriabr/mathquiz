/* Pindai: generator mana yang keluarannya (mode EN) bersih dari kata Indonesia */
const fs = require('fs'), vm = require('vm');
const order = ['core', 'gen_sd', 'gen_smp', 'gen_sma', 'gen_trig', 'gen_sd2', 'gen_smp2', 'gen_sma2', 'gen_kuliah', 'gen_kuliah2', 'gen_umum', 'meta'];
const code = order.filter(f => fs.existsSync(`src/${f}.js`)).map(f => fs.readFileSync(`src/${f}.js`, 'utf8')).join('\n') + '\n;this.__ = { TOPICS, seedRng, setLang };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { TOPICS, seedRng, setLang } = ctx.__; setLang('en');
const ID = /\b(adalah|berapa|hitung|hitunglah|sebuah|dengan|yang|jika|dan|atau|pada|trik|misal|jadi|dari|dibagi|kali|tambah|kurang|sisa|selisih|jumlah|bilangan|hari|jam|menit|siswa|orang|harga|luas|keliling|panjang|lebar|tinggi|sudut|titik|garis|nilai|persamaan|penyelesaian|grafik|gambar|berikut|ditulis|bentuk|sederhana|setiap|untuk|akan|dapat|maka|karena|sama|lebih|tidak|ada|ke|di|itu|ini)\b/i;
const strip = s => String(s).replace(/<[^>]+>/g, ' ');
const ready = [], notReady = [];
for (const lv in TOPICS) for (const tp of TOPICS[lv]) for (const g of tp.gens) {
  let hits = 0, ex = '', n = 0;
  for (let d = Math.max(g.min, 1); d <= 3; d++) for (let i = 0; i < 40; i++) {
    seedRng(9000 + i * 31 + d); let r; try { r = g.fn(d); } catch (e) { continue; } if (!r || !r.o) continue; n++;
    const txt = strip(r.q) + ' ' + r.o.opts.map(strip).join(' ') + ' ' + strip(r.exp || '');
    const m = txt.match(ID); if (m) { hits++; if (!ex) ex = m[0] + ' ... ' + txt.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' '); }
  }
  (hits === 0 && n > 0 ? ready : notReady).push([g.fn.name, hits, n, ex]);
}
console.log('EN bersih:', ready.length, '| belum bersih:', notReady.length);
console.log('Belum bersih (contoh sisa kata):'); notReady.filter(x => !/^(sd|smp|sma[A-Z])/.test(x[0]) || /Trig|Unit|Quad|Elev|Bear|Law|Wave|Ladd|Ferr|Radi/.test(x[0])).forEach(x => console.log(' ', x[0], x[1] + '/' + x[2], '|', x[3]));
fs.writeFileSync('en_ready.json', JSON.stringify(ready.map(x => x[0])));

{ const m = fs.readFileSync('src/meta.js', 'utf8'); const list = ready.map(x => "'" + x[0] + "'").join(', ');
  fs.writeFileSync('src/meta.js', m.replace(/const EN_READY = new Set\(\[[\s\S]*?\]\);/, 'const EN_READY = new Set([' + list + ']);')); console.log('EN_READY ditulis:', ready.length); }
