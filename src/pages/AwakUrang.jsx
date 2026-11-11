import { useState } from 'react';
import { BAGIAN, TEKS } from '../data/materi';
import { Sisi } from '../components/Anak';
import { Gambar } from '../components/Hiasan';

export default function AwakUrang({ onBack, sound }) {
  const [k, setK] = useState(null);
  const b = k === null ? null : BAGIAN[k];
  const pilih = (i) => { setK(i); sound.play('tap'); sound.say(BAGIAN[i].sunda); };

  return (
    <main className="page sub">
      <Sisi />
      <div className="top">
        <button className="back" onClick={onBack}>← Balik</button>
        <h2>{TEKS.menu.awak}</h2>
      </div>
      <div className="mid">
        <div className="stage tinggi">
          {b ? (
            <div key={k} className="pop-in">
              <div className="big"><Gambar folder="badan" nama={b.sunda} emoji={b.emoji} cls="besar" /></div>
              <div className="word">{b.sunda}</div>
              <div className="hint">artinya: {b.arti} (basa loma: {b.loma})</div>
            </div>
          ) : <div className="tanya">❓</div>}
          <p className="hint">{TEKS.hintBadan}</p>
        </div>
        <div className="grid g-badan">
          {BAGIAN.map((d, i) => (
            <button key={d.sunda} className={'card c' + (i % 5) + (i === k ? ' sel' : '')} onClick={() => pilih(i)}>
              <div className="e"><Gambar folder="badan" nama={d.sunda} emoji={d.emoji} /></div>
              <div className="w">{d.sunda}</div>
              <div className="i">{d.arti}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
