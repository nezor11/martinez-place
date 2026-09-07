# martinez.place

Personal resume site of Jorge Martínez Ortiz, live at [martinez.place](https://martinez.place/). The component library is published at [storybook.martinez.place](https://storybook.martinez.place/).

The page content (header, info sections, project slider, PDF resume) is
managed in [Sanity](https://www.sanity.io/) (schema in [nezor11/martinez-place-sanity](https://github.com/nezor11/martinez-place-sanity)) and fetched **at build time**: `scripts/fetch-resume.mjs` writes `src/data/resume.<locale>.json`, one per language, which the site bundles. The HTML is then **prerendered** by `scripts/prerender.mjs`, so `index.html` (English) and `es/index.html` (Spanish) ship with the full page and React only hydrates them. The browser never talks to Sanity and the content is visible before any JavaScript runs. The UI is
built from a small component library organised by atomic design and documented
with Storybook.

## Stack

- React 18 + TypeScript, bundled with Vite
- Tailwind CSS 4 with light/dark theme (system preference, persisted in `localStorage`)
- Sanity as headless CMS (`@sanity/client`, `@sanity/image-url`)
- Swiper and react-player for the project slider
- Storybook 10 for the component library
- Biome for linting and formatting
- Deployed on Vercel as two projects from this repo: `martinez-place` (site) and `martinez-place-storybook` (Storybook)

## Getting started

Requires Node 20+ and Yarn 4 (the version is pinned in `package.json`; enable
Corepack with `corepack enable` if `yarn --version` does not print 4.x).

```shell
yarn            # install dependencies
yarn dev        # app at http://localhost:5173
yarn storybook  # Storybook at http://localhost:6006 (also watches Tailwind)
```

## Environment variables

Only Storybook uses one, and it is optional:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `STORYBOOK_UNSPLASH_ACCESS_KEY` | stories | Fetches sample photos from Unsplash. Without it the stories show placeholder images. |

Copy `.env.example` to `.env` to set it locally. For the deployed Storybook, set it in the Vercel project `martinez-place-storybook`.

## Scripts

| Script | What it does |
| --- | --- |
| `yarn fetch-resume` | Pull the published resume from Sanity into `src/data/resume.<locale>.json`, one file per language (`--strict` fails instead of keeping a stale file; `--locale es` for one language) |
| `yarn build:pdf` | Build `public/resume.pdf` and `public/resume.es.pdf` from the same data with @react-pdf/renderer |
| `yarn build:og` | Build `public/og.png` and `public/og.es.png` (1200×630 social cards) from the same data with satori + resvg |
| `yarn dev` | Fetch the resume, build the PDF and the social card, then start the Vite dev server |
| `yarn build` | Fetch the resume (strict), build the PDFs and the social cards, one client bundle per language, the server bundle, then prerender `dist/index.html` and `dist/es/index.html` |
| `yarn build:client` / `yarn build:ssr` / `yarn prerender` | The three build steps, individually (`build:client` runs Vite once per language) |
| `yarn preview` | Serve the production build locally |
| `yarn storybook` | Storybook dev server |
| `yarn build-storybook` | Static Storybook into `storybook-static/` |
| `yarn lint` | Biome lint over `src/` |
| `yarn format` | Biome format over `src/` |

## Project layout

```
.
├── .storybook/          Storybook config, theme and viewports
├── scripts/             fetch-resume.mjs (Sanity → JSON), build-pdf.mjs (PDF), build-og.mjs (social card), prerender.mjs (HTML), fonts/ (TTF)
├── public/              Static assets served as-is (fonts, favicons)
├── src/
│   ├── App.tsx          Renders the resume sections
│   ├── main.tsx         Client entry: hydrates the prerendered HTML
│   ├── entry-server.tsx Server entry used by the prerender step
│   ├── *Section.tsx     Map Sanity sections to UI components
│   ├── contexts/        ThemeContext and ThemeProvider
│   ├── data/            resume.<locale>.json (generated, ignored) and their typed export
│   ├── i18n/            Languages, UI copy per language, SEO metadata and the locale context
│   ├── stories/         Component library (atoms, molecules, organisms, templates, pages)
│   ├── styles/          index.css: Tailwind 4 entry (theme via tailwind.config.js) and global styles
│   └── utils/           Sanity client, shared types, helpers
├── index.html           Vite entry with SEO / Open Graph metadata
├── vercel.json          Cache headers for hashed assets and fonts
└── vite.config.js       Vite config (image optimizer, asset naming)
```

### Prerender rules

Everything rendered on the first pass must be identical on the build server and in the browser: no `Math.random`, no `window`/`localStorage` reads during render (use effects or `import.meta.env.SSR`), and dates formatted with a fixed locale and time zone. The theme starts light and is applied after mount; an inline script in `index.html` (allowed by its hash in the CSP) adds the `dark` class before paint so there is no flash.

Tailwind 4 runs through `@tailwindcss/vite`: `src/styles/index.css` is the entry (it imports Tailwind and the legacy `tailwind.config.js` via `@config`), and component stylesheets that use `@apply` start with `@reference` to it.

## Dependency updates

Dependabot opens a grouped PR for minor and patch updates every Monday and one PR per major. CI runs lint, typecheck, build, the Playwright suite and Lighthouse on each of them, so a green PR is safe to merge.

## PDF resume

`scripts/build-pdf.mjs` renders `public/resume.pdf` and `public/resume.es.pdf` from `src/data/resume.<locale>.json` with [@react-pdf/renderer](https://react-pdf.org/), so the download link in each language's footer always matches the published content. It embeds the Raleway subsets converted to TTF in `scripts/fonts/` (react-pdf does not render WOFF2 glyphs).

## Social card

`scripts/build-og.mjs` renders `public/og.png` and `public/og.es.png` (1200×630) with [satori](https://github.com/vercel/satori) and [resvg](https://github.com/RazrFalcon/resvg): name, role, city, skills and the profile photo from Sanity, in the site's Raleway. Each prerendered page points `og:image` and `twitter:image` at its own card.

## Languages

The site is published in English at `/` and in Spanish at `/es/`, as two prerendered pages that link each other with `hreflang` (plus `x-default` to English) and share one `sitemap.xml`. There is no automatic redirect by browser language.

- **UI copy** (buttons, labels, accessible names, SEO title and description, date locale) lives in `src/i18n/messages.ts`; components read it through `useMessages()` from the `LocaleContext`, which defaults to English so Storybook and tests need no setup.
- **Active resume**: the site is built from one `resume` document, pinned by id in `activeResumeId` at the top of `scripts/fetch-resume.mjs`. To launch a new edition, write and publish it in the Studio, preview it with `RESUME_ID=<id> yarn dev`, then change the constant. Other published resume documents are ignored.
- **Content** comes from Sanity: translatable fields are `{ en, es }` objects and `fetch-resume.mjs` resolves each one per language, falling back to English (and then to the raw value) for anything untranslated, so a half-translated resume still builds.
- **Bundles**: `vite build` runs once per language (`SITE_LOCALE=es`), each with only its own data, under `dist/` and `dist/es/`. `SITE_LOCALE=es yarn vite` serves the Spanish page in development at `/es/`.
- **Adding a language**: add it to `locales` in `src/i18n/messages.ts` and `scripts/locales.mjs`, add its copy to `messages` and `seo`, its PDF copy to `pdfMessages`, a `SITE_LOCALE=xx vite build` to `build:client`, its resume JSON import to `src/entry-server.tsx`, and a Cache-Control rule for `/xx/assets/` in `vercel.json`.

## Content model

The build queries the latest published `resume` document. Publishing in Sanity does not update the live site by itself: a Sanity webhook must call the Vercel deploy hook of the `martinez-place` project so it rebuilds with fresh content.

The app renders the latest published `resume` document. Its `pageBuilder`
array holds sections of type `header`, `infoSection` and `sliderSection`, each
rendered by the matching component in `src/SectionRenderer.tsx`.

## License

MIT
