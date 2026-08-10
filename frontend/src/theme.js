// theme.js — shared dark/light theme toggle + back-to-top wiring.
// Used by main.js (builder app) and every static legal page, so the toggle
// behaves identically everywhere and there's exactly one place that owns
// the localStorage key.

const THEME_KEY = "aananda-theme";

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

// Wires up the #themeToggle button, if present on the page. The initial
// theme itself is already applied by the blocking inline script in
// <head> (before first paint) — this only handles the click.
export function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

// Wires up the #backToTop button, if present on the page.
export function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
}
