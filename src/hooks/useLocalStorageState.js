import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [state, setState] = useState(function () {
    const storedState = localStorage.getItem(key);

    if (!storedState) return initialState;
    return JSON.parse(storedState);
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(state));
    },
    [state, key]
  );

  return [state, setState];
}
