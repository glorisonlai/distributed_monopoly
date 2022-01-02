import { MeshProps, useFrame, useLoader, useThree } from "@react-three/fiber";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  CameraShake,
  Line,
  Reflector,
  useTexture,
  Billboard,
  Plane,
  Text,
} from "@react-three/drei";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
} from "three";
import * as THREE from "three";
import { Mesh, Vector3 } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { MeshReflectorMaterialProps } from "@react-three/drei/materials/MeshReflectorMaterial";

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

export const Mess = (props: MeshProps) => {
  const mesh = useRef<Mesh>(null!);

  // useFrame(
  //   () =>
  //     mesh.current?.rotation &&
  //     (mesh.current.rotation.x = mesh.current.rotation.y += 0.01)
  // );

  const iterations = 8000;
  const r = 800;
  const points: number[] = useMemo(
    () =>
      Array.from({ length: iterations * 3 }, () => Math.random() * r - r / 2),
    []
  );
  const colors = useMemo(() => points.map((e) => e / r + 0.5), [points]);
  // const points = useMemo(
  //   () =>
  //     Array.from(
  //       { length: iterations },
  //       () =>
  //         new Vector3(
  //           Math.random() * r - r / 2,
  //           Math.random() * r - r / 2,
  //           Math.random() * r - r / 2
  //         )
  //     ),
  //   []
  // );

  // const colors = useMemo(
  //   () => points.map((vec) => vec.toArray().map((e) => e / r + 0.5)),
  //   [points]
  // );
  const replacer = (_: string, value: any) =>
    typeof value === "function" ? value.toString() : value;

  const onUpdate = useCallback(
    (self: BufferGeometry) => {
      self.setAttribute("position", new Float32BufferAttribute(points, 3));
      self.setAttribute("colour", new Float32BufferAttribute(colors, 3));
      self.computeBoundingSphere();
      console.log(JSON.stringify(self, replacer, 2));
    },
    [points, colors]
  );

  // const colors: number[] = positions.map((x) => x / r + 0.5);

  // geometry.setAttribute(
  //   "position",
  //   new THREE.Float32BufferAttribute(positions, 3)
  // );
  // geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  // const geometry = new BufferGeometry().setFrom;
  // geometry.computeBoundingSphere();

  // const lines = new THREE.Line(geometry);

  // console.log(JSON.stringify(lines, replacer, 2));

  return (
    // <mesh {...props} position={[0, 0, -1000]} ref={mesh}>
    <line {...props} position={[0, -2.5, -100]} ref={mesh}>
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
    </line>
    // </mesh>
  );
};

const Ground = (props: MeshReflectorMaterialProps) => {
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
          normalScale={[2, 2]}
          {...props}
        />
      )}
    </Reflector>
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
      []
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

export const FloatingText: FC<{ size: number; color: string; text: string }> =
  ({ size, color, text }) => {
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
