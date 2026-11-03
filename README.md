# Jagoan Matematika (mathquiz)

Bank soal matematika bernomor tetap, dari SD sampai kuliah, dengan filter materi, penanda status
(belum / dicoba / selesai), pembahasan langkah demi langkah, dan antarmuka dua bahasa (ID/EN).

Status: **versi 3** (SD sampai Umum, 115 ribu soal unik). Terjemahan Inggris isi soal baru mencakup Kuliah, Umum, dan trigonometri bergambar.

## Struktur
- `src/core.js` mesin inti (angka, i18n, pembuat pilihan jawaban, gambar SVG)
- `src/gen_*.js` generator soal per jenjang
- `src/meta.js` katalog materi dan judul tipe soal (ID/EN)
- `src/bank.js` daftar seed soal unik (dihasilkan, jangan diedit manual)
- `src/app.js`, `src/style.css` antarmuka
- `build_bank.js` membangun `src/bank.js` dan membuang soal kembar
- `build.js` menggabungkan semuanya menjadi `index.html` dan `dist/index.html`
- `test.js` tes otomatis generator

## Pakai
Butuh Node.js.

```bash
node build_bank.js   # opsional: bangun ulang bank soal (nomor soal bisa bergeser)
node build.js        # hasilnya: dist/index.html
```

Buka `dist/index.html` di browser. Tidak perlu server.

## Deploy ke Vercel
Impor repo ini di Vercel, biarkan Framework Preset **Other**. `vercel.json` sudah mengarahkan
output ke `dist/` dan tanpa build command.

## Catatan
Nomor soal bergantung pada isi generator. Menambah atau mengubah generator membangun ulang bank dan
dapat menggeser nomor, sehingga progres yang tersimpan di browser tidak lagi cocok.
