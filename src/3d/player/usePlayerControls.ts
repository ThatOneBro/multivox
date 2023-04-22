import { useState, useEffect } from "react";

import { useRerender } from "../../hooks";

export const Action = {
  FORWARD: 0,
  BACKWARD: 1,
  LEFT: 2,
  RIGHT: 3,
  JUMP: 4,
} as const;

type Action = (typeof Action)[keyof typeof Action];

const MoveKeyTable = {
  KeyW: Action.FORWARD,
  KeyS: Action.BACKWARD,
  KeyA: Action.LEFT,
  KeyD: Action.RIGHT,
  Space: Action.JUMP,
} as const;

type MoveKey = keyof typeof MoveKeyTable;

function setMovementState(state: Uint8Array, action: Action, value: 0 | 1) {
  state[action] = value;
}

export const usePlayerControls = () => {
  // We use a Uint8Array to store the movement state
  // This is for space/perf reasons
  const [movement] = useState(new Uint8Array(5));
  const rerender = useRerender();

  // TODO: We probably want to make this transitive state rather having this trigger a re-render
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (MoveKeyTable[e.code as MoveKey] === undefined) {
        return;
      }
      setMovementState(movement, MoveKeyTable[e.code as MoveKey], 1);
      rerender();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!MoveKeyTable[e.code as MoveKey] === undefined) {
        return;
      }
      setMovementState(movement, MoveKeyTable[e.code as MoveKey], 0);
      rerender();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  console.log(movement);

  return movement;
};
