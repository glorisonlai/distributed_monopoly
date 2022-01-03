import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import type { FC } from "react";
import { useLoader } from "@react-three/fiber";

const RemoteGLTFLoader: FC<{ code: string }> = ({ code }) => {
  const gltf = useLoader(GLTFLoader, code);
  return gltf?.scene ? (
    <primitive object={gltf.scene} />
  ) : (
    <Html className="text-white font-bold" center>
      {gltf}
    </Html>
  );
};

export default RemoteGLTFLoader;
