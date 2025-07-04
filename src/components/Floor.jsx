import React from "react";
import { usePlane } from "@react-three/cannon";

const Floor = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
        material: {
          friction: 0,
          restitution: 0,
        },
      }));
      
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#555555" />
    </mesh>
  );
};

export default Floor;