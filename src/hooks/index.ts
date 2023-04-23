import { useState, useCallback } from "react";

export function useRerender() {
  const [, setCounter] = useState(0);
  const rerender = useCallback(() => setCounter(c => c + 1), []);
  return rerender;
}
