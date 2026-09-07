import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { resume } from "./data/resume";
import { isLocale, defaultLocale } from "./i18n";
import { ThemeProvider } from "./providers/index";
import "./styles/index.css";

// Each client bundle is built for one language (SITE_LOCALE in vite.config.js)
// and ships that language's resume, so no runtime detection is needed.
const locale = isLocale(__SITE_LOCALE__) ? __SITE_LOCALE__ : defaultLocale;

const container = document.getElementById("root") as HTMLElement;
const app = (
  <ThemeProvider>
    <App locale={locale} resume={resume} />
  </ThemeProvider>
);

// Production HTML is prerendered by scripts/prerender.mjs, so we hydrate it.
// The dev server serves an empty root, so it renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
