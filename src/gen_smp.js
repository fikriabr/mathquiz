'use strict';
/* ====== SMP ====== */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const sg = x => (x < 0 ? MINUS : '') + N(Math.abs(x));
const neg = x => x < 0 ? `(${MINUS}${N(-x)})` : N(x);

function smpInt(d) {
  if (d === 1) {
    if (rnd() < 0.5) {
      const a = R(3, 12), b = R(2, 15), v = -a + b;
      return { q: `Suhu di puncak gunung pada pagi hari adalah <b>${MINUS}${a}°C</b>. Siang hari suhu naik <b>${b}°</b>. Berapa suhu siang hari?`, o: numOpts(v, [-(a + b), a + b, a - b, v + 2, v - 2], x => sg(x) + '°C'), exp: ST(`Naik berarti ditambah: ${MINUS}${a} + ${b}`, `Dari ${MINUS}${a} naik ${b} langkah di garis bilangan.`, `Hasilnya <b>${sg(v)}°C</b>`) + TIP('Bayangkan garis bilangan: bergerak ke kanan menambah, ke kiri mengurangi.') };
    }
    const t = R(2, 10), dr = t + R(1, 8), v = t - dr;
    return { q: `Suhu di kulkas awalnya <b>${t}°C</b>. Setelah dibekukan, suhunya turun <b>${dr}°</b>. Berapa suhu sekarang?`, o: numOpts(v, [t + dr, dr - t, -(t + dr), v - 1, v + 2], x => sg(x) + '°C'), exp: ST(`Turun berarti dikurangi: ${t} ${MINUS} ${dr}`, `${t} ${MINUS} ${t} = 0, masih tersisa ${dr - t} langkah ke bawah nol.`, `Hasilnya <b>${sg(v)}°C</b>`) + TIP('Jika pengurangan melewati nol, hasilnya menjadi negatif.') };
  }
  if (d === 2) {
    const a = R(2, 15), b = R(2, 15), t = pick(['n+p', 'p-n', 'n-p', 'n-n']);
    let ex, v, rule;
    if (t === 'n+p') { ex = `(${MINUS}${a}) + ${b}`; v = -a + b; rule = `Menambah bilangan positif: geser ke kanan ${b} langkah dari ${MINUS}${a}.`; }
    else if (t === 'p-n') { ex = `${a} ${MINUS} (${MINUS}${b})`; v = a + b; rule = `Mengurangi bilangan negatif sama dengan menambah: ${a} ${MINUS} (${MINUS}${b}) = ${a} + ${b}.`; }
    else if (t === 'n-p') { ex = `(${MINUS}${a}) ${MINUS} ${b}`; v = -a - b; rule = `Mengurangi bilangan positif: geser ke kiri ${b} langkah dari ${MINUS}${a}.`; }
    else { ex = `(${MINUS}${a}) ${MINUS} (${MINUS}${b})`; v = -a + b; rule = `Dua tanda minus berdampingan menjadi plus: ${MINUS}${a} + ${b}.`; }
    return { q: `Hasil dari <b>${ex}</b> adalah …`, o: numOpts(v, [a + b, -(a + b), a - b, b - a, v + 2], sg), exp: ST(rule, `Hasilnya <b>${sg(v)}</b>`) + TIP('"Minus kali minus jadi plus" juga berlaku untuk pengurangan bilangan negatif: ' + MINUS + '(' + MINUS + ') = +.') };
  }
  const a = R(3, 12), b = R(2, 9), t = pick(['nn', 'np', 'div']);
  if (t === 'nn') { const v = a * b; return { q: `Hasil dari <b>(${MINUS}${a}) × (${MINUS}${b})</b> adalah …`, o: numOpts(v, [-v, a + b, -(a + b), v + a, v - b], sg), exp: ST('Negatif × negatif = positif', `${a} × ${b} = <b>${v}</b>`) + TIP('Tanda hasil perkalian: sama → positif, berbeda → negatif.') }; }
  if (t === 'np') { const v = -a * b; return { q: `Hasil dari <b>(${MINUS}${a}) × ${b}</b> adalah …`, o: numOpts(v, [-v, a - b, -(a + b), v - a, v + b], sg), exp: ST('Negatif × positif = negatif', `${a} × ${b} = ${a * b}, jadi hasilnya <b>${sg(v)}</b>`) + TIP('Tanda hasil perkalian: sama → positif, berbeda → negatif.') }; }
  const v = -b, tot = a * b;
  return { q: `Hasil dari <b>(${MINUS}${N(tot)}) ÷ ${a}</b> adalah …`, o: numOpts(v, [b, -(tot - a), tot - a, -b - 1, -b + 1], sg), exp: ST('Negatif ÷ positif = negatif', `${tot} ÷ ${a} = ${b}, jadi hasilnya <b>${sg(v)}</b>`) + TIP('Pembagian mengikuti aturan tanda yang sama dengan perkalian.') };
}
function smpOps(d) {
  let ex, v, wr, st;
  if (d === 1) {
    const a = R(2, 20), b = R(2, 9), c = R(2, 9); v = a + b * c; wr = (a + b) * c; ex = `${a} + ${b} × ${c}`;
    st = [`Kali dikerjakan lebih dulu: ${b} × ${c} = ${b * c}`, `${a} + ${b * c} = <b>${v}</b>`];
  } else if (d === 2) {
    const a = R(2, 9), b = R(2, 9), c = R(2, 6), e = R(2, 5), k = R(2, 8), dd = e * k; v = (a + b) * c - dd / e; wr = ((a + b) * c - dd) / e; ex = `(${a} + ${b}) × ${c} ${MINUS} ${dd} ÷ ${e}`;
    st = [`Kurung dulu: ${a} + ${b} = ${a + b}`, `Kali dan bagi (kiri ke kanan): ${a + b} × ${c} = ${(a + b) * c} dan ${dd} ÷ ${e} = ${k}`, `${(a + b) * c} ${MINUS} ${k} = <b>${v}</b>`];
  } else if (rnd() < 0.5) {
    const a = R(2, 15), b = R(2, 5), c = R(2, 6), e = R(2, 20); v = a + b * b * c - e; wr = (a + b) * b * c - e; ex = `${a} + ${b}<sup>2</sup> × ${c} ${MINUS} ${e}`;
    st = [`Pangkat dulu: ${b}² = ${b * b}`, `Kali: ${b * b} × ${c} = ${b * b * c}`, `Tambah dan kurang dari kiri: ${a} + ${b * b * c} ${MINUS} ${e} = <b>${v}</b>`];
  } else {
    const a = R(2, 12), b = R(2, 7), c = R(2, 6), e = R(2, 15); v = a + b * c + e; wr = (a - b) * (-c) + e; ex = `${a} ${MINUS} ${b} × (${MINUS}${c}) + ${e}`;
    st = [`Kali dulu: ${b} × (${MINUS}${c}) = ${MINUS}${b * c}`, `${a} ${MINUS} (${MINUS}${b * c}) + ${e} = ${a} + ${b * c} + ${e}`, `<b>${v}</b>`];
  }
  return { q: `Hasil dari <b>${ex}</b> adalah …`, o: numOpts(v, [wr, v + 2, v - 2, v + 10, -v], sg), exp: ST('Urutan pengerjaan: kurung → pangkat → kali/bagi → tambah/kurang.', st) + TIP('Mengerjakan dari kiri ke kanan tanpa memperhatikan urutan adalah jebakan paling umum.') };
}
function smpFpbKpk(d) {
  const g = d === 2 ? R(2, 6) : R(3, 12); let m, n; do { m = R(2, 6); n = R(2, 7); } while (m === n || gcd(m, n) !== 1);
  const a = g * m, b = g * n, kpk = lcm(a, b), fpb = g, fa = factorStr(a), fb = factorStr(b);
  if (rnd() < 0.5) return { q: `Lampu merah menyala setiap <b>${a}</b> detik dan lampu biru setiap <b>${b}</b> detik. Keduanya menyala bersamaan pada detik ke-0. Pada detik ke berapa keduanya menyala bersamaan lagi untuk pertama kali?`, o: numOpts(kpk, [fpb, a * b, a + b, Math.max(a, b), kpk * 2]), exp: ST(`Faktorisasi: ${a} = ${fa.html}, ${b} = ${fb.html}`, 'Menyala bersamaan lagi berarti mencari <b>KPK</b> (kelipatan persekutuan terkecil).', `KPK = semua faktor dengan pangkat terbesar = <b>${kpk}</b>`) + TIP('Kata kunci KPK: "bersamaan lagi", "bertemu lagi", "kapan sama-sama".') };
  return { q: `Dua pita sepanjang <b>${a} cm</b> dan <b>${b} cm</b> akan dipotong menjadi potongan-potongan sama panjang tanpa sisa. Berapa panjang terbesar tiap potongan?`, o: numOpts(fpb, [kpk, Math.abs(a - b), Math.min(a, b), fpb * 2, a * b]), exp: ST(`Faktorisasi: ${a} = ${fa.html}, ${b} = ${fb.html}`, 'Memotong sama panjang tanpa sisa berarti mencari <b>FPB</b> (faktor persekutuan terbesar).', `FPB = faktor yang sama dengan pangkat terkecil = <b>${fpb} cm</b>`) + TIP('Kata kunci FPB: "dibagi sama rata", "dipotong sama panjang", "sebesar-besarnya".') };
}
function smpLinear(d) {
  if (d === 1) {
    if (rnd() < 0.5) { const b = R(3, 20), x = R(2, 20); return { q: `Tentukan nilai <i>x</i> dari <b>x + ${b} = ${x + b}</b>`, o: numOpts(x, [x + b, x + 2 * b, b - x, x - 1, x + 1], sg), exp: ST(`Pindahkan ${b} ke ruas kanan, tandanya berubah: x = ${x + b} ${MINUS} ${b}`, `x = <b>${x}</b>`) + TIP('Cek jawaban: masukkan ke persamaan awal. ' + x + ' + ' + b + ' = ' + (x + b) + ' ✓') }; }
    const a = R(2, 9), x = R(2, 12); return { q: `Tentukan nilai <i>x</i> dari <b>${a}x = ${a * x}</b>`, o: numOpts(x, [a * x, a * x - a, a, x + 1, x - 1], sg), exp: ST(`${a}x artinya ${a} dikali x. Bagi kedua ruas dengan ${a}:`, `x = ${a * x} ÷ ${a} = <b>${x}</b>`) + TIP('Lawan dari kali adalah bagi.') };
  }
  if (d === 2) {
    const a = R(2, 9), x = R(-6, 12), b = pick([-1, 1]) * R(1, 12), c = a * x + b;
    return { q: `Tentukan nilai <i>x</i> dari <b>${P([a, b])} = ${sg(c)}</b>`, o: opts(sg(x), [frs(c + b, a), sg(c - b), sg(-x), frs(c - b, 1) === sg(x) ? null : frs(a * (c - b), 1)].filter(Boolean), () => sg(x + R(-3, 3))), exp: ST(`${a}x = ${sg(c)} ${b < 0 ? '+' : MINUS} ${Math.abs(b)} = ${sg(c - b)}`, `x = ${sg(c - b)} ÷ ${a} = <b>${sg(x)}</b>`) + TIP('Pindah ruas = ganti tanda. Selesaikan penjumlahan dulu, baru pembagian.') };
  }
  const x = R(-5, 9); let a, c; do { a = R(3, 9); c = R(1, 7); } while (a === c);
  const b = R(-10, 10), e = a * x + b - c * x;
  return { q: `Tentukan nilai <i>x</i> dari <b>${P([a, b])} = ${P([c, e])}</b>`, o: opts(sg(x), [sg(-x), frs(e - b, a + c), frs(e + b, a - c), frs(e - b, a)], () => sg(x + R(-3, 3))), exp: ST(`Kumpulkan suku x di ruas kiri: ${a}x ${MINUS} ${c}x = ${e} ${MINUS} (${sg(b)})`, `${a - c}x = ${sg(e - b)}`, `x = ${sg(e - b)} ÷ ${a - c} = <b>${sg(x)}</b>`) + TIP('Suku x ke satu sisi, angka ke sisi lain. Setiap pindah ruas, tanda berubah.') };
}
function smpAlg(d) {
  if (d === 1) {
    const a = R(2, 9), b = R(-9, 9), c = R(-5, 8), e = R(-9, 9); if (a + c === 0) return null;
    return { q: `Bentuk sederhana dari <b>(${P([a, b])}) + (${P([c, e])})</b> adalah …`, o: opts(P([a + c, b + e]), [P([a + c, b - e]), P([a, b + e]), P([a - c, b + e]), P([a + c + 1, b + e])], () => P([a + c + R(-2, 2), b + e + R(-3, 3)])), exp: ST('Kelompokkan suku sejenis (x dengan x, angka dengan angka):', `x: ${a} + ${neg(c)} = ${a + c}`, `angka: ${neg(b)} + ${neg(e)} = ${b + e}`, `<b>${P([a + c, b + e])}</b>`) + TIP('Hanya suku sejenis yang boleh dijumlahkan.') };
  }
  if (d === 2) {
    const a = R(2, 5), b = pick([-1, 1]) * R(1, 6), c = R(-4, 6); if (c === 0 || a + c === 0) return null;
    return { q: `Bentuk sederhana dari <b>${a}(x ${b < 0 ? MINUS : '+'} ${Math.abs(b)}) ${c < 0 ? MINUS : '+'} ${Math.abs(c)}x</b> adalah …`, o: opts(P([a + c, a * b]), [P([a + c, b]), P([a, a * b]), P([a + c, a + b]), P([a * c, a * b])], () => P([a + c + R(-2, 2), a * b + R(-3, 3)])), exp: ST(`Kalikan ${a} ke dalam kurung: ${a}x ${a * b < 0 ? MINUS : '+'} ${Math.abs(a * b)}`, `Gabungkan suku x: ${a}x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}x = ${a + c}x`, `<b>${P([a + c, a * b])}</b>`) + TIP('Sifat distributif: a(b + c) = ab + ac. Jangan lupa mengalikan suku kedua!') };
  }
  const p = R(-7, 7), q = R(-7, 7); if (!p || !q || p + q === 0) return null;
  return { q: `Hasil perkalian <b>(x ${p < 0 ? MINUS : '+'} ${Math.abs(p)})(x ${q < 0 ? MINUS : '+'} ${Math.abs(q)})</b> adalah …`, o: opts(P([1, p + q, p * q]), [P([1, 0, p * q]), P([1, p + q, p + q]), P([1, p - q, p * q]), P([1, p + q, -p * q])], () => P([1, p + q + R(-3, 3), p * q + R(-4, 4)])), exp: ST(`x × x = x²`, `x × ${neg(q)} + ${neg(p)} × x = ${sg(p + q)}x`, `${neg(p)} × ${neg(q)} = ${sg(p * q)}`, `<b>${P([1, p + q, p * q])}</b>`) + TIP('Setiap suku di kurung pertama harus bertemu setiap suku di kurung kedua (4 perkalian).') };
}
function smpWord(d) {
  if (d === 2) {
    if (rnd() < 0.5) { const s = R(30, 80), df = R(3, 14), big = (s + df) / 2; if (big !== Math.floor(big)) return null; return { q: `Jumlah dua bilangan adalah <b>${s}</b> dan selisihnya <b>${df}</b>. Berapakah bilangan yang lebih besar?`, o: numOpts(big, [big - df, s / 2, (s - df) / 2 + df, big + 1, big - 1]), exp: ST(`Misal bilangan besar = x dan kecil = y. x + y = ${s}, x ${MINUS} y = ${df}.`, `Jumlahkan kedua persamaan: 2x = ${s + df}`, `x = <b>${big}</b>`) + TIP('Jumlah + selisih = 2 × bilangan besar.') }; }
    const m = R(8, 30), s = 3 * m + 3; return { q: `Jumlah tiga bilangan bulat berurutan adalah <b>${s}</b>. Berapakah bilangan yang terbesar?`, o: numOpts(m + 2, [m + 1, m, m + 3, s / 3]), exp: ST('Misal bilangannya n, n + 1, n + 2.', `3n + 3 = ${s} → 3n = ${s - 3} → n = ${m}`, `Yang terbesar: ${m} + 2 = <b>${m + 2}</b>`) + TIP('Bilangan tengah dari tiga bilangan berurutan sama dengan jumlah dibagi 3.') };
  }
  if (rnd() < 0.5) {
    const k = R(2, 4), y = R(3, 8), dn = R(8, 15), S = (k + 1) * dn + 2 * y;
    return { q: `Umur Ayah <b>${k} kali</b> umur Dina. <b>${y} tahun lagi</b>, jumlah umur mereka menjadi <b>${S} tahun</b>. Berapa umur Dina sekarang?`, o: numOpts(dn, [S / (k + 1), (S - y) / (k + 1), dn + 1, dn - 1, k * dn].filter(x => Number.isInteger(x) || true), N, 1), exp: ST(`Misal umur Dina = x, umur Ayah = ${k}x.`, `${y} tahun lagi: (${k}x + ${y}) + (x + ${y}) = ${S}`, `${k + 1}x + ${2 * y} = ${S} → ${k + 1}x = ${S - 2 * y}`, `x = <b>${dn}</b>`) + TIP('Setiap orang bertambah umur sama banyaknya, jadi total bertambah dua kali.') };
  }
  const b = R(3, 9), p = R(2, 6), T2 = b + 2 * p, T1 = 2 * b + 3 * p;
  return { q: `Harga 2 buku dan 3 pensil adalah <b>${Rp(T1 * 1000)}</b>, sedangkan harga 1 buku dan 2 pensil adalah <b>${Rp(T2 * 1000)}</b>. Berapa harga satu buku?`, o: numOpts(b * 1000, [p * 1000, (b + 1) * 1000, (b - 1) * 1000, T2 * 500, (b + p) * 1000], Rp, 1000), exp: ST(`Misal buku = b dan pensil = p (dalam ribuan). 2b + 3p = ${T1} dan b + 2p = ${T2}.`, `Kalikan persamaan kedua dengan 2: 2b + 4p = ${2 * T2}`, `Kurangkan: (2b + 4p) ${MINUS} (2b + 3p) = ${2 * T2} ${MINUS} ${T1} → p = ${p}`, `Lalu b = ${T2} ${MINUS} 2 × ${p} = <b>${b}</b> → ${Rp(b * 1000)}`) + TIP('Eliminasi: samakan koefisien salah satu variabel, lalu kurangkan agar variabel itu hilang.') };
}
function smpPercent(d) {
  const goods = ['sepatu', 'tas', 'jaket', 'headphone', 'kemeja', 'jam tangan'];
  const it = pick(goods);
  if (d < 3) {
    const p = pick(d === 1 ? [10, 20, 25, 50] : [15, 30, 40, 35, 45]), price = R(1, 15) * (d === 1 ? 10000 : 20000), dc = price * p / 100;
    if (!Number.isInteger(dc)) return null;
    return { q: `Sebuah ${it} berharga <b>${Rp(price)}</b> mendapat diskon <b>${p}%</b>. Berapa yang harus dibayar?`, o: numOpts(price - dc, [dc, price + dc, price - dc * 2, price * (100 - p / 10) / 100], Rp, 1000), exp: ST(`Potongan harga = ${p}% × ${N(price)} = ${N(dc)}`, `Harga bayar = ${N(price)} ${MINUS} ${N(dc)} = <b>${Rp(price - dc)}</b>`) + TIP(`Cara cepat: bayar ${100 - p}% dari harga awal, yaitu ${N(price)} × ${(100 - p) / 100}.`) };
  }
  const pairs = [[20, 10], [10, 30], [25, 20], [20, 25], [30, 20]], [p1, p2] = pick(pairs), price = R(1, 5) * 100000;
  const final = price * (1 - p1 / 100) * (1 - p2 / 100);
  return { q: `Sebuah ${it} berharga <b>${Rp(price)}</b>. Toko memberi diskon <b>${p1}%</b>, lalu diskon tambahan <b>${p2}%</b> dari harga setelah diskon pertama. Berapa harga akhirnya?`, o: numOpts(final, [price * (1 - (p1 + p2) / 100), price * (p1 + p2) / 100, price * (1 - p1 / 100) - price * p2 / 100 * 0 - price * p2 / 100, price - final], Rp, 1000), exp: ST(`Diskon pertama ${p1}%: ${N(price)} × ${(100 - p1) / 100} = ${N(price * (100 - p1) / 100)}`, `Diskon kedua ${p2}% dari harga baru: ${N(price * (100 - p1) / 100)} × ${(100 - p2) / 100} = <b>${Rp(final)}</b>`) + TIP(`Diskon bertingkat ${p1}% + ${p2}% bukan ${p1 + p2}%! Diskon kedua dihitung dari harga yang sudah turun.`) };
}
function smpPercent2(d) {
  if (d === 2) {
    const b = R(2, 20) * 10000, p = pick([5, 10, 15, 20, 25, 30, 40]), nw = b * (100 + p) / 100;
    if (!Number.isInteger(nw)) return null;
    return { q: `Harga sebuah barang naik dari <b>${Rp(b)}</b> menjadi <b>${Rp(nw)}</b>. Berapa persen kenaikan harga tersebut?`, o: numOpts(p, [Math.round((nw - b) / nw * 1000) / 10, p * 2, p + 5, p - 5, (nw - b) / 1000], x => N(x, 1) + '%', 5), exp: ST(`Kenaikan = ${N(nw)} ${MINUS} ${N(b)} = ${N(nw - b)}`, `Persentase terhadap harga <b>awal</b>: ${N(nw - b)} ÷ ${N(b)} × 100% = <b>${p}%</b>`) + TIP('Persentase naik/turun selalu dihitung terhadap nilai awal.') };
  }
  const p = pick([10, 20, 25, 30, 40]), base = R(2, 10) * 50000, fin = base * (100 - p) / 100;
  if (!Number.isInteger(fin)) return null;
  return { q: `Setelah mendapat diskon <b>${p}%</b>, harga sebuah baju menjadi <b>${Rp(fin)}</b>. Berapa harga sebelum diskon?`, o: numOpts(base, [fin * (100 + p) / 100, fin + p * 1000, fin * 2, base + 10000], Rp, 10000), exp: ST(`Harga setelah diskon = ${100 - p}% dari harga awal.`, `${100 - p}% × harga awal = ${N(fin)}`, `harga awal = ${N(fin)} ÷ ${(100 - p) / 100} = <b>${Rp(base)}</b>`) + TIP(`Jebakan: menambahkan ${p}% ke harga akhir salah, karena ${p}% itu dari harga awal.`) };
}
function smpScale(d) {
  if (d === 1) {
    const e = pick([2, 3, 4, 6]), pp = e * R(2, 4), eg = pick([3, 4, 6, 8]) * 1, people = pp * R(2, 3), need = eg * people / pp;
    if (!Number.isInteger(need)) return null;
    return { q: `Resep kue untuk <b>${pp}</b> orang membutuhkan <b>${eg}</b> butir telur. Berapa butir telur untuk <b>${people}</b> orang?`, o: numOpts(need, [eg + (people - pp), eg * 2, need + 2, need - 2, people]), exp: ST(`Untuk 1 orang: ${eg} ÷ ${pp} = ${N(eg / pp)} butir`, `Untuk ${people} orang: ${N(eg / pp)} × ${people} = <b>${need}</b> butir`) + TIP('Perbandingan senilai: bila yang satu naik, yang lain ikut naik dengan perbandingan sama.') };
  }
  if (d === 2) {
    const k = pick([100000, 250000, 500000, 1000000]), c = R(2, 9), km = c * k / 100000;
    return { q: `Pada peta berskala <b>1 : ${N(k)}</b>, jarak dua kota adalah <b>${c} cm</b>. Berapa jarak sebenarnya (dalam km)?`, o: numOpts(km, [km * 10, km / 10, c * k, km * 100, km + c], x => N(x) + ' km', 1), exp: ST(`Jarak sebenarnya = ${c} × ${N(k)} = ${N(c * k)} cm`, `1 km = 100.000 cm, jadi ${N(c * k)} ÷ 100.000 = <b>${N(km)} km</b>`) + TIP('Dari cm ke km: bagi dengan 100.000 (sama dengan menghapus 5 nol).') };
  }
  const w1 = R(3, 8), days = R(4, 10) * 2, w2 = w1 * R(2, 3), nd = w1 * days / w2;
  if (!Number.isInteger(nd)) return null;
  return { q: `<b>${w1}</b> pekerja dapat menyelesaikan sebuah proyek dalam <b>${days}</b> hari. Berapa hari yang dibutuhkan jika ada <b>${w2}</b> pekerja (kecepatan sama)?`, o: numOpts(nd, [days * w2 / w1, days - (w2 - w1), days + w2 - w1, nd + 2, w2 - w1]), exp: ST(`Total pekerjaan = ${w1} × ${days} = ${w1 * days} (pekerja-hari)`, `Dengan ${w2} pekerja: ${w1 * days} ÷ ${w2} = <b>${nd} hari</b>`) + TIP('Perbandingan berbalik nilai: pekerja bertambah, waktu justru berkurang.') };
}
function smpPyth(d) {
  const lab = (a, b, c) => ({ a: a + ' cm', b: b + ' cm', c });
  if (d === 1) {
    const [a, b, c] = pick(TRIPLES.slice(0, 2)), k = R(1, 3), A = a * k, B = b * k, C = c * k;
    return { q: 'Berapa panjang sisi miring segitiga siku-siku berikut?', viz: svgRightTri({ a: A + ' cm', b: B + ' cm', c: '?' }, { a: A, b: B }), o: numOpts(C, [A + B, A * A + B * B, B - A, C + 1, C - 1]), exp: ST(`Pythagoras: sisi miring² = ${A}² + ${B}²`, `= ${A * A} + ${B * B} = ${A * A + B * B}`, `Sisi miring = √${A * A + B * B} = <b>${C} cm</b>`) + TIP('Tripel Pythagoras yang sering muncul: 3-4-5, 5-12-13, 8-15-17, beserta kelipatannya.') };
  }
  if (d === 2) {
    const [a, b, c] = pick(TRIPLES), k = a <= 9 ? R(1, 3) : 1, A = a * k, B = b * k, C = c * k;
    const h = rnd() < 0.5;
    return { q: 'Berapa panjang sisi yang ditandai tanda tanya?', viz: svgRightTri(h ? { a: A + ' cm', b: '?', c: C + ' cm' } : { a: '?', b: B + ' cm', c: C + ' cm' }, { a: A, b: B }), o: numOpts(h ? B : A, [C - (h ? A : B), C + (h ? A : B), C * C - (h ? A * A : B * B), (h ? A : B) + 2, Math.round((C * C + (h ? A * A : B * B)) ** 0.5)]), exp: ST(`Sisi miring (${C}) adalah sisi terpanjang.`, `Sisi tegak² = ${C}² ${MINUS} ${h ? A : B}² = ${C * C} ${MINUS} ${(h ? A : B) ** 2} = ${C * C - (h ? A : B) ** 2}`, `Panjangnya = √${C * C - (h ? A : B) ** 2} = <b>${h ? B : A} cm</b>`) + TIP('Kalau yang dicari bukan sisi miring, kurangkan. Kalau sisi miring, jumlahkan.') };
  }
  const a = R(2, 8), b = R(2, 8); if (a === b) return null;
  const s = a * a + b * b;
  return { q: 'Panjang kedua sisi siku-siku adalah ' + a + ' cm dan ' + b + ' cm. Berapa panjang sisi miring (bentuk akar paling sederhana)?', viz: svgRightTri({ a: a + ' cm', b: b + ' cm', c: '?' }, { a, b }), o: opts(sqrtForm(s) + ' cm', [rt(a + b) + ' cm', N(s) + ' cm', sqrtForm(Math.abs(a * a - b * b)) + ' cm', (a + b) + ' cm', rt(s + 1) + ' cm'], () => sqrtForm(s + R(1, 9)) + ' cm'), exp: ST(`Sisi miring² = ${a}² + ${b}² = ${s}`, `Sisi miring = √${s}`, `Sederhanakan: <b>${sqrtForm(s)} cm</b>`) + TIP('Setelah akar, sederhanakan dengan mencari faktor kuadrat sempurna: √50 = √(25×2) = 5√2.') };
}
function smpPythStory(d) {
  const [a, b, c] = pick(TRIPLES.slice(0, 4)), k = a <= 9 ? pick([1, 2]) : 1, A = a * k, B = b * k, C = c * k;
  const t = pick(['tangga', 'lapangan', 'jalan']);
  if (t === 'tangga') return { q: `Sebuah tangga sepanjang <b>${C} m</b> disandarkan pada dinding. Kaki tangga berjarak <b>${A} m</b> dari dinding. Berapa tinggi ujung tangga dari tanah?`, o: numOpts(B, [C - A, C + A, A + 2, B + 1, B - 1]), exp: ST('Tangga, tanah, dan dinding membentuk segitiga siku-siku. Tangga adalah sisi miringnya.', `Tinggi² = ${C}² ${MINUS} ${A}² = ${C * C - A * A}`, `Tinggi = √${C * C - A * A} = <b>${B} m</b>`) + TIP('Gambar dulu sketsa soal ceritanya. Tentukan mana sisi miring (yang berhadapan dengan sudut siku-siku).') };
  if (t === 'lapangan') return { q: `Sebuah lapangan berbentuk persegi panjang berukuran <b>${A} m × ${B} m</b>. Berapa panjang diagonal lapangan itu?`, o: numOpts(C, [A + B, A * A + B * B, B - A, C + 2, C - 2]), exp: ST('Diagonal membagi persegi panjang menjadi dua segitiga siku-siku.', `Diagonal² = ${A}² + ${B}² = ${A * A + B * B}`, `Diagonal = <b>${C} m</b>`) + TIP('Berjalan menyilang lebih hemat daripada mengitari sisi: ' + C + ' m vs ' + (A + B) + ' m.') };
  return { q: `Dari rumah, Budi berjalan <b>${A} km</b> ke utara, lalu <b>${B} km</b> ke timur. Berapa jarak lurus Budi dari rumah?`, o: numOpts(C, [A + B, B - A, A * A + B * B, C + 1, C - 1]), exp: ST('Arah utara dan timur saling tegak lurus.', `Jarak² = ${A}² + ${B}² = ${A * A + B * B}`, `Jarak = <b>${C} km</b>`) + TIP('Dua arah yang tegak lurus selalu membentuk sudut siku-siku.') };
}
function classifyTri(a, b, c) {
  const t = [a, b, c].sort((x, y) => x - y);
  if (t[0] + t[1] <= t[2]) return 'tidak dapat membentuk segitiga';
  const x = t[0] * t[0] + t[1] * t[1], m = t[2] * t[2];
  return x === m ? 'siku-siku' : x > m ? 'lancip' : 'tumpul';
}
function smpTriType(d) {
  const types = ['siku-siku', 'lancip', 'tumpul', 'tidak dapat membentuk segitiga'];
  const want = d === 2 ? pick(types.slice(0, 3)) : pick(types); let a, b, c, g = 0;
  if (want === 'siku-siku') { const k = pick([1, 2]); [a, b, c] = pick(TRIPLES.slice(0, 4)).map(x => x * k); }
  else { for (; g < 600; g++) { a = R(3, 12); b = R(3, 12); c = R(3, a + b + 3); if (classify(a, b, c) === want) break; } if (g >= 600) return null; }
  function classify(x, y, z) { return classifyTri(x, y, z); }
  const sd = shuffle([a, b, c]), t = [a, b, c].sort((x, y) => x - y), x2 = t[0] ** 2 + t[1] ** 2, m2 = t[2] ** 2;
  const st = want === 'tidak dapat membentuk segitiga'
    ? [`Syarat segitiga: dua sisi terpendek harus lebih panjang dari sisi terpanjang.`, `${t[0]} + ${t[1]} = ${t[0] + t[1]}, sedangkan sisi terpanjang ${t[2]}.`, `${t[0] + t[1]} tidak lebih besar dari ${t[2]}, jadi <b>tidak dapat membentuk segitiga</b>.`]
    : [`Sisi terpanjang = ${t[2]}, kuadratnya ${m2}.`, `Jumlah kuadrat dua sisi lain: ${t[0]}\u00B2 + ${t[1]}\u00B2 = ${x2}.`, x2 === m2 ? `${x2} = ${m2} \u2192 <b>siku-siku</b>` : x2 > m2 ? `${x2} > ${m2} \u2192 <b>lancip</b>` : `${x2} < ${m2} \u2192 <b>tumpul</b>`];
  const ops = shuffle(types);
  return { q: `Sebuah segitiga memiliki sisi-sisi <b>${sd.join(' cm, ')} cm</b>. Segitiga tersebut adalah \u2026`, o: { opts: ops, ans: ops.indexOf(want) }, exp: ST(st) + TIP('Jumlah kuadrat dua sisi pendek: sama dengan kuadrat sisi panjang \u2192 siku-siku, lebih besar \u2192 lancip, lebih kecil \u2192 tumpul.') };
}
function smpCircle(d) {
  const use227 = d !== 2, r = use227 ? 7 * R(1, 4) : pick([5, 10, 15, 20, 25, 30]), pi = use227 ? 22 / 7 : 3.14;
  const piTxt = use227 ? fr(22, 7) : '3,14', dia = d >= 2 && rnd() < 0.5, ask = rnd() < 0.5 ? 'keliling' : 'luas';
  const v = ask === 'keliling' ? 2 * pi * r : pi * r * r;
  const given = dia ? 2 * r : r, wrong = ask === 'keliling' ? [pi * r, 2 * pi * r * r, pi * given * 2, pi * r * r] : [2 * pi * r, pi * given * given, pi * r, pi * given];
  const lab = dia ? 'd = ' + given + ' cm' : 'r = ' + given + ' cm';
  return {
    q: `Gunakan \u03C0 = ${piTxt}. Berapa <b>${ask}</b> lingkaran berikut?`, viz: svgCircle({ mode: dia ? 'diameter' : 'radius', label: lab }),
    o: numOpts(v, wrong, x => N(x, 2) + (ask === 'luas' ? ' cm\u00B2' : ' cm'), 2),
    exp: ST(dia ? `Diameter ${given} cm, maka jari-jari r = ${given} \u00F7 2 = <b>${r} cm</b>` : `Jari-jari r = ${r} cm`, ask === 'keliling' ? `Keliling = 2 \u00D7 \u03C0 \u00D7 r = 2 \u00D7 ${piTxt} \u00D7 ${r}` : `Luas = \u03C0 \u00D7 r\u00B2 = ${piTxt} \u00D7 ${r} \u00D7 ${r}`, `= <b>${N(v, 2)} ${ask === 'luas' ? 'cm\u00B2' : 'cm'}</b>`) + TIP('Pakai \u03C0 = 22/7 bila jari-jari kelipatan 7, dan 3,14 bila jari-jarinya kelipatan 10. Awas: jangan lupa membagi diameter menjadi dua!')
  };
}
function smpSector(d) {
  const r = pick([7, 14]), th = pick([45, 90, 135, 180, 270]), ask = rnd() < 0.5 ? 'luas juring' : 'panjang busur';
  const v = ask === 'luas juring' ? 22 / 7 * r * r * th / 360 : 2 * 22 / 7 * r * th / 360;
  const full = ask === 'luas juring' ? 22 / 7 * r * r : 2 * 22 / 7 * r;
  return {
    q: `Gunakan \u03C0 = ${fr(22, 7)}. Sebuah lingkaran berjari-jari ${r} cm. Berapa <b>${ask}</b> dengan sudut pusat <b>${th}\u00B0</b>?`, viz: svgCircle({ mode: 'sector', label: r + ' cm', angle: th }),
    o: numOpts(v, [full, v * 2, full * (360 - th) / 360, (ask === 'luas juring' ? 2 * 22 / 7 * r : 22 / 7 * r * r) * th / 360], x => N(x, 2) + (ask === 'luas juring' ? ' cm\u00B2' : ' cm'), 2),
    exp: ST(`Perbandingan juring dengan lingkaran penuh: ${th}\u00B0 / 360\u00B0 = ${frs(th, 360)}`, ask === 'luas juring' ? `Luas lingkaran = \u03C0r\u00B2 = ${N(full, 2)} cm\u00B2` : `Keliling lingkaran = 2\u03C0r = ${N(full, 2)} cm`, `${ask[0].toUpperCase() + ask.slice(1)} = ${frs(th, 360)} \u00D7 ${N(full, 2)} = <b>${N(v, 2)}</b>`) + TIP('Juring adalah "irisan pizza". Cari dulu seberapa besar irisannya dari seluruh lingkaran.')
  };
}
function smpWheel(d) {
  const k = pick([5, 10, 20]), dia = 7 * k, C = 22 * k, n = R(5, 40), dist = C * n / 100;
  return { q: `Roda sepeda berdiameter <b>${dia} cm</b> (\u03C0 = ${fr(22, 7)}). Berapa kali roda itu berputar penuh untuk menempuh jarak <b>${N(dist)} m</b>?`, o: numOpts(n, [n * 2, Math.round(n / 2), n + 5, n - 3, dist]), exp: ST(`Keliling roda = \u03C0 \u00D7 d = ${fr(22, 7)} \u00D7 ${dia} = ${C} cm`, `Jarak = ${N(dist)} m = ${N(C * n)} cm`, `Banyak putaran = ${N(C * n)} \u00F7 ${C} = <b>${n}</b>`) + TIP('Satu putaran roda = satu kali keliling. Samakan dulu satuan (cm atau m) sebelum membagi.') };
}
function smpStat(d) {
  if (d === 1) {
    const m = R(60, 90); let dv, g = 0; do { dv = Array.from({ length: 4 }, () => R(-12, 12)); dv.push(-dv.reduce((x, y) => x + y)); g++; } while (Math.abs(dv[4]) > 15 && g < 50);
    const data = dv.map(x => m + x), sum = data.reduce((x, y) => x + y);
    return { q: 'Nilai ulangan matematika lima siswa ditunjukkan diagram berikut. Berapa nilai rata-ratanya?', viz: svgBars(data, { names: ['A', 'B', 'C', 'D', 'E'] }), o: numOpts(m, [Math.max(...data), [...data].sort((a, b) => a - b)[2] + 1, sum / 4, m + 3, m - 3]), ev: svgBars(data, { names: ['A', 'B', 'C', 'D', 'E'], mean: m }), exp: ST(`Jumlahkan semua nilai: ${data.join(' + ')} = ${sum}`, `Bagi dengan banyak data: ${sum} \u00F7 5 = <b>${m}</b>`) + TIP('Rata-rata = jumlah seluruh data \u00F7 banyak data.') };
  }
  if (d === 2) {
    const data = Array.from({ length: 7 }, () => R(2, 12)), s = [...data].sort((a, b) => a - b), med = s[3], mean = data.reduce((x, y) => x + y) / 7;
    return { q: `Median dari data: <b>${data.join(', ')}</b> adalah \u2026`, o: numOpts(med, [data[3], Math.round(mean), s[2], s[4], s[3] + 1].filter(x => x !== med)), exp: ST(`Urutkan dari terkecil: ${s.join(', ')}`, `Ada 7 data, nilai tengahnya adalah data ke-4.`, `Median = <b>${med}</b>`) + TIP('Median harus dicari setelah data diurutkan. Mengambil data tengah dari data acak adalah jebakan umum.') };
  }
  const n = R(4, 6), m = R(70, 85), t = m + R(1, 4), x = t * (n + 1) - m * n; if (x > 100) return null;
  return { q: `Rata-rata <b>${n}</b> nilai ulangan Rani adalah <b>${m}</b>. Berapa nilai ulangan berikutnya agar rata-ratanya menjadi <b>${t}</b>?`, o: numOpts(x, [t, t + (t - m), x - n, x + n, m + (t - m) * 2]), exp: ST(`Jumlah ${n} nilai pertama = ${n} \u00D7 ${m} = ${n * m}`, `Jumlah yang dibutuhkan untuk ${n + 1} nilai = ${n + 1} \u00D7 ${t} = ${(n + 1) * t}`, `Nilai berikutnya = ${(n + 1) * t} ${MINUS} ${n * m} = <b>${x}</b>`) + TIP('Pakai jumlah total, bukan rata-ratanya: rata-rata \u00D7 banyak data = jumlah data.') };
}
function smpProb(d) {
  let q, fav, tot, why;
  if (d === 1) {
    const t = pick(['prima', 'ganjil', 'lebih4', 'merah']);
    if (t === 'prima') { q = 'Sebuah dadu dilempar satu kali. Peluang muncul mata dadu <b>prima</b> adalah \u2026'; fav = 3; tot = 6; why = 'Mata dadu prima: 2, 3, 5 \u2192 ada 3 dari 6.'; }
    else if (t === 'ganjil') { q = 'Sebuah dadu dilempar satu kali. Peluang muncul mata dadu <b>ganjil</b> adalah \u2026'; fav = 3; tot = 6; why = 'Mata dadu ganjil: 1, 3, 5 \u2192 ada 3 dari 6.'; }
    else if (t === 'lebih4') { q = 'Sebuah dadu dilempar satu kali. Peluang muncul mata dadu <b>lebih dari 4</b> adalah \u2026'; fav = 2; tot = 6; why = 'Mata dadu lebih dari 4: 5 dan 6 \u2192 ada 2 dari 6.'; }
    else { const r = R(2, 8), b = R(2, 8), h = R(1, 5); fav = r; tot = r + b + h; q = `Dalam kantong ada ${r} kelereng merah, ${b} biru, dan ${h} hijau. Satu kelereng diambil acak. Peluang terambil kelereng <b>merah</b> adalah \u2026`; why = `Kelereng merah ada ${r}, seluruhnya ${r}+${b}+${h} = ${tot}.`; }
  } else if (d === 2) {
    const t = pick(['dua', 'satu', 'bukan', 'kelip']);
    if (t === 'dua') { q = 'Dua koin dilempar bersamaan. Peluang <b>keduanya muncul angka</b> adalah \u2026'; fav = 1; tot = 4; why = 'Ruang sampel: AA, AG, GA, GG (4 kemungkinan). Yang diminta hanya AA.'; }
    else if (t === 'satu') { q = 'Dua koin dilempar bersamaan. Peluang muncul <b>tepat satu angka</b> adalah \u2026'; fav = 2; tot = 4; why = 'Ruang sampel: AA, AG, GA, GG. Tepat satu angka: AG dan GA.'; }
    else if (t === 'bukan') { const r = R(3, 9), b = R(2, 7), h = R(2, 6); tot = r + b + h; fav = tot - b; q = `Dalam kotak ada ${r} bola merah, ${b} biru, dan ${h} kuning. Peluang terambil bola <b>bukan biru</b> adalah \u2026`; why = `Bukan biru = ${r} + ${h} = ${fav} dari ${tot}.`; }
    else { const k = pick([2, 3, 4, 5, 6, 7]), n = pick([20, 24, 30]); fav = Math.floor(n / k); tot = n; q = `Sebuah kartu diambil acak dari kartu bernomor 1 sampai ${n}. Peluang terambil kartu <b>kelipatan ${k}</b> adalah \u2026`; why = `Kelipatan ${k} sampai ${n}: ada ${fav} bilangan.`; }
  } else {
    const t = pick(['sum7', 'sum8', 'ge10', 'tanpa']);
    if (t === 'tanpa') { const r = R(3, 7), b = R(2, 6); tot = (r + b) * (r + b - 1); fav = r * (r - 1); q = `Dalam kantong ada ${r} kelereng merah dan ${b} biru. Dua kelereng diambil berturut-turut <b>tanpa pengembalian</b>. Peluang keduanya merah adalah \u2026`; why = `Pengambilan 1: ${r}/${r + b}. Pengambilan 2: ${r - 1}/${r + b - 1}. Kalikan: ${r * (r - 1)}/${tot}.`; }
    else { let c = 0; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) { const s = i + j; if (t === 'sum7' ? s === 7 : t === 'sum8' ? s === 8 : s >= 10) c++; } fav = c; tot = 36; q = `Dua dadu dilempar bersamaan. Peluang jumlah kedua mata dadu ${t === 'sum7' ? '<b>sama dengan 7</b>' : t === 'sum8' ? '<b>sama dengan 8</b>' : '<b>paling sedikit 10</b>'} adalah \u2026`; why = `Dua dadu punya 6 \u00D7 6 = 36 kemungkinan. Pasangan yang memenuhi ada ${c}.`; }
  }
  const ans = frs(fav, tot);
  return { q, o: opts(ans, [frs(tot - fav, tot), frs(fav, tot - fav), frs(fav + 1, tot), frs(fav, tot + 2), frs(1, tot)], () => frs(R(1, tot), tot + R(0, 2))), exp: ST(why, `Peluang = banyak yang diinginkan \u00F7 banyak seluruh kemungkinan = ${fr(fav, tot)}${gcd(fav, tot) > 1 ? ' = <b>' + ans + '</b>' : ''}`) + TIP('Peluang selalu antara 0 dan 1. Jika hasilmu lebih besar dari 1, ada yang keliru.') };
}
function smpExp(d) {
  const t = pick(['koin', 'dadu', 'hujan']);
  if (t === 'koin') { const n = pick([40, 60, 80, 100, 120]); return { q: `Sebuah koin dilempar sebanyak <b>${n}</b> kali. Frekuensi harapan muncul sisi angka adalah \u2026`, o: numOpts(n / 2, [n, n / 4, n / 2 + 5, n / 2 - 5, 2 * n]), exp: ST(`Peluang angka = ${fr(1, 2)}`, `Frekuensi harapan = peluang \u00D7 banyak percobaan = ${fr(1, 2)} \u00D7 ${n} = <b>${n / 2}</b>`) + TIP('Frekuensi harapan adalah perkiraan rata-rata, bukan jaminan hasil pasti.') }; }
  if (t === 'dadu') { const n = pick([60, 90, 120, 180]); return { q: `Sebuah dadu dilempar sebanyak <b>${n}</b> kali. Harapan muncul mata dadu <b>6</b> adalah \u2026 kali`, o: numOpts(n / 6, [n / 3, n / 2, n - n / 6, n / 6 + 5, n / 12]), exp: ST(`Peluang mata 6 = ${fr(1, 6)}`, `${fr(1, 6)} \u00D7 ${n} = <b>${n / 6}</b>`) + TIP('Frekuensi harapan = peluang \u00D7 banyak percobaan.') }; }
  const p = pick([10, 20, 25, 30, 40]), days = pick([20, 30, 40, 60]); const v = p * days / 100; if (!Number.isInteger(v)) return null;
  return { q: `Peluang hujan setiap hari dalam sebulan adalah <b>${p}%</b>. Dalam <b>${days}</b> hari, diperkirakan hujan turun sebanyak \u2026 hari`, o: numOpts(v, [days - v, p, v * 2, v + 3, v - 2]), exp: ST(`${p}% = ${fr(p, 100)}`, `${p}% \u00D7 ${days} = <b>${v}</b> hari`) + TIP('Ubah persen menjadi pecahan atau desimal dulu sebelum mengalikan.') };
}

