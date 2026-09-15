# martinez.place

Personal resume site of Jorge Martínez Ortiz, live at [martinez.place](https://martinez.place/) (English) and [martinez.place/es/](https://martinez.place/es/) (Spanish). The component library is published at [storybook.martinez.place](https://storybook.martinez.place/).

The content (header, info sections, project slider, PDF resume) is managed in [Sanity](https://www.sanity.io/) (schema in [nezor11/martinez-place-sanity](https://github.com/nezor11/martinez-place-sanity)) and fetched **at build time**: `scripts/fetch-resume.mjs` writes `src/data/resume.<locale>.json`, one per language, which the site bundles. The HTML is then **prerendered** by `scripts/prerender.mjs`, so `index.html` and `es/index.html` ship with the full page and React only hydrates them. The browser never talks to Sanity and the content is visible before any JavaScript runs. Publishing in the Studio fires a Sanity webhook that calls the Vercel deploy hook, so the live site follows the content within a few minutes.

## Stack

- React 19 + TypeScript, bundled with Vite 8
- Tailwind CSS 4 with light/dark theme (manual toggle, persisted in `localStorage`)
- Sanity as headless CMS, read through its public query API at build time
- Swiper for the project slider, react-player 3 (YouTube and HTML5 only) for videos
- Storybook 10 for the component library, with the accessibility addon
- Biome for linting and formatting; Vitest for unit tests; Playwright, axe and Lighthouse CI for the built site
- Deployed on Vercel as two projects from this repo: `martinez-place` (site) and `martinez-place-storybook` (Storybook)

## Getting started

Requires Node 22 and Yarn 4 (the version is pinned in `package.json`; enable Corepack with `corepack enable` if `yarn --version` does not print 4.x).

```shell
yarn            # install dependencies
yarn dev        # fetch content, build PDF + social card, app at http://localhost:5173
yarn storybook  # Storybook at http://localhost:6006
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
| `yarn fetch-resume` | Pull the published resume from Sanity into `src/data/resume.<locale>.json`, one file per language, and sample the corner luminance of every gallery image (`--strict` fails instead of keeping a stale file; `--locale es` for one language) |
| `yarn build:pdf` | Build `public/resume.pdf` and `public/resume.es.pdf` from the same data with @react-pdf/renderer |
| `yarn build:og` | Build `public/og.png` and `public/og.es.png` (1200×630 social cards) with satori + resvg |
| `yarn dev` | Fetch the resume, build the PDF and the social card, then start the Vite dev server (`SITE_LOCALE=es yarn vite` for the Spanish page) |
| `yarn build` | Fetch the resume (strict), build PDFs and social cards, one client bundle per language, the server bundle, then prerender `dist/index.html` and `dist/es/index.html` |
| `yarn build:client` / `yarn build:ssr` / `yarn prerender` | The three build steps individually |
| `yarn preview` | Serve the production build locally |
| `yarn storybook` / `yarn build-storybook` | Storybook dev server / static Storybook into `storybook-static/` |
| `yarn lint` / `yarn format` / `yarn typecheck` | Biome lint, Biome format, `tsc --noEmit` |
| `yarn test` / `yarn test:watch` | Vitest unit tests over the pure helpers in `src/utils` and `scripts` |
| `yarn test:e2e` | Playwright suite against `vite preview` of the built site (prerender, hydration, CSP and video playback, deep links, filter, print, manifest, i18n, PDF, social card, axe) |
| `yarn lighthouse` | Lighthouse CI with the thresholds in `lighthouserc.cjs` |

## Project layout

```
.
├── .github/workflows/   CI: lint, typecheck, unit tests, builds, e2e, Lighthouse
├── .storybook/          Storybook config, theme and viewports
├── scripts/             fetch-resume.mjs, image-luminance.mjs, critical-icons.mjs, locales.mjs,
│                        build-pdf.mjs, build-og.mjs, prerender.mjs, fonts/ (TTF for the PDF)
├── public/              Static assets served as-is (fonts, favicon, app icons, web manifest)
├── src/
│   ├── App.tsx          Renders the resume sections, theme toggle, language switcher
│   ├── main.tsx         Client entry: hydrates the prerendered HTML
│   ├── entry-server.tsx Server entry used by the prerender step
│   ├── *Section.tsx     Map Sanity sections to UI components
│   ├── contexts/        ThemeContext and ThemeProvider
│   ├── data/            resume.<locale>.json (generated, ignored) and their typed export
│   ├── i18n/            Languages, UI copy per language, SEO metadata and the locale context
│   ├── stories/         Component library (atoms, molecules, organisms, templates, pages)
│   ├── styles/          index.css: Tailwind 4 entry, global styles and the print stylesheet
│   └── utils/           Helpers (slugs, colour, icon labels, portfolio search, Sanity image URLs) + tests
├── tests/e2e/           Playwright specs and helpers
├── index.html           Vite entry with SEO / Open Graph metadata, manifest and icon links
├── vercel.json          Security headers, CSP and cache rules
├── vite.config.js       Vite config (image optimizer, per-locale build, critical icons)
└── vitest.config.ts     Unit test config
```

### Prerender rules

Everything rendered on the first pass must be identical on the build server and in the browser: no `Math.random`, no `window`/`localStorage` reads during render (use effects or `import.meta.env.SSR`), and dates formatted with a fixed locale and time zone. The theme starts light and is applied after mount; an inline script in `index.html` (allowed by its hash in the CSP) adds the `dark` class before paint so there is no flash. Card, modal and filter icons render after mount so the HTML stays small.

Tailwind 4 runs through `@tailwindcss/vite`: `src/styles/index.css` is the entry (it imports Tailwind and the legacy `tailwind.config.js` via `@config`), and component stylesheets that use `@apply` start with `@reference` to it.

### Icons

Each technology icon is a component in `src/stories/components/molecules/IconGallery/Icons/<Name>Icon.tsx`; its file name is the `name` stored in Sanity. They load on demand through the registry in `IconGallery/registry.tsx`; the icons the prerendered HTML contains (header skills and section titles, read from the resume JSON by `scripts/critical-icons.mjs`) are bundled through the `virtual:critical-icons` module so hydration never waits for them. To add an icon: create the component, add its label to `src/utils/iconLabels.ts` and the maps in `build-pdf.mjs` / `build-og.mjs`, and create the matching `icons` document in Sanity.

### Deep links

Every project card has a slug from its Sanity name. Opening a card sets `#project-<slug>` in the URL, closing it clears it, and loading a page with that hash scrolls the slider to the card and opens it. The popup's link icon copies the absolute URL.

### Printing

`@media print` rules in `src/styles/index.css` hide the controls, print the portfolio as columns of cards, force the light theme (`beforeprint` in `App.tsx`) and expand the "Load more" lists.

## Dependency updates

Dependabot opens a grouped PR for minor and patch updates every Monday and one PR per major. CI runs lint, typecheck, unit tests, both builds, the Playwright suite and Lighthouse on each of them, so a green PR is safe to merge.

## PDF resume

`scripts/build-pdf.mjs` renders `public/resume.pdf` and `public/resume.es.pdf` from `src/data/resume.<locale>.json` with [@react-pdf/renderer](https://react-pdf.org/), so the download link in each language's footer always matches the published content. It embeds the Raleway subsets converted to TTF in `scripts/fonts/` (react-pdf does not render WOFF2 glyphs).

## Social card

`scripts/build-og.mjs` renders `public/og.png` and `public/og.es.png` (1200×630) with [satori](https://github.com/vercel/satori) and [resvg](https://github.com/RazrFalcon/resvg): name, role, city, skills and the profile photo from Sanity, in the site's Raleway. Each prerendered page points `og:image` and `twitter:image` at its own card.

## Languages

The site is published in English at `/` and in Spanish at `/es/`, as two prerendered pages that link each other with `hreflang` (plus `x-default` to English) and share one `sitemap.xml`. There is no automatic redirect by browser language.

- **UI copy** (buttons, labels, accessible names, SEO title and description, date locale) lives in `src/i18n/messages.ts`; components read it through `useMessages()` from the `LocaleContext`, which defaults to English so Storybook and tests need no setup.
- **Active resume**: the site is built from one `resume` document, pinned by id in `activeResumeId` at the top of `scripts/fetch-resume.mjs`. To launch a new edition, write and publish it in the Studio, preview it with `RESUME_ID=<id> yarn dev`, then change the constant. Other published resume documents are ignored.
- **Content** comes from Sanity: translatable fields are `{ en, es }` objects and `fetch-resume.mjs` resolves each one per language, falling back to English (and then to the raw value) for anything untranslated, so a half-translated resume still builds.
- **Bundles**: `vite build` runs once per language (`SITE_LOCALE=es`), each with only its own data, under `dist/` and `dist/es/`.
- **Adding a language**: add it to `locales` in `src/i18n/messages.ts` and `scripts/locales.mjs`, add its copy to `messages` and `seo`, its PDF copy to `pdfMessages`, a `SITE_LOCALE=xx vite build` to `build:client`, its resume JSON import to `src/entry-server.tsx`, and a Cache-Control rule for `/xx/assets/` in `vercel.json`.

## Content model

The build queries one published `resume` document. Its `pageBuilder` array holds sections of type `header`, `infoSection` and `sliderSection`, each rendered by the matching component in `src/SectionRenderer.tsx`. Project cards are `slide` documents referenced from a `sliders` document; the array order is the order on the site, and card images must be 300×350.

## License

MIT
