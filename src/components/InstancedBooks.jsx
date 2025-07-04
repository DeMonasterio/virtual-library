import React, { useRef, useLayoutEffect, useMemo, useEffect } from "react";
import { InstancedMesh, BoxGeometry, MeshStandardMaterial } from "three";
import { useThree } from "@react-three/fiber";
import { useBox } from "@react-three/cannon"; // Asegúrate de que useBox está importado correctamente
import * as THREE from "three";

// Constantes para las dimensiones del libro
const BOOK_ARGS = [0.3, 1, 0.2];

// Recibe 'setApi' para pasar la API de física instanciada al componente padre
const InstancedBooks = ({ instances, setApi }) => {
  const meshRef = useRef();
  const { scene } = useThree();

  const [physicsRef, physicsApi] = useBox.instance((i) => ({
    mass: 1, // La masa es por instancia
    args: BOOK_ARGS,
    position: instances[i].position, // Posición inicial desde tus datos
    userData: instances[i].userData, // Asignar userData directamente aquí
  }), {
    // El segundo argumento es un objeto de opciones, y 'count' es el número total de instancias
    count: instances.length,
  });

  // Asignar el ref de física al mesh instanciado
  useLayoutEffect(() => {
    if (physicsRef.current) {
      meshRef.current = physicsRef.current;
    }
  }, [physicsRef]);

  // Exponer la physicsApi a través de la prop setApi para que el componente padre la reciba
  useEffect(() => {
    if (setApi) {
      setApi(physicsApi);
    }
  }, [setApi, physicsApi]); // Depende de setApi y physicsApi (que es estable)


  // Generar colores aleatorios para cada instancia una sola vez
  const colors = useMemo(() => {
    return new Array(instances.length).fill(0).map(() => new THREE.Color(Math.random() * 0xffffff));
  }, [instances.length]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    // Configurar las instancias visuales
    instances.forEach((instance, i) => {
      dummy.position.set(instance.position[0], instance.position[1], instance.position[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, colors[i]); // Asignar color a la instancia
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Registrar el mesh instanciado en la escena para que el Raycaster lo encuentre
    // y asignar userData general al InstancedMesh
    meshRef.current.userData = {
      type: "instanced_books_container", // Tipo para identificar el contenedor
    };
    scene.add(meshRef.current);

    return () => {
      scene.remove(meshRef.current);
    };
  }, [instances, scene, colors]);

  return (
    <>
      {/* El ref se asigna al meshRef, que a su vez se conecta a physicsRef */}
      <instancedMesh ref={meshRef} args={[null, null, instances.length]} castShadow receiveShadow>
        <boxGeometry args={BOOK_ARGS} />
        <meshStandardMaterial vertexColors={true} /> {/* Habilitar vertexColors para que se vean los colores por instancia */}
      </instancedMesh>
    </>
  );
};

export default InstancedBooks;