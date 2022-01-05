import type { Mesh } from "three";
import type { FC, MutableRefObject } from "react";
import type { ColorRepresentation } from "three";

const { KernelSize } = require("postprocessing");
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
/// <reference path="../node_modules/@types/three/index.d.ts" />
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import {
  Html,
  useProgress,
  CameraShake,
  Reflector,
  useTexture,
} from "@react-three/drei";

const Scene: FC<{
  className?: string;
  bgColor?: Exclude<[ColorRepresentation], number> | [number, number, number];
  exportTo?: MutableRefObject<string>;
  showGround?: boolean;
  showBlur?: boolean;
}> = ({ children, className, bgColor, exportTo, showGround, showBlur }) => {
  const Rig: FC<{}> = ({ children }) => {
    const mesh = useRef<Mesh>(null!);
    const vec = new THREE.Vector3();
    const { camera, mouse } = useThree();
    useFrame(() => {
      camera.position.lerp(vec.set(mouse.x * 2, 0, 3.5), 0.05);
      mesh.current.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.1, 0), 0.1);
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        (-mouse.x * Math.PI) / 20,
        0.1
      );
    });

    const downloadJSON = (blob: any, filename: string) => {
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    };

    const exportScene = () => {
      if (exportTo) {
        const exporter = new GLTFExporter();
        exporter.parse(
          mesh.current,
          (gltf) => {
            const blob = new Blob([JSON.stringify(gltf)], {
              type: "text/plain",
            });
            downloadJSON(blob, "scenecopy.gltf");
          },
          { onlyVisible: false }
        );
      }
    };

    return <group ref={mesh}>{children}</group>;
  };

  const Ground = (props: any) => {
    const [floor, normal] = useTexture([
      "/SurfaceImperfections003_1K_var1.jpg",
      "/SurfaceImperfections003_1K_Normal.jpg",
    ]);
    return (
      <Reflector resolution={1024} args={[8, 8]} {...props}>
        {(Material, props) => (
          <Material
            color="#f0f0f0"
            metalness={0}
            roughnessMap={floor}
            normalMap={normal}
            normalScale={new THREE.Vector2(2, 2)}
            {...props}
          />
        )}
      </Reflector>
    );
  };

  const Loader = () => {
    const { progress } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  };

  return (
    <Canvas className={`${className || ""} max-w-[screen] w-auto`}>
      {bgColor && <color attach="background" args={bgColor} />}
      <ambientLight />
      <pointLight />
      {/* <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> */}
      <Suspense fallback={<Loader />}>
        <Rig>{children}</Rig>
        {showGround && (
          <Ground
            mirror={1}
            blur={[500, 100]}
            mixBlur={12}
            mixStrength={1.5}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            position-y={-0.8}
          />
        )}
        {showBlur && (
          <EffectComposer multisampling={8}>
            <Bloom
              kernelSize={3}
              luminanceThreshold={0}
              luminanceSmoothing={0.4}
              intensity={0.6}
            />
            <Bloom
              kernelSize={KernelSize.HUGE}
              luminanceThreshold={0}
              luminanceSmoothing={0}
              intensity={0.5}
            />
          </EffectComposer>
        )}
        <CameraShake
          yawFrequency={0.2}
          pitchFrequency={0.2}
          rollFrequency={0.2}
        />
      </Suspense>
    </Canvas>
  );
};
export default Scene;
