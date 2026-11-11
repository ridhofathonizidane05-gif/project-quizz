import { useState, useRef, useEffect } from 'react';
import { slug } from '../data/materi';

// Format nada  : [frekuensi, mulai(detik), durasi, volume, jenis?, frekuensiAkhir?]
//                (frekuensiAkhir = nada meluncur turun/naik, dipakai buat efek "wah wah")
// Format noise : [mulai, durasi, volume, frekuensiFilter]  -> dipakai buat suara tepuk tangan
const SFX = {
  tap: { nada: [[660, 0, 0.1]] },

  // tombol "Lanjut"
  lanjut: { nada: [[520, 0, 0.09, 0.14, 'triangle'], [780, 0.08, 0.16, 0.14, 'triangle']] },

  // JAWABAN BENAR: tangga nada naik + kilauan + tepuk tangan 🎉
  ok: {
    nada: [
      [523, 0, 0.14, 0.14, 'triangle'],
      [659, 0.1, 0.14, 0.14, 'triangle'],
      [784, 0.2, 0.14, 0.14, 'triangle'],
      [1047, 0.3, 0.5, 0.16, 'triangle'],
      [1319, 0.3, 0.5, 0.06, 'sine'],
      [1568, 0.42, 0.45, 0.05, 'sine'],
      [2093, 0.52, 0.12, 0.05, 'sine'],
      [2637, 0.6, 0.12, 0.05, 'sine'],
      [3136, 0.68, 0.25, 0.05, 'sine'],
    ],
    noise: [[0.3, 0.8, 0.12, 3500]],
  },

  // JAWABAN SALAH: buzzer ala kuis "EHH-EEEHHH!" (suara komentar ditambah di reaksi())
  no: {
    nada: [
      [140, 0, 0.22, 0.12, 'sawtooth'], [147, 0, 0.22, 0.1, 'square'],
      [140, 0.27, 0.55, 0.12, 'sawtooth'], [147, 0.27, 0.55, 0.1, 'square'],
    ],
  },

  // selesai kuis: fanfare + tepuk tangan meriah 🏆
  win: {
    nada: [
      [523, 0, 0.12, 0.13, 'square'],
      [523, 0.14, 0.12, 0.13, 'square'],
      [523, 0.28, 0.12, 0.13, 'square'],
      [523, 0.42, 0.3, 0.14, 'square'],
      [415, 0.76, 0.3, 0.13, 'square'],
      [466, 1.06, 0.3, 0.13, 'square'],
      [523, 1.36, 0.2, 0.14, 'square'],
      [466, 1.58, 0.14, 0.13, 'square'],
      [523, 1.76, 0.8, 0.15, 'square'],
      [1047, 1.76, 0.8, 0.05, 'sine'],
      [1568, 1.9, 0.7, 0.04, 'sine'],
    ],
    noise: [[0.5, 2.2, 0.14, 3200]],
  },
};

// Kalimat yang diucapkan. Diucapkan pakai suara bawaan browser (text-to-speech),
// atau pakai rekaman sendiri kalau ada file public/audio/reaksi-benar.mp3 / reaksi-salah.mp3 / reaksi-selesai.mp3
const REAKSI = {
  benar: ['Yeay! Pinter pisan!', 'Hore! Leres!', 'Yeay! Hebat!', 'Mantap! Bener!', 'Wih, pinter pisan!'],
  salah: ['Yaaah, salah!', 'Waduh, belum bener!', 'Hampura, cobian deui!', 'Yaaah, kurang tepat!'],
  selesai: ['Hore! Kuisna réngsé! Hebat pisan!'],
};

