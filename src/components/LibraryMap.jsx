import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import PlayerController from "./PlayerController";
import { createCamera } from "./Camera.jsx"
import Hud from "./Hud/Hud.jsx"

const LibraryMap = ({ books }, fov) => {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const [isBookOpen, setisBookOpen] = useState(0)
  const [selectedBook, setSelectedBook] = useState(null);


  useEffect(() => {
    if (!mountRef.current || books.length === 0) return;


    //Cosas de la camara//
    cameraRef.current = createCamera(fov);
    const camera = cameraRef.current;
    camera.position.set(0, 1.8, 5);
    //Fin de cosas de la camara//


    const scene = new THREE.Scene();
    sceneRef.current = scene;


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);


    // Generar estanterías dinámicamente
    const booksPerShelf = 5;
    const shelves = Math.ceil(books.length / booksPerShelf);

    for (let i = 0; i < shelves; i++) {
      const x = (i % 5) * 4 - 10; // Espaciado horizontal
      const z = Math.floor(i / 5) * -4; // Espaciado vertical

      const shelfGeometry = new THREE.BoxGeometry(2, 3, 0.5);
      const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(x, 1.5, z);
      scene.add(shelf);

      // Agregar libros a la estantería
      for (let j = 0; j < booksPerShelf; j++) {
        const bookIndex = i * booksPerShelf + j;
        if (bookIndex >= books.length) break;

        const book = books[bookIndex];
        const bookGeometry = new THREE.BoxGeometry(0.3, 1, 0.2);
        const bookMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const bookMesh = new THREE.Mesh(bookGeometry, bookMaterial);
        bookMesh.position.set(x - 0.8 + j * 0.4, 2, z + 0.25);
        bookMesh.userData = { type: "book", title: book.title };
        scene.add(bookMesh);
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [books, fov]);

  return (
    <>
      <div ref={mountRef}>
        {cameraRef.current && sceneRef.current && (
          <PlayerController
            camera={cameraRef.current}
            scene={sceneRef.current}
            setisBookOpen={setisBookOpen}
            setSelectedBook={setSelectedBook}
          />
        )}
      </div>
      <Hud isBookOpen={isBookOpen} selectedBook={selectedBook} />
    </>
  );
};

export default LibraryMap;
