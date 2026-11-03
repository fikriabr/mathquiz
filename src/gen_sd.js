'use strict';
/* ====== SD ====== */
const NAMES = ['Budi', 'Sari', 'Rani', 'Dito', 'Maya', 'Andi', 'Putri', 'Raka', 'Nadia', 'Bima', 'Lina', 'Fajar', 'Tika', 'Joko', 'Ayu', 'Dimas'];
const THINGS = ['kelereng', 'stiker', 'kartu bergambar', 'buku cerita', 'pensil warna', 'apel', 'kue', 'balon', 'permen', 'kancing'];
const nm = () => pick(NAMES);

function sdAdd(d) {
  const n = nm(), it = pick(THINGS);
  const [lo, hi] = d === 1 ? [11, 49] : d === 2 ? [120, 899] : [1200, 6999];
  const a = R(lo, hi), b = R(lo, hi), s = a + b;
  return {
    q: `${n} punya <b>${N(a)}</b> ${it}. Lalu ${n} menerima <b>${N(b)}</b> ${it} lagi dari teman-temannya. Berapa ${it} ${n} sekarang?`,
    o: numOpts(s, [dw(a, b, (x, y) => (x + y) % 10), s + 10, s - 10, s + 100, s - 100, Math.abs(a - b)], N, 10),
    exp: ST(addSteps(a, b)) + TIP('Kalau satu kolom hasilnya lebih dari 9, simpan puluhannya dan tambahkan ke kolom di sebelah kiri.')
  };
}
function sdSub(d) {
  const n = nm(), it = pick(THINGS);
  let a, b;
  if (d === 1) { a = R(30, 99); b = R(11, a - 5); } else if (d === 2) { a = R(300, 999); b = R(120, a - 60); } else { a = R(2000, 9999); b = R(1100, a - 500); }
  const s = a - b;
  const tpl = pick([
    `${n} membawa <b>${N(a)}</b> ${it} ke sekolah. Sebanyak <b>${N(b)}</b> ${it} diberikan kepada adik. Berapa sisanya?`,
    `Di toko ada <b>${N(a)}</b> ${it}. Hari ini terjual <b>${N(b)}</b>. Berapa ${it} yang masih tersisa?`
  ]);
  return {
    q: tpl,
    o: numOpts(s, [a + b, dw(a, b, (x, y) => Math.abs(x - y)), s + 10, s - 10, s + 100, s - 100], N, 10),
    exp: ST(subSteps(a, b)) + TIP('Hasil pengurangan bisa dicek dengan menjumlahkan lagi: ' + N(s) + ' + ' + N(b) + ' = ' + N(a) + '.')
  };
}
const FOODS = [['bakso', 12000], ['mie ayam', 10000], ['nasi goreng', 15000], ['es teh', 4000], ['gorengan', 2000], ['jus jeruk', 8000], ['roti bakar', 9000], ['pisang goreng', 5000]];
function sdMoney(d) {
  const n = nm(); const [A, B] = shuffle(FOODS).slice(0, 2);
  const qa = d === 1 ? 1 : R(1, 3), qb = d === 1 ? 1 : R(1, d === 2 ? 2 : 4);
  const ta = A[1] * qa, tb = B[1] * qb, total = ta + tb;
  const pay = [20000, 50000, 100000].find(x => x >= total + 1000);
  const ch = pay - total;
  return {
    q: `${n} membeli ${qa} porsi ${A[0]} (@${Rp(A[1])}) dan ${qb} porsi ${B[0]} (@${Rp(B[1])}). ${n} membayar dengan uang ${Rp(pay)}. Berapa uang kembaliannya?`,
    o: numOpts(ch, [total, pay - ta, pay - tb, ch + 1000, ch - 1000, ch + 2000], Rp, 1000),
    exp: ST(`${A[0][0].toUpperCase() + A[0].slice(1)}: ${qa} × ${N(A[1])} = ${N(ta)}`, `${B[0][0].toUpperCase() + B[0].slice(1)}: ${qb} × ${N(B[1])} = ${N(tb)}`, `Total belanja: ${N(ta)} + ${N(tb)} = ${N(total)}`, `Kembalian: ${N(pay)} ${MINUS} ${N(total)} = <b>${Rp(ch)}</b>`) + TIP('Uang kembalian = uang yang dibayar dikurangi total belanja. Jangan lupa menghitung semua barang!')
  };
}
function mulSteps(x, y) {
  const big = y >= 10 ? x : y, dec = y >= 10 ? y : x; const parts = pv(dec).filter(v => v > 0); const prods = parts.map(v => v * big);
  return [`Pecah ${N(dec)} menjadi ${parts.map(N).join(' + ')}`, ...parts.map((v, i) => `${N(v)} × ${N(big)} = ${N(prods[i])}`), `Jumlahkan: ${prods.map(N).join(' + ')} = <b>${N(x * y)}</b>`];
}
function sdMul(d) {
  const it = pick(THINGS); let g, p;
  if (d === 1) { g = R(2, 9); p = R(2, 9); } else if (d === 2) { g = R(3, 9); p = R(12, 48); } else { g = R(11, 29); p = R(21, 59); }
  const v = g * p;
  const ev = d === 1 ? `<div class="viz small">${svgDots(g, p)}</div>` : '';
  return {
    q: `Ada <b>${g}</b> kotak ${it}. Setiap kotak berisi <b>${p}</b> ${it}. Berapa jumlah ${it} seluruhnya?`,
    o: numOpts(v, [g + p, v + g, v - p, v + 10, v - 10, v + p], N, 1),
    ev,
    exp: ST(d === 1 ? [`${g} kotak × ${p} ${it} = ${g} × ${p}`, `Lihat kumpulan titik di bawah: ${g} baris, tiap baris ${p} titik.`, `${g} × ${p} = <b>${v}</b>`] : [`Jumlah seluruhnya = ${g} × ${p}`, ...mulSteps(g, p)]) + TIP(d === 1 ? 'Perkalian adalah penjumlahan berulang: ' + Array(g).fill(p).join(' + ') + ' = ' + v + '.' : 'Memecah bilangan besar menjadi puluhan dan satuan membuat perkalian lebih mudah dihitung dalam kepala.')
  };
}
function sdDiv(d) {
  const it = pick(THINGS); let k, c;
  if (d === 1) { c = R(2, 5); k = R(2, 9); } else if (d === 2) { c = R(3, 9); k = R(12, 25); } else { c = R(6, 12); k = R(15, 40); }
  const total = c * k;
  return {
    q: `<b>${N(total)}</b> ${it} dibagi rata kepada <b>${c}</b> anak. Berapa ${it} yang diterima setiap anak?`,
    o: numOpts(k, [k + 1, k - 1, total - c, c, k + 10, k - 10], N, 1),
    exp: ST('Bagi rata berarti pembagian. Cari bilangan yang jika dikali ' + c + ' hasilnya ' + N(total) + '.', `${c} × ${k} = ${N(total)}`, `Jadi ${N(total)} ÷ ${c} = <b>${k}</b>`) + TIP('Pembagian adalah kebalikan perkalian. Kalau lupa hasil bagi, tebak lalu periksa dengan mengalikan.')
  };
}
function sdCeil(d) {
  const n = R(4, 12), q = R(3, 14), r = R(1, n - 1), total = q * n + r;
  return {
    q: `Sebanyak <b>${total}</b> kue akan dimasukkan ke dalam kotak. Satu kotak muat <b>${n}</b> kue. Paling sedikit dibutuhkan berapa kotak?`,
    o: numOpts(q + 1, [q, q + 2, total - n, q - 1], N, 1),
    exp: ST(`${total} ÷ ${n} = ${q} sisa ${r}`, `${q} kotak sudah penuh, tetapi masih ada <b>${r} kue</b> yang belum punya kotak.`, `Sisa itu butuh satu kotak lagi: ${q} + 1 = <b>${q + 1}</b> kotak.`) + TIP('Pada soal "paling sedikit butuh berapa", sisa pembagian selalu dibulatkan ke atas.')
  };
}
/* pecahan */
function sdFracRead(d) {
  const parts = pick(d === 1 ? [2, 3, 4] : d === 2 ? [5, 6, 8] : [8, 10, 12]);
  const n = R(d === 3 ? 3 : 1, parts - 1);
  return {
    q: 'Berapa bagian lingkaran yang diarsir (berwarna)?', viz: svgPie(parts, n),
    o: opts(fr(n, parts), [fr(parts - n, parts), n < parts - n ? fr(n, parts - n) : null, n + 1 < parts ? fr(n + 1, parts) : null, fr(n, parts + 1), fr(Math.max(1, n - 1), parts)], () => fr(R(1, parts - 1) || 1, parts + R(1, 3))),
    exp: ST(`Lingkaran dibagi menjadi <b>${parts}</b> bagian sama besar, jadi penyebutnya ${parts}.`, `Bagian yang diarsir ada <b>${n}</b>, jadi pembilangnya ${n}.`, `Pecahannya ${fr(n, parts)}.`) + TIP('Pecahan = bagian yang diambil di atas, banyaknya bagian seluruhnya di bawah.')
  };
}
function sdFracAdd(d) {
  let b1, a, b2, c, den, num, wrong = [];
  if (d < 3) {
    b1 = b2 = pick([4, 5, 6, 8, 10]); a = R(1, b1 - 2); c = R(1, b1 - 1 - a);
    den = b1; num = a + c;
    wrong = [frs(a + c, b1 + b2), frs(a + c, 2 * b1), frs(a * c, b1), frs(a + c + 1, b1)];
    return {
      q: `${fr(a, b1)} + ${fr(c, b2)} = … (tulis dalam bentuk paling sederhana)`,
      o: opts(frs(num, den), wrong, () => frs(R(1, b1), b1 + R(0, 2))),
      exp: ST('Penyebutnya sudah sama, jadi cukup jumlahkan pembilangnya.', `${a} + ${c} = ${a + c}`, `${fr(a + c, b1)}${gcd(a + c, b1) > 1 ? ' disederhanakan menjadi ' + frs(num, den) : ''}`) + TIP('Penyebut tidak ikut dijumlahkan. Hanya pembilang yang ditambah.')
    };
  }
  b1 = pick([2, 3, 4, 5]); const k = pick([2, 3]); b2 = b1 * k;
  do { a = R(1, b1 - 1); c = R(1, b2 - 1); num = a * k + c; } while (num >= b2);
  return {
    q: `${fr(a, b1)} + ${fr(c, b2)} = … (tulis dalam bentuk paling sederhana)`,
    o: opts(frs(num, b2), [frs(a + c, b1 + b2), frs(a + c, b2), frs(a + c, b1), frs(a * k + c + 1, b2)], () => frs(R(1, b2), b2 + R(0, 2))),
    exp: ST(`Samakan penyebut. ${b1} × ${k} = ${b2}, jadi ${fr(a, b1)} = ${fr(a * k, b2)}.`, `${fr(a * k, b2)} + ${fr(c, b2)} = ${fr(num, b2)}`, `Sederhanakan: <b>${frs(num, b2)}</b>`) + TIP('Penyebut berbeda? Ubah dulu supaya sama dengan mengalikan pembilang dan penyebut dengan bilangan yang sama.')
  };
}
function sdFracOf(d) {
  const b = pick(d === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 8]), a = R(1, b - 1), x = R(2, d === 1 ? 9 : 14), n = b * x, it = pick(THINGS);
  return {
    q: `Dari <b>${n}</b> ${it}, ${fr(a, b)} bagian diberikan kepada adik. Berapa ${it} yang diberikan kepada adik?`,
    o: numOpts(a * x, [x, n - a * x, a * x + b, a * x + 1, a * x - 1]),
    exp: ST(`Bagi ${n} menjadi ${b} kelompok sama banyak: ${n} ÷ ${b} = ${x}`, `Ambil ${a} kelompok: ${a} × ${x} = <b>${a * x}</b>`) + TIP('"Pecahan dari" artinya dibagi penyebut dulu, baru dikali pembilang.')
  };
}
function sdFracCmp(d) {
  let fs = [], guard = 0;
  while (fs.length < 4 && guard++ < 200) {
    const den = R(3, d === 2 ? 8 : 12), nu = R(1, den - 1), v = nu / den;
    if (fs.every(f => Math.abs(f.v - v) > 0.045)) fs.push({ n: nu, d: den, v });
  }
  if (fs.length < 4) return null;
  const big = rnd() < 0.5, sorted = fs.slice().sort((x, y) => big ? y.v - x.v : x.v - y.v), best = sorted[0];
  const s = x => fr(x.n, x.d);
  return {
    q: `Manakah pecahan yang nilainya paling <b>${big ? 'besar' : 'kecil'}</b>?`,
    o: opts(s(best), fs.filter(x => x !== best).map(s)),
    exp: ST('Ubah setiap pecahan menjadi desimal (pembilang ÷ penyebut):', ...fs.map(x => `${s(x)} ≈ ${N(x.v, 2)}`), `Paling ${big ? 'besar' : 'kecil'}: ${s(best)} (${N(best.v, 2)})`) + TIP('Pecahan yang kurang dari ½ punya pembilang kurang dari setengah penyebutnya. Itu cara cepat untuk menyaring.')
  };
}
/* bangun datar */
function sdShapes(d) {
  const askArea = rnd() < 0.5;
  if (d === 1) {
    const s = R(3, 9), v = askArea ? s * s : 4 * s;
    return {
      q: `Perhatikan persegi di bawah. Berapa <b>${askArea ? 'luas' : 'keliling'}</b>nya?`, viz: svgRect(s, s, s + ' cm', s + ' cm'),
      o: numOpts(v, askArea ? [4 * s, 2 * s, s + s * 2, v + s] : [s * s, 2 * s, 3 * s, v + s]),
      exp: ST(askArea ? [`Luas persegi = sisi × sisi`, `${s} × ${s} = <b>${v} cm²</b>`] : [`Keliling persegi = 4 × sisi`, `4 × ${s} = <b>${v} cm</b>`]) + TIP(askArea ? 'Luas diukur dalam petak persegi (cm²), keliling diukur sepanjang tepi (cm).' : 'Keliling = panjang pagar yang mengelilingi bangun. Keempat sisi persegi sama panjang.')
    };
  }
  if (d === 2) {
    const p = R(6, 15), l = R(3, p - 1), v = askArea ? p * l : 2 * (p + l);
    return {
      q: `Berapa <b>${askArea ? 'luas' : 'keliling'}</b> persegi panjang berikut?`, viz: svgRect(p, l, p + ' cm', l + ' cm'),
      o: numOpts(v, askArea ? [2 * (p + l), p + l, p * l + p, p * l - l] : [p * l, p + l, 2 * p + l, 2 * p * l]),
      exp: ST(askArea ? [`Luas = panjang × lebar`, `${p} × ${l} = <b>${v} cm²</b>`] : [`Keliling = 2 × (panjang + lebar)`, `2 × (${p} + ${l}) = 2 × ${p + l} = <b>${v} cm</b>`]) + TIP('Untuk keliling, jangan lupa sisi yang berhadapan sama panjang, jadi semuanya ada dua kali.')
    };
  }
  const w = R(9, 14), h = R(8, 12), cw = R(2, w - 5), ch = R(2, h - 4), v = askArea ? w * h - cw * ch : 2 * (w + h);
  return {
    q: `Bangun berbentuk huruf L di bawah dibuat dari persegi panjang yang dipotong di salah satu sudutnya. Berapa <b>${askArea ? 'luas' : 'keliling'}</b>nya?`, viz: svgL(w, h, cw, ch),
    o: numOpts(v, askArea ? [w * h, w * h + cw * ch, 2 * (w + h), w * h - cw - ch] : [w * h - cw * ch, 2 * (w + h) - 2 * cw, 2 * (w + h) - cw - ch, 2 * (w + h) + cw + ch]),
    exp: ST(askArea ? [`Bayangkan persegi panjang utuh: ${w} × ${h} = ${w * h} cm²`, `Bagian yang dipotong: ${cw} × ${ch} = ${cw * ch} cm²`, `Luas L = ${w * h} ${MINUS} ${cw * ch} = <b>${v} cm²</b>`] : [`Keliling bentuk L sama dengan keliling persegi panjang utuh, karena sisi yang "hilang" digantikan sisi lekukan yang panjang totalnya sama.`, `2 × (${w} + ${h}) = <b>${v} cm</b>`]) + TIP(askArea ? 'Luas bangun rumit = luas bangun besar dikurangi bagian yang hilang.' : 'Memotong sudut persegi panjang tidak mengubah kelilingnya!')
  };
}
function sdTri(d) {
  if (d === 3) {
    const b = pick([6, 8, 10, 12, 14]), t = R(4, 12), L = b * t / 2;
    return {
      q: `Sebuah segitiga memiliki luas <b>${L} cm²</b> dan alas <b>${b} cm</b>. Berapa tinggi segitiga itu?`,
      o: numOpts(t, [2 * L / b / 2, L / b / 2 + 1, L - b, L / b * 2, t + 2, t - 1]),
      exp: ST(`Luas = ½ × alas × tinggi`, `${L} = ½ × ${b} × tinggi = ${b / 2} × tinggi`, `tinggi = ${L} ÷ ${b / 2} = <b>${t} cm</b>`) + TIP('Kalau ada yang tidak diketahui, tulis dulu rumusnya, masukkan angka, lalu cari yang hilang.')
    };
  }
  const b = 2 * R(2, d === 1 ? 6 : 10), t = R(3, d === 1 ? 10 : 15), v = b * t / 2;
  return {
    q: 'Berapa luas segitiga berikut?', viz: svgTri(b, t),
    o: numOpts(v, [b * t, b + t, (b + t) / 2, v + t, v - b]),
    exp: ST(`Segitiga adalah setengah dari persegi panjang dengan alas dan tinggi yang sama.`, `Luas = ½ × alas × tinggi = ½ × ${b} × ${t}`, `= ${b * t} ÷ 2 = <b>${v} cm²</b>`) + TIP('Tinggi segitiga selalu tegak lurus dengan alas (ditandai garis putus-putus), bukan sisi miringnya.')
  };
}
function sdPerim(d) {
  if (rnd() < 0.5) {
    const s = R(4, 15), K = 4 * s;
    return {
      q: `Keliling sebuah persegi adalah <b>${K} cm</b>. Berapa panjang sisinya?`,
      o: numOpts(s, [K / 2, K - 4, K / 2 - 2, s + 2, K / 3]),
      exp: ST('Keliling persegi = 4 × sisi', `${K} = 4 × sisi`, `sisi = ${K} ÷ 4 = <b>${s} cm</b>`) + TIP('Persegi punya 4 sisi sama panjang, jadi keliling dibagi 4.')
    };
  }
  const p = R(7, 16), l = R(3, p - 2), K = 2 * (p + l);
  return {
    q: `Sebuah persegi panjang berkeliling <b>${K} cm</b> dan panjangnya <b>${p} cm</b>. Berapa lebarnya?`,
    o: numOpts(l, [K / 2, K - p, K / 4, K / 2 + p, l + 2]),
    exp: ST(`Keliling = 2 × (panjang + lebar), jadi panjang + lebar = ${K} ÷ 2 = ${K / 2}`, `lebar = ${K / 2} ${MINUS} ${p} = <b>${l} cm</b>`) + TIP('Jumlah panjang dan lebar selalu sama dengan setengah keliling.')
  };
}
/* pola bilangan */
function sdPattern(d) {
  const BL = '<span class="blank">?</span>';
  const show = (arr, hide) => '<div class="seq">' + arr.map((v, i) => i === hide ? BL : N(v)).join('<i>,</i> ') + '</div>';
  let seq, hide, ans, steps, tip, wrong;
  const arith = (s, st) => Array.from({ length: 7 }, (_, i) => s + i * st);
  if (d === 1) {
    const s = R(1, 20), st = R(2, 5); seq = arith(s, st);
    if (rnd() < 0.5) { seq = seq.slice(0, 6); hide = 5; } else { seq = seq.slice(0, 6); hide = R(2, 3); }
    ans = seq[hide]; wrong = [ans + 1, ans - 1, ans + st, ans - st];
    steps = [`Selisih tiap suku: ${seq[1]} ${MINUS} ${seq[0]} = <b>${st}</b>`, `Aturannya: tambah ${st} setiap langkah.`, hide === 5 ? `${seq[4]} + ${st} = <b>${ans}</b>` : `${seq[hide - 1]} + ${st} = <b>${ans}</b>`];
    tip = 'Cari selisih dua suku yang bersebelahan. Jika selalu sama, itu pola tambah (atau kurang) tetap.';
  } else if (d === 2) {
    const t = pick(['turun', 'kali', 'kuadrat']);
    if (t === 'turun') { const st = R(3, 9), s = R(60, 100); seq = Array.from({ length: 6 }, (_, i) => s - i * st); hide = 5; ans = seq[5]; wrong = [ans + 2 * st, ans + 1, ans - 1, ans + st]; steps = [`Bilangan makin kecil: ${seq[0]} ${MINUS} ${seq[1]} = ${st}`, `Aturannya: kurang ${st} setiap langkah.`, `${seq[4]} ${MINUS} ${st} = <b>${ans}</b>`]; tip = 'Pola bisa juga turun. Perhatikan apakah angkanya bertambah atau berkurang.'; }
    else if (t === 'kali') { const s = R(1, 5); seq = [s, 2 * s, 4 * s, 8 * s, 16 * s]; hide = 4; ans = 16 * s; wrong = [ans + s, ans - s, 12 * s + 4 * s + 2, 3 * 8 * s]; seq = seq.slice(0, 4).concat([]); seq = [s, 2 * s, 4 * s, 8 * s, 16 * s, 32 * s]; hide = 5; ans = 32 * s; wrong = [ans - 8 * s, 24 * s + 8 * s - 2, 16 * s + 8 * s, ans + 2]; steps = [`${seq[1]} ÷ ${seq[0]} = 2, ${seq[2]} ÷ ${seq[1]} = 2`, 'Aturannya: dikali 2 setiap langkah.', `${seq[4]} × 2 = <b>${ans}</b>`]; tip = 'Kalau selisihnya makin besar, coba periksa apakah polanya perkalian.'; }
    else { const o = R(0, 3); seq = Array.from({ length: 7 }, (_, i) => (i + 1 + o) * (i + 1 + o)).slice(0, 6); hide = 5; ans = (6 + o) * (6 + o); wrong = [ans + 1, ans - (6 + o), ans + (6 + o), (6 + o) * (5 + o)]; steps = [`Selisih tiap suku: ${seq[1] - seq[0]}, ${seq[2] - seq[1]}, ${seq[3] - seq[2]}, … selalu naik 2`, `Ini bilangan kuadrat: ${seq.slice(0, 5).map((v, i) => `${i + 1 + o}²`).join(', ')}`, `${6 + o}² = <b>${ans}</b>`]; tip = 'Bilangan kuadrat: 1, 4, 9, 16, 25, 36, … Selisihnya 3, 5, 7, 9, …'; }
  } else {
    const t = pick(['segitiga', 'fibo', 'selang', 'kali1']);
    if (t === 'segitiga') { seq = [1, 3, 6, 10, 15, 21]; hide = 5; ans = 21; wrong = [20, 22, 25, 18]; steps = ['Selisih tiap suku: 2, 3, 4, 5, … (naik 1 terus)', 'Selisih berikutnya adalah 6.', `15 + 6 = <b>21</b>`]; tip = 'Jika selisihnya tidak tetap tetapi membentuk pola sendiri, lihat "selisih dari selisih".'; }
    else if (t === 'fibo') { const a = R(1, 4), b = R(2, 6); seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b, 3 * a + 5 * b]; hide = 5; ans = seq[5]; wrong = [ans + 1, ans - 1, seq[4] * 2, seq[4] + seq[3] + 1]; steps = [`${seq[0]} + ${seq[1]} = ${seq[2]}, ${seq[1]} + ${seq[2]} = ${seq[3]}`, 'Aturannya: setiap suku adalah jumlah dua suku sebelumnya.', `${seq[3]} + ${seq[4]} = <b>${ans}</b>`]; tip = 'Pola seperti ini dinamai deret Fibonacci. Setiap suku = dua suku sebelumnya dijumlahkan.'; }
    else if (t === 'selang') { const s = R(2, 6), u = R(s + 3, s + 9); seq = [s, u, s + 1, u + 1, s + 2, u + 1 + 1]; hide = 5; ans = u + 2; seq = [s, u, s + 1, u + 1, s + 2, u + 2, s + 3]; hide = 6; ans = s + 3; wrong = [u + 3, ans + 1, ans - 1, s + 4]; steps = [`Ada dua pola yang bergantian.`, `Suku ke-1, 3, 5: ${s}, ${s + 1}, ${s + 2} (tambah 1)`, `Suku ke-2, 4, 6: ${u}, ${u + 1}, ${u + 2} (tambah 1)`, `Suku ke-7 mengikuti pola pertama: <b>${ans}</b>`]; tip = 'Jika pola terlihat acak, coba pisahkan suku ganjil dan suku genap.'; }
    else { const s = R(1, 3); seq = [s]; for (let i = 0; i < 5; i++) seq.push(seq[i] * 2 + 1); hide = 5; ans = seq[5]; wrong = [seq[4] * 2, ans + 2, ans - 2, seq[4] * 2 + 2]; steps = [`${seq[0]} × 2 + 1 = ${seq[1]}`, `${seq[1]} × 2 + 1 = ${seq[2]}`, 'Aturannya: kali 2, lalu tambah 1.', `${seq[4]} × 2 + 1 = <b>${ans}</b>`]; tip = 'Jika tidak cocok dengan tambah atau kali saja, coba gabungan keduanya.'; }
  }
  return { q: 'Tentukan bilangan yang menggantikan tanda tanya (?) pada pola berikut.' + show(seq, hide), o: numOpts(ans, wrong), exp: ST(steps) + TIP(tip) };
}
/* jam */
function sdClock(d) {
  const h = R(1, 12), m = d === 1 ? pick([0, 30]) : d === 2 ? pick([0, 15, 30, 45]) : R(0, 11) * 5;
  const wrap = x => ((x - 1 + 12) % 12) + 1, mm = x => (x + 60) % 60;
  const sh = (m / 5) || 12;
  const ans = fmtT(h, m);
  return {
    q: 'Jam di bawah menunjukkan pukul berapa? (ditulis jam.menit)', viz: svgClock(h, m),
    o: opts(ans, [fmtT(wrap(h + 1), m), fmtT(wrap(h - 1), m), fmtT(sh, (h % 12) * 5), fmtT(h, mm(m + 5)), fmtT(h, mm(m - 5)), fmtT(h, mm(m + 15))], () => fmtT(wrap(h + R(-2, 2)), mm(m + 5 * R(-3, 3)))),
    exp: ST('Jarum pendek menunjukkan <b>jam</b>, jarum panjang menunjukkan <b>menit</b>.', `Jarum pendek berada ${m === 0 ? 'tepat di angka ' + h : 'setelah angka ' + h + ' (belum mencapai angka ' + wrap(h + 1) + ')'}, jadi jamnya <b>${h}</b>.`, `Jarum panjang menunjuk angka ${m / 5}. Setiap angka bernilai 5 menit: ${m / 5} × 5 = <b>${m} menit</b>.`, `Waktunya: <b>${ans}</b>`) + TIP('Jarum panjang di angka 6 berarti 30 menit, di angka 3 berarti 15 menit, di angka 9 berarti 45 menit.')
  };
}
function sdDur(d) {
  const sh = R(6, 18), sm = pick([0, 10, 15, 20, 30, 35, 40, 45, 50]), dh = R(1, 3), dm = pick([20, 25, 30, 35, 40, 45, 50]);
  let em = sm + dm, eh = sh + dh; const carry = em >= 60; if (carry) { em -= 60; eh += 1; }
  if (eh >= 24) return null;
  const ans = fmtT(eh, em), mm = x => (x + 60) % 60;
  const n = nm();
  return {
    q: `${n} menonton film yang dimulai pukul <b>${fmtT(sh, sm)}</b>. Lama film itu <b>${dh} jam ${dm} menit</b>. Pukul berapa film selesai?`,
    o: opts(ans, [fmtT(sh + dh, mm(sm + dm)), fmtT(eh + 1, em), fmtT(eh - 1, em), fmtT(eh, mm(em + 10)), fmtT(eh, mm(em - 10))], () => fmtT(eh + R(-1, 1), mm(em + 5 * R(-3, 3)))),
    exp: ST(`Tambahkan jam dulu: ${sh} + ${dh} = ${sh + dh} jam`, `Tambahkan menit: ${sm} + ${dm} = ${sm + dm} menit${carry ? ' (lebih dari 60)' : ''}`, carry ? `${sm + dm} menit = 1 jam ${em} menit, jadi jam bertambah 1 menjadi ${eh}` : 'Menitnya belum mencapai 60, jadi jam tidak berubah.', `Film selesai pukul <b>${ans}</b>`) + TIP('Satu jam = 60 menit. Jika menit melewati 60, kurangi 60 dan tambah 1 jam.')
  };
}

