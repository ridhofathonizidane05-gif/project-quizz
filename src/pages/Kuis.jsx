import { useEffect } from 'react';
import { useQuiz, TOTAL } from '../hooks/useQuiz';
import { TEKS, hasil } from '../data/materi';
import { Sisi } from '../components/Anak';
import { Gambar, Konfeti, Ledakan, Salah } from '../components/Hiasan';

export default function Kuis({ onBack, sound }) {
  const { s, jawab, lanjut, ulang } = useQuiz((betul) => {
    sound.play(betul ? 'ok' : 'no');
  });
  useEffect(() => { if (s.selesai) { sound.play('win'); } }, [s.selesai]);

  const top = (
    <div className="top">
      <button className="back" onClick={onBack}>← Balik</button>
      <h2>{TEKS.menu.kuis}</h2>
    </div>
  );

  if (s.selesai) {
    const h = hasil(s.skor);
    return (
      <main className="page sub">
        <Sisi ekspresi="senang" anim="loncat" />
        {top}<Konfeti id="akhir" jumlah={70} />
        <div className="mid">
          <div className="stage">
            <div className="hint">{TEKS.selesai}</div>
            <div className="big trofi">{h.ikon}</div>
            <div className="word">{TEKS.nilai(s.skor)}</div>
            <div className="hint">{h.teks}</div>
          </div>
          <button className="again" onClick={ulang}>{TEKS.ulang}</button>
        </div>
      </main>
    );
  }

  const { soal, dipilih } = s;
  const sudah = dipilih !== null;
  const betul = sudah && dipilih === soal.benar;
  const ekspresi = !sudah ? 'biasa' : betul ? 'senang' : 'sedih';
  const anim = betul ? 'muncul' : sudah ? 'goyang' : 'bounce';
  const fb = !sudah ? '' : betul ? TEKS.benar : TEKS.salah(soal.benar);
  const terakhir = s.no >= TOTAL;
  const klikLanjut = () => { sound.play('lanjut'); lanjut(); };

  return (
    <main className="page sub">
      <Sisi ekspresi={ekspresi} anim={anim} />
      {top}
      {betul && <><Konfeti id={s.no} jumlah={70} /><Ledakan id={s.no} /></>}
      {sudah && !betul && <Salah id={s.no} />}
      <div className="mid">
        <div className="bar" aria-label={`Soal ${s.no} dari ${TOTAL}`}>
          {Array.from({ length: TOTAL }, (_, i) => <i key={i} className={i < s.no - 1 ? 'done' : i === s.no - 1 ? 'now' : ''}>⭐</i>)}
        </div>
        <div className={'stage' + (betul ? ' girang' : sudah ? ' getar' : '')}>
          <div className="objs" key={s.no}>
            {soal.isAngka
              ? Array.from({ length: soal.item.n }, (_, i) => <span className="obj ro" style={{ "--i": i }} key={i}><Gambar folder="angka" nama={soal.item.sunda} emoji={soal.item.emoji} /></span>)
              : <span className="obj ro bsr"><Gambar folder="badan" nama={soal.item.sunda} emoji={soal.item.emoji} cls="besar" /></span>}
          </div>
          <div className="word">{soal.isAngka ? TEKS.tanyaAngka : TEKS.tanyaBadan}</div>
          <div className="hint">{soal.isAngka ? TEKS.glossAngka : TEKS.glossBadan}</div>
        </div>
        <div className="opts">
          {soal.pilihan.map((w, i) => (
            <button key={w + s.no} disabled={sudah}
              className={'card c' + i + (!sudah ? '' : w === soal.benar ? ' ok' : w === dipilih ? ' salah-pilih goyang' : ' no')}
              onClick={() => jawab(w)}>
              <div className="w">{w}</div>
            </button>
          ))}
        </div>
        <div className={'fb' + (sudah && !betul ? ' salah' : '')}>{fb}</div>
        <div className="slot">
          {sudah && (
            <button className={'next' + (terakhir ? ' akhir' : '')} onClick={klikLanjut} autoFocus>
              {terakhir ? 'Tingali Nilai 🏆' : 'Lanjut ➜'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
