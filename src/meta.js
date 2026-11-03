'use strict';
/* ====== Katalog materi, judul tipe soal, dan peta jenjang ====== */
const LEVELS = [
  { id: 'sd', id_: 'SD', en: 'Elementary', rid: 'Kelas 1–6', ren: 'Grades 1–6' },
  { id: 'smp', id_: 'SMP', en: 'Junior High', rid: 'Kelas 7–9', ren: 'Grades 7–9' },
  { id: 'sma', id_: 'SMA', en: 'Senior High', rid: 'Kelas 10–12', ren: 'Grades 10–12' },
  { id: 'kuliah', id_: 'Kuliah', en: 'University', rid: 'Mahasiswa', ren: 'Undergraduate' },
  { id: 'umum', id_: 'Umum', en: 'General', rid: 'Semua usia', ren: 'All ages' }
];
const DIFFS = [{ id: 'Mudah', en: 'Easy' }, { id: 'Sedang', en: 'Medium' }, { id: 'Sulit', en: 'Hard' }];
/* id materi: [Indonesia, Inggris] */
const MATERI = {
  aritmatika: ['Aritmatika', 'Arithmetic'], pecahan: ['Pecahan', 'Fractions'], persen: ['Persen', 'Percentages'], rasio: ['Rasio & Skala', 'Ratio & Scale'],
  keuangan: ['Uang & Keuangan', 'Money & Finance'], waktu: ['Jam & Waktu', 'Time & Clocks'], pola: ['Pola Bilangan', 'Number Patterns'],
  aljabar: ['Aljabar', 'Algebra'], pertidaksamaan: ['Pertidaksamaan', 'Inequalities'], fungsi: ['Fungsi', 'Functions'], 'fungsi-kuadrat': ['Fungsi Kuadrat', 'Quadratics'],
  eksponen: ['Eksponen', 'Exponents'], logaritma: ['Logaritma', 'Logarithms'], barisan: ['Barisan & Deret', 'Sequences & Series'],
  geometri: ['Geometri Bidang', 'Plane Geometry'], 'geometri-ruang': ['Geometri Ruang', 'Solid Geometry'], 'geometri-analitik': ['Geometri Analitik', 'Coordinate Geometry'],
  transformasi: ['Transformasi', 'Transformations'], vektor: ['Vektor', 'Vectors'], matriks: ['Matriks', 'Matrices'], trigonometri: ['Trigonometri', 'Trigonometry'],
  statistika: ['Statistika', 'Statistics'], peluang: ['Peluang', 'Probability'], kombinatorika: ['Kombinatorika', 'Combinatorics'],
  'teori-bilangan': ['Teori Bilangan', 'Number Theory'], 'himpunan-logika': ['Himpunan & Logika', 'Sets & Logic'],
  limit: ['Limit', 'Limits'], turunan: ['Turunan', 'Derivatives'], integral: ['Integral', 'Integrals'], 'aljabar-linear': ['Aljabar Linear', 'Linear Algebra'],
  kompleks: ['Bilangan Kompleks', 'Complex Numbers'], diferensial: ['Persamaan Diferensial', 'Differential Equations'], 'deret-takhingga': ['Deret Tak Hingga', 'Infinite Series'],
  diskrit: ['Matematika Diskrit', 'Discrete Math'], 'multi-variabel': ['Kalkulus Multivariabel', 'Multivariable Calculus'],
  logika: ['Teka-teki Logika', 'Logic Puzzles'], gerak: ['Kecepatan & Pekerjaan', 'Speed & Work'], estimasi: ['Hitung Cepat', 'Mental Math'], satuan: ['Satuan & Pengukuran', 'Units & Measurement']
};
/* nama fungsi generator -> [materi, judul id, judul en] */
const GEN_META = {
  sdAdd: ['aritmatika', 'Penjumlahan Cerita', 'Addition Stories'], sdSub: ['aritmatika', 'Pengurangan Cerita', 'Subtraction Stories'], sdMoney: ['keuangan', 'Belanja dan Kembalian', 'Shopping and Change'],
  sdMul: ['aritmatika', 'Perkalian Cerita', 'Multiplication Stories'], sdDiv: ['aritmatika', 'Pembagian Rata', 'Equal Sharing'], sdCeil: ['aritmatika', 'Pembagian Bersisa', 'Division with Remainder'],
  sdFracRead: ['pecahan', 'Membaca Pecahan dari Gambar', 'Reading Fractions from a Picture'], sdFracAdd: ['pecahan', 'Menjumlah Pecahan', 'Adding Fractions'], sdFracOf: ['pecahan', 'Pecahan dari Jumlah', 'Fraction of a Quantity'], sdFracCmp: ['pecahan', 'Membandingkan Pecahan', 'Comparing Fractions'],
  sdShapes: ['geometri', 'Keliling dan Luas Bangun Datar', 'Perimeter and Area of Shapes'], sdTri: ['geometri', 'Luas Segitiga', 'Area of a Triangle'], sdPerim: ['geometri', 'Mencari Sisi dari Keliling', 'Side from Perimeter'],
  sdPattern: ['pola', 'Menebak Pola Bilangan', 'Guess the Pattern'], sdClock: ['waktu', 'Membaca Jam Analog', 'Reading an Analog Clock'], sdDur: ['waktu', 'Durasi dan Waktu Selesai', 'Duration and End Time'],
  smpInt: ['aritmatika', 'Bilangan Bulat', 'Integers'], smpOps: ['aritmatika', 'Urutan Operasi Hitung', 'Order of Operations'], smpFpbKpk: ['teori-bilangan', 'KPK dan FPB dalam Cerita', 'LCM and GCF Stories'],
  smpLinear: ['aljabar', 'Persamaan Linear', 'Linear Equations'], smpAlg: ['aljabar', 'Menyederhanakan Bentuk Aljabar', 'Simplifying Algebraic Expressions'], smpWord: ['aljabar', 'Soal Cerita Aljabar', 'Algebra Word Problems'],
  smpPercent: ['persen', 'Diskon dan Harga Bayar', 'Discounts and Final Price'], smpPercent2: ['persen', 'Persen Naik dan Harga Awal', 'Percent Change and Original Price'], smpScale: ['rasio', 'Skala dan Perbandingan', 'Scale and Proportion'],
  smpPyth: ['geometri', 'Teorema Pythagoras', 'Pythagorean Theorem'], smpPythStory: ['geometri', 'Pythagoras dalam Cerita', 'Pythagoras in Real Life'], smpTriType: ['geometri', 'Jenis Segitiga dari Sisinya', 'Triangle Type from Sides'],
  smpCircle: ['geometri', 'Keliling dan Luas Lingkaran', 'Circle Circumference and Area'], smpSector: ['geometri', 'Juring dan Busur', 'Sectors and Arcs'], smpWheel: ['geometri', 'Roda yang Berputar', 'Rolling Wheel'],
  smpStat: ['statistika', 'Rata-rata dan Median', 'Mean and Median'], smpProb: ['peluang', 'Peluang Kejadian', 'Probability of Events'], smpExp: ['peluang', 'Frekuensi Harapan', 'Expected Frequency'],
  smaQuad: ['fungsi-kuadrat', 'Akar Persamaan Kuadrat', 'Roots of a Quadratic'], smaVertex: ['fungsi-kuadrat', 'Titik Puncak Parabola', 'Parabola Vertex'], smaDisc: ['fungsi-kuadrat', 'Diskriminan', 'The Discriminant'],
  smaExp: ['eksponen', 'Sifat-sifat Eksponen', 'Laws of Exponents'], smaLog: ['logaritma', 'Sifat-sifat Logaritma', 'Laws of Logarithms'], smaExpEq: ['eksponen', 'Persamaan Eksponen dan Logaritma', 'Exponential and Log Equations'],
  smaTrigValue: ['trigonometri', 'Nilai Sudut Istimewa', 'Special Angle Values'], smaTrigTri: ['trigonometri', 'Perbandingan Trigonometri', 'Trigonometric Ratios'], smaTower: ['trigonometri', 'Sudut Elevasi', 'Angle of Elevation'],
  smaArith: ['barisan', 'Barisan dan Deret Aritmetika', 'Arithmetic Sequences and Series'], smaGeo: ['barisan', 'Barisan dan Deret Geometri', 'Geometric Sequences and Series'], smaComb: ['kombinatorika', 'Permutasi dan Kombinasi', 'Permutations and Combinations'],
  smaDeriv: ['turunan', 'Turunan Polinom', 'Derivative of a Polynomial'], smaOptim: ['turunan', 'Nilai Maksimum dan Optimasi', 'Maxima and Optimization'], smaFunc: ['fungsi', 'Komposisi dan Invers Fungsi', 'Composite and Inverse Functions'],
  smaLine: ['geometri-analitik', 'Gradien dan Persamaan Garis', 'Slope and Equation of a Line'], smaVec: ['vektor', 'Operasi Vektor', 'Vector Operations'], smaMatrix: ['matriks', 'Determinan dan Invers Matriks', 'Determinant and Inverse'],
  smaIneq: ['pertidaksamaan', 'Pertidaksamaan', 'Inequalities'], smaSolid: ['geometri-ruang', 'Volume dan Luas Permukaan', 'Volume and Surface Area'], smaMod: ['teori-bilangan', 'Faktor dan Sisa Pembagian', 'Factors and Remainders'],
  smaSet: ['himpunan-logika', 'Himpunan dan Logika', 'Sets and Logic'], smaStat2: ['statistika', 'Jangkauan, Ragam, dan Simpangan Baku', 'Range, Variance and Std. Deviation'], smaTransform: ['transformasi', 'Transformasi Titik', 'Transforming a Point'],
  smaCircleEq: ['geometri-analitik', 'Persamaan Lingkaran', 'Equation of a Circle']
};
/* generator yang sudah punya terjemahan Inggris penuh (soal + pembahasan) */
const EN_READY = new Set();
