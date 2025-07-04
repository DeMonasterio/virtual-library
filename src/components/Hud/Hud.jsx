import "./Hud.css";
import useAudioPlayer from "../../hooks/useAudioPlayer";

const tracks = [
  "/music/lost_woods.mp3",
  "/music/song_of_storms.mp3",
  "/music/ocarina_of_time.mp3",
  "/music/gerudo_valley.mp3",
  "/music/midnas_lament.mp3"
];

const HUD = ({ isBookOpen, selectedBook }) => {
  const {
    play, pause, next, prev, changeVolume,
    isPlaying, currentTrack, volume
  } = useAudioPlayer(tracks);

  return (
    <div className="hud">
      {/* Book HUD */}
      {isBookOpen && selectedBook ? (
        <div className="BookUI">
          {selectedBook.cover_url && (
            <img className="book-cover" src={selectedBook.cover_url} alt={selectedBook.title} />
          )}
          <div className="book-info">
            <h2 className="book-title">📖 {selectedBook.title}</h2>
            <p className="book-author">✍️ {selectedBook.author || "Autor desconocido"}</p>
            <p className="book-year">📅 {selectedBook.first_publish_year || "Año desconocido"}</p>
            <p className="book-editions">📚 Ediciones: {selectedBook.edition_count || "?"}</p>
            <p className="book-language">🌐 Idiomas: {selectedBook.languages || "?"}</p>

            {selectedBook.public_scan && selectedBook.ia_identifier && (
              <a
                href={`https://archive.org/details/${selectedBook.ia_identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="book-link"
              >
                🔗 Leer en Archive.org
              </a>
            )}

            <a
              href={`https://openlibrary.org${selectedBook.openlibrary_key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="book-link"
            >
              🌐 Ver en OpenLibrary
            </a>

            <p className="book-closing">Presioná <b>E</b> para cerrar</p>
          </div>
        </div>
      ) : (
        <span className="crosshair">+</span>
      )}

      {/* Music Player */}
      <div className="music-player">
      <div>🎵 {tracks[currentTrack].split("/").pop().replace(/_/g, " ").replace(".mp3", "").replace(/\b\w/g, c => c.toUpperCase())}</div>
        <button onClick={prev}>⏮️</button>
        {isPlaying ? (
          <button onClick={pause}>⏸️</button>
        ) : (
          <button onClick={play}>▶️</button>
        )}
        <button onClick={next}>⏭️</button>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          style={{ width: '100px', marginLeft: '10px' }}
        />
      </div>
    </div>
  );
};

export default HUD;
