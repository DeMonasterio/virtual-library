import "./Hud.css";

const HUD = ({ isBookOpen, selectedBook }) => {
  return (
    <>
      {isBookOpen ? (
        <div className="BookUI">
          <h2 className="book-title">📖 {selectedBook}</h2>
        </div>
      ) : null}
      <div className="hud">
        <span className="crosshair">+</span>
      </div>
    </>
  );
};

export default HUD;
