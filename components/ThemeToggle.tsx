"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function applyTheme(t: Theme) {
  const el = document.documentElement;
  el.classList.remove("light", "dark");
  el.classList.add(t);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
    setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-xl px-3 py-2 border border-[hsl(var(--border))] text-sm hover:opacity-80"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}