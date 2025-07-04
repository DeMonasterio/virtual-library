import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import Weapon from "./Weapon";

const SPEED = 100;
const JUMP_FORCE = 5;

const PlayerController = ({ setIsBookOpen, setSelectedBook, isBookOpen, selectedBook }) => {
  const { camera, scene, gl } = useThree();
  const controlsRef = useRef();
  const move = useRef({ forward: 0, right: 0 });
  const velocity = useRef([0, 0, 0]);
  const canJump = useRef(true);

  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 2, 0],
    args: [1, 2, 1],
    fixedRotation: true,
    linearDamping: 0.01,
    material: { friction: 0, restitution: 0.1 },
  }));

  const playerPosRef = useRef(new THREE.Vector3());
  const playerDirRef = useRef(new THREE.Vector3());

  const [isSwinging, setIsSwinging] = useState(false);

  useEffect(() => {
    const unsubscribeVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribePos = api.position.subscribe((pos) => {
      playerPosRef.current.set(...pos);
      camera.position.set(pos[0], pos[1] + 1, pos[2]);
    });

    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
          move.current.forward = 1;
          break;
        case "KeyS":
          move.current.forward = -1;
          break;
        case "KeyA":
          move.current.right = 1;
          break;
        case "KeyD":
          move.current.right = -1;
          break;
        case "Space":
          if (canJump.current) {
            api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
            canJump.current = false;
          }
          break;
        case "KeyE":
          if (isBookOpen) {
            setIsBookOpen(false);
            setSelectedBook(null);
          } else {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const raycaster = new THREE.Raycaster(camera.position, direction);

            const intersects = raycaster
              .intersectObjects(scene.children, true)
              .filter((obj) => !obj.object.userData?.ignoreRaycast);

            if (intersects.length > 0) {
              const object = intersects[0].object;

              if (object.userData.type === "book") {
                setIsBookOpen(true);
                setSelectedBook(object.userData);
              }
            }
          }
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (["KeyW", "KeyS"].includes(e.code)) move.current.forward = 0;
      if (["KeyA", "KeyD"].includes(e.code)) move.current.right = 0;
    };

    const handleMouseDown = () => {
      const controls = controlsRef.current;
      if (!controls.isLocked) {
        controls.lock();
      } else {
        setIsSwinging(true);
      }
    };

    const handleMouseUp = () => {
      setIsSwinging(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gl.domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      unsubscribeVel();
      unsubscribePos();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [api, camera, scene, gl, setIsBookOpen, setSelectedBook, isBookOpen, selectedBook]);

  useFrame((_, delta) => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    playerDirRef.current.copy(direction);

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    const movement = new THREE.Vector3();
    movement.addScaledVector(direction, move.current.forward * SPEED * delta);
    movement.addScaledVector(right, move.current.right * SPEED * delta);

    api.velocity.set(movement.x, velocity.current[1], movement.z);

    if (Math.abs(velocity.current[1]) < 0.1) canJump.current = true;
  });

  return (
    <>
      <mesh ref={ref} />
      <PointerLockControls ref={controlsRef} camera={camera} domElement={gl.domElement} />
      <Weapon playerPosRef={playerPosRef} playerDirRef={playerDirRef} isSwinging={isSwinging} />
    </>
  );
};

export default PlayerController;
