import { useState } from 'react';
import { slug } from '../data/materi';

const BASE = import.meta.env.BASE_URL;

// Gambar dari public/images/<folder>/<nama>.png ; jika belum ada -> otomatis pakai emoji.
export function Gambar({ folder, nama, emoji, cls = '' }) {
  const [gagal, setGagal] = useState(false);
  if (gagal) return <span className={'emo ' + cls}>{emoji}</span>;
  return <img className={'img ' + cls} alt={nama} draggable="false"
    src={`${BASE}images/${folder}/${slug(nama)}.png`} onError={() => setGagal(true)} />;
}

const WARNA = ['#FF6B57', '#FFC93C', '#5BBF6A', '#7FD3F0', '#7B5EA7', '#FF9ECF'];
export function Konfeti({ id, jumlah = 28 }) {
  return (
    <div className="konfeti" key={id} aria-hidden="true">
      {Array.from({ length: jumlah }, (_, i) => (
        <i key={i} style={{
          left: `${(i * 37) % 100}%`, background: WARNA[i % 6],
          animationDelay: `${(i % 7) * 0.06}s`, animationDuration: `${1.4 + (i % 4) * 0.25}s`,
          '--g': `${(i % 5) * 24 - 48}px`,
          borderRadius: i % 3 ? '3px' : '50%',
        }} />
      ))}
    </div>
  );
}

// Ledakan bintang & hati dari tengah layar (jawaban BENAR)
const EMO = ['⭐', '✨', '🌟', '🎉', '💖', '🎊'];
export function Ledakan({ id }) {
  return (
    <div className="ledakan" key={id} aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 110 + (i % 3) * 45;
        return (
          <span key={i} style={{
            '--dx': `${Math.cos(a) * r}px`, '--dy': `${Math.sin(a) * r}px`,
            animationDelay: `${(i % 4) * 0.04}s`,
          }}>{EMO[i % EMO.length]}</span>
        );
      })}
    </div>
  );
}

// Animasi JAWABAN SALAH: layar berkedip merah, ❌ besar muncul + bergoyang, hujan air mata
export function Salah({ id }) {
  return (
    <div className="salah-fx" key={id} aria-hidden="true">
      <div className="kilat" />
      <div className="silang">❌</div>
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="tetes" style={{
          left: `${((i * 53) % 96) + 2}%`, animationDelay: `${(i % 6) * 0.12}s`,
        }}>{i % 5 === 0 ? '💔' : '💧'}</span>
      ))}
    </div>
  );
}
