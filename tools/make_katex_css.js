/* Buat src/katex.css: CSS KaTeX + font woff2 tertanam (CSS/font dari CDN diblok oleh halaman terbit) */
const fs = require('fs'), path = require('path');
const dist = process.argv[2], keep = ['AMS-Regular', 'Main-Regular', 'Main-Bold', 'Main-Italic', 'Main-BoldItalic', 'Math-Italic', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'];
let css = fs.readFileSync(path.join(dist, 'katex.min.css'), 'utf8'), kept = 0;
css = css.replace(/@font-face\{[^}]*\}/g, blk => {
  const m = blk.match(/url\(fonts\/(KaTeX_[\w-]+)\.woff2\)/); if (!m) return '';
  const name = m[1].replace('KaTeX_', ''); if (!keep.includes(name)) return '';
  const b64 = fs.readFileSync(path.join(dist, 'fonts', m[1] + '.woff2')).toString('base64'); kept++;
  return blk.replace(/src:[^;}]*/, `src:url(data:font/woff2;base64,${b64}) format("woff2")`);
});
fs.writeFileSync('src/katex.css', css); console.log('font tertanam:', kept, '| ukuran css', (css.length / 1024).toFixed(0), 'KB');
