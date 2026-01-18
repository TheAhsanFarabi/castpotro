"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-20 left-6 md:bottom-6 md:left-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-2xl backdrop-blur-md border-2 border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-110 active:scale-95 group"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative h-6 w-6">
        <Sun
          className={`absolute inset-0 h-6 w-6 text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
          `}
        />
        <Moon
          className={`absolute inset-0 h-6 w-6 text-sky-400 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
          `}
        />
      </div>
      <div className={`absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${theme === 'dark' ? 'bg-sky-400' : 'bg-amber-400'}`} />
    </button>
  );
}