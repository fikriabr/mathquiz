/* Terapkan terjemahan: node apply_i18n.js src/gen_x.js tools/en/gen_x.tsv */
const fs = require('fs'), acorn = require('./node_modules/acorn'), cp = require('child_process');
const [file, tsv] = process.argv.slice(2);
cp.execSync(`node tools/extract_i18n.js ${file}`, { stdio: 'pipe' });
const cand = JSON.parse(fs.readFileSync(file + '.cand.json', 'utf8')); let src = fs.readFileSync(file, 'utf8');
if (!fs.existsSync('tools/orig/' + file.split('/').pop())) fs.writeFileSync('tools/orig/' + file.split('/').pop(), src);
const tr = {}; fs.readFileSync(tsv, 'utf8').split('\n').forEach(l => { if (!l.trim()) return; const k = l.indexOf('\t'); tr[+l.slice(0, k)] = l.slice(k + 1); });
const exprs = text => { const a = acorn.parse('(' + text + ')', { ecmaVersion: 2022, ranges: true }); const t = a.body[0].expression, out = []; (function f(n) { if (n && n.type === 'TemplateLiteral') { n.expressions.forEach(e => out.push(text.slice(e.start - 1, e.end - 1).replace(/\s+/g, ''))); } })(t); return out.sort(); };
let errors = 0; const edits = [];
for (const c of cand) {
  let en = tr[c.i]; if (en === undefined) continue;
  let skipCheck = false; if (en.startsWith('!')) { skipCheck = true; en = en.slice(1); }
  const orig = c.text, q = orig[0];
  let enLit;
  if (q === '`') {
    if (!skipCheck) { const a = exprs(orig), b = exprs('`' + en + '`'); if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`#${c.i} ${c.fn}: placeholder tidak sama\n  asli: ${a.join(' | ')}\n  en:   ${b.join(' | ')}`); errors++; continue; } }
    try { acorn.parse('(`' + en + '`)', { ecmaVersion: 2022 }); } catch (e) { console.error(`#${c.i}: templat Inggris tidak valid: ${e.message}`); errors++; continue; }
    enLit = '`' + en + '`';
  } else { enLit = q + en.replace(/\\/g, '\\\\').replace(new RegExp(q, 'g'), '\\' + q) + q; }
  const rep = c.callee === 'TIP' ? orig + ', ' + enLit : 'tr(' + orig + ', ' + enLit + ')';
  edits.push([c.start, c.end, rep]);
}
if (errors) { console.error(errors, 'galat: tidak ada yang ditulis'); process.exit(1); }
edits.sort((a, b) => b[0] - a[0]).forEach(([s, e, r]) => { src = src.slice(0, s) + r + src.slice(e); });
try { new (require("vm").Script)(src); } catch (e) { fs.writeFileSync("/tmp/claude-0/-home-user/bb4942cd-7298-5dfa-8cbc-d1765ae21821/scratchpad/out.js", src); console.error("hasil tidak valid:", e.message); process.exit(1); }
fs.writeFileSync(file, src); console.log('diterapkan', edits.length, 'dari', cand.length, 'kandidat ke', file);
