import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./providers/index";
import "./styles/tailwind.css";

const container = document.getElementById("root") as HTMLElement;
const app = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

// Production HTML is prerendered by scripts/prerender.mjs, so we hydrate it.
// The dev server serves an empty root, so it renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
