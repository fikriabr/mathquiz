/* Ekstrak literal bahasa Indonesia dari file generator, lengkap dengan konteks, untuk diterjemahkan */
const fs = require('fs'), acorn = require('./node_modules/acorn');
const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 2022, ranges: true, sourceType: 'script' });
const KEEP = new Set(['cm','km','kg','mm','sin','cos','tan','sec','csc','cot','log','ln','lim','det','max','min','mod','exp','tr','sup','sub','span','class','style','rt','ro','fr','mat','svg','NaN','Rp','MINUS','minus','ml','kpk','fpb']);
const ID = { test(s) { const plain = String(s).replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' '); for (const m of plain.matchAll(/[A-Za-z]{3,}/g)) { if (!KEEP.has(m[0]) && !KEEP.has(m[0].toLowerCase())) return true; } return false; } };
const out = [];
function walk(node, parent, depthInTpl) {
  if (!node || typeof node.type !== 'string') return;
  let handled = false;
  if (node.type === 'Literal' && typeof node.value === 'string' && parent && parent.type !== 'Property' || (node.type === 'Literal' && typeof node.value === 'string' && parent && parent.type === 'Property' && parent.value === node)) {
    if (ID.test(node.value) && node.value.length > 0) { out.push({ node, parent, kind: 'str', text: src.slice(node.start, node.end) }); handled = true; }
  } else if (node.type === 'TemplateLiteral') {
    const stat = node.quasis.map(q => q.value.cooked).join(' ');
    if (ID.test(stat)) { out.push({ node, parent, kind: 'tpl', text: src.slice(node.start, node.end) }); handled = true; }
  }
  if (handled) return; /* literal bersarang di dalam ${} tidak diekstrak terpisah */
  for (const k of Object.keys(node)) { const v = node[k]; if (k === 'type' || k === 'start' || k === 'end' || k === 'range' || k === 'loc') continue; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === 'string' && walk(c, node)); else if (v && typeof v.type === 'string') walk(v, node); }
}
walk(ast, null);
/* konteks: fungsi pembungkus + 30 karakter sebelum */
let fnName = '';
const fns = []; (function f(n) { if (!n || typeof n !== 'object') return; if (n.type === 'FunctionDeclaration' && n.id) fns.push([n.start, n.end, n.id.name]); for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(f); else if (v && typeof v.type === 'string') f(v); } })(ast);
const res = out.map((o, i) => { const fn = fns.filter(f => f[0] <= o.node.start && o.node.end <= f[1]).map(f => f[2]).pop() || ''; const callee = o.parent && o.parent.type === 'CallExpression' && o.parent.callee.name ? o.parent.callee.name : ''; return { i, fn, callee, start: o.node.start, end: o.node.end, text: o.text }; });
fs.writeFileSync(file + '.cand.json', JSON.stringify(res));
console.log(res.length, 'kandidat di', file);
if (process.argv[3] === 'print') { let last = ''; res.forEach(r => { if (r.fn !== last) { console.log('\n## ' + r.fn); last = r.fn; } console.log(r.i + (r.callee ? ' [' + r.callee + ']' : '') + ' ' + r.text.replace(/\n/g, ' ')); }); }
