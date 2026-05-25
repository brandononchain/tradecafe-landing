import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  { key: "tradecafe", label: "TradeCafe", swatch: "#00B4A6" },
  { key: "slate", label: "Slate", swatch: "#64748B" },
  { key: "navy", label: "Navy", swatch: "#06B6D4" },
  { key: "matrix", label: "Matrix", swatch: "#00CC6A" },
  { key: "charcoal", label: "Charcoal", swatch: "#FF8C00" },
  { key: "deep-blue", label: "Deep Blue", swatch: "#3B82F6" },
  { key: "dracula", label: "Dracula", swatch: "#A855F7" },
];

const ThemeContext = createContext({ theme: "tradecafe", setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("tc-theme") || "tradecafe";
    } catch {
      return "tradecafe";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tc-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
