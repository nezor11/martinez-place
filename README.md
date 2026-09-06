# martinez.place

Personal resume site of Jorge Martínez Ortiz, live at [martinez.place](https://martinez.place/). The component library is published at [storybook.martinez.place](https://storybook.martinez.place/).

The page content (header, info sections, project slider, PDF resume) is
managed in [Sanity](https://www.sanity.io/) (schema in [nezor11/martinez-place-sanity](https://github.com/nezor11/martinez-place-sanity)) and fetched at runtime. The UI is
built from a small component library organised by atomic design and documented
with Storybook.

## Stack

- React 18 + TypeScript, bundled with Vite
- Tailwind CSS with light/dark theme (system preference, persisted in `localStorage`)
- Sanity as headless CMS (`@sanity/client`, `@sanity/image-url`)
- Swiper and react-player for the project slider
- Storybook 8 for the component library
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
| `yarn dev` | Vite dev server for the site |
| `yarn build` | Production build into `dist/` |
| `yarn preview` | Serve the production build locally |
| `yarn storybook` | Storybook dev server plus Tailwind watcher |
| `yarn build-storybook` | Static Storybook into `storybook-static/` |
| `yarn build-storybook-and-copy-readme` | Static Storybook with docs and the per-component README files |
| `yarn lint` | Biome lint over `src/` |
| `yarn format` | Biome format over `src/` |

## Project layout

```
.
├── .storybook/          Storybook config, theme and viewports
├── public/              Static assets served as-is (fonts, favicons)
├── src/
│   ├── App.tsx          Fetches the resume from Sanity and renders it
│   ├── *Section.tsx     Map Sanity sections to UI components
│   ├── contexts/        ThemeContext and ThemeProvider
│   ├── stories/         Component library (atoms, molecules, organisms, templates, pages)
│   ├── styles/          Generated Tailwind CSS (do not edit; see tailwind-input.css)
│   └── utils/           Sanity client, shared types, helpers
├── index.html           Vite entry with SEO / Open Graph metadata
├── vercel.json          Cache headers for hashed assets and fonts
└── vite.config.js       Vite config (image optimizer, asset naming)
```

Tailwind is compiled from `src/tailwind-input.css` into `src/styles/tailwind.css`
by the `watch:tailwind` script; the generated file is committed so the app can
import it directly.

## Content model

The app queries the latest published `resume` document. Its `pageBuilder`
array holds sections of type `header`, `infoSection` and `sliderSection`, each
rendered by the matching component in `src/SectionRenderer.tsx`.

## License

MIT
