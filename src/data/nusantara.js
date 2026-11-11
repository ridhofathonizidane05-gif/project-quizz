// ===== DATA PETA NUSANTARA (Bhinneka Tunggal Ika) =====
// Bentuk pulau dibuat sederhana & "gemuk" biar lucu buat anak TK.
// Koordinat dalam [bujur, lintang]; diubah ke koordinat SVG oleh proyek().

export const LEBAR = 1000;
export const TINGGI = 540;

const X0 = 93.8, SX = 20.5;  // bujur 93.8 -> x=0
const Y0 = 7.8, SY = 27;     // lintang 7.8 -> y=0  (sedikit diregangkan ke bawah biar pulau tidak gepeng)
export const proyek = ([lon, lat]) => [(lon - X0) * SX, (Y0 - lat) * SY];

// Titik-titik -> jalur lengkung halus tertutup (Catmull-Rom -> Bezier)
export function jalur(titik, t = 0.5) {
  const p = titik.map(proyek);
  const n = p.length;
  const f = (v) => Math.round(v * 10) / 10;
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * t) / 3 * 1, p1[1] + ((p2[1] - p0[1]) * t) / 3 * 1];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * t) / 3 * 1, p2[1] - ((p3[1] - p1[1]) * t) / 3 * 1];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}

// Elips kecil untuk pulau-pulau kecil (pusat, radius bujur, radius lintang, miring derajat)
export function elips([lon, lat], rx, ry, miring = 0, n = 10) {
  const a = (miring * Math.PI) / 180;
  return Array.from({ length: n }, (_, i) => {
    const u = (i / n) * Math.PI * 2;
    const x = Math.cos(u) * rx, y = Math.sin(u) * ry;
    return [lon + x * Math.cos(a) - y * Math.sin(a), lat + x * Math.sin(a) + y * Math.cos(a)];
  });
}

