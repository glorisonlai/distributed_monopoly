import { FC, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Game } from "../../lib/contract/types";

const Box = (props: any) => {
  console.log(props);
  const mesh = useRef<THREE.Mesh>();

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

const Gameboard: FC<{ game: Game }> = ({ game }) => (
  <Canvas camera={{ position: [0, 0, 35] }}>
    <ambientLight intensity={2} />
    <pointLight position={[40, 40, 40]} />
    <Box position={[0, 0, 0]} />
  </Canvas>
);
export default Gameboard;
