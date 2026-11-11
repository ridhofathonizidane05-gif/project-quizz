import { Sisi } from '../components/Anak';
import PetaNusantara from '../components/PetaNusantara';

// Halaman sendiri untuk Peta Nusantara. Kerangka halaman dikunci satu layar,
// jadi isi peta (panjang) di-scroll di dalam .scroll, bukan di halaman.
export default function Peta({ onBack, sound, go }) {
  return (
    <main className="page sub peta-page">
      <Sisi />
      <div className="top">
        <button className="back" onClick={onBack}>← Balik</button>
        <h2>🗺️ Nusantara</h2>
      </div>
      <div className="scroll">
        <PetaNusantara sound={sound} go={go} />
      </div>
    </main>
  );
}
