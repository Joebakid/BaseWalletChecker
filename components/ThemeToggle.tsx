// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

type Theme = "dim" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Initialize from localStorage and set the html class
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(saved);
    document.documentElement.classList.remove("dark", "dim");
    document.documentElement.classList.add(saved);
  }, []);

  // Toggle between "dark" and "dim"
  const toggle = () => {
    const next: Theme = theme === "dark" ? "dim" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove("dark", "dim");
    document.documentElement.classList.add(next);
  };

  return (
    <button
      onClick={toggle}
      className="rounded-xl px-3 py-2 border text-sm hover:opacity-80"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Dark" : "Dim"}
    </button>
  );
}
