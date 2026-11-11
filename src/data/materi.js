export const ANGKA = [
  { n: 1, sunda: 'hiji', emoji: '🍎' },
  { n: 2, sunda: 'dua', emoji: '🐥' },
  { n: 3, sunda: 'tilu', emoji: '🌸' },
  { n: 4, sunda: 'opat', emoji: '🐟' },
  { n: 5, sunda: 'lima', emoji: '⭐' },
  { n: 6, sunda: 'genep', emoji: '🦋' },
  { n: 7, sunda: 'tujuh', emoji: '🍌' },
  { n: 8, sunda: 'dalapan', emoji: '🎈' },
  { n: 9, sunda: 'salapan', emoji: '🍓' },
  { n: 10, sunda: 'sapuluh', emoji: '🚗' },
];

export const BAGIAN = [
  { sunda: 'mastaka', arti: 'kepala', emoji: '🧒', loma: 'sirah' },
  { sunda: 'soca', arti: 'mata', emoji: '👁️', loma: 'panon' },
  { sunda: 'cepil', arti: 'telinga', emoji: '👂', loma: 'ceuli' },
  { sunda: 'pangambung', arti: 'hidung', emoji: '👃', loma: 'irung' },
  { sunda: 'baham', arti: 'mulut', emoji: '👄', loma: 'sungut' },
  { sunda: 'waos', arti: 'gigi', emoji: '🦷', loma: 'huntu' },
  { sunda: 'panangan', arti: 'tangan', emoji: '✋', loma: 'leungeun' },
  { sunda: 'sampéan', arti: 'kaki', emoji: '🦶', loma: 'suku' },
];

export const TEKS = {
  judul: 'Hayu Diajar Basa Sunda!',
  sapaan: 'Ketuk gambar atau angkanya ya, adik-adik!',
  hintAngka: 'Ketuk gambar buat ngitung bareng! 👆',
  hintBadan: 'Ketuk gambar buat ningali ngaranna! 👆',
  tanyaAngka: 'Aya sabaraha?',
  glossAngka: '(Ada berapa?)',
  tanyaBadan: 'Ieu naon?',
  glossBadan: '(Ini apa dalam bahasa Sunda?)',
  benar: 'Pinter! 🎉 Leres!',
  salah: (r) => `Hampura, jawabanna: ${r} 💪`,
  selesai: 'Réngsé!',
  nilai: (s) => `Nilai: ${s} / 10`,
  ulang: '🔁 Ulang deui',
  menu: { ngitung: '🔢 Ngitung', awak: '🧒 Awak Urang', kuis: '🎯 Kuis' },
};

// Logika hasil asli: >=8 🏆 "Hebat pisan!", 5-7 🌟 dan 0-4 🌱 "Hayu diajar deui!"
export function hasil(skor) {
  return {
    ikon: skor >= 8 ? '🏆' : skor >= 5 ? '🌟' : '🌱',
    teks: skor >= 8 ? 'Hebat pisan!' : 'Hayu diajar deui!',
  };
}

// nama file audio: kata tanpa aksen (sampéan -> sampean)
export const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
