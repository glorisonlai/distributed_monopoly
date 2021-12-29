import { FC, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ColorRepresentation } from "three";

const Scene: FC<{
  className?: string;
  bgColor?: Exclude<[ColorRepresentation], number> | [number, number, number];
}> = ({ children, className, bgColor }) => (
  <Canvas className={className}>
    {bgColor && <color attach="background" args={bgColor} />}
    <ambientLight />
    <pointLight />
    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    <Suspense fallback={null}>{children}</Suspense>
  </Canvas>
);
export default Scene;
