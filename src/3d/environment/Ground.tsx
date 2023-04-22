import { useState, useLayoutEffect } from "react";
import { usePlane } from "@react-three/cannon";
import { TextureLoader, RepeatWrapping } from "three";

import type { Texture } from "three";

import grass from "../assets/grass.jpg";

export const Ground = (props: any) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    type: "Static",
    ...props,
  }));

  const [texture] = useState<Texture>(() => new TextureLoader().load(grass));

  useLayoutEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(960, 960);
  }, []);

  return (
    <mesh ref={ref as any}>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <meshStandardMaterial map={texture} attach="material" color="#73c94f" />
    </mesh>
  );
};
