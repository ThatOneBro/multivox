import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";

import { usePlayerControls } from "./usePlayerControls";

const SPEED = 10;

// Create the Player component
export const Player = (props: any) => {
  const { camera } = useThree();

  const [moveForward, moveBackward, moveLeft, moveRight, jump] =
    usePlayerControls();

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    ...props,
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 0, 0]);

  const directionRef = useRef(new Vector3());
  const frontVectorRef = useRef(new Vector3());
  const sideVectorRef = useRef(new Vector3());

  useEffect(() => {
    api.velocity.subscribe(v => (velocity.current = v));
    api.position.subscribe(p => (position.current = p));
  }, []);

  useFrame(() => {
    camera.position.set(
      position.current![0],
      position.current![1],
      position.current![2],
    );
    const direction = directionRef.current!.set(0, 0, 0);

    const frontVector = frontVectorRef.current!.set(
      0,
      0,
      moveBackward - moveForward,
    );
    const sideVector = sideVectorRef.current!.set(moveLeft - moveRight, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // TODO: Add jump with raycast check
    if (jump) {
      api.velocity.set(velocity.current[0], 10, velocity.current[2]);
    }
  });

  return (
    <>
      <PointerLockControls makeDefault />
      <mesh ref={ref as any}>
        <sphereBufferGeometry attach="geometry" args={[1, 16, 16]} />
      </mesh>
    </>
  );
};
