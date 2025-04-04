import * as THREE from "three";
import { useEffect, useRef } from "react";

const LibraryStructure = ({ scene }) => {
  useEffect(() => {
    if (!scene) return;

    // 📌 Suelo
    const floorGeometry = new THREE.BoxGeometry(50, 1, 50);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -0.5, 0);
    scene.add(floor);

    // 📌 Paredes
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x777777 });
    const walls = [
      new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1), wallMaterial), // Frente
      new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1), wallMaterial), // Fondo
      new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50), wallMaterial), // Izquierda
      new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50), wallMaterial), // Derecha
    ];
    walls[0].position.set(0, 5, -25);
    walls[1].position.set(0, 5, 25);
    walls[2].position.set(-25, 5, 0);
    walls[3].position.set(25, 5, 0);
    walls.forEach((wall) => scene.add(wall));

    // 📌 Estanterías organizadas en pasillos
    const shelfMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const shelves = [];
    for (let row = -20; row <= 20; row += 10) {
      for (let col = -20; col <= 20; col += 20) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 1), shelfMaterial);
        shelf.position.set(col, 3, row);
        scene.add(shelf);
        shelves.push(shelf);
      }
    }

    return () => {
      [floor, ...walls, ...shelves].forEach((obj) => scene.remove(obj));
    };
  }, [scene]);

  return null;
};

export default LibraryStructure;
