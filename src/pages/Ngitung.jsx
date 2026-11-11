import { useState, useEffect } from 'react';
import { ANGKA, TEKS } from '../data/materi';
import { Sisi } from '../components/Anak';
import { Gambar } from '../components/Hiasan';

export default function Ngitung({ onBack, sound }) {
  const [k, setK] = useState(0);
  const [tampil, setTampil] = useState(0);
  const [hit, setHit] = useState(0); // berapa benda yang sudah diketuk
  const a = ANGKA[k];

  useEffect(() => {
    setTampil(0); setHit(0);
    const id = setInterval(() => {
      setTampil((c) => { if (c >= a.n) { clearInterval(id); return c; } return c + 1; });
    }, 280);
    return () => clearInterval(id);
  }, [k]);

  const pilih = (i) => { setK(i); sound.play('tap'); sound.say(ANGKA[i].sunda); };
  // ketuk benda satu-satu: menyebut hiji, dua, tilu ...
  const hitung = (i) => { setHit(i + 1); sound.play('tap'); sound.say(ANGKA[i].sunda); };

  return (
    <main className="page sub">
      <Sisi />
      <div className="top">
        <button className="back" onClick={onBack}>← Balik</button>
        <h2>{TEKS.menu.ngitung}</h2>
      </div>
      <div className="mid">
        <div className="stage">
          <div key={k} className="pop-in">
            <div className="big">{a.n}</div>
            <div className="word">{a.sunda}</div>
          </div>
          <div className="objs">
            {Array.from({ length: tampil }, (_, i) => (
              <button key={i} className={'obj' + (i < hit ? ' on' : '')} onClick={() => hitung(i)} aria-label={`hitung ${i + 1}`}>
                <Gambar folder="angka" nama={a.sunda} emoji={a.emoji} />
                {i < hit && <small>{i + 1}</small>}
              </button>
            ))}
          </div>
          <p className="hint">{TEKS.hintAngka}</p>
        </div>
        <div className="grid g-angka">
          {ANGKA.map((d, i) => (
            <button key={d.n} className={'card c' + (i % 5) + (i === k ? ' sel' : '')} onClick={() => pilih(i)}>
              <div className="e">{d.n}</div>
              <div className="w">{d.sunda}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
