import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ mode: "dark", toggle: () => {}, setMode: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("tc-mode") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tc-mode", mode);
    } catch {
      /* ignore */
    }
    // Mirror the theme onto <html> so portaled overlays (modals, sheets,
    // toasts appended to document.body — outside .tc-app) inherit the
    // light/dark CSS variables too. Cleared on unmount so the always-dark
    // marketing pages keep the :root defaults.
    document.documentElement.setAttribute("data-theme", mode);
    return () => document.documentElement.removeAttribute("data-theme");
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ mode, setMode, toggle }}>{children}</ThemeContext.Provider>;
}
