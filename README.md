# Jagoan Matematika (mathquiz)

Bank soal matematika bernomor tetap, dari SD sampai kuliah, dengan filter materi, penanda status
(belum / dicoba / selesai), pembahasan langkah demi langkah, dan antarmuka dua bahasa (ID/EN).

Status: **versi 8**. 189.584 soal buatan template (semua tipe punya versi ID dan EN) ditambah 8.792 soal cerita GSM8K (khusus bahasa Inggris, format isian angka), total 198.376 soal.

## Struktur
- `src/core.js` mesin inti (angka, i18n, pembuat pilihan jawaban, gambar SVG)
- `src/gen_*.js` generator soal per jenjang
- `src/meta.js` katalog materi dan judul tipe soal (ID/EN)
- `src/bank.js` daftar seed soal unik (dihasilkan, jangan diedit manual)
- `src/gen_ext1.js`, `gen_ext2.js`, `gen_ext3.js` generator perluasan (`…X`) untuk 20 tipe soal yang dulu sempit; didaftarkan di akhir `gen_ext3.js`
- `src/gsm.js` soal GSM8K (dihasilkan oleh `tools/build_gsm.js` dari `data/gsm8k/`)
- `tools/` alat bantu: `extract_i18n.js` / `apply_i18n.js` (terjemahan), `build_gsm.js`; terjemahan ada di `tools/en/`
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

## Soal GSM8K
Diambil dari [openai/grade-school-math](https://github.com/openai/grade-school-math) (train + test, 8.792 soal),
© 2021 OpenAI, **MIT License** (salinan di `data/gsm8k/LICENSE`). Soal tetap berbahasa Inggris dan dijawab dengan angka.
Jenjang dan kesulitan ditentukan dari jumlah langkah penyelesaian, materi dari kata kunci. Itu heuristik, bukan label dari GSM8K.
Nomor soal GSM8K ditaruh di belakang soal template, jadi menjalankan `node tools/build_gsm.js` tidak menggeser nomor soal lain.

## Urutan nomor soal
Nomor soal disusun dalam tiga blok: (1) generator utama, (2) GSM8K, (3) generator perluasan (`…X`). Blok baru selalu ditambah di
belakang dan `build_bank.js` memproses generator perluasan paling akhir, jadi seed dan nomor soal yang sudah ada tidak bergeser
(diverifikasi: seed 158 generator lama identik). Mengubah generator lama tetap menggeser nomor soal.

## Catatan
Nomor soal bergantung pada isi generator. Menambah atau mengubah generator membangun ulang bank dan
dapat menggeser nomor, sehingga progres yang tersimpan di browser tidak lagi cocok.
