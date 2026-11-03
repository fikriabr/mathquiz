'use strict';
/* ====== Teks antarmuka (id/en) ====== */
const UI = {
  id: {
    app: 'Jagoan Matematika', nav_problems: 'Daftar Soal', nav_stats: 'Statistik',
    hero_title: 'Seberapa jago kamu <mark>berhitung?</mark>',
    hero_lead: '{n} soal bernomor tetap, dari berhitung dasar sampai kalkulus. Kerjakan, tandai kemajuanmu, dan baca pembahasan langkah demi langkah.',
    btn_continue: 'Lanjutkan', btn_random: 'Soal acak', prog_title: 'Kemajuanmu', solved_of: 'dari {n} soal selesai',
    daily: 'Soal harian', daily_desc: 'Satu soal pilihan untuk hari ini. Nomornya sama untuk semua orang.', open: 'Buka',
    f_level: 'Jenjang', f_diff: 'Kesulitan', f_status: 'Status', f_topic: 'Materi', all: 'Semua', reset: 'Reset filter', clear: 'Kosongkan',
    st_solved: 'Selesai', st_attempted: 'Dicoba', st_todo: 'Belum', search: 'Cari nomor, judul, atau materi',
    results: '{n} soal', page_of: 'Halaman {p} dari {t}', prev: 'Sebelumnya', next: 'Berikutnya', no_results: 'Tidak ada soal yang cocok dengan filter ini.',
    back: 'Daftar soal', submit: 'Kirim jawaban', show_sol: 'Lihat pembahasan', retry: 'Coba lagi', next_p: 'Soal berikutnya', prev_p: 'Sebelumnya',
    correct_t: 'Benar!', wrong_t: 'Belum tepat', right_ans: 'Jawaban yang benar:', explain: 'Pembahasan', pick_first: 'Pilih satu jawaban dulu.',
    untranslated: 'Belum diterjemahkan, tampil dalam Bahasa Indonesia', attempts: 'Percobaan', not_tried: 'Belum pernah dicoba',
    revealed_note: 'Pembahasan dibuka, soal ini tidak dihitung selesai. Coba soal serupa untuk menguji pemahamanmu.',
    s_title: 'Statistik', s_solved: 'Terselesaikan', s_streak: 'Rentetan hari', s_days: 'hari', s_act: 'Aktivitas 26 minggu terakhir', s_by_diff: 'Menurut kesulitan',
    s_by_level: 'Menurut jenjang', s_by_topic: 'Menurut materi', s_subs: 'jawaban dikirim',
    foot: 'Soal dibuat otomatis dari template, tetapi setiap nomor selalu menghasilkan soal yang sama.', foot_en: 'Terjemahan Inggris: {p}% soal',
    theme: 'Ganti tema terang/gelap', lang: 'Bahasa', n_topics: '{n} materi'
  },
  en: {
    app: 'Math Champ', nav_problems: 'Problems', nav_stats: 'Stats',
    hero_title: 'How sharp is your <mark>math?</mark>',
    hero_lead: '{n} numbered problems, from basic arithmetic to calculus. Solve them, track your progress, and read step-by-step explanations.',
    btn_continue: 'Continue', btn_random: 'Random problem', prog_title: 'Your progress', solved_of: 'of {n} problems solved',
    daily: 'Daily problem', daily_desc: "Today's pick. Everyone gets the same number.", open: 'Open',
    f_level: 'Level', f_diff: 'Difficulty', f_status: 'Status', f_topic: 'Topic', all: 'All', reset: 'Reset filters', clear: 'Clear',
    st_solved: 'Solved', st_attempted: 'Attempted', st_todo: 'Todo', search: 'Search number, title, or topic',
    results: '{n} problems', page_of: 'Page {p} of {t}', prev: 'Previous', next: 'Next', no_results: 'No problems match these filters.',
    back: 'Problems', submit: 'Submit', show_sol: 'Show explanation', retry: 'Try again', next_p: 'Next problem', prev_p: 'Previous',
    correct_t: 'Correct!', wrong_t: 'Not quite', right_ans: 'Correct answer:', explain: 'Explanation', pick_first: 'Choose an answer first.',
    untranslated: 'Not translated yet, shown in Indonesian', attempts: 'Attempts', not_tried: 'Not attempted yet',
    revealed_note: "Explanation opened, so this problem isn't counted as solved. Try a similar one to test yourself.",
    s_title: 'Your stats', s_solved: 'Solved', s_streak: 'Day streak', s_days: 'days', s_act: 'Activity, last 26 weeks', s_by_diff: 'By difficulty',
    s_by_level: 'By level', s_by_topic: 'By topic', s_subs: 'submissions',
    foot: 'Problems are generated from templates, but each number always gives the same problem.', foot_en: 'English coverage: {p}% of problems',
    theme: 'Toggle light/dark theme', lang: 'Language', n_topics: '{n} topics'
  }
};
const t = (k, p) => { let s = (UI[LANG] && UI[LANG][k]) ?? UI.id[k] ?? k; if (p) for (const x in p) s = s.split('{' + x + '}').join(p[x]); return s; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nf = n => N(n, 0);

/* ====== Data bank ====== */
const CAT = [];
LEVELS.forEach((lv, li) => (TOPICS[lv.id] || []).forEach(tp => tp.gens.forEach(g => {
  const n = g.fn.name, m = GEN_META[n] || ['aritmatika', n, n];
  CAT.push({ name: n, fn: g.fn, li, level: lv.id, materi: m[0], ti: m[1], te: m[2], min: g.min });
})));
const PR = (() => {
  const gi = [], d = [], sd = [];
  for (let dd = 1; dd <= 3; dd++) CAT.forEach((c, i) => {
    const str = (typeof BANK_DATA !== 'undefined' ? BANK_DATA[c.name] || {} : {})[dd]; if (!str) return;
    let prev = 0; for (const x of str.split(',')) { prev += parseInt(x, 36); gi.push(i); d.push(dd); sd.push(prev); }
  });
  return { gi: Uint16Array.from(gi), d: Uint8Array.from(d), seed: Float64Array.from(sd), n: gi.length };
})();
const MKEYS = Object.keys(MATERI);
const COUNT = { d: [0, 0, 0, 0], l: {}, m: {}, en: 0 };
for (let i = 0; i < PR.n; i++) { const c = CAT[PR.gi[i]]; COUNT.d[PR.d[i]]++; COUNT.l[c.level] = (COUNT.l[c.level] || 0) + 1; COUNT.m[c.materi] = (COUNT.m[c.materi] || 0) + 1; if (EN_READY.has(c.name)) COUNT.en++; }
const catOf = id => CAT[PR.gi[id - 1]];
const titleOf = c => LANG === 'en' ? c.te : c.ti;
const materiName = k => (MATERI[k] || [k, k])[LANG === 'en' ? 1 : 0];
const levelName = c => { const lv = LEVELS[c.li]; return LANG === 'en' ? lv.en : lv.id_; };
const diffName = d => DIFFS[d - 1][LANG === 'en' ? 'en' : 'id'];
function genProblem(id) {
  const c = catOf(id); seedRng(PR.seed[id - 1]); let r = null;
  try { r = c.fn(PR.d[id - 1]); } catch (e) { r = null; }
  if (r && r.o) { r.q = fixMinus(r.q); r.exp = fixMinus(r.exp || ''); r.o.opts = r.o.opts.map(fixMinus); }
  return r;
}
const tmp = document.createElement('div');
const plain = html => { tmp.innerHTML = html; return tmp.textContent.replace(/\s+/g, ' ').trim(); };

/* ====== Penyimpanan (hanya di browser ini) ====== */
const KEY = 'jagoan-matematika-v2';
const DB = { status: {}, attempts: {}, act: {}, lang: 'id', theme: null };
try { const s = localStorage.getItem(KEY); if (s) Object.assign(DB, JSON.parse(s)); } catch (e) { /* abaikan */ }
const saveDB = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* abaikan */ } };
setLang(DB.lang); document.documentElement.lang = LANG;
if (DB.theme) document.documentElement.dataset.theme = DB.theme;

