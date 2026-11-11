import { useState, useEffect } from 'react';
import { useSound } from './hooks/useSound';
import KontrolAudio from './components/KontrolAudio';
import Beranda from './pages/Beranda';
import Ngitung from './pages/Ngitung';
import AwakUrang from './pages/AwakUrang';
import Kuis from './pages/Kuis';
import Peta from './pages/Peta';

export default function App() {
  const [hal, setHal] = useState('beranda');
  const [latar, setLatar] = useState(true);
  const sound = useSound();

  useEffect(() => {
    const f = () => sound.unlock();
    window.addEventListener('pointerdown', f, { once: true });
    return () => window.removeEventListener('pointerdown', f);
  }, []);

  const balik = () => { sound.play('tap'); setHal('beranda'); };
  return (
    <div className={'app' + (latar ? ' ada-latar' : '')}>
      {/* Latar opsional: public/images/latar.png (kalau tidak ada, pakai pemandangan CSS) */}
      {latar && <img className="latar" alt="" src={`${import.meta.env.BASE_URL}images/latar.png`} onError={() => setLatar(false)} />}
      <div className="awan a1" /><div className="awan a2" /><div className="awan a3" />
      <KontrolAudio sound={sound} />
      {hal === 'beranda' && <Beranda go={setHal} sound={sound} />}
      {hal === 'ngitung' && <Ngitung onBack={balik} sound={sound} />}
      {hal === 'awak' && <AwakUrang onBack={balik} sound={sound} />}
      {hal === 'kuis' && <Kuis onBack={balik} sound={sound} />}
      {hal === 'peta' && <Peta onBack={balik} sound={sound} go={setHal} />}
    </div>
  );
}
