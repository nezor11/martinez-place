// ThemeContext.tsx
import type { ReactNode } from "react";
import {
  createContext,
  startTransition,
  useEffect,
  useState,
} from "react";
import type { ThemeContextInterface } from "../utils/types/theme";

const ThemeContext = createContext<ThemeContextInterface | null>(null);

export { ThemeContext };

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // The first render must match the prerendered HTML, so it always starts in
  // light mode; the real preference is applied right after mount. An inline
  // script in index.html already sets the `dark` class before paint, so there
  // is no visible flash.
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  const toggleTheme = () => {
    startTransition(() => {
      setDarkTheme((curr) => {
        const next = !curr;
        localStorage.setItem("theme", next ? "dark" : "light");
        return next;
      });
    });
  };

  useEffect(() => {
    if (import.meta.env.SSR) return;
    const savedTheme = localStorage.getItem("theme");
    const preferred = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    // A transition keeps this from interrupting hydration.
    startTransition(() => setDarkTheme(preferred));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setDarkTheme(event.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.body.className = darkTheme ? "theme-dark" : "theme-light";
  }, [darkTheme]);
  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme, setDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
