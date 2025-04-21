import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const PlayerController = ({ camera, scene, setisBookOpen, setSelectedBook }) => {
  const controlsRef = useRef(null);
  const move = useRef({ forward: 0, right: 0 });

  useEffect(() => {
    if (!camera || !scene) return;

    const controls = new PointerLockControls(camera, document.body);
    controlsRef.current = controls;
    scene.add(controls.object);

    const handleClick = (event) => {
      if (!controls.isLocked) {
        controls.lock();
      } else {
        const raycaster = new THREE.Raycaster();
        raycaster.far = 1000;
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          const object = intersects[0].object;
          if (object.userData.type === "book") {
            setisBookOpen(true);
            setSelectedBook(object.userData.title);
          }
        }
      }
    };

    document.addEventListener("click", handleClick);

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
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "KeyS":
          move.current.forward = 0;
          break;
        case "KeyA":
        case "KeyD":
          move.current.right = 0;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const clock = new THREE.Clock();
    const speed = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      if (controls.isLocked) {
        const delta = clock.getDelta();
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        const right = new THREE.Vector3();
        right.crossVectors(new THREE.Vector3(0, 1, 0), direction).normalize();

        const movement = new THREE.Vector3();
        movement.addScaledVector(direction, move.current.forward * speed * delta);
        movement.addScaledVector(right, move.current.right * speed * delta);

        controls.object.position.add(movement); 

      }
    };
    animate();

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera, scene]);

  return null;
};

export default PlayerController;
