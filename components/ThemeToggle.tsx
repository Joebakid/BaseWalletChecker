// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dim" | "dark";
const STORAGE_KEY = "theme";
const ALL: Theme[] = ["light", "dim", "dark"];

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

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dim");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || "dim";
    setTheme(saved);
    apply(saved);
  }, []);

  const handle = () => {
    const t = next(theme);
    setTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    apply(t);
  };

  const label = theme === "light" ? "Light" : theme === "dim" ? "Dim" : "Dark";

  return (
    <button
      onClick={handle}
      className="rounded-xl px-3 py-2 border text-sm hover:opacity-80"
      aria-label="Toggle theme"
      title="Cycle Light → Dim → Dark"
    >
      {label}
    </button>
  );
}
