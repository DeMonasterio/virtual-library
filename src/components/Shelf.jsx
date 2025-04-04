import * as THREE from "three";

const Shelf = (scene, x, z) => {
  const shelfWidth = 10, shelfHeight = 10, shelfDepth = 1;
  const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const geometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
  const shelf = new THREE.Mesh(geometry, material);
  shelf.position.set(x, shelfHeight / 2, z);
  scene.add(shelf);
};

export default Shelf;
