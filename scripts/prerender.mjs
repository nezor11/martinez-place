#!/usr/bin/env node
/**
 * Renders the app to static HTML and injects it into dist/index.html.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle in
 * dist-ssr). A jsdom window is exposed globally before the server bundle is
 * imported so DOMPurify sanitises exactly as it does in the browser.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

// Use the production server renderer: faster and without dev-only warnings.
process.env.NODE_ENV = "production";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexFile = resolve(root, "dist/index.html");

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://martinez.place/",
});
for (const key of ["window", "document", "navigator", "HTMLElement", "Node"]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key === "window" ? undefined : key] ?? dom.window,
    configurable: true,
    writable: true,
  });
}

const { render } = await import(resolve(root, "dist-ssr/entry-server.js"));
const html = render();
if (!html.includes("<main")) {
  throw new Error("Prerender produced no <main> element");
}

const resume = JSON.parse(
  readFileSync(resolve(root, "src/data/resume.json"), "utf8")
);
const header = resume.pageBuilder.find((s) => s._type === "header") ?? {};
const siteUrl = "https://martinez.place/";
const lastModified = (resume._updatedAt ?? new Date().toISOString()).slice(0, 10);

// Structured data for search engines. Contact details stay out on purpose:
// the page obfuscates them to keep scrapers away.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: header.name,
  jobTitle: header.jobDescHeader,
  url: siteUrl,
  image: header.imageDetails?.url,
  address: header.contactDetails?.address
    ? { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" }
    : undefined,
};
const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

writeFileSync(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
`
);

const marker = '<div id="root"></div>';
const template = readFileSync(indexFile, "utf8");
if (!template.includes(marker)) {
  throw new Error(`${indexFile} has no empty #root to fill`);
}
writeFileSync(
  indexFile,
  template
    .replace(marker, `<div id="root">${html}</div>`)
    .replace("</head>", `${jsonLdTag}</head>`)
);
console.log(`[prerender] wrote ${indexFile} (${(html.length / 1024).toFixed(1)} KB of HTML), JSON-LD and sitemap.xml`);