export const PULAU = [
  {
    id: 'sumatera', nama: 'Sumatera', judul: 'Pulau Sumatera', julukan: 'Rumah gajah dan harimau',
    emoji: '🐘', warna: '#ffd34d', tua: '#d9a21c',
    pusat: [100.6, -0.6], labelDi: [100.6, -3.1],
    bentuk: [
      [[95.3, 5.6], [97.4, 5.2], [98.8, 3.9], [100.6, 2.4], [102.6, 1.6], [103.9, 0.5], [104.3, -1.0], [104.9, -2.6], [106.0, -3.1], [106.0, -5.0], [105.4, -5.9], [104.3, -5.7], [102.7, -3.9], [101.5, -2.3], [100.7, -0.6], [99.7, 1.0], [98.5, 2.3], [97.1, 3.9]],
    ],
    bahasa: ['Aceh', 'Batak', 'Minang', 'Melayu', 'Lampung', 'Palembang'],
    kata: [
      { b: 'Batak', k: 'Horas!', a: 'Halo, salam sejahtera' },
      { b: 'Minang', k: 'Tarimo kasih', a: 'Terima kasih' },
      { b: 'Aceh', k: 'Teurimong geunaseh', a: 'Terima kasih' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Rumah Gadang', ket: 'Atapnya melengkung seperti tanduk kerbau' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Saman', ket: 'Ditarikan duduk berbaris sambil bertepuk tangan' },
      { j: 'Makanan', ik: '🍲', nama: 'Rendang', ket: 'Daging dimasak dengan santan dan rempah' },
      { j: 'Alat musik', ik: '🥁', nama: 'Talempong', ket: 'Gong kecil yang dipukul' },
      { j: 'Kain adat', ik: '🧵', nama: 'Ulos', ket: 'Kain tenun cantik dari tanah Batak' },
    ],
    fakta: 'Di hutan Sumatera hidup harimau, gajah, dan orangutan Sumatera!',
  },
  {
    id: 'jawa', nama: 'Jawa', judul: 'Pulau Jawa', julukan: 'Tanah angklung dan batik',
    emoji: '🌋', warna: '#ff9a86', tua: '#d9604c',
    pusat: [109.8, -7.4], labelDi: [110.4, -9.5],
    sunda: true,
    bentuk: [
      [[105.2, -6.8], [106.8, -6.0], [108.5, -6.4], [110.5, -6.7], [112.6, -6.8], [114.4, -7.6], [114.3, -8.3], [112.4, -8.2], [110.5, -8.1], [108.6, -7.9], [106.8, -7.8], [105.6, -7.3]],
    ],
    bahasa: ['Sunda', 'Jawa', 'Betawi', 'Madura'],
    kata: [
      { b: 'Sunda', k: 'Wilujeng sumping', a: 'Selamat datang' },
      { b: 'Jawa', k: 'Matur nuwun', a: 'Terima kasih' },
      { b: 'Betawi', k: 'Nyok!', a: 'Ayo!' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Rumah Joglo', ket: 'Atap tengahnya menjulang tinggi' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Jaipong', ket: 'Tarian ceria dari tanah Sunda' },
      { j: 'Makanan', ik: '🍲', nama: 'Gudeg', ket: 'Nangka muda manis dari Yogyakarta' },
      { j: 'Alat musik', ik: '🎶', nama: 'Angklung', ket: 'Dari bambu, digoyang-goyang. Dari tanah Sunda!' },
      { j: 'Kain adat', ik: '🧵', nama: 'Batik', ket: 'Kain bermotif cantik yang dilukis dengan malam' },
    ],
    fakta: 'Angklung dan batik dari Pulau Jawa sudah diakui dunia, lho!',
    sorot: 'Basa Sunda yang sedang kamu pelajari berasal dari sini!',
  },
  {
    id: 'kalimantan', nama: 'Kalimantan', judul: 'Pulau Kalimantan', julukan: 'Pulau hutan dan orangutan',
    emoji: '🦧', warna: '#9be37a', tua: '#4f9f3a',
    pusat: [113.2, 0.6], labelDi: [113.4, -1.9],
    bentuk: [
      [[109.0, 1.0], [109.7, 2.1], [111.2, 2.7], [113.0, 3.6], [114.8, 4.8], [116.0, 6.4], [117.2, 7.0], [118.4, 5.8], [117.9, 4.2], [118.2, 2.5], [117.6, 1.0], [116.8, -1.0], [116.5, -2.8], [115.8, -3.8], [114.2, -4.0], [112.5, -3.4], [110.8, -3.0], [110.0, -2.0], [109.3, -0.4]],
    ],
    bahasa: ['Dayak', 'Banjar', 'Kutai', 'Melayu'],
    kata: [
      { b: 'Banjar', k: 'Kayapa habar?', a: 'Apa kabar?' },
      { b: 'Banjar', k: 'Pian', a: 'Kamu (sopan)' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Rumah Betang', ket: 'Rumah panjang, banyak keluarga tinggal bersama' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Enggang', ket: 'Menirukan burung enggang yang gagah' },
      { j: 'Makanan', ik: '🍲', nama: 'Soto Banjar', ket: 'Soto hangat dimakan dengan ketupat' },
      { j: 'Alat musik', ik: '🎸', nama: 'Sape\u2019', ket: 'Alat musik petik dari kayu' },
      { j: 'Kain adat', ik: '🧵', nama: 'Manik-manik Dayak', ket: 'Hiasan dari butiran manik warna-warni' },
    ],
    fakta: 'Bekantan, monyet berhidung panjang, hanya ada di Pulau Kalimantan!',
  },
  {
    id: 'sulawesi', nama: 'Sulawesi', judul: 'Pulau Sulawesi', julukan: 'Pulau para pelaut',
    emoji: '⛵', warna: '#b79be6', tua: '#7b5ea7',
    pusat: [121.0, -1.9], labelDi: [121.9, -6.5],
    bentuk: [
      [[125.1, 1.6], [124.2, 0.8], [123.0, 0.5], [121.6, 0.6], [120.5, 0.4], [119.9, -0.6], [119.7, -1.9], [119.5, -3.2], [119.6, -4.6], [119.9, -5.6], [120.5, -5.4], [120.4, -4.0], [120.8, -3.1], [121.3, -3.6], [121.9, -4.5], [122.8, -5.0], [122.9, -4.0], [122.3, -3.0], [121.9, -2.4], [122.8, -1.8], [123.4, -1.0], [122.4, -0.8], [121.2, -0.8], [120.8, -0.2], [122.0, 0.1], [123.4, 0.9], [124.4, 1.4]],
    ],
    bahasa: ['Bugis', 'Makassar', 'Toraja', 'Minahasa', 'Gorontalo'],
    kata: [
      { b: 'Bugis', k: 'Aga kareba?', a: 'Apa kabar?' },
      { b: 'Makassar', k: 'Kurru sumanga\u2019', a: 'Terima kasih' },
      { b: 'Manado', k: 'Torang samua basudara', a: 'Kita semua bersaudara' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Tongkonan', ket: 'Rumah Toraja, atapnya seperti perahu' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Pakarena', ket: 'Tarian lembut dari Makassar' },
      { j: 'Makanan', ik: '🍲', nama: 'Coto Makassar', ket: 'Sup daging yang dimakan dengan ketupat' },
      { j: 'Alat musik', ik: '🎶', nama: 'Kecapi', ket: 'Dipetik, suaranya merdu' },
      { j: 'Kain adat', ik: '🧵', nama: 'Baju Bodo', ket: 'Baju adat Bugis-Makassar yang berwarna cerah' },
    ],
    fakta: 'Tarsius, hewan mungil bermata besar, tinggal di hutan Sulawesi!',
  },
  {
    id: 'nusra', nama: 'Bali & Nusa Tenggara', pendek: 'Nusa Tenggara', judul: 'Bali dan Nusa Tenggara', julukan: 'Pulau-pulau komodo',
    emoji: '🦎', warna: '#ff9ecf', tua: '#d9609b',
    pusat: [118.2, -8.7], labelDi: [119.5, -11.3],
    bentuk: [
      elips([115.1, -8.5], 0.75, 0.6, 0, 9),      // Bali
      elips([116.45, -8.6], 0.6, 0.6, 0, 9),    // Lombok
      elips([118.0, -8.65], 1.05, 0.6, 8, 10),      // Sumbawa
      elips([121.5, -8.7], 1.65, 0.55, -4, 12),     // Flores
      elips([120.1, -9.9], 1.05, 0.5, -10, 10),    // Sumba
      elips([125.0, -9.7], 1.8, 0.65, -22, 12),   // Timor
    ],
    bahasa: ['Bali', 'Sasak', 'Sumbawa', 'Manggarai', 'Sumba', 'Dawan'],
    kata: [
      { b: 'Bali', k: 'Om Swastyastu', a: 'Salam sejahtera' },
      { b: 'Bali', k: 'Suksma', a: 'Terima kasih' },
      { b: 'Sasak', k: 'Tampi asih', a: 'Terima kasih' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Mbaru Niang', ket: 'Rumah kerucut tinggi dari Flores' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Pendet', ket: 'Tarian selamat datang dari Bali' },
      { j: 'Makanan', ik: '🍲', nama: 'Ayam Betutu', ket: 'Ayam berbumbu khas Bali' },
      { j: 'Alat musik', ik: '🎶', nama: 'Sasando', ket: 'Dipetik, bentuknya seperti kipas daun lontar' },
      { j: 'Kain adat', ik: '🧵', nama: 'Tenun Ikat', ket: 'Kain tenun bermotif dari Nusa Tenggara' },
    ],
    fakta: 'Komodo, kadal raksasa, hanya hidup di Nusa Tenggara!',
  },
  {
    id: 'maluku', nama: 'Maluku', judul: 'Kepulauan Maluku', julukan: 'Pulau rempah-rempah',
    emoji: '🌿', warna: '#ffa95c', tua: '#d9782a',
    pusat: [128.6, -3.0], labelDi: [128.9, -4.9],
    bentuk: [
      [[127.7, 1.9], [128.5, 1.1], [128.2, 0.2], [128.7, -0.5], [127.9, -0.9], [127.4, 0.1], [127.9, 0.7]],  // Halmahera
      elips([129.4, -3.0], 1.3, 0.45, 5, 10),    // Seram
      elips([126.6, -3.3], 0.6, 0.45, 0, 8),     // Buru
      elips([134.4, -6.0], 0.5, 0.9, 0, 8),      // Aru
    ],
    bahasa: ['Melayu Ambon', 'Ternate', 'Tidore', 'Kei'],
    kata: [
      { b: 'Ambon', k: 'Beta', a: 'Saya' },
      { b: 'Ambon', k: 'Katong', a: 'Kita' },
      { b: 'Ambon', k: 'Basudara', a: 'Bersaudara' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Rumah Baileo', ket: 'Rumah besar tempat warga berkumpul' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Lenso', ket: 'Menari sambil melambaikan sapu tangan' },
      { j: 'Makanan', ik: '🍲', nama: 'Papeda', ket: 'Bubur sagu yang kenyal' },
      { j: 'Alat musik', ik: '🥁', nama: 'Tifa', ket: 'Gendang yang dipukul dengan tangan' },
      { j: 'Kain adat', ik: '🧵', nama: 'Baju Cele', ket: 'Baju adat bergaris warna-warni' },
    ],
    fakta: 'Maluku dijuluki Pulau Rempah. Cengkeh dan pala berasal dari sini!',
  },
  {
    id: 'papua', nama: 'Papua', judul: 'Pulau Papua', julukan: 'Rumah burung cenderawasih',
    emoji: '🦜', warna: '#5fcfb2', tua: '#2f9c82',
    pusat: [136.4, -4.0], labelDi: [136.6, -6.6],
    bentuk: [
      [[131.0, -0.8], [132.5, -0.4], [134.0, -0.8], [135.5, -3.0], [137.0, -2.2], [138.5, -1.8], [140.0, -2.5], [141.0, -2.6], [141.0, -9.1], [139.8, -8.2], [138.2, -8.2], [137.7, -6.5], [136.8, -4.8], [135.5, -4.2], [134.0, -3.9], [133.0, -3.5], [132.3, -2.8], [131.0, -1.6]],
    ],
    bahasa: ['Dani', 'Asmat', 'Biak', 'Sentani', 'Marind', 'dan ratusan lainnya'],
    kata: [
      { b: 'Pegunungan Papua', k: 'Wa, wa, wa!', a: 'Salam dari pegunungan' },
      { b: 'Amungme', k: 'Amolongo', a: 'Salam ramah' },
    ],
    budaya: [
      { j: 'Rumah adat', ik: '🏠', nama: 'Honai', ket: 'Rumah bulat beratap jerami, hangat di gunung' },
      { j: 'Tarian', ik: '💃', nama: 'Tari Yospan', ket: 'Tarian ceria anak muda Papua' },
      { j: 'Makanan', ik: '🍲', nama: 'Papeda', ket: 'Bubur sagu, dimakan dengan ikan kuah kuning' },
      { j: 'Alat musik', ik: '🥁', nama: 'Tifa', ket: 'Dipukul untuk mengiringi tarian' },
      { j: 'Kain adat', ik: '🧵', nama: 'Noken', ket: 'Tas rajut dari serat kayu, dipakai di kepala' },
    ],
    fakta: 'Burung cenderawasih yang cantik hidup di hutan Papua!',
  },
];

// Hiasan di laut (tidak bisa diketuk)
export const LAUT = [
  { teks: 'Samudra Hindia', lon: 100.2, lat: -8.7, miring: -6 },
  { teks: 'Samudra Pasifik', lon: 134.0, lat: 4.6, miring: 0 },
  { teks: 'Laut Jawa', lon: 111.0, lat: -4.9, miring: 0 },
];
