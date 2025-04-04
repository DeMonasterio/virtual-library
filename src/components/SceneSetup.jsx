import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SceneSetup = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current || initialized) return;

    // 🎬 Configurar escena, cámara y renderizador
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.1;
    controlsRef.current.maxPolarAngle = Math.PI / 2;

    cameraRef.current.position.set(0, 5, 10);
    cameraRef.current.lookAt(0, 0, 0);

    // 🔥 Agregar luz ambiental y direccional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    sceneRef.current.add(directionalLight);

    // 📌 Agregar una cuadrícula
    const gridHelper = new THREE.GridHelper(20, 20);
    sceneRef.current.add(gridHelper);

    // 🟩 Agregar un cubo de prueba
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 1, 0);
    sceneRef.current.add(cube);

    setInitialized(true);

    // 🎥 Animación
    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // 📌 Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      controlsRef.current.dispose();
      rendererRef.current.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [initialized]);

  // 📌 Manejo de redimensionamiento
  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  return <div ref={mountRef} />;
};

export default SceneSetup;
