'use strict';
/* ====== Trigonometri bergambar (dua bahasa) ====== */
const D2R = Math.PI / 180;
/* busur dari sudut a0 ke a1 (derajat, arah matematika: berlawanan jarum jam dari sumbu x) */
const arcP = (cx, cy, r, a0, a1) => {
  const x0 = cx + r * Math.cos(a0 * D2R), y0 = cy - r * Math.sin(a0 * D2R), x1 = cx + r * Math.cos(a1 * D2R), y1 = cy - r * Math.sin(a1 * D2R);
  return `M${f1(x0)} ${f1(y0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f1(x1)} ${f1(y1)}`;
};
const stripTags = x => String(x).replace(/<[^>]+>/g, '');
const cmp4 = () => tr(['U', 'T', 'S', 'B'], ['N', 'E', 'S', 'W']);

function svgUnit(deg, o = {}) {
  const cx = 130, cy = 130, r = 92, a = deg * D2R, px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" class="f0"/>`;
  s += `<line class="ln" style="stroke-width:1.6" x1="14" y1="${cy}" x2="246" y2="${cy}"/><line class="ln" style="stroke-width:1.6" x1="${cx}" y1="14" x2="${cx}" y2="246"/>`;
  s += TX(250, cy + 16, 'x', 'end', 'tick') + TX(cx + 10, 22, 'y', 'start', 'tick');
  [['I', 1, -1], ['II', -1, -1], ['III', -1, 1], ['IV', 1, 1]].forEach(q => { s += TX(cx + q[1] * 62, cy + q[2] * 62 + 5, q[0], 'middle', 'tick'); });
  s += `<line class="ln dash" style="stroke-width:1.8" x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px)}" y2="${cy}"/><line class="ln dash" style="stroke-width:1.8" x1="${f1(px)}" y1="${f1(py)}" x2="${cx}" y2="${f1(py)}"/>`;
  s += `<line class="ln c2" style="stroke-width:3.4" x1="${cx}" y1="${cy}" x2="${f1(px)}" y2="${f1(py)}"/>`;
  s += `<path d="${arcP(cx, cy, 24, 0, deg)}" class="ln" style="stroke-width:2.2"/>`;
  const m = deg / 2 * D2R; s += TX(cx + 42 * Math.cos(m), cy - 42 * Math.sin(m) + 5, o.theta || 'θ', 'middle', 'acc');
  s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="5.5" class="dot acc"/>`;
  const pl = o.plabel === undefined ? 'P' : o.plabel; if (pl.length > 3) s += TX(8, 20, pl, 'start', 'big'); else if (pl) s += TX(px + (Math.cos(a) >= 0 ? 8 : -8), py + (Math.sin(a) >= 0 ? -10 : 18), pl, Math.cos(a) >= 0 ? 'start' : 'end', 'big');
  return svg(260, 260, s, tr('Lingkaran satuan dengan sudut θ', 'Unit circle with angle θ'));
}
const coord = (c, s) => `(${exact(c)}, ${exact(s)})`;

function smaUnitCircle(d) {
  if (d === 3) {
    const [a, b, c] = pick(TRIPLES.slice(0, 3)), sx = pick([1, -1]), sy = pick([1, -1]), x = sx * a, y = sy * b, deg = Math.atan2(y, x) / D2R;
    const ask = pick(['tan', 'sin', 'cos']), val = { tan: [y, x], sin: [y, c], cos: [x, c] }[ask], ans = frs(val[0], val[1]);
    const pl = `P(${sx < 0 ? MINUS : ''}${a}/${c}, ${sy < 0 ? MINUS : ''}${b}/${c})`;
    return {
      q: tr(`Titik <b>${pl}</b> terletak pada lingkaran satuan seperti pada gambar. Berapakah nilai <b>${ask} θ</b>?`, `Point <b>${pl}</b> lies on the unit circle as shown. What is <b>${ask} θ</b>?`),
      viz: svgUnit(deg < 0 ? deg + 360 : deg, { plabel: pl }),
      o: opts(ans, [frs(val[1], val[0]), frs(-val[0], val[1]), frs(y, c), frs(x, c), frs(c, val[0])].filter(z => z !== ans), () => frs(R(-5, 5), R(2, 6))),
      exp: ST(tr('Pada lingkaran satuan, titik P(x, y) = (cos θ, sin θ).', 'On the unit circle, P(x, y) = (cos θ, sin θ).'), tr(`cos θ = ${frs(x, c)} dan sin θ = ${frs(y, c)}`, `cos θ = ${frs(x, c)} and sin θ = ${frs(y, c)}`), ask === 'tan' ? tr(`tan θ = sin θ ÷ cos θ = ${frs(y, c)} ÷ ${frs(x, c)} = <b>${ans}</b>`, `tan θ = sin θ ÷ cos θ = ${frs(y, c)} ÷ ${frs(x, c)} = <b>${ans}</b>`) : tr(`Jadi ${ask} θ = <b>${ans}</b>`, `So ${ask} θ = <b>${ans}</b>`)) + TIP('Koordinat x adalah cosinus, koordinat y adalah sinus. Tangen adalah y dibagi x.', 'The x-coordinate is cosine, the y-coordinate is sine, and tangent is y divided by x.')
    };
  }
  const th = pick(d === 1 ? [30, 45, 60] : [120, 135, 150, 210, 225, 240, 300, 315, 330]), c = Math.cos(th * D2R), s = Math.sin(th * D2R), ans = coord(c, s);
  return {
    q: tr(`Titik P berada pada lingkaran satuan dengan sudut <b>θ = ${th}°</b>, diukur dari sumbu x positif berlawanan arah jarum jam (lihat gambar). Koordinat titik P adalah …`, `Point P lies on the unit circle at angle <b>θ = ${th}°</b>, measured counterclockwise from the positive x-axis (see the figure). The coordinates of P are …`),
    viz: svgUnit(th), o: opts(ans, [coord(s, c), coord(-c, s), coord(c, -s), coord(-c, -s)]),
    exp: ST(tr('Titik P pada lingkaran satuan memiliki koordinat (cos θ, sin θ).', 'A point P on the unit circle has coordinates (cos θ, sin θ).'), tr(`cos ${th}° = ${exact(c)} dan sin ${th}° = ${exact(s)}`, `cos ${th}° = ${exact(c)} and sin ${th}° = ${exact(s)}`), tr(`Jadi P = <b>${ans}</b>`, `So P = <b>${ans}</b>`)) + TIP('Perhatikan kuadran di gambar untuk menentukan tanda: x negatif di kiri sumbu y, y negatif di bawah sumbu x.', 'Use the quadrant in the figure for the signs: x is negative left of the y-axis, y is negative below the x-axis.')
  };
}
function smaQuadSign() {
  const deg = pick([20, 35, 50, 65, 110, 125, 145, 160, 200, 215, 235, 250, 290, 305, 325, 340]), q = deg < 90 ? 0 : deg < 180 ? 1 : deg < 270 ? 2 : 3;
  const S = [['+', '+', '+'], ['+', '−', '−'], ['−', '−', '+'], ['−', '+', '−']], f = a => `sin ${a[0]}, cos ${a[1]}, tan ${a[2]}`;
  const sh = shuffle([0, 1, 2, 3]);
  return {
    q: tr('Perhatikan titik P pada lingkaran satuan berikut. Tanda dari sin θ, cos θ, dan tan θ berturut-turut adalah …', 'Look at the point P on the unit circle. What are the signs of sin θ, cos θ, and tan θ?'),
    viz: svgUnit(deg), o: { opts: sh.map(i => f(S[i])), ans: sh.indexOf(q) },
    exp: ST(tr(`Titik P berada di kuadran ${['I', 'II', 'III', 'IV'][q]}.`, `Point P is in quadrant ${['I', 'II', 'III', 'IV'][q]}.`), tr('sin = koordinat y, cos = koordinat x, tan = y ÷ x.', 'sin = y-coordinate, cos = x-coordinate, tan = y ÷ x.'), tr(`Di kuadran ${['I', 'II', 'III', 'IV'][q]}: <b>${f(S[q])}</b>`, `In quadrant ${['I', 'II', 'III', 'IV'][q]}: <b>${f(S[q])}</b>`)) + TIP('Kuadran I: semua positif. II: hanya sin. III: hanya tan. IV: hanya cos.', 'Quadrant I: all positive. II: only sin. III: only tan. IV: only cos.')
  };
}
/* ---- adegan sudut elevasi / depresi ---- */
function sceneElev(a) {
  const W = 330, H = 205, gy = 168, hp = 128, ey = 24;
  let s = `<line class="ln" x1="6" y1="${gy}" x2="${W - 6}" y2="${gy}"/>`;
  if (!a.dep) {
    const tx = 250, dp = (hp - ey) / Math.tan(a.ang * D2R), ox = tx - 22 - dp, eyY = gy - ey, topY = gy - hp;
    s += `<rect x="${tx - 22}" y="${topY}" width="22" height="${hp}" class="f1"/>`;
    s += `<circle cx="${f1(ox)}" cy="${gy - 32}" r="6" class="f0"/><line class="ln" x1="${f1(ox)}" y1="${gy - 26}" x2="${f1(ox)}" y2="${gy - 8}"/><line class="ln" x1="${f1(ox)}" y1="${gy - 8}" x2="${f1(ox - 5)}" y2="${gy}"/><line class="ln" x1="${f1(ox)}" y1="${gy - 8}" x2="${f1(ox + 5)}" y2="${gy}"/>`;
    s += `<line class="ln dash" style="stroke-width:1.8" x1="${f1(ox)}" y1="${eyY}" x2="${tx - 22}" y2="${eyY}"/><line class="ln c2" style="stroke-width:3" x1="${f1(ox)}" y1="${eyY}" x2="${tx - 22}" y2="${topY}"/>`;
    s += `<path d="${arcP(ox, eyY, 38, 0, a.ang)}" class="ln" style="stroke-width:2"/>` + TX(ox + 52, eyY - 6, a.angL, 'middle', 'acc');
    s += `<line class="ln" style="stroke-width:1.6" x1="${f1(ox)}" y1="${gy + 16}" x2="${tx - 22}" y2="${gy + 16}"/>` + TX((ox + tx - 22) / 2, gy + 34, a.dist, 'middle');
    s += TX(tx - 11, topY - 9, a.h, 'middle', 'big');
    if (a.eye) s += TX(ox - 10, gy - 12, a.eye, 'end', 'tick');
  } else {
    const bx0 = 24, bw = 34, topY = gy - hp, eyeY = topY - ey, dp = (hp + ey) / Math.tan(a.ang * D2R), bx = bx0 + bw + dp - 34;
    s += `<rect x="${bx0}" y="${topY}" width="${bw}" height="${hp}" class="f1"/>`;
    s += `<circle cx="${bx0 + 17}" cy="${eyeY + 8}" r="6" class="f0"/><line class="ln" x1="${bx0 + 17}" y1="${eyeY + 14}" x2="${bx0 + 17}" y2="${topY}"/>`;
    s += `<line class="ln dash" style="stroke-width:1.8" x1="${bx0 + 17}" y1="${eyeY + 8}" x2="${W - 12}" y2="${eyeY + 8}"/>`;
    const tx2 = bx0 + 17 + (hp + ey - 8) / Math.tan(a.ang * D2R);
    s += `<line class="ln c2" style="stroke-width:3" x1="${bx0 + 17}" y1="${eyeY + 8}" x2="${f1(tx2)}" y2="${gy - 4}"/>`;
    s += `<path d="${arcP(bx0 + 17, eyeY + 8, 40, 0, -a.ang)}" class="ln" style="stroke-width:2"/>` + TX(bx0 + 17 + 58, eyeY + 30, a.angL, 'middle', 'acc');
    s += `<path d="M${f1(tx2 - 16)} ${gy - 4}h32l-6 -10h-20Z" class="f1"/>`;
    s += `<line class="ln" style="stroke-width:1.6" x1="${bx0 + bw}" y1="${gy + 16}" x2="${f1(tx2)}" y2="${gy + 16}"/>` + TX((bx0 + bw + tx2) / 2, gy + 34, a.dist, 'middle');
    s += TX(bx0 + bw + 6, (gy + topY) / 2 + 5, a.h, 'start', 'big');
  }
  return svg(W, H, s, a.dep ? tr('Sudut depresi', 'Angle of depression') : tr('Sudut elevasi', 'Angle of elevation'));
}
const mulRt = (k, r) => (k === 1 ? '' : N(k)) + rt(r);
function smaTrigElev(d) {
  const ang = pick([30, 45, 60]), dep = d >= 2 && rnd() < 0.5;
  if (!dep) {
    const k = R(2, 12), dist = ang === 30 ? 3 * k : R(8, 40), eyeM = d === 3 ? pick([1, 2]) : 0;
    const base = ang === 45 ? N(dist) : ang === 60 ? mulRt(dist, 3) : mulRt(k, 3), ans = eyeM ? `${eyeM} + ${base}` : base;
    const wr = ang === 45 ? [mulRt(dist, 2), N(dist / 2), mulRt(dist, 3), N(2 * dist)] : [ang === 60 ? fr(dist, 3) + rt(3) : mulRt(3 * k, 3), N(dist), fr(dist, 2), mulRt(dist, 2), fr(dist, 2) + rt(3)];
    const fin = eyeM ? wr.map(x => `${eyeM} + ${x}`).concat([base]) : wr;
    return {
      q: tr(`Seorang pengamat berdiri <b>${dist} m</b> dari kaki sebuah menara. Sudut elevasi puncak menara dari ${eyeM ? `matanya (setinggi <b>${eyeM} m</b> dari tanah)` : 'matanya'} adalah <b>${ang}°</b>. Tinggi menara adalah … m`, `An observer stands <b>${dist} m</b> from the base of a tower. The angle of elevation of the top of the tower from ${eyeM ? `their eyes (<b>${eyeM} m</b> above the ground)` : 'their eyes'} is <b>${ang}°</b>. The height of the tower is … m`),
      viz: sceneElev({ ang, dist: dist + ' m', h: tr('tinggi = ?', 'height = ?'), angL: ang + '°', eye: eyeM ? eyeM + ' m' : '' }),
      o: opts(ans, fin.length ? fin : wr, () => R(2, 60) + rt(3)),
      exp: ST(tr('Sudut elevasi diukur dari garis pandang datar ke atas, sehingga membentuk segitiga siku-siku.', 'The angle of elevation is measured from the horizontal line of sight upward, forming a right triangle.'), `tan ${ang}° = ${tr('sisi depan', 'opposite')} ÷ ${tr('sisi samping', 'adjacent')} = ${tr('tinggi', 'height')} ÷ ${dist}`, ang === 45 ? tr(`tan 45° = 1, jadi tinggi = ${dist} m`, `tan 45° = 1, so the height = ${dist} m`) : ang === 60 ? tr(`tan 60° = √3, jadi tinggi = ${dist}√3 m`, `tan 60° = √3, so the height = ${dist}√3 m`) : tr(`tan 30° = ${fr(1, 3)}√3, jadi tinggi = ${dist} × ${fr(1, 3)}√3 = ${k}√3 m`, `tan 30° = ${fr(1, 3)}√3, so the height = ${dist} × ${fr(1, 3)}√3 = ${k}√3 m`), eyeM ? tr(`Tambahkan tinggi mata ${eyeM} m: <b>${ans} m</b>`, `Add the eye height of ${eyeM} m: <b>${ans} m</b>`) : tr(`Tinggi menara = <b>${ans} m</b>`, `Tower height = <b>${ans} m</b>`)) + TIP('Yang diketahui sisi samping dan yang dicari sisi depan, jadi pakai tan.', 'You know the adjacent side and want the opposite one, so use tan.')
    };
  }
  const k = R(2, 10), H = ang === 60 ? 3 * k : R(10, 40), ans = ang === 45 ? N(H) : ang === 30 ? mulRt(H, 3) : mulRt(k, 3);
  const wr = ang === 45 ? [mulRt(H, 2), N(2 * H), mulRt(H, 3), fr(H, 2)] : ang === 30 ? [fr(H, 3) + rt(3), N(H), fr(H, 2), mulRt(H, 2)] : [mulRt(H, 3), N(H), fr(H, 2), mulRt(H, 2)];
  return {
    q: tr(`Dari atas sebuah gedung setinggi <b>${H} m</b>, seorang pengamat melihat sebuah perahu dengan sudut depresi <b>${ang}°</b>. Jarak mendatar perahu dari kaki gedung adalah … m (abaikan tinggi pengamat)`, `From the top of a <b>${H} m</b> building, an observer sees a boat at an angle of depression of <b>${ang}°</b>. The horizontal distance of the boat from the base of the building is … m (ignore the observer's height)`),
    viz: sceneElev({ ang, dep: true, dist: tr('jarak = ?', 'distance = ?'), h: H + ' m', angL: ang + '°' }),
    o: opts(ans, wr, () => R(2, 60) + rt(3)),
    exp: ST(tr('Sudut depresi diukur dari garis datar ke bawah. Sudut itu sama besar dengan sudut elevasi dari perahu ke pengamat (sudut dalam berseberangan).', 'The angle of depression is measured from the horizontal downward. It equals the angle of elevation from the boat up to the observer (alternate angles).'), `tan ${ang}° = ${H} ÷ ${tr('jarak', 'distance')}`, tr(`jarak = ${H} ÷ tan ${ang}° = <b>${ans} m</b>`, `distance = ${H} ÷ tan ${ang}° = <b>${ans} m</b>`)) + TIP('Sudut depresi tidak diukur dari tanah. Ia diukur dari garis datar setinggi mata, ke arah bawah.', 'The angle of depression is not measured from the ground. It is measured from the horizontal at eye level, downward.')
  };
}
/* ---- arah mata angin (bearing) ---- */
function svgBear(deg, L) {
  const cx = 120, cy = 130, len = 92, a = (90 - deg) * D2R, px = cx + len * Math.cos(a), py = cy - len * Math.sin(a), c = cmp4();
  let s = `<line class="ln" style="stroke-width:1.5" x1="${cx}" y1="14" x2="${cx}" y2="246"/><line class="ln" style="stroke-width:1.5" x1="26" y1="${cy}" x2="226" y2="${cy}"/>`;
  s += `<path d="M${cx} 14l-6 12h12Z" class="dot"/>` + TX(cx, 10, c[0], 'middle', 'big') + TX(232, cy + 5, c[1], 'start', 'big') + TX(cx, 262, c[2], 'middle', 'big') + TX(12, cy + 5, c[3], 'middle', 'big');
  s += `<line class="ln dash" style="stroke-width:1.8" x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px)}" y2="${cy}"/><line class="ln dash" style="stroke-width:1.8" x1="${f1(px)}" y1="${f1(py)}" x2="${cx}" y2="${f1(py)}"/>`;
  s += `<line class="ln c2" style="stroke-width:3.2" x1="${cx}" y1="${cy}" x2="${f1(px)}" y2="${f1(py)}"/><path d="${arcP(cx, cy, 34, 90, 90 - deg)}" class="ln" style="stroke-width:2"/>`;
  const m = (90 - deg / 2) * D2R; s += TX(cx + 52 * Math.cos(m), cy - 52 * Math.sin(m) + 5, String(deg).padStart(3, '0') + '°', 'middle', 'acc');
  s += `<circle cx="${cx}" cy="${cy}" r="5" class="dot"/><circle cx="${f1(px)}" cy="${f1(py)}" r="5.5" class="dot acc"/>` + TX(px + (Math.sin(deg * D2R) >= 0 ? 9 : -9), py - 6, L, Math.sin(deg * D2R) >= 0 ? 'start' : 'end', 'big');
  return svg(260, 270, s, tr('Arah kapal diukur dari utara searah jarum jam', 'Ship direction measured clockwise from north'));
}
function smaBearing(d) {
  const deg = d === 3 ? pick([120, 135, 150, 210, 240]) : pick([30, 45, 60]), L = pick([10, 20, 30, 40, 60, 80]), want = pick(['utara', 'timur']);
  const north = L * Math.cos(deg * D2R), east = L * Math.sin(deg * D2R);
  const comp = (v, sgn) => { const a = Math.abs(v); const e = exact(a / L); const str = e === '0' ? '0' : null; const ratio = a / L;
    if (Math.abs(ratio - 0.5) < 1e-9) return N(L / 2); if (Math.abs(ratio - 1) < 1e-9) return N(L); if (Math.abs(ratio - Math.SQRT1_2) < 1e-9) return mulRt(L / 2, 2); if (Math.abs(ratio - Math.sqrt(3) / 2) < 1e-9) return mulRt(L / 2, 3); return null; };
  const dirN = north >= 0 ? tr('utara', 'north') : tr('selatan', 'south'), dirE = east >= 0 ? tr('timur', 'east') : tr('barat', 'west');
  const askN = want === 'utara', val = askN ? north : east, ans = comp(val);
  if (!ans) return null;
  const alt = [comp(askN ? east : north), N(L), N(L / 2), mulRt(L, 2), mulRt(L, 3), mulRt(L / 2, 3)].filter(x => x && x !== ans);
  return {
    q: tr(`Sebuah kapal berlayar sejauh <b>${L} km</b> dengan arah <b>${String(deg).padStart(3, '0')}°</b> (diukur dari utara searah jarum jam, lihat gambar). Berapa jarak kapal ke arah ${askN ? (north >= 0 ? 'utara' : 'selatan') : (east >= 0 ? 'timur' : 'barat')} dari titik awal?`, `A ship sails <b>${L} km</b> on a bearing of <b>${String(deg).padStart(3, '0')}°</b> (measured clockwise from north, see the figure). How far is the ship ${askN ? dirN : dirE} of its starting point?`),
    viz: svgBear(deg, L + ' km'), o: opts(ans + ' km', alt.map(x => x + ' km'), () => R(2, 90) + ' km'),
    exp: ST(tr('Arah (bearing) diukur dari utara searah jarum jam. Gambar segitiga siku-siku dengan jarak tempuh sebagai sisi miring.', 'Bearing is measured clockwise from north. Draw a right triangle with the distance sailed as the hypotenuse.'), askN ? tr(`Komponen utara–selatan = ${L} × cos ${deg}° = ${L} × ${exact(Math.cos(deg * D2R))}`, `North–south component = ${L} × cos ${deg}° = ${L} × ${exact(Math.cos(deg * D2R))}`) : tr(`Komponen timur–barat = ${L} × sin ${deg}° = ${L} × ${exact(Math.sin(deg * D2R))}`, `East–west component = ${L} × sin ${deg}° = ${L} × ${exact(Math.sin(deg * D2R))}`), tr(`Jaraknya <b>${ans} km</b> ke arah ${askN ? dirN : dirE}`, `The distance is <b>${ans} km</b> ${askN ? dirN : dirE}`)) + TIP('Dari arah utara: cos memberi jarak utara–selatan, sin memberi jarak timur–barat. Hati-hati, ini kebalikan dari sudut biasa dari sumbu x.', 'Measured from north: cos gives the north–south distance and sin gives the east–west distance, the reverse of angles measured from the x-axis.')
  };
}
/* ---- segitiga sembarang: aturan sinus dan kosinus ---- */
function svgTriGen(P0, labs) {
  const xs = P0.map(p => p[0]), ys = P0.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys), k = Math.min(250 / w, 130 / h);
  const P1 = P0.map(p => [34 + (p[0] - Math.min(...xs)) * k, 26 + (Math.max(...ys) - p[1]) * k]);
  const g = [0, 1, 2].reduce((a, i) => [a[0] + P1[i][0] / 3, a[1] + P1[i][1] / 3], [0, 0]);
  const away = (p, dd) => { const vx = p[0] - g[0], vy = p[1] - g[1], l = Math.hypot(vx, vy); return [p[0] + vx / l * dd, p[1] + vy / l * dd]; };
  let s = `<polygon points="${P1.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ')}" class="f1"/>`;
  ['A', 'B', 'C'].forEach((v, i) => { const q = away(P1[i], 15); s += TX(q[0], q[1] + 5, v, 'middle', 'big'); if (labs.ang[i]) { const t = away(P1[i], -26); s += TX(t[0], t[1] + 5, labs.ang[i], 'middle', 'big'); } });
  [[1, 2, 0], [0, 2, 1], [0, 1, 2]].forEach(([i, j, kx]) => { if (labs.side[kx]) { const m = [(P1[i][0] + P1[j][0]) / 2, (P1[i][1] + P1[j][1]) / 2], q = away(m, 20); s += TX(q[0], q[1] + 5, labs.side[kx], 'middle'); } });
  return svg(320, 205, s, tr('Segitiga ABC', 'Triangle ABC'));
}
const SINRAT = [[30, 45, 1, 2, 1], [30, 60, 1, 3, 1], [45, 30, 1, 2, 2], [45, 60, 1, 6, 2], [60, 45, 1, 6, 3], [60, 30, 1, 3, 3]];
const COSL = [[3, 5, 120, 7], [5, 8, 60, 7], [3, 8, 60, 7], [8, 15, 60, 13], [7, 8, 120, 13], [5, 3, 120, 7]];
function smaLawTri(d) {
  if (d === 1 || (d === 2 && rnd() < 0.4)) {
    const [A, B, , rr, den] = pick(SINRAT), kk = R(1, 6), a = den * kk, ans = mulRt(kk, rr), C = 180 - A - B;
    const cb = A * D2R, bb = B * D2R, cc = C * D2R, c = Math.sin(cc) / Math.sin(cb) * 1;
    const Bpt = [c, 0], b = Math.sin(bb) / Math.sin(cb), Cpt = [b * Math.cos(cb), b * Math.sin(cb)];
    const wr = [mulRt(a * (rr === 2 && den === 2 ? 1 : 1), rr), mulRt(a, 2), N(a), mulRt(2 * kk, rr), N(a * 2), `${a}${rt(3)}`].filter(x => x !== ans);
    return {
      q: tr(`Pada segitiga ABC, sisi <b>a = ${a} cm</b> (di depan sudut A), sudut <b>A = ${A}°</b>, dan sudut <b>B = ${B}°</b>. Panjang sisi <b>b</b> (di depan sudut B) adalah … cm`, `In triangle ABC, side <b>a = ${a} cm</b> (opposite angle A), angle <b>A = ${A}°</b>, and angle <b>B = ${B}°</b>. The length of side <b>b</b> (opposite angle B) is … cm`),
      viz: svgTriGen([[0, 0], Bpt, Cpt], { ang: [A + '°', B + '°', ''], side: [a + ' cm', '?', ''] }),
      o: opts(ans, wr, () => R(2, 60) + rt(R(2, 3))),
      exp: ST(tr('Aturan sinus: a ÷ sin A = b ÷ sin B', 'Law of sines: a ÷ sin A = b ÷ sin B'), `b = a × sin B ÷ sin A = ${a} × sin ${B}° ÷ sin ${A}°`, `= ${a} × ${exact(Math.sin(bb))} ÷ ${exact(Math.sin(cb))}`, `= <b>${ans} cm</b>`) + TIP('Aturan sinus cocok jika diketahui sepasang sisi dan sudut yang berhadapan, ditambah satu sudut lain.', 'The law of sines works when you know a side and its opposite angle, plus one more angle.')
    };
  }
  const [a, b, g, c] = pick(COSL), gr = g * D2R, Cp = [0, 0], Ap = [b, 0], Bp = [a * Math.cos(gr), a * Math.sin(gr)];
  const ans = N(c), cosv = g === 60 ? fr(1, 2) : MINUS + fr(1, 2);
  return {
    q: tr(`Pada segitiga ABC diketahui sisi <b>a = ${a} cm</b>, <b>b = ${b} cm</b>, dan sudut apit <b>C = ${g}°</b>. Panjang sisi <b>c</b> adalah … cm`, `In triangle ABC, side <b>a = ${a} cm</b>, <b>b = ${b} cm</b>, and the included angle <b>C = ${g}°</b>. The length of side <b>c</b> is … cm`),
    viz: svgLaw(a, b, g, c),
    o: numOpts(c, [a + b, Math.round(Math.sqrt(a * a + b * b) * 100) / 100, c * c, Math.abs(a - b), c + 1, c - 1].filter(x => x !== c), N, 1),
    exp: ST(tr('Aturan kosinus: c² = a² + b² − 2ab cos C', 'Law of cosines: c² = a² + b² − 2ab cos C'), `c² = ${a}² + ${b}² ${MINUS} 2(${a})(${b}) cos ${g}°`, `= ${a * a} + ${b * b} ${MINUS} ${2 * a * b} × ${g === 60 ? '½' : '(−½)'} = ${c * c}`, `c = √${c * c} = <b>${c} cm</b>`) + TIP('Aturan kosinus dipakai jika diketahui dua sisi dan sudut di antaranya. Jika sudutnya 90°, hasilnya kembali menjadi Pythagoras.', 'Use the law of cosines when you know two sides and the angle between them. At 90° it reduces to Pythagoras.')
  };
}
function svgLaw(a, b, g, c) {
  const gr = g * D2R, Cp = [0, 0], Ap = [b, 0], Bp = [a * Math.cos(gr), a * Math.sin(gr)];
  return svgTriGen([Ap, Bp, Cp].map(p => p), { ang: ['', '', g + '°'], side: [a + ' cm', b + ' cm', '?'] });
}
/* ---- grafik gelombang ---- */
function smaWave(d) {
  const A = pick([1, 2, 3]), B = pick([1, 2, 3]), Dd = pick([0, 0, 1, -1, 2]), kind = d === 3 ? pick(['sin', 'cos']) : 'sin';
  const f = x => A * (kind === 'sin' ? Math.sin : Math.cos)(B * x * D2R) + Dd, lo = Dd - A - 1, hi = Dd + A + 1;
  const eq = (a, b, dd) => `y = ${a === 1 ? '' : a}${kind} ${b === 1 ? '' : b}x${dd ? (dd > 0 ? ' + ' : ' ' + MINUS + ' ') + Math.abs(dd) : ''}`;
  const pl = plot({ w: 340, h: 230, xr: [0, 360], yr: [lo, hi], xs: 90, ys: hi - lo > 7 ? 2 : 1, fns: [f], label: tr('Grafik fungsi trigonometri', 'Graph of a trigonometric function') });
  if (d === 1) { const ask = pick(['max', 'min']), v = ask === 'max' ? A + Dd : -A + Dd; return { q: tr(`Perhatikan grafik fungsi trigonometri berikut (sumbu x dalam derajat). Nilai <b>${ask === 'max' ? 'maksimum' : 'minimum'}</b> fungsi adalah …`, `Look at the graph of this trigonometric function (x-axis in degrees). The <b>${ask === 'max' ? 'maximum' : 'minimum'}</b> value of the function is …`), viz: pl, o: numOpts(v, [A, -v, Dd, A + Dd + 1, ask === 'max' ? -A + Dd : A + Dd], sg), exp: ST(tr(`Titik tertinggi grafik ada pada y = ${A + Dd} dan titik terendah pada y = ${-A + Dd}.`, `The highest point of the graph is at y = ${A + Dd} and the lowest at y = ${-A + Dd}.`), tr(`Nilai ${ask === 'max' ? 'maksimum' : 'minimum'} = <b>${sg(v)}</b>`, `The ${ask === 'max' ? 'maximum' : 'minimum'} value is <b>${sg(v)}</b>`)) + TIP('Nilai maksimum = garis tengah + amplitudo, minimum = garis tengah − amplitudo.', 'Maximum = midline + amplitude, minimum = midline − amplitude.') }; }
  if (d === 2) { const per = 360 / B; return { q: tr('Perhatikan grafik berikut (sumbu x dalam derajat). Periode fungsi tersebut adalah …', 'Look at this graph (x-axis in degrees). The period of the function is …'), viz: pl, o: numOpts(per, [360, per * 2, per / 2, B * 90, 180].filter(x => x !== per), x => N(x) + '°', 30), exp: ST(tr('Periode adalah panjang satu siklus penuh, misalnya jarak antara dua puncak yang berurutan.', 'The period is the length of one full cycle, for example the distance between two consecutive peaks.'), tr(`Pada grafik, ada ${B} siklus dalam 360°, jadi periode = 360° ÷ ${B} = <b>${per}°</b>`, `The graph shows ${B} cycle${B > 1 ? 's' : ''} in 360°, so the period = 360° ÷ ${B} = <b>${per}°</b>`)) + TIP('Untuk y = a sin bx, periode = 360° ÷ b.', 'For y = a sin bx, the period is 360° ÷ b.') }; }
  const ans = eq(A, B, Dd);
  return { q: tr('Persamaan grafik fungsi trigonometri berikut (sumbu x dalam derajat) adalah …', 'The equation of the trigonometric graph shown (x-axis in degrees) is …'), viz: pl, o: opts(ans, [eq(A === 1 ? 2 : 1, B, Dd), eq(A, B === 1 ? 2 : B - 1, Dd), eq(A, B, Dd ? 0 : 1), eq(B, A, Dd), eq(A + 1, B, Dd)].filter(x => x !== ans), () => eq(R(1, 3), R(1, 3), R(-1, 2))),
    exp: ST(tr(`Amplitudo = (maks − min) ÷ 2 = (${A + Dd} ${MINUS} (${sg(-A + Dd)})) ÷ 2 = ${A}`, `Amplitude = (max − min) ÷ 2 = (${A + Dd} ${MINUS} (${sg(-A + Dd)})) ÷ 2 = ${A}`), tr(`Garis tengah = (maks + min) ÷ 2 = ${Dd}`, `Midline = (max + min) ÷ 2 = ${Dd}`), tr(`Banyak siklus dalam 360° = ${B}, jadi b = ${B}`, `Number of cycles in 360° = ${B}, so b = ${B}`), kind === 'sin' ? tr('Grafik dimulai dari garis tengah menuju naik, jadi bentuk sin.', 'The graph starts at the midline going up, so it is a sine.') : tr('Grafik dimulai dari titik maksimum, jadi bentuk cos.', 'The graph starts at its maximum, so it is a cosine.'), `<b>${ans}</b>`) + TIP('Cari tiga hal berurutan: amplitudo, garis tengah, lalu periode. Titik awal grafik membedakan sin dan cos.', 'Find three things in order: amplitude, midline, then period. The starting point tells sin from cos.') };
}
/* ---- tangga bersandar ---- */
function sceneLadder(a, L, hL, angL, dL) {
  const W = 330, H = 215, gy = 175, wx = 270, Lp = 160, r = a * D2R, fx = wx - Lp * Math.cos(r), ty = gy - Lp * Math.sin(r);
  let s = `<line class="ln" x1="6" y1="${gy}" x2="${W - 6}" y2="${gy}"/><rect x="${wx}" y="${ty - 20}" width="28" height="${gy - ty + 20}" class="f1"/>`;
  s += `<line class="ln" style="stroke-width:5" x1="${f1(fx)}" y1="${gy}" x2="${wx}" y2="${f1(ty)}"/>`;
  s += `<line class="ln dash" style="stroke-width:1.6" x1="${wx}" y1="${f1(ty)}" x2="${wx}" y2="${gy}"/>`;
  s += `<path d="${arcP(fx, gy, 36, 0, a)}" class="ln" style="stroke-width:2"/>` + TX(fx + 54, gy - 8, angL, 'middle', 'acc');
  s += TX((fx + wx) / 2 - 14, (gy + ty) / 2 - 6, L, 'end', 'big');
  if (hL) s += TX(wx - 8, (gy + ty) / 2 + 5, hL, 'end', 'big');
  if (dL) s += `<line class="ln" style="stroke-width:1.6" x1="${f1(fx)}" y1="${gy + 16}" x2="${wx}" y2="${gy + 16}"/>` + TX((fx + wx) / 2, gy + 34, dL, 'middle', 'big');
  return svg(W, H, s, tr('Tangga bersandar pada dinding', 'Ladder leaning on a wall'));
}
function smaLadder(d) {
  const L = pick([6, 8, 10, 12, 16, 20]), ang = pick([30, 45, 60]);
  if (d === 3 && rnd() < 0.5) {
    const h = ang === 30 ? N(L / 2) : ang === 45 ? mulRt(L / 2, 2) : mulRt(L / 2, 3), angs = shuffle([30, 45, 60, 75]);
    return { q: tr(`Sebuah tangga sepanjang <b>${L} m</b> bersandar pada dinding dan ujung atasnya menyentuh dinding pada ketinggian <b>${h} m</b>. Sudut yang dibentuk tangga dengan tanah adalah …`, `A <b>${L} m</b> ladder leans against a wall and its top touches the wall at a height of <b>${h} m</b>. The angle the ladder makes with the ground is …`), viz: sceneLadder(ang, L + ' m', stripTags(h) + ' m', 'α = ?', ''),
      o: { opts: angs.map(x => x + '°'), ans: angs.indexOf(ang) }, exp: ST(tr(`sin α = ${tr('tinggi', 'height')} ÷ ${tr('panjang tangga', 'ladder length')} = ${h} ÷ ${L}`, `sin α = height ÷ ladder length = ${h} ÷ ${L}`), `sin α = ${exact(Math.sin(ang * D2R))}`, tr(`Sudut istimewa dengan nilai sin itu adalah <b>${ang}°</b>`, `The special angle with that sine is <b>${ang}°</b>`)) + TIP('Tinggi dan panjang tangga adalah sisi depan dan sisi miring, jadi gunakan sin.', 'The height and the ladder are the opposite side and the hypotenuse, so use sin.') };
  }
  const askH = rnd() < 0.6, val = askH ? L * Math.sin(ang * D2R) : L * Math.cos(ang * D2R);
  const tmp1 = (r, den) => (r === 1 ? N(L / den) : mulRt(L / den, r)); let ans;
  const sinS = { 30: N(L / 2), 45: mulRt(L / 2, 2), 60: mulRt(L / 2, 3) }, cosS = { 30: mulRt(L / 2, 3), 45: mulRt(L / 2, 2), 60: N(L / 2) };
  ans = (askH ? sinS : cosS)[ang];
  const wr = [(askH ? cosS : sinS)[ang], N(L), mulRt(L, 3), mulRt(L, 2), N(L / 2)].filter(x => x !== ans);
  return {
    q: tr(`Sebuah tangga sepanjang <b>${L} m</b> bersandar pada dinding dan membentuk sudut <b>${ang}°</b> dengan tanah. ${askH ? 'Berapa tinggi ujung tangga dari tanah?' : 'Berapa jarak kaki tangga dari dinding?'}`, `A <b>${L} m</b> ladder leans against a wall, making an angle of <b>${ang}°</b> with the ground. ${askH ? 'How high does the top of the ladder reach?' : 'How far is the foot of the ladder from the wall?'}`),
    viz: sceneLadder(ang, L + ' m', askH ? '?' : '', ang + '°', askH ? '' : '?'), o: opts(ans + ' m', wr.map(x => x + ' m'), () => R(2, 30) + rt(3) + ' m'),
    exp: ST(tr('Tangga, tanah, dan dinding membentuk segitiga siku-siku. Tangga adalah sisi miring.', 'The ladder, ground, and wall form a right triangle. The ladder is the hypotenuse.'), askH ? `${tr('tinggi', 'height')} = ${L} × sin ${ang}° = ${L} × ${exact(Math.sin(ang * D2R))}` : `${tr('jarak', 'distance')} = ${L} × cos ${ang}° = ${L} × ${exact(Math.cos(ang * D2R))}`, `<b>${ans} m</b>`) + TIP('Sisi di depan sudut tanah adalah tinggi (sin), sisi di sampingnya adalah jarak ke dinding (cos).', 'The side opposite the ground angle is the height (sin), and the side next to it is the distance to the wall (cos).')
  };
}
/* ---- kincir ria ---- */
function sceneFerris(th, Rm) {
  const W = 300, H = 230, cx = 150, cy = 105, Rp = 82, gy = 205, a = (-90 + th) * D2R, px = cx + Rp * Math.cos(a), py = cy - Rp * Math.sin(a);
  let s = `<line class="ln" x1="6" y1="${gy}" x2="${W - 6}" y2="${gy}"/><line class="ln" x1="${cx}" y1="${cy}" x2="${cx - 36}" y2="${gy}"/><line class="ln" x1="${cx}" y1="${cy}" x2="${cx + 36}" y2="${gy}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${Rp}" class="f0"/>`;
  for (let i = 0; i < 8; i++) { const t = i * 45 * D2R; s += `<line class="ln" style="stroke-width:1.2" x1="${cx}" y1="${cy}" x2="${f1(cx + Rp * Math.cos(t))}" y2="${f1(cy - Rp * Math.sin(t))}"/>`; }
  s += `<line class="ln dash" style="stroke-width:1.8" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + Rp}"/><line class="ln c2" style="stroke-width:3" x1="${cx}" y1="${cy}" x2="${f1(px)}" y2="${f1(py)}"/>`;
  s += `<path d="${arcP(cx, cy, 28, -90, -90 + th)}" class="ln" style="stroke-width:2"/>` + TX(cx + 40 * Math.sin(th / 2 * D2R), cy + 40 * Math.cos(th / 2 * D2R) + 5, th + '°', 'middle', 'acc');
  s += `<line class="ln dash" style="stroke-width:1.8" x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px)}" y2="${gy}"/><circle cx="${f1(px)}" cy="${f1(py)}" r="7" class="dot acc"/>`;
  s += TX(px + (px > cx ? 12 : -12), (py + gy) / 2 + 5, '?', px > cx ? 'start' : 'end', 'big') + TX(8, 18, 'R = ' + Rm + ' m', 'start', 'big');
  s += TX(cx + Rp + 14, gy - ((gy - cy - Rp) / 2) + 4, '1 m', 'start', 'tick');
  return svg(W, H, s, tr('Kincir ria', 'Ferris wheel'));
}
function smaFerris(d) {
  const Rm = pick([10, 12, 16, 20, 24]), th = pick(d === 1 ? [60, 90, 120, 180] : [60, 90, 120, 150, 180, 210]), c = Math.cos(th * D2R);
  const val = 1 + Rm * (1 - c), isInt = Math.abs(Math.round(val) - val) < 1e-9, h = Rm / 2, p = 1 + Rm; let ans, wr;
  if (isInt) { ans = N(val); wr = [1 + Rm * (1 + c), Rm * (1 - c), 1 + Rm, 2 * Rm + 1, Rm + 1 + Rm * Math.abs(c)].filter(v => Math.abs(Math.round(v) - v) < 1e-9).map(v => N(v)); }
  else { ans = `${p} + ${mulRt(h, 3)}`; wr = [`${p} ${MINUS} ${mulRt(h, 3)}`, `${p} + ${mulRt(Rm, 3)}`, `${Rm} + ${mulRt(h, 3)}`, `${2 * Rm + 1}`]; }
  return {
    q: tr(`Sebuah kincir ria berjari-jari <b>${Rm} m</b>. Titik terendah roda berada <b>1 m</b> di atas tanah. Setelah berputar <b>${th}\u00B0</b> dari titik terendah, ketinggian seorang penumpang dari tanah adalah \u2026 m`, `A Ferris wheel has a radius of <b>${Rm} m</b>. The lowest point of the wheel is <b>1 m</b> above the ground. After turning <b>${th}\u00B0</b> from the lowest point, a rider's height above the ground is \u2026 m`),
    viz: sceneFerris(th, Rm), o: opts(ans, wr, () => N(R(2, 2 * Rm + 1))),
    exp: ST(tr(`Tinggi dari titik terendah = R \u2212 R cos \u03B8 = ${Rm} ${MINUS} ${Rm} cos ${th}\u00B0`, `Height above the lowest point = R \u2212 R cos \u03B8 = ${Rm} ${MINUS} ${Rm} cos ${th}\u00B0`), `cos ${th}\u00B0 = ${exact(c)}`, tr(`Tinggi dari tanah = 1 + ${Rm}(1 ${MINUS} ${exact(c)}) = <b>${ans} m</b>`, `Height above ground = 1 + ${Rm}(1 ${MINUS} ${exact(c)}) = <b>${ans} m</b>`)) + TIP('Mulai dari titik terendah, lalu tambahkan seberapa jauh penumpang naik: R(1 \u2212 cos \u03B8). Jangan lupa tinggi dasar 1 m.', 'Start from the lowest point and add how far the rider has risen: R(1 \u2212 cos \u03B8). Do not forget the 1 m clearance.')
  };
}
/* ---- radian ---- */
const radStr = deg => { const g = gcd(deg, 180), n = deg / g, dd = 180 / g, top = n === 1 ? 'π' : n + 'π'; return dd === 1 ? top : fr(top, dd); };
function smaRadian(d) {
  if (d < 3) {
    const deg = pick(d === 1 ? [30, 45, 60, 90, 120, 180] : [135, 150, 210, 225, 240, 270, 300, 315, 330]), ans = radStr(deg);
    const alt = shuffle([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].filter(x => x !== deg)).slice(0, 4).map(radStr);
    return { q: tr(`Sudut <b>θ = ${deg}°</b> pada gambar jika dinyatakan dalam radian sama dengan …`, `The angle <b>θ = ${deg}°</b> in the figure, expressed in radians, equals …`), viz: svgUnit(deg, { plabel: '' }), o: opts(ans + ' rad', alt.map(x => x + ' rad'), () => radStr(R(1, 23) * 15) + ' rad'), exp: ST(tr('π radian = 180°, jadi 1° = π ÷ 180 radian.', 'π radians = 180°, so 1° = π ÷ 180 radians.'), `${deg}° × ${fr('π', 180)} = ${fr(deg + 'π', 180)}`, tr(`Sederhanakan: <b>${ans} rad</b>`, `Simplify: <b>${ans} rad</b>`)) + TIP('Hafalkan 180° = π. Maka 90° = π/2, 60° = π/3, 45° = π/4, 30° = π/6.', 'Remember 180° = π. Then 90° = π/2, 60° = π/3, 45° = π/4, 30° = π/6.') };
  }
  const [n, dn] = pick([[1, 3], [1, 4], [1, 6], [2, 3], [5, 6], [3, 4]]), r = dn * R(1, 4) * (dn % 4 === 0 ? 1 : 2), deg = n * 180 / dn, arc = r * n / dn, area = r * r * n / dn / 2, isArc = rnd() < 0.5;
  const th = (n === 1 ? 'π' : n + 'π'), thS = fr(th, dn), ans = (isArc ? N(arc) : N(area)) + 'π';
  return { q: tr(`Sebuah juring lingkaran berjari-jari <b>${r} cm</b> dengan sudut pusat <b>${thS}</b> radian (= ${deg}°). Berapa ${isArc ? 'panjang busur' : 'luas juring'}-nya?`, `A circle sector has a radius of <b>${r} cm</b> and a central angle of <b>${thS}</b> radians (= ${deg}°). What is its ${isArc ? 'arc length' : 'area'}?`),
    viz: svgCircle({ mode: 'sector', label: r + ' cm', angle: deg }), o: opts(ans + (isArc ? ' cm' : ' cm²'), [N(isArc ? area : arc) + 'π' + (isArc ? ' cm' : ' cm²'), N(isArc ? arc * 2 : area * 2) + 'π' + (isArc ? ' cm' : ' cm²'), N(r * r * n / dn) + 'π' + (isArc ? ' cm' : ' cm²'), N(isArc ? arc / 2 : area / 2) + 'π' + (isArc ? ' cm' : ' cm²')], () => N(R(2, 90)) + 'π' + (isArc ? ' cm' : ' cm²')),
    exp: ST(isArc ? tr(`Panjang busur s = r × θ (θ dalam radian) = ${r} × ${thS}`, `Arc length s = r × θ (θ in radians) = ${r} × ${thS}`) : tr(`Luas juring = ½ × r² × θ = ½ × ${r}² × ${thS}`, `Sector area = ½ × r² × θ = ½ × ${r}² × ${thS}`), `= <b>${ans}</b>`) + TIP('Dalam radian, rumus busur dan juring paling sederhana: s = rθ dan L = ½ r²θ.', 'In radians the arc and sector formulas are simplest: s = rθ and A = ½ r²θ.') };
}

TOPICS.sma.push({ id: 'trig-gambar', name: 'Trigonometri Bergambar', glyph: '∠', desc: 'Lingkaran satuan, sudut elevasi, arah mata angin, grafik gelombang, dan kincir ria.', gens: [G(1, smaUnitCircle), G(1, smaQuadSign), G(1, smaTrigElev), G(1, smaBearing), G(1, smaLawTri), G(1, smaWave), G(1, smaLadder), G(2, smaFerris), G(1, smaRadian)] });
