"use client";

import { useRef } from "react";

export function ThemeToggle() {
  const transitioning = useRef(false);

  async function toggleTheme() {
    if (transitioning.current) return;

    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    const applyTheme = () => {
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem("portfolio-theme-v1", nextTheme);
      } catch {
        // Theme switching also works when browser storage is unavailable.
      }
    };

    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    transitioning.current = true;
    root.dataset.themeTransition = "true";
    try {
      const transition = document.startViewTransition(applyTheme);
      // A hidden tab can skip the animation; consume both rejection paths.
      await Promise.all([transition.ready, transition.finished]);
    } catch {
      applyTheme();
    } finally {
      delete root.dataset.themeTransition;
      transitioning.current = false;
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <span className="theme-when-dark">
        <span className="sr-only">Switch to light mode</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />
        </svg>
      </span>
      <span className="theme-when-light">
        <span className="sr-only">Switch to dark mode</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      </span>
    </button>
  );
}
