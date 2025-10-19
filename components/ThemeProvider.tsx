// components/ThemeProvider.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dim" | "dark";
type Ctx = { theme: Theme; toggle: () => void };

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(saved);
    document.documentElement.classList.remove("dark", "dim");
    document.documentElement.classList.add(saved);
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "dim" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.remove("dark", "dim");
      document.documentElement.classList.add(next);
      return next;
    });
  };

  const value = useMemo(() => ({ theme, toggle }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