export function useSound() {
  const [musik, setMusik] = useState(true);
  const [suara, setSuara] = useState(true);
  const [mulai, setMulai] = useState(false); // autoplay: aktif setelah interaksi pertama
  const ctx = useRef(null);
  const voice = useRef(null);
  const benarAudio = useRef(null);
  const salahAudio = useRef(null);

  const getCtx = () => {
    try {
      if (!ctx.current) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ctx.current = new C();
      }
      if (ctx.current.state === 'suspended') ctx.current.resume();
      return ctx.current;
    } catch { return null; }
  };

  const nada = (f, t0, dur, vol, type = 'sine', to) => {
    const c = getCtx();
    if (!c) return;
    const o = c.createOscillator();
    const g = c.createGain();
    const t = c.currentTime + t0;
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur); // nada meluncur
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    // gelombang kasar (sawtooth/square) dilembutkan biar nggak nyaring di telinga anak
    if (type === 'sawtooth' || type === 'square') {
      const lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1600;
      o.connect(lp); lp.connect(g);
    } else {
      o.connect(g);
    }
    g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  };

  // Suara tepuk tangan: noise yang volumenya diacak tiap 40ms biar terdengar "prok-prok-prok"
  const noise = (t0, dur, vol, freq = 3000) => {
    const c = getCtx();
    if (!c) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.7;
    const g = c.createGain();
    const t = c.currentTime + t0;
    g.gain.setValueAtTime(0.0001, t);
    const step = 0.04;
    const n = Math.floor(dur / step);
    for (let k = 0; k < n; k++) {
      const env = 1 - k / n; // makin lama makin pelan
      g.gain.setValueAtTime(Math.max(0.0001, vol * env * Math.random()), t + k * step);
    }
    g.gain.setValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t);
  };

  // Mainkan file audio dari public/audio/. Kalau gagal dimuat -> pakai suara bawaan (fallback)
  const mainFile = (ref, file, fallback) => {
    try {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
      const a = new Audio(`${import.meta.env.BASE_URL}audio/${file}`);
      a.volume = 1;
      a.addEventListener('error', fallback);
      ref.current = a;
      a.play().catch(fallback);
    } catch { fallback(); }
  };

  const play = (nama) => {
    if (!suara) return;
    const s = SFX[nama];
    if (!s) return;
    const mainSintetis = () => {
      (s.nada || []).forEach(([f, t, d, v = 0.12, type = 'sine', to]) => nada(f, t, d, v, type, to));
      (s.noise || []).forEach(([t, d, v, fr]) => noise(t, d, v, fr));
    };
    // jawaban benar -> jawaban-benar.mp3, jawaban salah -> jawaban-salah.mpeg
    if (nama === 'ok') { mainFile(benarAudio, 'jawaban-benar.mp3', mainSintetis); return; }
    if (nama === 'no') { mainFile(salahAudio, 'jawaban-salah.mpeg', mainSintetis); return; }
    mainSintetis();
  };

  // Pelafalan: public/audio/<kata>.mp3 ; jika tidak ada, diam saja (aplikasi tetap jalan)
  const say = (kata) => {
    if (!suara) return;
    try {
      if (voice.current) voice.current.pause();
      const a = new Audio(`${import.meta.env.BASE_URL}audio/${slug(kata)}.mp3`);
      voice.current = a;
      a.play().catch(() => {});
    } catch { /* abaikan */ }
  };

  // Suara orang ngomong: "YEAY!" kalau benar, "Yaaah salah!" kalau salah.
  const reaksi = (jenis, jeda = 350) => {
    if (!suara) return;
    setTimeout(() => {
      const daftar = REAKSI[jenis];
      if (!daftar) return;
      const ngomong = () => {
        try {
          const ss = window.speechSynthesis;
          if (!ss || typeof SpeechSynthesisUtterance === 'undefined') return;
          ss.cancel();
          const u = new SpeechSynthesisUtterance(daftar[Math.floor(Math.random() * daftar.length)]);
          u.lang = 'id-ID';
          const v = ss.getVoices().find((x) => x.lang && x.lang.toLowerCase().replace('_', '-').startsWith('id'));
          if (v) u.voice = v;
          const senang = jenis !== 'salah';
          u.pitch = senang ? 1.8 : 0.6;  // senang = tinggi & ceria, salah = rendah & lesu
          u.rate = senang ? 1.15 : 0.8;
          u.volume = 1;
          ss.speak(u);
        } catch { /* abaikan */ }
      };
      try {
        let sudah = false;
        const fallback = () => { if (!sudah) { sudah = true; ngomong(); } };
        const a = new Audio(`${import.meta.env.BASE_URL}audio/reaksi-${jenis}.mp3`);
        a.addEventListener('error', fallback);
        a.play().catch(fallback); // file rekaman tidak ada -> pakai suara browser
      } catch { ngomong(); }
    }, jeda);
  };

  useEffect(() => {
    if (!mulai || !musik) return;
    const mel = [523, 587, 659, 784, 880, 784, 659, 587];
    let i = 0;
    const tik = () => { nada(mel[i % mel.length], 0, 0.5, 0.025, 'triangle'); i++; };
    tik();
    const id = setInterval(tik, 450);
    return () => clearInterval(id);
  }, [mulai, musik]);

  return {
    musik, suara, play, say, reaksi,
    unlock: () => setMulai(true),
    toggleMusik: () => setMusik((v) => !v),
    toggleSuara: () => setSuara((v) => !v),
  };
}
