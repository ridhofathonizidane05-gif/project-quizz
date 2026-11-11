import { useState } from 'react';
import { TEKS } from '../data/materi';
import { Anak } from '../components/Anak';

export default function Beranda({ go, sound }) {
  const [logo, setLogo] = useState(true);
  const pilih = (p) => { sound.play('tap'); go(p); };
  return (
    <main className="page home">
      <div className="judul">
        {logo && <img className="logo" alt="" src={`${import.meta.env.BASE_URL}images/logo.png`} onError={() => setLogo(false)} />}
        <h1>{[...TEKS.judul].map((c, i) => <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>{c === ' ' ? '\u00A0' : c}</span>)}</h1>
        <p className="sapa">{TEKS.sapaan}</p>
      </div>
      <Anak gender="cowok" cls="side kiri float" />
      <Anak gender="cewek" cls="side kanan float d2" />
      <div className="menu">
        <button className="m-pink" onClick={() => pilih('peta')}><b>🗺️</b>Nusantara</button>
        <button className="m-kuning" onClick={() => pilih('ngitung')}><b>🔢</b>Ngitung</button>
        <button className="m-hijau" onClick={() => pilih('awak')}><b>🧒</b>Awak Urang</button>
        <button className="m-biru" onClick={() => pilih('kuis')}><b>🎯</b>Kuis</button>
      </div>
    </main>
  );
}
