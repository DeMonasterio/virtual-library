import { useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Weapon = ({ playerPosRef, playerDirRef, isSwinging }) => {
  const [ref, api] = useBox(() => ({
    type: "Kinematic",
    args: [0.3, 0.3, 1],
    position: [0, -10, 0], // escondido
  }));

  // Actualiza posición y rotación cada frame mientras está swingeando
  useFrame(() => {
    if (!isSwinging) return;

    const pos = playerPosRef.current;
    const dir = playerDirRef.current;

    if (!pos || !dir) return;

    const offset = dir.clone().multiplyScalar(1.3);
    const newPos = [pos.x + offset.x, pos.y + 1, pos.z + offset.z];

    api.position.set(...newPos);

    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
    api.quaternion.copy(quat);
  });

  useEffect(() => {
    if (!isSwinging) {
      api.position.set(0, -10, 0);
    }
  }, [isSwinging, api]);

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.3, 0.3, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Weapon;
