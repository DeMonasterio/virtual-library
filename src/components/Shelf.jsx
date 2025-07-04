import React from "react";
import { useCompoundBody } from "@react-three/cannon";



const SHELF_CONFIG = {
  sideThickness: 0.1,
  width: 2,
  height: 2.8,
  depth: 0.60,
  shelfSpacing: 0.7,
  levels: 4,
};

const Shelf = ({ position }) => {
  const { sideThickness, width, height, depth, shelfSpacing, levels } = SHELF_CONFIG;

  const shapes = [
    // Laterales
    {
      type: "Box",
      args: [sideThickness, height, depth],
      position: [-width / 2 + sideThickness / 2, height / 2, 0],
      color: "#8B4513",
    },
    {
      type: "Box",
      args: [sideThickness, height, depth],
      position: [width / 2 - sideThickness / 2, height / 2, 0],
      color: "#8B4513",
    },
    // Fondo
    {
      type: "Box",
      args: [width, height, 0.1],
      position: [0, height / 2, -depth / 2 + 0.05],
      color: "#6B4A1B",
    },
  ];
  for (let i = 0; i <= levels; i++) {
    shapes.push({
      type: "Box",
      args: [width, 0.1, depth],
      position: [0, i * shelfSpacing, 0],
      color: "#8B4513",
    });
  }

  const physicsShapes = shapes.map(({ type, args, position }) => ({
    type,
    args,
    position,
  }));



  const [ref] = useCompoundBody(() => ({
    mass: 5,
    // type:"Kinematic",
    type:"Dynamic",
    position,
    shapes: physicsShapes,
  }));

  return (
    <group ref={ref}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} castShadow receiveShadow>
          <boxGeometry args={shape.args} />
          <meshStandardMaterial color={shape.color} />
        </mesh>
      ))}
    </group>
  );
};

export default Shelf;