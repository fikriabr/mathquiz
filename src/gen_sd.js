'use strict';
/* ====== SD ====== */
const NAMES = ['Budi', 'Sari', 'Rani', 'Dito', 'Maya', 'Andi', 'Putri', 'Raka', 'Nadia', 'Bima', 'Lina', 'Fajar', 'Tika', 'Joko', 'Ayu', 'Dimas'];
const THINGS = () => [tr('kelereng', 'marbles'), tr('stiker', 'stickers'), tr('kartu bergambar', 'picture cards'), tr('buku cerita', 'storybooks'), tr('pensil warna', 'colored pencils'), tr('apel', 'apples'), tr('kue', 'cakes'), tr('balon', 'balloons'), tr('permen', 'candies'), tr('kancing', 'buttons')];
const nm = () => pick(NAMES);

function sdAdd(d) {
  const n = nm(), it = pick(THINGS());
  const [lo, hi] = d === 1 ? [11, 49] : d === 2 ? [120, 899] : [1200, 6999];
  const a = R(lo, hi), b = R(lo, hi), s = a + b;
  return {
    q: pick([
      tr(`${n} punya <b>${N(a)}</b> ${it}. Lalu ${n} menerima <b>${N(b)}</b> ${it} lagi dari teman-temannya. Berapa ${it} ${n} sekarang?`, `${n} has <b>${N(a)}</b> ${it}. Then ${n} receives <b>${N(b)}</b> more ${it} from friends. How many ${it} does ${n} have now?`),
      tr(`Kemarin ${n} mengumpulkan <b>${N(a)}</b> ${it}, hari ini <b>${N(b)}</b> ${it} lagi. Berapa seluruh ${it} yang sudah ${n} kumpulkan?`, `Yesterday ${n} collected <b>${N(a)}</b> ${it}, and today <b>${N(b)}</b> more. How many ${it} has ${n} collected altogether?`),
      tr(`Kelas 4A memiliki <b>${N(a)}</b> ${it} dan kelas 4B memiliki <b>${N(b)}</b> ${it}. Berapa jumlah ${it} kedua kelas itu?`, `Class 4A has <b>${N(a)}</b> ${it} and Class 4B has <b>${N(b)}</b> ${it}. How many ${it} do the two classes have together?`),
      tr(`Sebuah toko menerima kiriman <b>${N(a)}</b> ${it} pada pagi hari dan <b>${N(b)}</b> ${it} pada sore hari. Berapa ${it} yang diterima toko hari itu?`, `A shop receives <b>${N(a)}</b> ${it} in the morning and <b>${N(b)}</b> ${it} in the afternoon. How many ${it} does the shop receive that day?`),
      tr(`Dua kotak berisi <b>${N(a)}</b> ${it} dan <b>${N(b)}</b> ${it}. Jika isinya digabung, berapa ${it} sekarang?`, `Two boxes contain <b>${N(a)}</b> ${it} and <b>${N(b)}</b> ${it}. If they are combined, how many ${it} are there?`)
    ]),
    o: numOpts(s, [dw(a, b, (x, y) => (x + y) % 10), s + 10, s - 10, s + 100, s - 100, Math.abs(a - b)], N, 10),
    exp: ST(addSteps(a, b)) + TIP('Kalau satu kolom hasilnya lebih dari 9, simpan puluhannya dan tambahkan ke kolom di sebelah kiri.', 'If a column adds up to more than 9, carry the tens over to the column on its left.')
  };
}
function sdSub(d) {
  const n = nm(), it = pick(THINGS());
  let a, b;
  if (d === 1) { a = R(30, 99); b = R(11, a - 5); } else if (d === 2) { a = R(300, 999); b = R(120, a - 60); } else { a = R(2000, 9999); b = R(1100, a - 500); }
  const s = a - b;
  const tpl = pick([
    tr(`${n} membawa <b>${N(a)}</b> ${it} ke sekolah. Sebanyak <b>${N(b)}</b> ${it} diberikan kepada adik. Berapa sisanya?`, `${n} brings <b>${N(a)}</b> ${it} to school. <b>${N(b)}</b> ${it} are given to a younger sibling. How many are left?`),
    tr(`Di toko ada <b>${N(a)}</b> ${it}. Hari ini terjual <b>${N(b)}</b>. Berapa ${it} yang masih tersisa?`, `A shop has <b>${N(a)}</b> ${it}. Today <b>${N(b)}</b> were sold. How many ${it} are still left?`),
    tr(`${n} memiliki <b>${N(a)}</b> ${it}. Sebanyak <b>${N(b)}</b> ${it} hilang. Berapa ${it} yang tersisa?`, `${n} has <b>${N(a)}</b> ${it}. <b>${N(b)}</b> ${it} get lost. How many ${it} are left?`),
    tr(`Sebuah gudang menyimpan <b>${N(a)}</b> ${it}. Setelah <b>${N(b)}</b> ${it} dikirim ke toko, berapa ${it} yang masih ada di gudang?`, `A warehouse stores <b>${N(a)}</b> ${it}. After <b>${N(b)}</b> ${it} are sent to a shop, how many ${it} remain in the warehouse?`),
    tr(`Dari <b>${N(a)}</b> ${it} milik kelas, <b>${N(b)}</b> sudah dipakai. Berapa ${it} yang belum dipakai?`, `Of the class's <b>${N(a)}</b> ${it}, <b>${N(b)}</b> have been used. How many ${it} have not been used?`)
  ]);
  return {
    q: tpl,
    o: numOpts(s, [a + b, dw(a, b, (x, y) => Math.abs(x - y)), s + 10, s - 10, s + 100, s - 100], N, 10),
    exp: ST(subSteps(a, b)) + TIP(`Hasil pengurangan bisa dicek dengan menjumlahkan lagi: ${N(s)} + ${N(b)} = ${N(a)}.`, `You can check a subtraction by adding back: ${N(s)} + ${N(b)} = ${N(a)}.`)
  };
}
const FOODS = () => [[tr('bakso', 'meatball soup'), 12000], [tr('mie ayam', 'chicken noodles'), 10000], [tr('nasi goreng', 'fried rice'), 15000], [tr('es teh', 'iced tea'), 4000], [tr('gorengan', 'fried snacks'), 2000], [tr('jus jeruk', 'orange juice'), 8000], [tr('roti bakar', 'toast'), 9000], [tr('pisang goreng', 'fried bananas'), 5000]];
function sdMoney(d) {
  const n = nm(); const [A, B] = shuffle(FOODS()).slice(0, 2);
  const qa = d === 1 ? 1 : R(1, 3), qb = d === 1 ? 1 : R(1, d === 2 ? 2 : 4);
  const ta = A[1] * qa, tb = B[1] * qb, total = ta + tb;
  const pay = [20000, 50000, 100000].find(x => x >= total + 1000);
  const ch = pay - total;
  return {
    q: tr(`${n} membeli ${qa} porsi ${A[0]} (@${Rp(A[1])}) dan ${qb} porsi ${B[0]} (@${Rp(B[1])}). ${n} membayar dengan uang ${Rp(pay)}. Berapa uang kembaliannya?`, `${n} buys ${qa} portions of ${A[0]} (@${Rp(A[1])}) and ${qb} portions of ${B[0]} (@${Rp(B[1])}). ${n} pays with ${Rp(pay)}. How much is the change?`),
    o: numOpts(ch, [total, pay - ta, pay - tb, ch + 1000, ch - 1000, ch + 2000], Rp, 1000),
    exp: ST(`${A[0][0].toUpperCase() + A[0].slice(1)}: ${qa} × ${N(A[1])} = ${N(ta)}`, `${B[0][0].toUpperCase() + B[0].slice(1)}: ${qb} × ${N(B[1])} = ${N(tb)}`, tr(`Total belanja: ${N(ta)} + ${N(tb)} = ${N(total)}`, `Total bill: ${N(ta)} + ${N(tb)} = ${N(total)}`), tr(`Kembalian: ${N(pay)} ${MINUS} ${N(total)} = <b>${Rp(ch)}</b>`, `Change: ${N(pay)} ${MINUS} ${N(total)} = <b>${Rp(ch)}</b>`)) + TIP('Uang kembalian = uang yang dibayar dikurangi total belanja. Jangan lupa menghitung semua barang!', 'Change = money paid minus the total bill. Do not forget to count every item!')
  };
}
function mulSteps(x, y) {
  const big = y >= 10 ? x : y, dec = y >= 10 ? y : x; const parts = pv(dec).filter(v => v > 0); const prods = parts.map(v => v * big);
  return [tr(`Pecah ${N(dec)} menjadi ${parts.map(N).join(' + ')}`, `Split ${N(dec)} into ${parts.map(N).join(' + ')}`), ...parts.map((v, i) => `${N(v)} × ${N(big)} = ${N(prods[i])}`), tr(`Jumlahkan: ${prods.map(N).join(' + ')} = <b>${N(x * y)}</b>`, `Add them up: ${prods.map(N).join(' + ')} = <b>${N(x * y)}</b>`)];
}
function sdMul(d) {
  const it = pick(THINGS()), [uI, uE] = pick([['kotak', 'boxes'], ['kantong', 'bags'], ['rak', 'shelves'], ['toples', 'jars']]), fr3 = pick([0, 1, 2]); let g, p;
  if (d === 1) { g = R(2, 9); p = R(2, 9); } else if (d === 2) { g = R(3, 9); p = R(12, 48); } else { g = R(11, 29); p = R(21, 59); }
  const v = g * p;
  const ev = d === 1 ? `<div class="viz small">${svgDots(g, p)}</div>` : '';
  return {
    q: [
      tr(`Ada <b>${g}</b> ${uI} ${it}. Setiap ${uI} berisi <b>${p}</b> ${it}. Berapa jumlah ${it} seluruhnya?`, `There are <b>${g}</b> ${uE} of ${it}. Each holds <b>${p}</b> ${it}. How many ${it} are there in total?`),
      tr(`Seorang penjual menata <b>${g}</b> ${uI} ${it}. Tiap ${uI} memuat <b>${p}</b> ${it}. Berapa ${it} yang ditata penjual itu?`, `A seller arranges <b>${g}</b> ${uE} of ${it}. Each one holds <b>${p}</b> ${it}. How many ${it} did the seller arrange?`),
      tr(`Bu Guru menyiapkan <b>${g}</b> ${uI} ${it} untuk hadiah. Di setiap ${uI} ada <b>${p}</b> ${it}. Berapa seluruh ${it} yang disiapkan Bu Guru?`, `The teacher prepares <b>${g}</b> ${uE} of ${it} as prizes. Each one contains <b>${p}</b> ${it}. How many ${it} did the teacher prepare in all?`)
    ][fr3],
    o: numOpts(v, [g + p, v + g, v - p, v + 10, v - 10, v + p], N, 1),
    ev,
    exp: ST(d === 1 ? [tr(`${g} ${uI} × ${p} ${it} = ${g} × ${p}`, `${g} ${uE} × ${p} ${it} = ${g} × ${p}`), tr(`Lihat kumpulan titik di bawah: ${g} baris, tiap baris ${p} titik.`, `Look at the dots below: ${g} rows with ${p} dots in each row.`), `${g} × ${p} = <b>${v}</b>`] : [tr(`Jumlah seluruhnya = ${g} × ${p}`, `Total = ${g} × ${p}`), ...mulSteps(g, p)]) + TIP(d === 1 ? tr(`Perkalian adalah penjumlahan berulang: ${Array(g).fill(p).join(' + ')} = ${v}.`, `Multiplication is repeated addition: ${Array(g).fill(p).join(' + ')} = ${v}.`) : tr('Memecah bilangan besar menjadi puluhan dan satuan membuat perkalian lebih mudah dihitung dalam kepala.', 'Splitting a big number into tens and ones makes multiplication easier to do in your head.'))
  };
}
function sdDiv(d) {
  const it = pick(THINGS()), fr4 = pick([0, 1, 2, 3]); let k, c;
  if (d === 1) { c = R(2, 5); k = R(2, 9); } else if (d === 2) { c = R(3, 9); k = R(12, 25); } else { c = R(6, 12); k = R(15, 40); }
  const total = c * k;
  return {
    q: [
      tr(`<b>${N(total)}</b> ${it} dibagi rata kepada <b>${c}</b> anak. Berapa ${it} yang diterima setiap anak?`, `<b>${N(total)}</b> ${it} are shared equally among <b>${c}</b> children. How many ${it} does each child get?`),
      tr(`Ibu memasukkan <b>${N(total)}</b> ${it} ke dalam <b>${c}</b> kantong sama banyak. Berapa ${it} di setiap kantong?`, `Mom puts <b>${N(total)}</b> ${it} equally into <b>${c}</b> bags. How many ${it} are in each bag?`),
      tr(`<b>${N(total)}</b> ${it} disusun dalam <b>${c}</b> baris yang sama banyak. Berapa ${it} dalam tiap baris?`, `<b>${N(total)}</b> ${it} are arranged in <b>${c}</b> equal rows. How many ${it} are in each row?`),
      tr(`Guru membagikan <b>${N(total)}</b> ${it} secara adil kepada <b>${c}</b> kelompok. Berapa ${it} yang diterima tiap kelompok?`, `The teacher fairly hands out <b>${N(total)}</b> ${it} to <b>${c}</b> groups. How many ${it} does each group get?`)
    ][fr4],
    o: numOpts(k, [k + 1, k - 1, total - c, c, k + 10, k - 10], N, 1),
    exp: ST(tr(`Bagi rata berarti pembagian. Cari bilangan yang jika dikali ${c} hasilnya ${N(total)}.`, `Sharing equally means division. Find the number that gives ${N(total)} when multiplied by ${c}.`), `${c} × ${k} = ${N(total)}`, tr(`Jadi ${N(total)} ÷ ${c} = <b>${k}</b>`, `So ${N(total)} ÷ ${c} = <b>${k}</b>`)) + TIP('Pembagian adalah kebalikan perkalian. Kalau lupa hasil bagi, tebak lalu periksa dengan mengalikan.', 'Division is the opposite of multiplication. If you forget the answer, guess and check by multiplying.')
  };
}
function sdCeil(d) {
  const n = R(4, 12), q = R(3, 14), r = R(1, n - 1), total = q * n + r;
  return {
    q: tr(`Sebanyak <b>${total}</b> kue akan dimasukkan ke dalam kotak. Satu kotak muat <b>${n}</b> kue. Paling sedikit dibutuhkan berapa kotak?`, `<b>${total}</b> cakes are to be packed into boxes. One box holds <b>${n}</b> cakes. What is the fewest number of boxes needed?`),
    o: numOpts(q + 1, [q, q + 2, total - n, q - 1], N, 1),
    exp: ST(tr(`${total} ÷ ${n} = ${q} sisa ${r}`, `${total} ÷ ${n} = ${q} remainder ${r}`), tr(`${q} kotak sudah penuh, tetapi masih ada <b>${r} kue</b> yang belum punya kotak.`, `${q} boxes are full, but <b>${r} cakes</b> still have no box.`), tr(`Sisa itu butuh satu kotak lagi: ${q} + 1 = <b>${q + 1}</b> kotak.`, `Those left over need one more box: ${q} + 1 = <b>${q + 1}</b> boxes.`)) + TIP('Pada soal "paling sedikit butuh berapa", sisa pembagian selalu dibulatkan ke atas.', 'In "how many are needed at least" problems, the remainder of a division is always rounded up.')
  };
}
/* pecahan */
function sdFracRead(d) {
  const parts = pick(d === 1 ? [2, 3, 4] : d === 2 ? [5, 6, 8] : [8, 10, 12]);
  const n = R(d === 3 ? 3 : 1, parts - 1);
  return {
    q: tr('Berapa bagian lingkaran yang diarsir (berwarna)?', 'What fraction of the circle is shaded (colored)?'), viz: svgPie(parts, n),
    o: opts(fr(n, parts), [fr(parts - n, parts), n < parts - n ? fr(n, parts - n) : null, n + 1 < parts ? fr(n + 1, parts) : null, fr(n, parts + 1), fr(Math.max(1, n - 1), parts)], () => fr(R(1, parts - 1) || 1, parts + R(1, 3))),
    exp: ST(tr(`Lingkaran dibagi menjadi <b>${parts}</b> bagian sama besar, jadi penyebutnya ${parts}.`, `The circle is divided into <b>${parts}</b> equal parts, so the denominator is ${parts}.`), tr(`Bagian yang diarsir ada <b>${n}</b>, jadi pembilangnya ${n}.`, `<b>${n}</b> parts are shaded, so the numerator is ${n}.`), tr(`Pecahannya ${fr(n, parts)}.`, `The fraction is ${fr(n, parts)}.`)) + TIP('Pecahan = bagian yang diambil di atas, banyaknya bagian seluruhnya di bawah.', 'A fraction = the parts taken on top, the total number of equal parts on the bottom.')
  };
}
function sdFracAdd(d) {
  let b1, a, b2, c, den, num, wrong = [];
  if (d < 3) {
    b1 = b2 = pick([4, 5, 6, 8, 10]); a = R(1, b1 - 2); c = R(1, b1 - 1 - a);
    den = b1; num = a + c;
    wrong = [frs(a + c, b1 + b2), frs(a + c, 2 * b1), frs(a * c, b1), frs(a + c + 1, b1)];
    return {
      q: tr(`${fr(a, b1)} + ${fr(c, b2)} = … (tulis dalam bentuk paling sederhana)`, `${fr(a, b1)} + ${fr(c, b2)} = … (write in simplest form)`),
      o: opts(frs(num, den), wrong, () => frs(R(1, b1), b1 + R(0, 2))),
      exp: ST(tr('Penyebutnya sudah sama, jadi cukup jumlahkan pembilangnya.', 'The denominators are already the same, so just add the numerators.'), `${a} + ${c} = ${a + c}`, `${fr(a + c, b1)}${gcd(a + c, b1) > 1 ? tr(' disederhanakan menjadi ', ' simplifies to ') + frs(num, den) : ''}`) + TIP('Penyebut tidak ikut dijumlahkan. Hanya pembilang yang ditambah.', 'The denominator is not added. Only the numerators are added.')
    };
  }
  b1 = pick([2, 3, 4, 5]); const k = pick([2, 3]); b2 = b1 * k;
  do { a = R(1, b1 - 1); c = R(1, b2 - 1); num = a * k + c; } while (num >= b2);
  return {
    q: tr(`${fr(a, b1)} + ${fr(c, b2)} = … (tulis dalam bentuk paling sederhana)`, `${fr(a, b1)} + ${fr(c, b2)} = … (write in simplest form)`),
    o: opts(frs(num, b2), [frs(a + c, b1 + b2), frs(a + c, b2), frs(a + c, b1), frs(a * k + c + 1, b2)], () => frs(R(1, b2), b2 + R(0, 2))),
    exp: ST(tr(`Samakan penyebut. ${b1} × ${k} = ${b2}, jadi ${fr(a, b1)} = ${fr(a * k, b2)}.`, `Make the denominators equal. ${b1} × ${k} = ${b2}, so ${fr(a, b1)} = ${fr(a * k, b2)}.`), `${fr(a * k, b2)} + ${fr(c, b2)} = ${fr(num, b2)}`, tr(`Sederhanakan: <b>${frs(num, b2)}</b>`, `Simplify: <b>${frs(num, b2)}</b>`)) + TIP('Penyebut berbeda? Ubah dulu supaya sama dengan mengalikan pembilang dan penyebut dengan bilangan yang sama.', 'Different denominators? First make them equal by multiplying the numerator and denominator by the same number.')
  };
}
function sdFracOf(d) {
  const b = pick(d === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 8]), a = R(1, b - 1), x = R(2, d === 1 ? 9 : 14), n = b * x, it = pick(THINGS());
  return {
    q: tr(`Dari <b>${n}</b> ${it}, ${fr(a, b)} bagian diberikan kepada adik. Berapa ${it} yang diberikan kepada adik?`, `Of <b>${n}</b> ${it}, ${fr(a, b)} are given to a younger sibling. How many ${it} is that?`),
    o: numOpts(a * x, [x, n - a * x, a * x + b, a * x + 1, a * x - 1]),
    exp: ST(tr(`Bagi ${n} menjadi ${b} kelompok sama banyak: ${n} ÷ ${b} = ${x}`, `Divide ${n} into ${b} equal groups: ${n} ÷ ${b} = ${x}`), tr(`Ambil ${a} kelompok: ${a} × ${x} = <b>${a * x}</b>`, `Take ${a} groups: ${a} × ${x} = <b>${a * x}</b>`)) + TIP('"Pecahan dari" artinya dibagi penyebut dulu, baru dikali pembilang.', '"Fraction of" means divide by the denominator first, then multiply by the numerator.')
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
    q: tr(`Manakah pecahan yang nilainya paling <b>${big ? 'besar' : 'kecil'}</b>?`, `Which fraction has the <b>${big ? 'largest' : 'smallest'}</b> value?`),
    o: opts(s(best), fs.filter(x => x !== best).map(s)),
    exp: ST(tr('Ubah setiap pecahan menjadi desimal (pembilang ÷ penyebut):', 'Turn each fraction into a decimal (numerator ÷ denominator):'), ...fs.map(x => `${s(x)} ≈ ${N(x.v, 2)}`), tr(`Paling ${big ? 'besar' : 'kecil'}: ${s(best)} (${N(best.v, 2)})`, `${big ? 'Largest' : 'Smallest'}: ${s(best)} (${N(best.v, 2)})`)) + TIP('Pecahan yang kurang dari ½ punya pembilang kurang dari setengah penyebutnya. Itu cara cepat untuk menyaring.', 'A fraction below ½ has a numerator less than half its denominator. That is a quick way to filter.')
  };
}
/* bangun datar */
function sdShapes(d) {
  const askArea = rnd() < 0.5;
  if (d === 1) {
    const s = R(3, 9), v = askArea ? s * s : 4 * s;
    return {
      q: tr(`Perhatikan persegi di bawah. Berapa <b>${askArea ? 'luas' : 'keliling'}</b>nya?`, `Look at the square below. What is its <b>${askArea ? 'area' : 'perimeter'}</b>?`), viz: svgRect(s, s, s + ' cm', s + ' cm'),
      o: numOpts(v, askArea ? [4 * s, 2 * s, s + s * 2, v + s] : [s * s, 2 * s, 3 * s, v + s]),
      exp: ST(askArea ? [tr(`Luas persegi = sisi × sisi`, `Area of a square = side × side`), `${s} × ${s} = <b>${v} cm²</b>`] : [tr(`Keliling persegi = 4 × sisi`, `Perimeter of a square = 4 × side`), `4 × ${s} = <b>${v} cm</b>`]) + TIP(askArea ? tr('Luas diukur dalam petak persegi (cm²), keliling diukur sepanjang tepi (cm).', 'Area is measured in square units (cm²), perimeter along the edge (cm).') : tr('Keliling = panjang pagar yang mengelilingi bangun. Keempat sisi persegi sama panjang.', 'Perimeter = length of the fence around the shape. All four sides of a square are equal.'))
    };
  }
  if (d === 2) {
    const p = R(6, 15), l = R(3, p - 1), v = askArea ? p * l : 2 * (p + l);
    return {
      q: tr(`Berapa <b>${askArea ? 'luas' : 'keliling'}</b> persegi panjang berikut?`, `What is the <b>${askArea ? 'area' : 'perimeter'}</b> of this rectangle?`), viz: svgRect(p, l, p + ' cm', l + ' cm'),
      o: numOpts(v, askArea ? [2 * (p + l), p + l, p * l + p, p * l - l] : [p * l, p + l, 2 * p + l, 2 * p * l]),
      exp: ST(askArea ? [tr(`Luas = panjang × lebar`, `Area = length × width`), `${p} × ${l} = <b>${v} cm²</b>`] : [tr(`Keliling = 2 × (panjang + lebar)`, `Perimeter = 2 × (length + width)`), `2 × (${p} + ${l}) = 2 × ${p + l} = <b>${v} cm</b>`]) + TIP('Untuk keliling, jangan lupa sisi yang berhadapan sama panjang, jadi semuanya ada dua kali.', 'For the perimeter, remember that opposite sides are equal, so every length counts twice.')
    };
  }
  const w = R(9, 14), h = R(8, 12), cw = R(2, w - 5), ch = R(2, h - 4), v = askArea ? w * h - cw * ch : 2 * (w + h);
  return {
    q: tr(`Bangun berbentuk huruf L di bawah dibuat dari persegi panjang yang dipotong di salah satu sudutnya. Berapa <b>${askArea ? 'luas' : 'keliling'}</b>nya?`, `The L-shaped figure below is a rectangle with one corner cut out. What is its <b>${askArea ? 'area' : 'perimeter'}</b>?`), viz: svgL(w, h, cw, ch),
    o: numOpts(v, askArea ? [w * h, w * h + cw * ch, 2 * (w + h), w * h - cw - ch] : [w * h - cw * ch, 2 * (w + h) - 2 * cw, 2 * (w + h) - cw - ch, 2 * (w + h) + cw + ch]),
    exp: ST(askArea ? [tr(`Bayangkan persegi panjang utuh: ${w} × ${h} = ${w * h} cm²`, `Imagine the whole rectangle: ${w} × ${h} = ${w * h} cm²`), tr(`Bagian yang dipotong: ${cw} × ${ch} = ${cw * ch} cm²`, `The cut-out part: ${cw} × ${ch} = ${cw * ch} cm²`), tr(`Luas L = ${w * h} ${MINUS} ${cw * ch} = <b>${v} cm²</b>`, `Area of the L = ${w * h} ${MINUS} ${cw * ch} = <b>${v} cm²</b>`)] : [tr(`Keliling bentuk L sama dengan keliling persegi panjang utuh, karena sisi yang "hilang" digantikan sisi lekukan yang panjang totalnya sama.`, `The perimeter of the L equals the perimeter of the whole rectangle, because the "missing" sides are replaced by notch sides of the same total length.`), `2 × (${w} + ${h}) = <b>${v} cm</b>`]) + TIP(askArea ? tr('Luas bangun rumit = luas bangun besar dikurangi bagian yang hilang.', 'Area of a complex shape = area of the big shape minus the missing part.') : tr('Memotong sudut persegi panjang tidak mengubah kelilingnya!', 'Cutting a corner out of a rectangle does not change its perimeter!'))
  };
}
function sdTri(d) {
  if (d === 3) {
    const b = pick([6, 8, 10, 12, 14]), t = R(4, 12), L = b * t / 2;
    return {
      q: tr(`Sebuah segitiga memiliki luas <b>${L} cm²</b> dan alas <b>${b} cm</b>. Berapa tinggi segitiga itu?`, `A triangle has an area of <b>${L} cm²</b> and a base of <b>${b} cm</b>. What is the height of the triangle?`),
      o: numOpts(t, [2 * L / b / 2, L / b / 2 + 1, L - b, L / b * 2, t + 2, t - 1]),
      exp: ST(tr(`Luas = ½ × alas × tinggi`, `Area = ½ × base × height`), tr(`${L} = ½ × ${b} × tinggi = ${b / 2} × tinggi`, `${L} = ½ × ${b} × height = ${b / 2} × height`), tr(`tinggi = ${L} ÷ ${b / 2} = <b>${t} cm</b>`, `height = ${L} ÷ ${b / 2} = <b>${t} cm</b>`)) + TIP('Kalau ada yang tidak diketahui, tulis dulu rumusnya, masukkan angka, lalu cari yang hilang.', 'When something is unknown, write the formula first, put in the numbers, then solve for the missing value.')
    };
  }
  const b = 2 * R(2, d === 1 ? 6 : 10), t = R(3, d === 1 ? 10 : 15), v = b * t / 2;
  return {
    q: tr('Berapa luas segitiga berikut?', 'What is the area of this triangle?'), viz: svgTri(b, t),
    o: numOpts(v, [b * t, b + t, (b + t) / 2, v + t, v - b]),
    exp: ST(tr(`Segitiga adalah setengah dari persegi panjang dengan alas dan tinggi yang sama.`, `A triangle is half of a rectangle with the same base and height.`), tr(`Luas = ½ × alas × tinggi = ½ × ${b} × ${t}`, `Area = ½ × base × height = ½ × ${b} × ${t}`), `= ${b * t} ÷ 2 = <b>${v} cm²</b>`) + TIP('Tinggi segitiga selalu tegak lurus dengan alas (ditandai garis putus-putus), bukan sisi miringnya.', 'The height of a triangle is always perpendicular to the base (shown by the dashed line), not the slanted side.')
  };
}
function sdPerim(d) {
  if (rnd() < 0.5) {
    const s = R(4, 15), K = 4 * s;
    return {
      q: tr(`Keliling sebuah persegi adalah <b>${K} cm</b>. Berapa panjang sisinya?`, `The perimeter of a square is <b>${K} cm</b>. How long is its side?`),
      o: numOpts(s, [K / 2, K - 4, K / 2 - 2, s + 2, K / 3]),
      exp: ST(tr('Keliling persegi = 4 × sisi', 'Perimeter of a square = 4 × side'), tr(`${K} = 4 × sisi`, `${K} = 4 × side`), tr(`sisi = ${K} ÷ 4 = <b>${s} cm</b>`, `side = ${K} ÷ 4 = <b>${s} cm</b>`)) + TIP('Persegi punya 4 sisi sama panjang, jadi keliling dibagi 4.', 'A square has 4 equal sides, so divide the perimeter by 4.')
    };
  }
  const p = R(7, 16), l = R(3, p - 2), K = 2 * (p + l);
  return {
    q: tr(`Sebuah persegi panjang berkeliling <b>${K} cm</b> dan panjangnya <b>${p} cm</b>. Berapa lebarnya?`, `A rectangle has a perimeter of <b>${K} cm</b> and a length of <b>${p} cm</b>. What is its width?`),
    o: numOpts(l, [K / 2, K - p, K / 4, K / 2 + p, l + 2]),
    exp: ST(tr(`Keliling = 2 × (panjang + lebar), jadi panjang + lebar = ${K} ÷ 2 = ${K / 2}`, `Perimeter = 2 × (length + width), so length + width = ${K} ÷ 2 = ${K / 2}`), tr(`lebar = ${K / 2} ${MINUS} ${p} = <b>${l} cm</b>`, `width = ${K / 2} ${MINUS} ${p} = <b>${l} cm</b>`)) + TIP('Jumlah panjang dan lebar selalu sama dengan setengah keliling.', 'Length plus width is always half the perimeter.')
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
    steps = [tr(`Selisih tiap suku: ${seq[1]} ${MINUS} ${seq[0]} = <b>${st}</b>`, `Difference between terms: ${seq[1]} ${MINUS} ${seq[0]} = <b>${st}</b>`), tr(`Aturannya: tambah ${st} setiap langkah.`, `The rule: add ${st} at every step.`), hide === 5 ? `${seq[4]} + ${st} = <b>${ans}</b>` : `${seq[hide - 1]} + ${st} = <b>${ans}</b>`];
    tip = tr('Cari selisih dua suku yang bersebelahan. Jika selalu sama, itu pola tambah (atau kurang) tetap.', 'Find the difference between neighboring terms. If it is always the same, it is a constant add (or subtract) pattern.');
  } else if (d === 2) {
    const t = pick(['turun', 'kali', 'kuadrat']);
    if (t === 'turun') { const st = R(3, 9), s = R(60, 100); seq = Array.from({ length: 6 }, (_, i) => s - i * st); hide = 5; ans = seq[5]; wrong = [ans + 2 * st, ans + 1, ans - 1, ans + st]; steps = [tr(`Bilangan makin kecil: ${seq[0]} ${MINUS} ${seq[1]} = ${st}`, `The numbers get smaller: ${seq[0]} ${MINUS} ${seq[1]} = ${st}`), tr(`Aturannya: kurang ${st} setiap langkah.`, `The rule: subtract ${st} at every step.`), `${seq[4]} ${MINUS} ${st} = <b>${ans}</b>`]; tip = tr('Pola bisa juga turun. Perhatikan apakah angkanya bertambah atau berkurang.', 'A pattern can also go down. Check whether the numbers increase or decrease.'); }
    else if (t === 'kali') { const s = R(1, 5); seq = [s, 2 * s, 4 * s, 8 * s, 16 * s]; hide = 4; ans = 16 * s; wrong = [ans + s, ans - s, 12 * s + 4 * s + 2, 3 * 8 * s]; seq = seq.slice(0, 4).concat([]); seq = [s, 2 * s, 4 * s, 8 * s, 16 * s, 32 * s]; hide = 5; ans = 32 * s; wrong = [ans - 8 * s, 24 * s + 8 * s - 2, 16 * s + 8 * s, ans + 2]; steps = [`${seq[1]} ÷ ${seq[0]} = 2, ${seq[2]} ÷ ${seq[1]} = 2`, tr('Aturannya: dikali 2 setiap langkah.', 'The rule: multiply by 2 at every step.'), `${seq[4]} × 2 = <b>${ans}</b>`]; tip = tr('Kalau selisihnya makin besar, coba periksa apakah polanya perkalian.', 'If the differences keep growing, check whether the pattern is multiplication.'); }
    else { const o = R(0, 3); seq = Array.from({ length: 7 }, (_, i) => (i + 1 + o) * (i + 1 + o)).slice(0, 6); hide = 5; ans = (6 + o) * (6 + o); wrong = [ans + 1, ans - (6 + o), ans + (6 + o), (6 + o) * (5 + o)]; steps = [tr(`Selisih tiap suku: ${seq[1] - seq[0]}, ${seq[2] - seq[1]}, ${seq[3] - seq[2]}, … selalu naik 2`, `Differences between terms: ${seq[1] - seq[0]}, ${seq[2] - seq[1]}, ${seq[3] - seq[2]}, … always up by 2`), tr(`Ini bilangan kuadrat: ${seq.slice(0, 5).map((v, i) => `${i + 1 + o}²`).join(', ')}`, `These are square numbers: ${seq.slice(0, 5).map((v, i) => `${i + 1 + o}²`).join(', ')}`), `${6 + o}² = <b>${ans}</b>`]; tip = tr('Bilangan kuadrat: 1, 4, 9, 16, 25, 36, … Selisihnya 3, 5, 7, 9, …', 'Square numbers: 1, 4, 9, 16, 25, 36, … The differences are 3, 5, 7, 9, …'); }
  } else {
    const t = pick(['segitiga', 'fibo', 'selang', 'kali1']);
    if (t === 'segitiga') { seq = [1, 3, 6, 10, 15, 21]; hide = 5; ans = 21; wrong = [20, 22, 25, 18]; steps = [tr('Selisih tiap suku: 2, 3, 4, 5, … (naik 1 terus)', 'Differences between terms: 2, 3, 4, 5, … (keeps going up by 1)'), tr('Selisih berikutnya adalah 6.', 'The next difference is 6.'), `15 + 6 = <b>21</b>`]; tip = tr('Jika selisihnya tidak tetap tetapi membentuk pola sendiri, lihat "selisih dari selisih".', 'If the differences are not constant but form their own pattern, look at the "difference of the differences".'); }
    else if (t === 'fibo') { const a = R(1, 4), b = R(2, 6); seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b, 3 * a + 5 * b]; hide = 5; ans = seq[5]; wrong = [ans + 1, ans - 1, seq[4] * 2, seq[4] + seq[3] + 1]; steps = [`${seq[0]} + ${seq[1]} = ${seq[2]}, ${seq[1]} + ${seq[2]} = ${seq[3]}`, tr('Aturannya: setiap suku adalah jumlah dua suku sebelumnya.', 'The rule: each term is the sum of the two terms before it.'), `${seq[3]} + ${seq[4]} = <b>${ans}</b>`]; tip = tr('Pola seperti ini dinamai deret Fibonacci. Setiap suku = dua suku sebelumnya dijumlahkan.', 'This kind of pattern is called a Fibonacci sequence. Each term = the sum of the previous two terms.'); }
    else if (t === 'selang') { const s = R(2, 6), u = R(s + 3, s + 9); seq = [s, u, s + 1, u + 1, s + 2, u + 1 + 1]; hide = 5; ans = u + 2; seq = [s, u, s + 1, u + 1, s + 2, u + 2, s + 3]; hide = 6; ans = s + 3; wrong = [u + 3, ans + 1, ans - 1, s + 4]; steps = [tr(`Ada dua pola yang bergantian.`, `There are two patterns taking turns.`), tr(`Suku ke-1, 3, 5: ${s}, ${s + 1}, ${s + 2} (tambah 1)`, `Terms 1, 3, 5: ${s}, ${s + 1}, ${s + 2} (add 1)`), tr(`Suku ke-2, 4, 6: ${u}, ${u + 1}, ${u + 2} (tambah 1)`, `Terms 2, 4, 6: ${u}, ${u + 1}, ${u + 2} (add 1)`), tr(`Suku ke-7 mengikuti pola pertama: <b>${ans}</b>`, `Term 7 follows the first pattern: <b>${ans}</b>`)]; tip = tr('Jika pola terlihat acak, coba pisahkan suku ganjil dan suku genap.', 'If a pattern looks random, try separating the odd-numbered and even-numbered terms.'); }
    else { const s = R(1, 3); seq = [s]; for (let i = 0; i < 5; i++) seq.push(seq[i] * 2 + 1); hide = 5; ans = seq[5]; wrong = [seq[4] * 2, ans + 2, ans - 2, seq[4] * 2 + 2]; steps = [`${seq[0]} × 2 + 1 = ${seq[1]}`, `${seq[1]} × 2 + 1 = ${seq[2]}`, tr('Aturannya: kali 2, lalu tambah 1.', 'The rule: multiply by 2, then add 1.'), `${seq[4]} × 2 + 1 = <b>${ans}</b>`]; tip = tr('Jika tidak cocok dengan tambah atau kali saja, coba gabungan keduanya.', 'If adding or multiplying alone does not fit, try a combination of both.'); }
  }
  return { q: tr('Tentukan bilangan yang menggantikan tanda tanya (?) pada pola berikut.', 'Find the number that replaces the question mark (?) in this pattern.') + show(seq, hide), o: numOpts(ans, wrong), exp: ST(steps) + TIP(tip) };
}
/* jam */
function sdClock(d) {
  const h = R(1, 12), m = d === 1 ? pick([0, 30]) : d === 2 ? pick([0, 15, 30, 45]) : R(0, 11) * 5;
  const wrap = x => ((x - 1 + 12) % 12) + 1, mm = x => (x + 60) % 60;
  const sh = (m / 5) || 12;
  const ans = fmtT(h, m);
  return {
    q: tr('Jam di bawah menunjukkan pukul berapa? (ditulis jam.menit)', 'What time does the clock below show? (written as hour.minute)'), viz: svgClock(h, m),
    o: opts(ans, [fmtT(wrap(h + 1), m), fmtT(wrap(h - 1), m), fmtT(sh, (h % 12) * 5), fmtT(h, mm(m + 5)), fmtT(h, mm(m - 5)), fmtT(h, mm(m + 15))], () => fmtT(wrap(h + R(-2, 2)), mm(m + 5 * R(-3, 3)))),
    exp: ST(tr('Jarum pendek menunjukkan <b>jam</b>, jarum panjang menunjukkan <b>menit</b>.', 'The short hand shows the <b>hour</b>, the long hand shows the <b>minutes</b>.'), tr(`Jarum pendek berada ${m === 0 ? 'tepat di angka ' + h : 'setelah angka ' + h + ' (belum mencapai angka ' + wrap(h + 1) + ')'}, jadi jamnya <b>${h}</b>.`, `The short hand is ${m === 0 ? 'exactly on ' + h : 'just past ' + h + ' (not yet at ' + wrap(h + 1) + ')'}, so the hour is <b>${h}</b>.`), tr(`Jarum panjang menunjuk angka ${m / 5}. Setiap angka bernilai 5 menit: ${m / 5} × 5 = <b>${m} menit</b>.`, `The long hand points to ${m / 5}. Each number is worth 5 minutes: ${m / 5} × 5 = <b>${m} minutes</b>.`), tr(`Waktunya: <b>${ans}</b>`, `The time: <b>${ans}</b>`)) + TIP('Jarum panjang di angka 6 berarti 30 menit, di angka 3 berarti 15 menit, di angka 9 berarti 45 menit.', 'The long hand on 6 means 30 minutes, on 3 means 15 minutes, on 9 means 45 minutes.')
  };
}
function sdDur(d) {
  const sh = R(6, 18), sm = pick([0, 10, 15, 20, 30, 35, 40, 45, 50]), dh = R(1, 3), dm = pick([20, 25, 30, 35, 40, 45, 50]);
  let em = sm + dm, eh = sh + dh; const carry = em >= 60; if (carry) { em -= 60; eh += 1; }
  if (eh >= 24) return null;
  const ans = fmtT(eh, em), mm = x => (x + 60) % 60;
  const n = nm();
  return {
    q: tr(`${n} menonton film yang dimulai pukul <b>${fmtT(sh, sm)}</b>. Lama film itu <b>${dh} jam ${dm} menit</b>. Pukul berapa film selesai?`, `${n} watches a movie that starts at <b>${fmtT(sh, sm)}</b>. The movie lasts <b>${dh} hours ${dm} minutes</b>. What time does the movie end?`),
    o: opts(ans, [fmtT(sh + dh, mm(sm + dm)), fmtT(eh + 1, em), fmtT(eh - 1, em), fmtT(eh, mm(em + 10)), fmtT(eh, mm(em - 10))], () => fmtT(eh + R(-1, 1), mm(em + 5 * R(-3, 3)))),
    exp: ST(tr(`Tambahkan jam dulu: ${sh} + ${dh} = ${sh + dh} jam`, `Add the hours first: ${sh} + ${dh} = ${sh + dh} hours`), tr(`Tambahkan menit: ${sm} + ${dm} = ${sm + dm} menit${carry ? ' (lebih dari 60)' : ''}`, `Add the minutes: ${sm} + ${dm} = ${sm + dm} minutes${carry ? ' (more than 60)' : ''}`), carry ? tr(`${sm + dm} menit = 1 jam ${em} menit, jadi jam bertambah 1 menjadi ${eh}`, `${sm + dm} minutes = 1 hour ${em} minutes, so the hour goes up by 1 to ${eh}`) : tr('Menitnya belum mencapai 60, jadi jam tidak berubah.', 'The minutes have not reached 60, so the hour does not change.'), tr(`Film selesai pukul <b>${ans}</b>`, `The movie ends at <b>${ans}</b>`)) + TIP('Satu jam = 60 menit. Jika menit melewati 60, kurangi 60 dan tambah 1 jam.', 'One hour = 60 minutes. If the minutes pass 60, subtract 60 and add 1 hour.')
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
