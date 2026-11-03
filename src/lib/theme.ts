export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "novara-theme";

/**
 * Runs in <head> before first paint, so the page never flashes the wrong theme.
 * Order of precedence: saved choice → OS preference → light.
 * Also marks returning visitors in this tab session so the intro loader is skipped.
 */
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;if(sessionStorage.getItem("novara-intro")){d.classList.add("intro-seen")}}catch(e){d.dataset.theme="light"}})();`;