TOPICS.sd = [
  { id: 'tambah-kurang', name: 'Tambah & Kurang', glyph: '+', desc: 'Cerita belanja, uang kembalian, dan menyimpan angka.', gens: [G(1, sdAdd), G(1, sdSub), G(1, sdMoney)] },
  { id: 'kali-bagi', name: 'Kali & Bagi', glyph: '×', desc: 'Perkalian, bagi rata, dan soal bersisa.', gens: [G(1, sdMul), G(1, sdDiv), G(2, sdCeil)] },
  { id: 'pecahan', name: 'Pecahan', glyph: '½', desc: 'Baca, jumlahkan, dan bandingkan pecahan.', gens: [G(1, sdFracRead), G(1, sdFracAdd), G(1, sdFracOf), G(2, sdFracCmp)] },
  { id: 'bangun-datar', name: 'Bangun Datar', glyph: '△', desc: 'Keliling dan luas persegi, segitiga, sampai bentuk L.', gens: [G(1, sdShapes), G(1, sdTri), G(2, sdPerim)] },
  { id: 'pola', name: 'Pola Bilangan', glyph: '∞', desc: 'Temukan aturan tersembunyi di balik deretan angka.', gens: [G(1, sdPattern)] },
  { id: 'jam', name: 'Jam & Waktu', glyph: '◔', desc: 'Baca jam analog dan hitung durasi.', gens: [G(1, sdClock), G(2, sdDur)] }
];
