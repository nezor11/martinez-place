import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import {
  defaultLocale,
  localeDist,
  localePath,
  locales,
  resumeDataFile,
} from "./scripts/locales.mjs";

// The client is built once per language (`yarn build:client`), each bundle
// carrying only its own resume data: SITE_LOCALE picks the data file, the
// output directory and the base path. The default language stays at the
// root; the others live under /<locale>/ and reuse the root's public files.
const locale = process.env.SITE_LOCALE ?? defaultLocale;
if (!locales.includes(locale)) {
  throw new Error(
    `SITE_LOCALE must be one of ${locales.join(", ")}, got "${locale}"`
  );
}
const isDefaultLocale = locale === defaultLocale;

// https://vitejs.dev/config/
export default defineConfig({
  base: localePath(locale),
  publicDir: isDefaultLocale ? "public" : false,
  define: {
    __SITE_LOCALE__: JSON.stringify(locale),
  },
  json: {
    // resume.json is large; JSON.parse is faster than an object literal
    stringify: true,
  },
  assetsInclude: [
    "**/*.woff",
    "**/*.woff2",
    "**/*.eot",
    "**/*.ttf",
    "**/*.svg",
  ],
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
            },
          },
          "sortAttrs",
          {
            name: "addAttributesToSVGElement",
            params: {
              attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
            },
          },
        ],
      },
      png: {
        // https://sharp.pixelplumbing.com/api-output#png
        quality: 80,
      },
      jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
      },
      jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 80,
      },
      tiff: {
        // https://sharp.pixelplumbing.com/api-output#tiff
        quality: 100,
      },
      // gif does not support lossless compression
      // https://sharp.pixelplumbing.com/api-output#gif
      gif: {},
      webp: {
        // https://sharp.pixelplumbing.com/api-output#webp
        lossless: true,
      },
      avif: {
        // https://sharp.pixelplumbing.com/api-output#avif
        lossless: true,
      },
      cache: false,
      cacheLocation: undefined,
    }),
  ],
  ssr: {
    // Bundle these into the server build instead of importing them from
    // node_modules at prerender time: swiper ships CSS entries, and the
    // CommonJS packages yield `{ default }` objects instead of components
    // when imported under Node ESM.
    noExternal: [/^swiper/, "react-player", "react-obfuscate"],
  },
  resolve: {
    alias: {
      "@resume-data": path.resolve(
        import.meta.dirname,
        resumeDataFile(locale)
      ),
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: localeDist(locale),
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? "";
          if (/\.woff2?$/.test(name)) {
            return "fonts/[name][extname]";
          }
          if (/\.ttf$/.test(name)) {
            return "fonts/[name][extname]";
          }
          if (/\.svg$/.test(name)) {
            return "images/[name][extname]";
          }
          return "[name][extname]";
        },
      },
    },
  },
});