TOPICS.smp = [
  { id: 'bilangan', name: 'Bilangan & Operasi', glyph: '\u00B1', desc: 'Bilangan negatif, urutan operasi, serta KPK dan FPB.', gens: [G(1, smpInt), G(1, smpOps), G(2, smpFpbKpk)] },
  { id: 'aljabar', name: 'Aljabar', glyph: 'x', desc: 'Persamaan linear, bentuk aljabar, dan soal cerita.', gens: [G(1, smpLinear), G(1, smpAlg), G(2, smpWord)] },
  { id: 'persen', name: 'Persen & Perbandingan', glyph: '%', desc: 'Diskon bertingkat, skala peta, dan perbandingan.', gens: [G(1, smpPercent), G(2, smpPercent2), G(1, smpScale)] },
  { id: 'pythagoras', name: 'Pythagoras', glyph: '\u221A', desc: 'Sisi miring, tangga, dan jenis segitiga.', gens: [G(1, smpPyth), G(1, smpPythStory), G(2, smpTriType)] },
  { id: 'lingkaran', name: 'Lingkaran', glyph: '\u25CB', desc: 'Keliling, luas, juring, dan roda yang berputar.', gens: [G(1, smpCircle), G(2, smpWheel), G(3, smpSector)] },
  { id: 'data', name: 'Data & Peluang', glyph: '\u03BC', desc: 'Rata-rata, median, peluang, dan frekuensi harapan.', gens: [G(1, smpStat), G(1, smpProb), G(2, smpExp)] }
];
