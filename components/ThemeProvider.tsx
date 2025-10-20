// components/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "dim" | "light";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const STORAGE_KEY = "theme";
const ALL_CLASSES: Theme[] = ["dark", "dim", "light"];
const ThemeCtx = createContext<Ctx | null>(null);

function applyThemeClass(t: Theme) {
  const el = document.documentElement;
  el.classList.remove(...ALL_CLASSES);
  // Add the selected theme class explicitly (including "light")
  el.classList.add(t);
}

function nextTheme(t: Theme): Theme {
  if (t === "dark") return "dim";
  if (t === "dim") return "light";
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark"); // SSR-safe default

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
    setThemeState(saved);
    applyThemeClass(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyThemeClass(t);
  };

  const toggle = () => setTheme(nextTheme(theme));

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// Optional default export (matches many imports like "@/providers/ThemeProvider")
export default ThemeProvider;

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
