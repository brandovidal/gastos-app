import { atom } from "nanostores";

export const $theme = atom<"light" | "dark">("light");

export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
  $theme.set(theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const next = $theme.get() === "dark" ? "light" : "dark";
  $theme.set(next);
  localStorage.setItem("theme", next);
  applyTheme(next);
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
