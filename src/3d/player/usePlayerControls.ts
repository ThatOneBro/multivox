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

function setMovementState(state: Uint8Array, key: string, value: 0 | 1) {
  // Check if this is one of the keys we're supposed to track
  // If there's no action in the table, we're not tracking this key
  const action = MoveKeyTable[key as MoveKey];
  if (action === undefined) {
    return;
  }

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
      setMovementState(movement, e.code, 1);
      rerender();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setMovementState(movement, e.code, 0);
      rerender();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};
