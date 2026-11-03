'use strict';
/* ====== Pengubah HTML matematika menjadi TeX (KaTeX) ======
   Soal menulis matematika sebagai HTML: <sup>, <sub>, pecahan (.fr), akar (.rt), matriks (.mat), simbol Unicode.
   fmtMath() membaca HTML itu sebagai DOM, mengubah rangkaian matematikanya menjadi TeX, lalu merendernya dengan KaTeX.
   Kalimat biasa, satuan (cm, Rp), dan angka polos dibiarkan agar tetap enak dibaca. Jika KaTeX tidak termuat, HTML asli dipakai. */
const MF = (() => {
  const FUNCS = new Set(['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'log', 'ln', 'lim', 'det', 'max', 'min', 'mod', 'exp', 'tr', 'gcd']);
  const PAIRS = new Set(['xy', 'xz', 'yz', 'dx', 'dy', 'dz', 'dt', 'du', 'dv', 'ab', 'bc', 'ac', 'pq', 'uv', 'mn', 'kx', 'ax', 'bx', 'cx']);
  const SYM = { '−': '-', '×': '\\times ', '÷': '\\div ', '·': '\\cdot ', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '≈': '\\approx ', '±': '\\pm ', '∓': '\\mp ', '°': '^{\\circ}', 'π': '\\pi ', 'θ': '\\theta ', 'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'λ': '\\lambda ', 'μ': '\\mu ', 'σ': '\\sigma ', 'φ': '\\varphi ', 'ω': '\\omega ', 'Δ': '\\Delta ', 'Σ': '\\sum ', '∑': '\\sum ', 'Π': '\\prod ', '∫': '\\int ', '∞': '\\infty ', '→': '\\to ', '↔': '\\leftrightarrow ', '∪': '\\cup ', '∩': '\\cap ', '∈': '\\in ', '∠': '\\angle ', '⊂': '\\subset ', '∘': '\\circ ', '∇': '\\nabla ', '∂': '\\partial ', '≡': '\\equiv ', 'ℕ': '\\mathbb{N}', '…': '\\ldots ', '%': '\\%', '′': "'", '″': "''", '½': '\\frac{1}{2}', '⅓': '\\frac{1}{3}', '⅔': '\\frac{2}{3}', '¼': '\\frac{1}{4}', '¾': '\\frac{3}{4}', '⅕': '\\frac{1}{5}', '⅙': '\\frac{1}{6}', '⅛': '\\frac{1}{8}' };
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', 'ⁿ': 'n', 'ᵐ': 'm', 'ˣ': 'x', 'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c' };
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n', 'ₚ': 'p' };
  const esc = s => s.replace(/[\\^$.*+?()[\]{}|\/-]/g, '\\$&');
  const ALLOWED = new RegExp('^[A-Za-z0-9+\\-=<>()\\[\\]{}|/^_,.:!\'\\u0001\\u0002\\u221A' + Object.keys(SYM).filter(k => k !== '%').map(esc).join('') + Object.keys(SUP).map(esc).join('') + Object.keys(SUB).map(esc).join('') + '%]+$');
  const STRONG = /[+=<>≤≥≠≈±×÷·^∪∩∈→∠∂∫Σ∑ΠπθαβγλμσφωΔ∞√≡ℕ′″−]/;
  const cache = new Map();

  /* teks matematika polos -> TeX */
  function toTeX(s) {
    s = s.replace(/[⁰¹²³⁴-⁻ⁿᵐˣᵃᵇᶜ]+/g, m => '^{' + [...m].map(c => SUP[c] || '').join('') + '}');
    s = s.replace(/[₀-₉ₙₚ]+/g, m => '_{' + [...m].map(c => SUB[c] || '').join('') + '}');
    s = s.replace(/[−×÷·≤≥≠≈±∓°πθαβγλμσφωΔΣ∑Π∫∞→↔∪∩∈∠⊂∘∇∂≡ℕ…%′″½⅓⅔¼¾⅕⅙⅛]/g, c => SYM[c]);
    s = s.replace(/(?<![\\A-Za-z])(sin|cos|tan|sec|csc|cot|log|ln|lim|det|max|min|exp|gcd)(?![A-Za-z])/g, '\\$1 ').replace(/(?<![\\A-Za-z])mod(?![A-Za-z])/g, '\\bmod ').replace(/(?<![\\A-Za-z])tr(?![A-Za-z])/g, '\\operatorname{tr}');
    s = s.replace(/(\d),(\d)/g, '$1{,}$2').replace(/\{,\}(?=\d)/g, '{,}');
    /* √(...) atau √token */
    let out = '', i = 0;
    while (i < s.length) {
      if (s[i] === '√') {
        let j = i + 1;
        if (s[j] === '(') { let dep = 0, k = j; for (; k < s.length; k++) { if (s[k] === '(') dep++; else if (s[k] === ')') { dep--; if (!dep) break; } } out += '\\sqrt{' + s.slice(j + 1, k) + '}'; i = k + 1; continue; }
        const m = s.slice(j).match(/^[\dA-Za-z.]+/), tok = m ? m[0] : ''; out += '\\sqrt{' + tok + '}'; i = j + tok.length; continue;
      }
      out += s[i++];
    }
    return out;
  }
  function texOfChildren(node) {
    let out = ''; node.childNodes.forEach(ch => { out += ch.nodeType === 3 ? toTeX(ch.nodeValue) : texOfElement(ch); }); return out;
  }
  function texOfElement(el) {
    const tag = el.tagName, c = el.classList;
    if (tag === 'SPAN' && c.contains('fr')) { const k = el.children; return '\\frac{' + texOfChildren(k[0]) + '}{' + texOfChildren(k[1]) + '}'; }
    if (tag === 'SPAN' && c.contains('rt')) return '\\sqrt{' + texOfChildren(el.querySelector('.ro')) + '}';
    if (tag === 'SPAN' && c.contains('mat')) {
      const rows = [...el.querySelectorAll('tr')].map(tr => [...tr.children].map(td => texOfChildren(td)).join(' & ')).join(' \\\\ '), env = c.contains('det') ? 'vmatrix' : 'pmatrix';
      return '\\begin{' + env + '}' + rows + '\\end{' + env + '}';
    }
    if (tag === 'SUP') return '^{' + texOfChildren(el) + '}';
    if (tag === 'SUB') return '_{' + texOfChildren(el) + '}';
    return texOfChildren(el);
  }
  const isAtom = el => { const t = el.tagName; return t === 'SUP' || t === 'SUB' || (t === 'SPAN' && (el.classList.contains('fr') || el.classList.contains('rt') || el.classList.contains('mat'))); };
  const escH = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function render(tex, fallback) {
    if (cache.has(tex)) return cache.get(tex);
    let h; try { h = katex.renderToString(tex, { throwOnError: false, strict: 'ignore', trust: false }); } catch (e) { h = fallback; }
    cache.set(tex, h); return h;
  }
  /* klasifikasi satu "kata": text | num | math */
  function kindOf(core) {
    if (!core) return 'text';
    for (const m of core.matchAll(/[A-Za-z]+/g)) { const w = m[0]; if (w.length >= 2 && !FUNCS.has(w) && !PAIRS.has(w)) return 'text'; }
    if (!ALLOWED.test(core)) return 'text';
    if (/^[−-]?[\d.,]+°[CF]$/.test(core) || /^m[²³]$/.test(core)) return 'text';
    if (/^[−-]?[\d.,]+(%|°)?$/.test(core)) return 'num';
    return 'math';
  }
  const isStrong = core => /\u0001/.test(core) || /[A-Za-z]/.test(core) || STRONG.test(core) || core === '-';

  function processStream(src, atoms) {
    const parts = src.split(/(\s+)/), items = [];
    for (const p of parts) {
      if (p === '') continue;
      if (/^\s+$/.test(p)) { items.push({ ws: true, s: p }); continue; }
      const m = /^([\s\S]*?)([.,;:?!"'”’]*)$/.exec(p); let core = m[1], trail = m[2];
      if (core === '' ) { core = p; trail = ''; }
      items.push({ core, trail, kind: kindOf(core) });
    }
    const restore = s => escH(s).replace(/\u0001(\d+)\u0002/g, (_, i) => atoms[+i].html);
    const itemText = it => it.ws ? it.s : restore(it.core + it.trail);
    let out = '', i = 0;
    while (i < items.length) {
      const it = items[i];
      if (it.ws || it.kind === 'text') { out += itemText(it); i++; continue; }
      const run = []; let j = i;
      while (j < items.length) {
        const x = items[j];
        if (x.ws) { j++; continue; }
        if (x.kind === 'text') break;
        run.push(j);
        if (/[.;:?!"'”’]/.test(x.trail)) break;
        if (x.trail === ',') { let k = j + 1; while (k < items.length && items[k].ws) k++; if (!(k < items.length && items[k].kind !== 'text')) break; }
        j++;
      }
      const last = run[run.length - 1], words = run.map(k => items[k]);
      let strong = words.some(w => w.kind === 'math' && isStrong(w.core));
      if (words.length === 1 && /^[aAI]$/.test(words[0].core)) strong = false;
      if (words.length === 2 && words[0].kind === 'num' && /^[mgshdlL]$/.test(words[1].core)) strong = false;
      if (!strong) { for (let k = i; k <= last; k++) out += itemText(items[k]); i = last + 1; continue; }
      let tex = '';
      for (let k = i; k <= last; k++) {
        const w = items[k];
        if (w.ws) { tex += ' '; continue; }
        const raw = k === last ? w.core : w.core + w.trail;
        let piece = '';
        raw.split(/\u0001(\d+)\u0002/).forEach((seg, idx) => { if (idx % 2) { const t = atoms[+seg].tex; piece += (piece === '' && /^[\^_]/.test(t) ? '{}' : '') + t; } else piece += toTeX(seg); });
        tex += piece;
      }
      if (/\\frac|\\begin\{[pv]matrix\}/.test(tex)) tex = '\\displaystyle ' + tex;
      const fb = items.slice(i, last + 1).map(itemText).join('');
      out += render(tex, fb) + (items[last].trail && !/,/.test(items[last].trail.slice(-1)) ? restore(items[last].trail) : (items[last].trail ? restore(items[last].trail) : ''));
      i = last + 1;
    }
    return out;
  }
  function fmtChildren(parent) {
    let html = '', stream = '', atoms = [];
    const flush = () => { if (stream) { html += processStream(stream, atoms); stream = ''; atoms = []; } };
    parent.childNodes.forEach(ch => {
      if (ch.nodeType === 3) stream += ch.nodeValue;
      else if (ch.nodeType === 1) {
        if (isAtom(ch)) { atoms.push({ tex: texOfElement(ch), html: ch.outerHTML }); stream += '\u0001' + (atoms.length - 1) + '\u0002'; }
        else { flush(); html += fmtElement(ch); }
      }
    });
    flush(); return html;
  }
  function fmtElement(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg' || tag === 'br' || tag === 'img' || tag === 'hr') return el.outerHTML;
    const shell = el.cloneNode(false).outerHTML, close = '</' + tag + '>';
    return shell.slice(0, shell.length - close.length) + fmtChildren(el) + close;
  }
  const tpl = document.createElement('template');
  function fmtMath(html) {
    if (typeof katex === 'undefined' || !html) return html;
    try { tpl.innerHTML = html; return fmtChildren(tpl.content); } catch (e) { return html; }
  }
  return { fmtMath, toTeX };
})();
const fmtMath = MF.fmtMath;
