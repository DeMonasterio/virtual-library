import * as THREE from "three";
export const createCamera = (fov) =>{

    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

    return camera;    
}