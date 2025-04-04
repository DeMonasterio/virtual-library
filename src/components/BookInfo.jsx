const BookInfo = ({ book }) => {
    return (
      <div style={{
        position: "absolute", top: "10px", left: "10px",
        background: "rgba(0,0,0,0.7)", color: "white",
        padding: "10px", borderRadius: "5px"
      }}>
        <p><b>{book.title}</b></p>
        <p>Autor: {book.author}</p>
      </div>
    );
  };
  
  export default BookInfo;
  