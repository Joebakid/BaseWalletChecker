// components/ThemeToggle.tsx
"use client";

import { useContext } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      onClick={toggle}
      className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
