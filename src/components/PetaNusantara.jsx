import { useState, useRef, useEffect } from 'react';
import { PULAU, LAUT, LEBAR, TINGGI, jalur, proyek } from '../data/nusantara';
import { Anak } from './Anak';
import { Konfeti } from './Hiasan';

// Pra-hitung jalur SVG sekali saja
const BENTUK = PULAU.map((p) => p.bentuk.map((b) => jalur(b)));
const WARNA_BD = ['c0', 'c1', 'c2', 'c3', 'c4'];

export default function PetaNusantara({ sound, go }) {
  const [pilih, setPilih] = useState(null);       // indeks pulau yang dibuka
  const [dikunjungi, setDikunjungi] = useState([]);
  const [juara, setJuara] = useState(0);          // penanda untuk memunculkan konfeti
  const kartu = useRef(null);
  const pertama = useRef(true);

  useEffect(() => {
    if (pertama.current) { pertama.current = false; return; }
    if (pilih !== null && kartu.current) kartu.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [pilih]);

  const p = pilih === null ? null : PULAU[pilih];
  const semua = dikunjungi.length === PULAU.length;

  const buka = (i) => {
    sound.play('tap');
    setPilih(i);
    if (!dikunjungi.includes(i)) {
      const baru = [...dikunjungi, i];
      setDikunjungi(baru);
      if (baru.length === PULAU.length) {
        setJuara((j) => j + 1);
        setTimeout(() => { sound.play('win'); }, 700);
        return;
      }
    }
  };

  const geser = (n) => buka((pilih + n + PULAU.length) % PULAU.length);
  const keyBuka = (e, i) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buka(i); } };

  return (
    <section className="nusantara" id="peta" aria-labelledby="judul-peta">
      {juara > 0 && <Konfeti id={juara} jumlah={40} />}
      <h2 id="judul-peta">🗺️ Indonesiaku Kaya Budaya!</h2>
      <p className="sapa">Bhinneka Tunggal Ika: berbeda-beda, tetapi tetap satu!</p>
      <p className="hint">Indonesia punya ribuan pulau dan ratusan bahasa daerah. Ketuk pulaunya, yuk! 👆</p>

      <div className="peta-wrap">
        <svg className="peta" viewBox={`0 0 ${LEBAR} ${TINGGI}`} role="group" aria-label="Peta Indonesia. Ketuk pulau untuk mengenal bahasa dan budayanya.">
          <defs>
            <linearGradient id="lautan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a9e4f7" />
              <stop offset="1" stopColor="#d3f1fb" />
            </linearGradient>
            <pattern id="ombak" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 15q7.5-9 15 0t15 0 15 0 15 0" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".55" />
            </pattern>
            <pattern id="titik" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="3" fill="#fff" opacity=".4" />
              <circle cx="20" cy="20" r="2.2" fill="#fff" opacity=".4" />
            </pattern>
          </defs>
          <rect width={LEBAR} height={TINGGI} fill="url(#lautan)" />
          <rect width={LEBAR} height={TINGGI} fill="url(#ombak)" />

          {/* nama laut */}
          {LAUT.map((l) => {
            const [x, y] = proyek([l.lon, l.lat]);
            return <text key={l.teks} className="nama-laut" x={x} y={y} textAnchor="middle" transform={`rotate(${l.miring} ${x} ${y})`}>{l.teks}</text>;
          })}

          {/* teman-teman di laut */}
          <g aria-hidden="true" className="teman">
            <text className="perahu" x="120" y="505" fontSize="44">⛵</text>
            <text className="lompat" x="60" y="400" fontSize="40">🐬</text>
            <text className="paus" x="650" y="70" fontSize="46">🐳</text>
            <text className="ikan" x="880" y="440" fontSize="34">🐠</text>
            <text className="kompas" x="905" y="505" fontSize="40">🧭</text>
          </g>

          {PULAU.map((x, i) => {
            const [ex, ey] = proyek(x.pusat);
            const [lx, ly] = proyek(x.labelDi);
            const sudah = dikunjungi.includes(i);
            return (
              <g key={x.id} className={'pulau' + (pilih === i ? ' aktif' : '')} role="button" tabIndex={0}
                aria-label={`${x.judul}. ${x.julukan}.`} aria-pressed={pilih === i}
                style={{ '--c': x.warna, '--cd': x.tua, '--d': `${i * -0.7}s` }}
                onClick={() => buka(i)} onKeyDown={(e) => keyBuka(e, i)}>
                <g className="ayun">
                  {BENTUK[i].map((d, k) => <path key={'p' + k} className="pantai" d={d} />)}
                  {BENTUK[i].map((d, k) => <path key={'d' + k} className="darat" d={d} />)}
                  {BENTUK[i].map((d, k) => <path key={'m' + k} className="motif" d={d} />)}
                  <text className="emb" x={ex} y={ey} textAnchor="middle" dominantBaseline="central">{x.emoji}</text>
                  <text className="nama" x={lx} y={ly} textAnchor="middle">{x.pendek || x.nama}</text>
                  {sudah && <text className="bintang" x={ex + 28} y={ey - 24} textAnchor="middle" dominantBaseline="central">⭐</text>}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* tombol pulau: lebih gampang diketuk di layar kecil */}
      <div className="chips" role="group" aria-label="Pilih pulau">
        {PULAU.map((x, i) => (
          <button key={x.id} className={'chip' + (pilih === i ? ' on' : '')} style={{ '--c': x.warna, '--cd': x.tua }} onClick={() => buka(i)} aria-pressed={pilih === i}>
            <span aria-hidden="true">{x.emoji}</span> {x.pendek || x.nama}{dikunjungi.includes(i) && <span aria-hidden="true"> ⭐</span>}
          </button>
        ))}
      </div>
      <div className="bar jejak" aria-label={`${dikunjungi.length} dari ${PULAU.length} pulau sudah dikunjungi`}>
        {PULAU.map((x, i) => <i key={x.id} className={dikunjungi.includes(i) ? 'done' : ''}>⭐</i>)}
      </div>

      {semua && (
        <div className="juara pop-in">
          <span className="trofi">🏆</span>
          <div><b>Hebat! Kamu sudah keliling Indonesia!</b><br />Kita beda-beda, tapi tetap satu. Bhinneka Tunggal Ika!</div>
        </div>
      )}

      {!p ? (
        <div className="info kosong" ref={kartu}>
          <div className="chars"><Anak gender="cowok" size={56} cls="bounce" /><Anak gender="cewek" size={56} cls="bounce d2" /></div>
          <p className="hint">Ayo kenalan dengan bahasa dan budaya dari Sabang sampai Merauke!</p>
          <button className="next" onClick={() => buka(0)}>Mulai keliling! 🚀</button>
        </div>
      ) : (
        <article className="info" ref={kartu} key={p.id} style={{ '--c': p.warna, '--cd': p.tua }} aria-live="polite">
          <header className="info-head">
            <span className="info-emo" aria-hidden="true">{p.emoji}</span>
            <div>
              <h3>{p.judul}</h3>
              <p>{p.julukan}</p>
            </div>
          </header>

          <div className="info-body">
            <div className="blok">
              <h4>🗣️ Bahasa daerah</h4>
              <div className="pil">
                {p.bahasa.map((b) => <span key={b} className={b === 'Sunda' ? 'sunda' : ''}>{b === 'Sunda' ? '🌟 Sunda' : b}</span>)}
              </div>
              <div className="kata">
                {p.kata.map((k) => (
                  <div key={k.k}>
                    <b>{k.k}</b>
                    <small>{k.a} <em>({k.b})</em></small>
                  </div>
                ))}
              </div>
            </div>

            <div className="blok">
              <h4>🎎 Budaya</h4>
              <div className="ubin-grid">
                {p.budaya.map((b, i) => (
                  <div key={b.nama} className={'ubin ' + WARNA_BD[i % 5]}>
                    <div className="ik" aria-hidden="true">{b.ik}</div>
                    <div className="jn">{b.j}</div>
                    <div className="nm">{b.nama}</div>
                    <div className="kt">{b.ket}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fakta">
              <Anak gender={pilih % 2 ? 'cewek' : 'cowok'} size={62} ekspresi="senang" cls="bounce" />
              <p><b>Tahukah kamu?</b> {p.fakta}</p>
            </div>

            {p.sorot && (
              <div className="sorot">
                <p>{p.sorot}</p>
                <button className="again" onClick={() => { sound.play('lanjut'); go('ngitung'); }}>Hayu diajar Basa Sunda!</button>
              </div>
            )}
          </div>

          <footer className="nav">
            <button className="back" onClick={() => geser(-1)}>← Sebelumnya</button>
            <button className="next" onClick={() => geser(1)}>Pulau berikutnya →</button>
          </footer>
        </article>
      )}
    </section>
  );
}
