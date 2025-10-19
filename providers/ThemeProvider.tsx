// providers/ThemeProvider.tsx
"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggle: () => void; set: (t: Theme) => void };

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
  set: () => {},
});

const STORAGE_KEY = "bwc_theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const getInitial = (): Theme => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
  };

  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const set = useCallback((t: Theme) => setTheme(t), []);

  const value = useMemo(() => ({ theme, toggle, set }), [theme, toggle, set]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
