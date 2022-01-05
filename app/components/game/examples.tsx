import type { MeshProps } from "@react-three/fiber";
import type { FC } from "react";
import type { Mesh } from "three";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Plane, Text } from "@react-three/drei";
/// <reference path="../node_modules/@types/three/index.d.ts" />
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

export const Box = (props: MeshProps) => {
  const mesh = useRef<Mesh>(null!);

  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(
    () =>
      mesh.current?.rotation &&
      (mesh.current.rotation.x = mesh.current.rotation.y += 0.01)
  );

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [10, 10, 10] : [5, 5, 5]}
      onClick={() => setActive((active) => !active)}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovering ? "hotpink" : "orange"}
      />
    </mesh>
  );
};

export const Triangle = () => {
  const Triangle = ({ color, ...props }: MeshProps & { color: string }) => {
    const ref = useRef<Mesh>(null!);
    const [r] = useState(() => Math.random() * 10000);
    useFrame(
      (_) =>
        (ref.current.position.y =
          -1.75 + Math.sin(_.clock.elapsedTime + r) / 10)
    );
    const { paths: [path] } = useLoader(SVGLoader, '/triangle.svg') // prettier-ignore
    const geom = useMemo(
      () =>
        SVGLoader.pointsToStroke(
          path.subPaths[0].getPoints(),
          path.userData!.style
        ),
      [path.subPaths, path.userData]
    );
    return (
      <group ref={ref}>
        <mesh geometry={geom} {...props}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    );
  };

  const Rig: FC<{}> = ({ children }) => {
    const ref = useRef<Mesh>(null!);
    const vec = new THREE.Vector3();
    const { camera, mouse } = useThree();
    useFrame(() => {
      camera.position.lerp(vec.set(mouse.x * 2, 0, 3.5), 0.05);
      ref.current.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.1, 0), 0.1);
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        (-mouse.x * Math.PI) / 20,
        0.1
      );
    });

    return <group ref={ref}>{children}</group>;
  };

  return (
    <>
      <Triangle color="#ff2060" scale={0.009} rotation={[0, 0, Math.PI / 3]} />
      <Triangle
        color="cyan"
        scale={0.009}
        position={[2, 0, -2]}
        rotation={[0, 0, Math.PI / 3]}
      />
      <Triangle
        color="orange"
        scale={0.009}
        position={[-2, 0, -2]}
        rotation={[0, 0, Math.PI / 3]}
      />
      <Triangle
        color="white"
        scale={0.009}
        position={[0, 2, -10]}
        rotation={[0, 0, Math.PI / 3]}
      />
    </>
  );
};

export const FloatingText: FC<{
  size: number;
  color: string;
  text: string;
}> = ({ size, color, text }) => {
  const ref = useRef<Mesh>(null!);
  return (
    <mesh ref={ref} scale={[size, size, size] /*width, height, depth*/}>
      <Text color={color} anchorX="center" anchorY="middle">
        {text}
      </Text>
    </mesh>
  );
};

export const Sign: FC<{ url: string }> = ({ url }) => {
  const mesh = useRef<Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <Plane ref={mesh} scale={[3, 3, 0]}>
      <meshBasicMaterial attach="material" map={texture} />
    </Plane>
  );
};
