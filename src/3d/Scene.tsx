import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";

import { Player } from "./player/Player";
import { Ground } from "./environment/Ground";

export const Scene = () => {
  return (
    <Canvas shadows="basic">
      <Sky sunPosition={[100, 10, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <Physics gravity={[0, -40, 0]}>
        <Player position={[0, 10, 0]} />
        <Ground />
      </Physics>
    </Canvas>
  );
};
