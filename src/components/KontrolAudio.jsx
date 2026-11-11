export default function KontrolAudio({ sound }) {
  return (
    <div className="audio">
      <button className="round" onClick={sound.toggleMusik} aria-label="Musik" title="Musik">
        {sound.musik ? '🎵' : '🔇'}
      </button>
      <button className="round" onClick={sound.toggleSuara} aria-label="Suara" title="Suara">
        {sound.suara ? '🔊' : '🔈'}
      </button>
    </div>
  );
}
