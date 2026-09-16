import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { resume } from "./data/resume";
import { isLocale, defaultLocale } from "./i18n";
import { preloadIcons } from "./stories/components/molecules/IconGallery/registry";
import {
  projectIconNames,
  projectSlugFromPath,
  projectsFrom,
} from "./utils/projects";
import { ThemeProvider } from "./providers/index";
import "./styles/index.css";
// Registers the icons the prerendered HTML contains before hydration.
import "virtual:critical-icons";

// Each client bundle is built for one language (SITE_LOCALE in vite.config.js)
// and ships that language's resume, so no runtime detection is needed.
const locale = isLocale(__SITE_LOCALE__) ? __SITE_LOCALE__ : defaultLocale;

const container = document.getElementById("root") as HTMLElement;

// Project pages live at /project/<slug>/ (per language); anything else is
// the resume. Their tech icons are in the prerendered HTML, so load them
// before hydrating (the header icons come registered from
// virtual:critical-icons).
const projectSlug =
  projectSlugFromPath(window.location.pathname, locale) ?? undefined;
const project = projectSlug
  ? projectsFrom(resume).find((p) => p.slug === projectSlug)
  : undefined;

const boot = async () => {
  if (project) await preloadIcons(projectIconNames(project.slide));
  const app = (
    <ThemeProvider>
      <App locale={locale} resume={resume} projectSlug={project?.slug} />
    </ThemeProvider>
  );
  // Production HTML is prerendered by scripts/prerender.mjs, so we hydrate it.
  // The dev server serves an empty root, so it renders from scratch.
  if (container.hasChildNodes()) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
};

void boot();
