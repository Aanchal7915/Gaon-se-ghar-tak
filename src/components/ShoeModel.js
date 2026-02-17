


// src/components/ShoeModel.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const ShoeModel = ({ path, ...props }) => {
  const gltf = useGLTF(path);
  const ref = useRef();

  useEffect(() => {
    if (ref.current && gltf.scene) {
      const clonedScene = gltf.scene.clone();

      while (ref.current.children.length > 0) {
        ref.current.remove(ref.current.children[0]);
      }
      ref.current.add(clonedScene);

      // Reset
      clonedScene.rotation.set(0, 0, 0);

      // Bounding box auto-scale
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);

      const targetHeight = 2.2;
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = targetHeight / maxDim;

      clonedScene.scale.set(scale, scale, scale);

      // Center model
      box.setFromObject(clonedScene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      clonedScene.position.sub(center);
    }
  }, [gltf.scene, path]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return <group ref={ref} {...props} />;
};

export default ShoeModel;
