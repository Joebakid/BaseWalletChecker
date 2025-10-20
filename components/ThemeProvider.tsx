// components/ThemeProvider.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dim" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const STORAGE_KEY = "theme";
const ALL: Theme[] = ["light", "dim", "dark"];
const ThemeCtx = createContext<Ctx | null>(null);

function apply(t: Theme) {
  const el = document.documentElement;
  el.classList.remove(...ALL);
  el.classList.add(t);
}
function next(t: Theme): Theme {
  if (t === "dark") return "light";
  if (t === "light") return "dim";
  return "dark";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dim"); // SSR-safe default

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || "dim";
    setThemeState(saved);
    apply(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    apply(t);
  };
  const toggle = () => setTheme(next(theme));
  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
