import { useEffect, useState } from "react";

// useState that mirrors to localStorage, so dashboard state (balances,
// positions, notifications) survives a page reload. Falls back to the
// initial value when storage is empty or unavailable.
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored != null ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [key, value]);

  return [value, setValue];
}
