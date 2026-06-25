export function initThemeToggle(rootEl, toggleBtn, storageKey) {
  if (!rootEl || !toggleBtn) return;

  const applyTheme = (isDark) => {
    rootEl.classList.toggle("dark-mode", isDark);
    localStorage.setItem(storageKey, isDark ? "dark" : "light");
  };

  applyTheme(localStorage.getItem(storageKey) === "dark");

  toggleBtn.addEventListener("click", () => {
    applyTheme(!rootEl.classList.contains("dark-mode"));
  });
}
