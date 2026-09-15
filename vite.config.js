import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { criticalIconNames } from "./scripts/critical-icons.mjs";
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


// `virtual:critical-icons` statically imports the icons the prerendered HTML
// contains (header skills, section titles) and registers them, so hydration
// has them synchronously while the other icons stay in lazy chunks.
const criticalIconsPlugin = () => {
  const id = "virtual:critical-icons";
  const resolvedId = `\0${id}`;
  const iconsDir = "/src/stories/components/molecules/IconGallery/Icons";
  const registry = "/src/stories/components/molecules/IconGallery/registry";
  return {
    name: "critical-icons",
    resolveId(source) {
      return source === id ? resolvedId : undefined;
    },
    load(moduleId) {
      if (moduleId !== resolvedId) return undefined;
      const resume = JSON.parse(readFileSync(resumeDataFile(locale), "utf8"));
      const names = criticalIconNames(resume).filter((name) =>
        existsSync(path.join(import.meta.dirname, `.${iconsDir}/${name}.tsx`))
      );
      const imports = names
        .map((name) => `import ${name} from "${iconsDir}/${name}.tsx";`)
        .join("\n");
      return `${imports}\nimport { registerIcons } from "${registry}";\nregisterIcons({ ${names.join(", ")} });\n`;
    },
  };
};

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
    criticalIconsPlugin(),
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
