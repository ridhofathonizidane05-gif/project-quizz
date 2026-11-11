import { useState } from 'react';

const BASE = import.meta.env.BASE_URL;

// ekspresi: 'biasa' | 'senang' (jawaban benar) | 'sedih' (jawaban salah)
// Urutan gambar: maskot-cowok-senang.png -> (kalau tidak ada) maskot-cowok.png -> (kalau tidak ada) SVG bawaan.
export function Anak({ gender = 'cowok', size = 110, cls = '', ekspresi = 'biasa' }) {
  const cewek = gender === 'cewek';
  const [gagal, setGagal] = useState([]);
  const daftar = ekspresi === 'biasa' ? [`maskot-${gender}`] : [`maskot-${gender}-${ekspresi}`, `maskot-${gender}`];
  const nama = daftar.find((n) => !gagal.includes(n));
  if (nama) {
    return <img className={'maskot ' + cls} width={size * 1.2} alt={cewek ? 'Anak perempuan' : 'Anak laki-laki'}
      src={`${BASE}images/${nama}.png`} onError={() => setGagal((g) => [...g, nama])} draggable="false" />;
  }
  return (
    <svg className={cls} viewBox="0 0 100 120" width={size} height={size * 1.2} role="img"
      aria-label={cewek ? 'Anak perempuan' : 'Anak laki-laki'}>
      <rect x="24" y="68" width="52" height="46" rx="18" fill={cewek ? '#FF927E' : '#78B978'} />
      <rect x="40" y="70" width="20" height="8" rx="4" fill="#FFD166" />
      <circle cx="50" cy="42" r="26" fill="#F2C29B" />
      {cewek ? (<>
        <path d="M24 42a26 26 0 0 1 52 0c-10-13-42-13-52 0z" fill="#4a2f1d" />
        <circle cx="22" cy="52" r="8" fill="#4a2f1d" /><circle cx="78" cy="52" r="8" fill="#4a2f1d" />
        <circle cx="27" cy="38" r="5" fill="#FFD166" />
      </>) : (<>
        <path d="M24 38a26 26 0 0 1 52 0z" fill="#8D79C6" />
        <rect x="24" y="33" width="52" height="7" fill="#FFD166" />
        <path d="M72 30l12-6-4 14z" fill="#8D79C6" />
      </>)}
      <circle cx="41" cy="47" r="3.2" fill="#3a2a1a" /><circle cx="59" cy="47" r="3.2" fill="#3a2a1a" />
      <circle cx="35" cy="54" r="4" fill="#FF927E" opacity=".5" /><circle cx="65" cy="54" r="4" fill="#FF927E" opacity=".5" />
      {ekspresi === 'sedih' ? (<>
        <path d="M41 62q9-8 18 0" stroke="#3a2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M36 40l9 3M64 40l-9 3" stroke="#3a2a1a" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="38" cy="56" rx="2" ry="3.5" fill="#6EC6FF" />
      </>) : ekspresi === 'senang' ? (
        <path d="M38 55q12 16 24 0z" fill="#3a2a1a" />
      ) : (
        <path d="M41 56q9 9 18 0" stroke="#3a2a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function Pasangan({ size = 110, cls = '' }) {
  return (
    <div className="chars">
      <Anak gender="cowok" size={size} cls={cls} />
      <Anak gender="cewek" size={size} cls={cls} />
    </div>
  );
}

// Sepasang maskot di sisi kiri & kanan layar (posisi diatur CSS: .side.kiri / .side.kanan).
// anim: 'bounce' (diam) | 'loncat' (benar) | 'goyang' (salah)
export function Sisi({ ekspresi = 'biasa', anim = 'bounce' }) {
  return (
    <>
      <Anak gender="cowok" ekspresi={ekspresi} cls={'side kiri ' + anim} />
      <Anak gender="cewek" ekspresi={ekspresi} cls={'side kanan ' + anim + (anim === 'bounce' ? ' d2' : '')} />
    </>
  );
}