const F = { q: '', levels: new Set(), diffs: new Set(), status: 'all', materi: new Set(), page: 1, openM: false };
const PAGE = 40;
const $app = document.getElementById('app');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

function computeList() {
  const q = F.q.trim().toLowerCase(), isNum = /^\d+$/.test(q);
  const ok = CAT.map(c => {
    if (F.levels.size && !F.levels.has(c.level)) return 0;
    if (F.materi.size && !F.materi.has(c.materi)) return 0;
    if (q && !isNum && !(titleOf(c) + ' ' + materiName(c.materi) + ' ' + levelName(c)).toLowerCase().includes(q)) return 0;
    return 1;
  });
  const out = [], st = DB.status;
  for (let i = 0; i < PR.n; i++) {
    if (!ok[PR.gi[i]]) continue; if (F.diffs.size && !F.diffs.has(PR.d[i])) continue;
    const id = i + 1, s = st[id] | 0;
    if (F.status === 'solved' && s !== 2) continue; if (F.status === 'attempted' && s !== 1) continue; if (F.status === 'todo' && s !== 0) continue;
    if (isNum && !String(id).includes(q)) continue;
    out.push(id);
  }
  return out;
}
const ICON = {
  logo: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="15" r="10" fill="var(--l-sd)" stroke="var(--line)" stroke-width="2.5"/><rect x="18" y="14" width="19" height="19" rx="3" fill="var(--l-kuliah)" stroke="var(--line)" stroke-width="2.5"/><path d="M5 36 18 22 29 36Z" fill="var(--l-umum)" stroke="var(--line)" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  theme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 13.2A8.5 8.5 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2Z"/></svg>'
};
const stIcon = s => `<svg class="st ${s === 2 ? 'ok' : s === 1 ? 'try' : ''}" viewBox="0 0 24 24" aria-label="${s === 2 ? t('st_solved') : s === 1 ? t('st_attempted') : t('st_todo')}"><circle class="c" cx="12" cy="12" r="10"/>${s === 2 ? '<path class="k" d="M7 12.5l3.3 3.3L17 9" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' : s === 1 ? '<path class="k" d="M8 12h8" fill="none" stroke-width="2.4" stroke-linecap="round"/>' : ''}</svg>`;

