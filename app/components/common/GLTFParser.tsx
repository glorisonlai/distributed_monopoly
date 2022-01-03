import type { FC } from "react";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

const GLTFParser: FC<{ code?: string }> = ({ code }) => {
  const [parseGLTF, setParseGLTF] = useState<{
    gltf?: GLTF;
    error?: string;
  }>({ error: "Loading..." });
  useEffect(() => {
    if (!code) {
      setParseGLTF({ error: "No code here" });
      return;
    }
    try {
      const loader = new GLTFLoader();
      loader.parse(
        code || "{}",
        "/",
        (gltf: GLTF) => {
          setParseGLTF({ gltf });
        },
        (e: ErrorEvent) => {
          setParseGLTF({ error: e.message });
        }
      );
    } catch (e) {
      setParseGLTF({ error: "Error Parsing GLTF" });
    }
  }, [code]);
  return parseGLTF.gltf?.scene ? (
    <primitive object={parseGLTF.gltf.scene} />
  ) : (
    <Html className="text-white font-bold" center>
      {parseGLTF.error}
    </Html>
  );
};

export default GLTFParser;
