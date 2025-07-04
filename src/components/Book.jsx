import React, { useMemo, useRef } from "react";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import FallbackImage from "../assets/fallback_image.webp"
const Book = ({ position, userData }) => {
  const [ref] = useBox(() => ({
    // type: "Kinematic",
    type: "Dynamic",
    mass: 0.010,
    args: [0.3, 0.5, 0.1],
    position,
    userData,
  }));

  const color = useMemo(() => new THREE.Color(Math.random() * 0xffffff), []);

  const texture = useLoader(
    THREE.TextureLoader,
    userData.cover_url || FallbackImage // Fallback local si falla
  );

  const materials = useMemo(() => {
    const base = new THREE.MeshStandardMaterial({ color });
    const coverMaterial = userData.cover_url
      ? new THREE.MeshBasicMaterial({ map: texture })
      : base;

    return [
      base, base, base, base,
      coverMaterial, // portada
      base,          // contraportada
    ];
  }, [texture, userData.cover_url]);

  return (
    <mesh ref={ref} castShadow position={position} userData={userData} material={materials}>
      <boxGeometry args={[0.3, 0.5, 0.1]} />
    </mesh>
  );
};

export default Book;