function header(active) {
  return `<header class="top wrap"><a class="brand" href="#problems">${ICON.logo}<span>${t('app')}</span></a>
  <nav class="nav" aria-label="Menu"><a href="#problems" ${active === 'list' ? 'aria-current="page"' : ''}>${t('nav_problems')}</a><a href="#stats" ${active === 'stats' ? 'aria-current="page"' : ''}>${t('nav_stats')}</a></nav>
  <div class="seg" role="group" aria-label="${t('lang')}"><button data-act="lang" data-v="id" aria-pressed="${LANG === 'id'}">ID</button><button data-act="lang" data-v="en" aria-pressed="${LANG === 'en'}">EN</button></div>
  <button class="icon-btn" data-act="theme" aria-label="${t('theme')}">${ICON.theme}</button></header>`;
}
function solvedCounts() {
  const c = { all: 0, d: [0, 0, 0, 0], l: {}, m: {} };
  for (const k in DB.status) { if (DB.status[k] !== 2) continue; const id = +k; if (id > PR.n) continue; const g = catOf(id); c.all++; c.d[PR.d[id - 1]]++; c.l[g.level] = (c.l[g.level] || 0) + 1; c.m[g.materi] = (c.m[g.materi] || 0) + 1; }
  return c;
}
function dailyId() { const s = today(); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return (h % PR.n) + 1; }

