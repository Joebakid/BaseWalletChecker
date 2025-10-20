// components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "dim" | "light";
const STORAGE_KEY = "theme";
const ALL_CLASSES: Theme[] = ["dark", "dim", "light"];

function applyThemeClass(t: Theme) {
  const el = document.documentElement;
  el.classList.remove(...ALL_CLASSES);
  el.classList.add(t);
}

function nextTheme(t: Theme): Theme {
  if (t === "dark") return "dim";
  if (t === "dim") return "light";
  return "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
    setTheme(saved);
    applyThemeClass(saved);
  }, []);

  const handleToggle = () => {
    const t = nextTheme(theme);
    setTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyThemeClass(t);
  };

  // Label shows current mode
  const label = theme === "dark" ? "Dark" : theme === "dim" ? "Dim" : "Light";

  return (
    <button
      onClick={handleToggle}
      className="rounded-xl px-3 py-2 border text-sm hover:opacity-80"
      aria-label="Toggle theme"
      title="Cycle theme (Dark → Dim → Light)"
    >
      {label}
    </button>
  );
}
