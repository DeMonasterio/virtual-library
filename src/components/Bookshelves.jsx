import * as THREE from "three";
import { useEffect } from "react";

const Bookshelves = ({ scene }) => {
  useEffect(() => {
    if (!scene) return;

    const books = [];
    const bookMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    // 📌 Generar libros en cada estantería
    scene.children.forEach((shelf) => {
      if (shelf.geometry && shelf.geometry.parameters.width === 8) {
        for (let i = -3; i <= 3; i++) {
          const bookHeight = 2 + Math.random();
          const bookGeometry = new THREE.BoxGeometry(0.8, bookHeight, 0.8);
          const color = new THREE.Color(Math.random(), Math.random(), Math.random());
          const book = new THREE.Mesh(bookGeometry, bookMaterial.clone());
          book.material.color.set(color);
          book.position.set(shelf.position.x + i, shelf.position.y + bookHeight / 2 - 2, shelf.position.z + 0.6);
          scene.add(book);
          books.push(book);
        }
      }
    });

    return () => books.forEach((book) => scene.remove(book));
  }, [scene]);

  return null;
};

export default Bookshelves;