/* ====== Halaman daftar ====== */
function renderList() {
  const sc = solvedCounts(), pct = PR.n ? sc.all / PR.n : 0, C = 2 * Math.PI * 40;
  const dcol = ['', 'var(--d1)', 'var(--d2)', 'var(--d3)'];
  const did = dailyId(), dc = catOf(did);
  $app.innerHTML = header('list') + `<main class="wrap">
  <section class="hero"><div><p class="eyebrow">${t('nav_problems')}</p><h1>${t('hero_title')}</h1><p class="lead">${t('hero_lead', { n: nf(PR.n) })}</p>
    <div class="hero-actions"><button class="btn pri" data-act="continue">${t('btn_continue')}</button><button class="btn" data-act="random">${t('btn_random')}</button></div></div>
    <div class="card prog"><div class="ring-row"><svg class="ring" viewBox="0 0 100 100" role="img" aria-label="${nf(sc.all)} / ${nf(PR.n)}"><circle class="tr" cx="50" cy="50" r="40" fill="none" stroke-width="10"/><circle class="pg" cx="50" cy="50" r="40" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C * pct} ${C}" transform="rotate(-90 50 50)"/><text x="50" y="58" text-anchor="middle">${nf(sc.all)}</text></svg>
    <div><b>${t('prog_title')}</b><div class="mut">${t('solved_of', { n: nf(PR.n) })}</div></div></div>
    ${[1, 2, 3].map(d => `<div class="bar" style="color:${dcol[d]}"><span class="dif dif${d}">${diffName(d)}</span><i><b style="width:${COUNT.d[d] ? 100 * sc.d[d] / COUNT.d[d] : 0}%"></b></i><span style="color:var(--ink)">${nf(sc.d[d])}/${nf(COUNT.d[d])}</span></div>`).join('')}</div></section>
  <section class="card daily"><div><b>${t('daily')} #${did}</b><div class="mut">${esc(titleOf(dc))} · ${diffName(PR.d[did - 1])}</div></div><a class="btn sm" href="#problem-${did}" style="margin-left:auto">${t('open')}</a></section>
  <section class="card filters" aria-label="Filter"><div class="frow"><input id="q" class="search" type="search" value="${esc(F.q)}" placeholder="${t('search')}" aria-label="${t('search')}"><button class="btn sm" data-act="reset">${t('reset')}</button></div>
    <div class="frow"><span class="lbl">${t('f_level')}</span>${LEVELS.filter(lv => COUNT.l[lv.id]).map(lv => `<button class="chip" data-act="fl" data-v="${lv.id}" aria-pressed="${F.levels.has(lv.id)}">${LANG === 'en' ? lv.en : lv.id_}</button>`).join('')}</div>
    <div class="frow"><span class="lbl">${t('f_diff')}</span>${[1, 2, 3].map(d => `<button class="chip dif${d}" data-act="fd" data-v="${d}" aria-pressed="${F.diffs.has(d)}">${diffName(d)}</button>`).join('')}</div>
    <div class="frow"><span class="lbl">${t('f_status')}</span>${[['all', t('all')], ['todo', t('st_todo')], ['attempted', t('st_attempted')], ['solved', t('st_solved')]].map(([v, l]) => `<button class="chip" data-act="fs" data-v="${v}" aria-pressed="${F.status === v}">${l}</button>`).join('')}</div>
    <details class="mat-d" ${F.openM || F.materi.size ? 'open' : ''}><summary class="chip" style="display:inline-flex">${t('f_topic')} (${F.materi.size || t('all')}) · ${t('n_topics', { n: MKEYS.length })}</summary>
      <div class="chips">${MKEYS.filter(k => COUNT.m[k]).map(k => `<button class="chip" data-act="fm" data-v="${k}" aria-pressed="${F.materi.has(k)}">${materiName(k)} <span class="mut">${nf(COUNT.m[k])}</span></button>`).join('')}${F.materi.size ? `<button class="chip" data-act="fmc">${t('clear')}</button>` : ''}</div></details></section>
  <div class="rcount"><span id="rc"></span></div><div id="results"></div><div class="pager" id="pager"></div>
  <p class="foot mut">${t('foot')} ${LANG === 'en' ? '' : ''}${t('foot_en', { p: PR.n ? Math.round(100 * COUNT.en / PR.n) : 0 })}</p></main>`;
  renderResults();
}
function renderResults() {
  const list = computeList(), pages = Math.max(1, Math.ceil(list.length / PAGE)); if (F.page > pages) F.page = pages;
  const slice = list.slice((F.page - 1) * PAGE, F.page * PAGE);
  document.getElementById('rc').textContent = t('results', { n: nf(list.length) });
  document.getElementById('results').innerHTML = slice.length ? '<div class="card list">' + slice.map(rowHTML).join('') + '</div>' : `<div class="card empty">${t('no_results')}</div>`;
  document.getElementById('pager').innerHTML = pages > 1 ? `<button class="btn sm" data-act="pg" data-v="-1" ${F.page <= 1 ? 'disabled' : ''}>${t('prev')}</button><span class="mut">${t('page_of', { p: F.page, t: pages })}</span><button class="btn sm" data-act="pg" data-v="1" ${F.page >= pages ? 'disabled' : ''}>${t('next')}</button>` : '';
}
function rowHTML(id) {
  const c = catOf(id), d = PR.d[id - 1], s = DB.status[id] | 0; let ex = '';
  const r = genProblem(id); if (r) { const p = plain(r.q); ex = p.length > 90 ? p.slice(0, 88) + '…' : p; }
  return `<a class="row" href="#problem-${id}">${stIcon(s)}<span class="pid">${id}</span><span style="min-width:0"><span class="ttl" style="display:block">${esc(titleOf(c))}</span><span class="mut" style="display:block;font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(ex)}</span></span><span class="mt">${materiName(c.materi)}</span><span class="lv"><span class="tag lv-${c.level}">${levelName(c)}</span></span><span class="df dif dif${d}">${diffName(d)}</span></a>`;
}

