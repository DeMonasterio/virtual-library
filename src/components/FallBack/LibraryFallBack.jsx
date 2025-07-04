import React from 'react';
import BookLoader from "../../assets/Book.gif"
import "./LibraryFallBack.css"

const LibraryFallBack = () => {
  return (
    <div className='fallback-container' >
      <h1 style={{ color: 'black' }}>Cargando Libros...</h1> {/* Texto negro sobre fondo blanco */}
      <p style={{ color: 'black' }}>Un momento por favor, estamos organizando los libros.</p> {/* Texto negro */}
      <img src={BookLoader} alt="" />
    </div>
  );
};

export default LibraryFallBack;