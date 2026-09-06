/**
 * Server entry used by scripts/prerender.mjs at build time. It renders the
 * same tree as main.tsx to a string so index.html ships with the content.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import { ThemeProvider } from "./providers/index";

export const render = (): string =>
  renderToString(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