/* ====== Halaman soal ====== */
let CUR = null;
function openProblem(id) {
  CUR = { id, r: genProblem(id), sel: -1, wrong: new Set(), solved: false, revealed: false, last: null, msg: '' };
  DB.lastId = id; saveDB(); renderProblem(); window.scrollTo(0, 0);
}
function neighbor(id, dir) {
  const list = computeList(); if (!list.length) return Math.min(PR.n, Math.max(1, id + dir));
  let lo = 0, hi = list.length; while (lo < hi) { const m = (lo + hi) >> 1; if (list[m] < id) lo = m + 1; else hi = m; }
  if (dir > 0) { const i = list[lo] === id ? lo + 1 : lo; return list[Math.min(i, list.length - 1)]; }
  return list[Math.max(0, lo - 1)];
}
function renderProblem() {
  const { id, r } = CUR, c = catOf(id), d = PR.d[id - 1], done = CUR.solved || CUR.revealed;
  if (!r) { $app.innerHTML = header('list') + `<main class="wrap pv"><p>Error</p></main>`; return; }
  const o = r.o, miss = LANG === 'en' && !EN_READY.has(c.name);
  const opts = o.opts.map((txt, i) => {
    let cls = '', dis = '';
    if (done) { dis = 'disabled'; if (i === o.ans) cls = 'ok'; else if (CUR.wrong.has(i)) cls = 'bad'; }
    else if (CUR.wrong.has(i)) { cls = 'bad'; dis = 'disabled'; } else if (CUR.sel === i) cls = 'sel';
    return `<button class="opt ${cls}" data-act="sel" data-i="${i}" ${dis} aria-pressed="${CUR.sel === i}"><span class="k">${'ABCD'[i]}</span><span class="v">${fmtMath(txt)}</span></button>`;
  }).join('');
  let fb = '';
  const expl = `<h3>${t('explain')}</h3>${fmtMath(r.exp || '')}${r.ev ? `<div class="viz">${fmtMath(r.ev)}</div>` : ''}`;
  if (CUR.solved) fb = `<section class="card fb ok" role="status"><h2>${t('correct_t')}</h2>${expl}</section>`;
  else if (CUR.revealed) fb = `<section class="card fb info" role="status"><p class="ans">${t('right_ans')} <b>${'ABCD'[o.ans]}</b></p><p class="mut">${t('revealed_note')}</p>${expl}</section>`;
  else if (CUR.last === 'wrong') fb = `<section class="card fb bad" role="status"><h2>${t('wrong_t')}</h2><p>${t('retry')}?</p></section>`;
  const tries = DB.attempts[id] | 0;
  $app.innerHTML = header('list') + `<main class="wrap pv lvbg-${c.level}">
  <div class="pv-top"><a class="btn sm" href="#problems">← ${t('back')}</a><span style="display:flex;gap:8px"><button class="btn sm" data-act="nav" data-v="-1">← ${t('prev_p')}</button><button class="btn sm" data-act="random">${t('btn_random')}</button><button class="btn sm" data-act="nav" data-v="1">${t('next')} →</button></span></div>
  <h1><span class="pid">#${id}</span> ${esc(titleOf(c))}</h1>
  <div class="tags"><span class="tag lv-${c.level}">${levelName(c)}</span><span class="chip dif dif${d}">${diffName(d)}</span><span class="chip">${materiName(c.materi)}</span>${stIcon(DB.status[id] | 0)}<span class="mut" style="font-size:.88rem">${tries ? t('attempts') + ': ' + tries : t('not_tried')}</span>${miss ? `<span class="nomt">${t('untranslated')}</span>` : ''}</div>
  <article class="card qcard"><div class="qtext">${fmtMath(r.q)}</div>${r.viz ? `<div class="viz">${r.viz}</div>` : ''}</article>
  <div class="opts" role="group" aria-label="Pilihan jawaban">${opts}</div>
  ${done ? `<div class="actions"><button class="btn pri" data-act="nav" data-v="1">${t('next_p')} →</button></div>` : `<div class="actions"><button class="btn pri" data-act="submit">${t('submit')}</button><button class="btn" data-act="reveal">${t('show_sol')}</button><span class="mut" id="msg" role="alert">${CUR.msg}</span></div>`}
  ${fb}</main>`;
  if (CUR.last === 'wrong') { CUR.last = null; }
}
function bumpActivity() { const k = today(); DB.act[k] = (DB.act[k] || 0) + 1; }
function submit() {
  if (CUR.sel < 0) { CUR.msg = t('pick_first'); renderProblem(); return; }
  const ok = CUR.sel === CUR.r.o.ans; DB.attempts[CUR.id] = (DB.attempts[CUR.id] | 0) + 1; bumpActivity();
  if (ok) { DB.status[CUR.id] = 2; CUR.solved = true; CUR.last = 'ok'; } else { if (!DB.status[CUR.id]) DB.status[CUR.id] = 1; CUR.wrong.add(CUR.sel); CUR.last = 'wrong'; }
  CUR.sel = -1; CUR.msg = ''; saveDB(); renderProblem();
  const el = $app.querySelector('.fb'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function reveal() { CUR.revealed = true; if (!DB.status[CUR.id]) DB.status[CUR.id] = 1; saveDB(); renderProblem(); const el = $app.querySelector('.fb'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }

/* ====== Statistik ====== */
function renderStats() {
  const sc = solvedCounts(); let subs = 0; for (const k in DB.act) subs += DB.act[k];
  let streak = 0; const dt = new Date(); const key = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  if (!DB.act[key(dt)]) dt.setDate(dt.getDate() - 1); while (DB.act[key(dt)]) { streak++; dt.setDate(dt.getDate() - 1); }
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - start.getDay() - 25 * 7); const end = new Date(); end.setHours(0, 0, 0, 0);
  let heat = ''; for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) { const n = DB.act[key(d)] | 0; heat += `<i class="${n ? 'h' + (n >= 12 ? 4 : n >= 6 ? 3 : n >= 3 ? 2 : 1) : ''}" title="${key(d)}: ${n}"></i>`; }
  const dcol = ['', 'var(--d1)', 'var(--d2)', 'var(--d3)'];
  const rows = MKEYS.filter(k => COUNT.m[k]).sort((a, b) => (sc.m[b] | 0) - (sc.m[a] | 0) || COUNT.m[b] - COUNT.m[a]);
  $app.innerHTML = header('stats') + `<main class="wrap"><h1 style="margin:10px 0 18px">${t('s_title')}</h1>
  <div class="stats-grid"><section class="card stat"><span class="eyebrow">${t('s_solved')}</span><span class="big-n">${nf(sc.all)}<span class="mut" style="font-size:1.1rem"> / ${nf(PR.n)}</span></span></section>
  <section class="card stat"><span class="eyebrow">${t('s_streak')}</span><span class="big-n">${streak}<span class="mut" style="font-size:1.1rem"> ${t('s_days')}</span></span><span class="mut">${nf(subs)} ${t('s_subs')}</span></section>
  <section class="card stat"><h2>${t('s_by_diff')}</h2>${[1, 2, 3].map(d => `<div class="bar" style="color:${dcol[d]}"><span class="dif dif${d}">${diffName(d)}</span><i><b style="width:${COUNT.d[d] ? 100 * sc.d[d] / COUNT.d[d] : 0}%"></b></i><span style="color:var(--ink)">${nf(sc.d[d])}/${nf(COUNT.d[d])}</span></div>`).join('')}</section></div>
  <section class="card stat" style="margin-bottom:22px"><h2>${t('s_act')}</h2><div class="heat" aria-label="${t('s_act')}">${heat}</div></section>
  <div class="stats-grid"><section class="card stat"><h2>${t('s_by_level')}</h2>${LEVELS.filter(lv => COUNT.l[lv.id]).map(lv => `<div class="bar" style="color:var(--l-${lv.id})"><span style="color:var(--ink)">${LANG === 'en' ? lv.en : lv.id_}</span><i><b style="width:${100 * (sc.l[lv.id] | 0) / COUNT.l[lv.id]}%"></b></i><span style="color:var(--ink)">${nf(sc.l[lv.id] | 0)}/${nf(COUNT.l[lv.id])}</span></div>`).join('')}</section>
  <section class="card stat" style="grid-column:1/-1"><h2>${t('s_by_topic')}</h2><div class="topic-table">${rows.map(k => `<div class="mrow"><span>${materiName(k)}</span><i><b style="width:${100 * (sc.m[k] | 0) / COUNT.m[k]}%"></b></i><span>${nf(sc.m[k] | 0)}/${nf(COUNT.m[k])}</span></div>`).join('')}</div></section></div></main>`;
}

/* ====== Rute & peristiwa ====== */
function route() {
  const h = location.hash.slice(1); let m;
  if ((m = h.match(/^problem-(\d+)$/))) { const id = +m[1]; if (id >= 1 && id <= PR.n) { openProblem(id); return; } }
  if (h === 'stats') { renderStats(); window.scrollTo(0, 0); return; }
  renderList();
}
window.addEventListener('hashchange', route);
function go(id) { if (location.hash === '#problem-' + id) openProblem(id); else location.hash = '#problem-' + id; }
const toggleSet = (s, v) => { s.has(v) ? s.delete(v) : s.add(v); F.page = 1; };
const ACT = {
  lang: el => { setLang(el.dataset.v); DB.lang = LANG; document.documentElement.lang = LANG; saveDB(); if (CUR && /^#problem-/.test(location.hash)) { CUR.r = genProblem(CUR.id); renderProblem(); } else route(); },
  theme: () => { const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const nx = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = nx; DB.theme = nx; saveDB(); },
  fl: el => { toggleSet(F.levels, el.dataset.v); renderList(); }, fd: el => { toggleSet(F.diffs, +el.dataset.v); renderList(); },
  fs: el => { F.status = el.dataset.v; F.page = 1; renderList(); }, fm: el => { F.openM = true; toggleSet(F.materi, el.dataset.v); renderList(); }, fmc: () => { F.materi.clear(); renderList(); },
  reset: () => { F.q = ''; F.levels.clear(); F.diffs.clear(); F.materi.clear(); F.status = 'all'; F.page = 1; renderList(); },
  pg: el => { F.page += +el.dataset.v; renderResults(); window.scrollTo({ top: document.querySelector('.rcount').offsetTop - 20 }); },
  random: () => { const list = computeList(), todo = list.filter(i => !DB.status[i]), pool = todo.length ? todo : (list.length ? list : [1 + Math.floor(Math.random() * PR.n)]); go(pool[Math.floor(Math.random() * pool.length)]); },
  continue: () => { const list = computeList(), after = list.find(i => i > (DB.lastId | 0) && !DB.status[i]) || list.find(i => !DB.status[i]) || list[0] || 1; go(after); },
  sel: el => { if (CUR.solved || CUR.revealed) return; CUR.sel = +el.dataset.i; CUR.msg = ''; renderProblem(); },
  submit, reveal, nav: el => go(neighbor(CUR.id, +el.dataset.v))
};
$app.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el); });
$app.addEventListener('input', e => { if (e.target.id === 'q') { F.q = e.target.value; F.page = 1; renderResults(); } });
document.addEventListener('keydown', e => {
  if (!/^#problem-/.test(location.hash) || !CUR || /INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName) && e.key === 'Enter' || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.toLowerCase(), i = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
  if (k.length === 1 && i >= 0 && !CUR.solved && !CUR.revealed && !CUR.wrong.has(i) && !e.metaKey && !e.ctrlKey) { CUR.sel = i; CUR.msg = ''; renderProblem(); }
  else if (e.key === 'Enter') { if (CUR.solved || CUR.revealed) ACT.nav({ dataset: { v: 1 } }); else submit(); }
});
route();
