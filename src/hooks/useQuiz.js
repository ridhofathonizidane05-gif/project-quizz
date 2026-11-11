import { useState, useRef } from 'react';
import { ANGKA, BAGIAN } from '../data/materi';

export const TOTAL = 10;

const acak = (arr) => {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// Satu babak = TOTAL soal yang dibuat sekaligus di awal, TANPA soal kembar:
// separuh soal angka, separuh soal bagian tubuh, tiap item hanya dipakai sekali, lalu urutannya diacak.
// 2 pengecoh diambil acak dari kelompok yang sama.
function buatSoal(isAngka, item) {
  const pool = isAngka ? ANGKA : BAGIAN;
  const pengecoh = acak(pool.filter((p) => p !== item)).slice(0, 2).map((p) => p.sunda);
  return { isAngka, item, benar: item.sunda, pilihan: acak([item.sunda, ...pengecoh]) };
}

function buatBabak() {
  const nAngka = Math.floor(TOTAL / 2);
  const nBagian = TOTAL - nAngka;
  const daftar = [
    ...acak(ANGKA).slice(0, nAngka).map((it) => buatSoal(true, it)),
    ...acak(BAGIAN).slice(0, nBagian).map((it) => buatSoal(false, it)),
  ];
  return acak(daftar);
}

const awal = () => {
  const daftar = buatBabak();
  return { no: 1, skor: 0, daftar, soal: daftar[0], dipilih: null, selesai: false };
};

export function useQuiz(onJawab) {
  const [s, setS] = useState(awal);
  const ref = useRef(s);
  ref.current = s;

  // Pilih jawaban. Setelah dijawab, soal TIDAK pindah otomatis:
  // adik-adik harus menekan tombol "Lanjut" (lihat lanjut()).
  const jawab = (w) => {
    const cur = ref.current;
    if (cur.dipilih !== null || cur.selesai) return; // pilihan dikunci
    const betul = w === cur.soal.benar;
    const baru = { ...cur, dipilih: w, skor: cur.skor + (betul ? 1 : 0) };
    ref.current = baru; // kunci langsung, sebelum render ulang (anti dobel-klik)
    setS(baru);
    if (onJawab) onJawab(betul);
  };

  // Tombol "Lanjut": ke soal berikutnya, atau ke layar nilai kalau sudah soal terakhir.
  const lanjut = () => {
    const cur = ref.current;
    if (cur.dipilih === null || cur.selesai) return; // belum menjawab
    const baru = cur.no >= TOTAL
      ? { ...cur, selesai: true, dipilih: null }
      : { ...cur, no: cur.no + 1, soal: cur.daftar[cur.no], dipilih: null };
    ref.current = baru;
    setS(baru);
  };

  const ulang = () => {
    const baru = awal();
    ref.current = baru;
    setS(baru);
  };

  return { s, jawab, lanjut, ulang };
}
