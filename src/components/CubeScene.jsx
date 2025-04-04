import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CubeScene = () => {
  const mountRef = useRef(null); // Para referenciar el contenedor donde colocaremos el canvas de Three.js

  useEffect(() => {
    // Crear la escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Agregar el renderizador al contenedor solo si no se ha añadido ya
    if (mountRef.current && !mountRef.current.children.length) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Crear un cubo básico
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Posicionar la cámara
    camera.position.z = 5;

    // Crear una luz direccional
const light = new THREE.DirectionalLight(0xffffff, 1); // color blanco y una intensidad de 1
light.position.set(5, 5, 5).normalize(); // Ubicar la luz
scene.add(light);

// Fondo simple con gradiente
const background = new THREE.Color(0xeeeeee);
scene.background = background;


    // Controles de órbita para mover la cámara
    const controls = new OrbitControls(camera, renderer.domElement);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update(); // Necesario para que los controles de órbita funcionen
      renderer.render(scene, camera);
    };
    animate();

    // Limpieza cuando el componente se desmonta
    return () => {
      controls.dispose();
      if (mountRef.current && mountRef.current.children.length > 0) {
        mountRef.current.removeChild(renderer.domElement); // Limpiar el canvas antes de desmontar
      }
      renderer.dispose();
    };
  }, []); // Solo ejecuta una vez

  return <div ref={mountRef} />;
};

export default CubeScene;
