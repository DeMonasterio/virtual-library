import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";

import Floor from "./Floor";
import Shelf from "./Shelf";
import Book from "./Book";
import PlayerController from "./PlayerController";

const SHELF_CONFIG = {
  levels: 4,
  shelfSpacing: 0.7,
};

const SceneSetup = ({
  books,
  setSelectedBook,
  setIsBookOpen,
  fov = 75,
  onLoaded,
  canvasClassName,
  isBookOpen,
  selectedBook,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("SceneSetup: books.length", books.length, "ready", ready);
    if (books.length > 0 && !ready) {
      setReady(true);
      console.log("SceneSetup: onLoaded()");
      onLoaded?.();
    }
  }, [books, ready, onLoaded]);
  

  const booksPerLevel = 4;
  const levelsPerShelf = SHELF_CONFIG.levels;
  const shelfSpacing = SHELF_CONFIG.shelfSpacing;
  const booksPerShelf = booksPerLevel * levelsPerShelf;
  const shelves = Math.ceil(books.length / booksPerShelf);

  return (
    <Canvas
      className={canvasClassName}
      shadows
      camera={{ position: [0, 1.8, 5], fov }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Physics gravity={[0, -9.81, 0]}>
      {/* <Physics gravity={[0, 0, 0]}> */}
        <Floor />

        {ready &&
          Array.from({ length: shelves }).map((_, i) => {
            const x = (i % 5) * 4 - 10;
            const z = Math.floor(i / 5) * -4;
            return <Shelf key={`shelf-${i}`} position={[x, 0.1, z]} />;
          })}

        {ready &&
          books.map((book, index) => {
            const shelfIndex = Math.floor(index / booksPerShelf);
            const indexInShelf = index % booksPerShelf;

            const levelIndex = Math.floor(indexInShelf / booksPerLevel);
            const positionInLevel = indexInShelf % booksPerLevel;

            const xShelf = (shelfIndex % 5) * 4 - 10;
            const zShelf = Math.floor(shelfIndex / 5) * -4;

            const x = xShelf- 0.55 + positionInLevel * 0.4;
            const y = 0.35 + levelIndex * shelfSpacing;
            const z = zShelf;

            const bookPosition = [x, y, z];

            return (
              <Book
                key={`book-${index}`}
                position={bookPosition}
                userData={{
                  type: "book",
                  name: "Libro",
                  title: book.title,
                  author: book.author_name?.[0] || "Desconocido",
                  first_publish_year: book.first_publish_year,
                  edition_count: book.edition_count,
                  languages: book.language?.join(", "),
                  cover_id: book.cover_id,
                  cover_url: book.cover_id
                    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                    : null,
                  openlibrary_key: book.key,
                  public_scan: book.public_scan_b || false,
                  ia_identifier: book.lending_identifier_s,
                  ebook_access: book.ebook_access,
                }}
              />
            );
          })}

        {ready && (
          <PlayerController
          setIsBookOpen={setIsBookOpen}
          setSelectedBook={setSelectedBook}
          isBookOpen={isBookOpen}
          selectedBook={selectedBook}
          />
        )}
      </Physics>
    </Canvas>
  );
};

export default SceneSetup;
