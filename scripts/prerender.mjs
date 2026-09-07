#!/usr/bin/env node
/**
 * Renders the app to static HTML, once per language, and injects it into
 * dist/index.html and dist/<locale>/index.html.
 *
 * Runs after `vite build` (one client build per language, see
 * vite.config.js) and `vite build --ssr` (server bundle in dist-ssr). A jsdom
 * window is exposed globally before the server bundle is imported so
 * DOMPurify sanitises exactly as it does in the browser.
 *
 * index.html carries the English <head>; for every other language the title,
 * description, canonical and social tags are rewritten from the SEO copy the
 * server bundle exports, and every page gets hreflang links to the others.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { localeDist } from "./locales.mjs";

// Use the production server renderer: faster and without dev-only warnings.
process.env.NODE_ENV = "production";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://martinez.place";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: `${siteUrl}/`,
});
for (const key of ["window", "document", "navigator", "HTMLElement", "Node"]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key === "window" ? undefined : key] ?? dom.window,
    configurable: true,
    writable: true,
  });
}

const { render, resumeFor, locales, defaultLocale, localePath, localeFile, seo } =
  await import(resolve(root, "dist-ssr/entry-server.js"));

const pageUrl = (locale) => `${siteUrl}${localePath(locale)}`;

/** Set an attribute on the first element matching `selector`, which must exist. */
const setAttr = (doc, selector, attribute, value) => {
  const element = doc.querySelector(selector);
  if (!element) throw new Error(`index.html has no ${selector}`);
  element.setAttribute(attribute, value);
};

/** Rewrite the template <head> for `locale` and return the HTML string. */
const localiseTemplate = (template, locale) => {
  const { document } = new JSDOM(template).window;
  const copy = seo[locale];
  const url = pageUrl(locale);
  const image = `${siteUrl}${localeFile("og", "png", locale)}`;

  document.documentElement.setAttribute("lang", locale);
  document.title = copy.title;
  setAttr(document, 'meta[name="description"]', "content", copy.description);
  setAttr(document, 'link[rel="canonical"]', "href", url);
  setAttr(document, 'meta[property="og:url"]', "content", url);
  setAttr(document, 'meta[property="og:title"]', "content", copy.socialTitle);
  setAttr(document, 'meta[property="og:description"]', "content", copy.description);
  setAttr(document, 'meta[property="og:image"]', "content", image);
  setAttr(document, 'meta[property="og:image:alt"]', "content", copy.imageAlt);
  setAttr(document, 'meta[name="twitter:title"]', "content", copy.socialTitle);
  setAttr(document, 'meta[name="twitter:description"]', "content", copy.description);
  setAttr(document, 'meta[name="twitter:image"]', "content", image);

  const ogLocale = document.createElement("meta");
  ogLocale.setAttribute("property", "og:locale");
  ogLocale.setAttribute("content", locale === "es" ? "es_ES" : "en_US");
  document.head.appendChild(ogLocale);

  // Every page lists every language, itself included, plus x-default.
  for (const other of [...locales, "x-default"]) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", other);
    link.setAttribute("href", pageUrl(other === "x-default" ? defaultLocale : other));
    document.head.appendChild(link);
  }

  return `<!doctype html>\n${document.documentElement.outerHTML}\n`;
};

const jsonLdFor = (locale) => {
  const resume = resumeFor(locale);
  const header = resume.pageBuilder.find((s) => s._type === "header") ?? {};
  // Structured data for search engines. Contact details stay out on purpose:
  // the page obfuscates them to keep scrapers away.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: header.name,
    jobTitle: header.jobDescHeader,
    url: pageUrl(locale),
    image: header.imageDetails?.url,
    address: header.contactDetails?.address
      ? { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" }
      : undefined,
  };
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
};

const marker = '<div id="root"></div>';

for (const locale of locales) {
  const html = render(locale);
  if (!html.includes("<main")) {
    throw new Error(`Prerender for ${locale} produced no <main> element`);
  }
  // Each language's client build wrote its own index.html, with the English
  // <head> from the template and its own asset URLs; localise it in place.
  const indexFile = resolve(root, localeDist(locale), "index.html");
  const template = readFileSync(indexFile, "utf8");
  if (!template.includes(marker)) {
    throw new Error(`${indexFile} has no empty #root to fill`);
  }
  writeFileSync(
    indexFile,
    localiseTemplate(template, locale)
      .replace(marker, `<div id="root">${html}</div>`)
      .replace("</head>", `${jsonLdFor(locale)}</head>`)
  );
  console.log(`[prerender] wrote ${indexFile} (${(html.length / 1024).toFixed(1)} KB of HTML)`);
}

const lastModified = (resumeFor(defaultLocale)._updatedAt ?? new Date().toISOString()).slice(0, 10);
const alternates = locales
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${pageUrl(l)}"/>`)
  .join("\n");
writeFileSync(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales
  .map(
    (locale) => `  <url>
    <loc>${pageUrl(locale)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
${alternates}
  </url>`
  )
  .join("\n")}
</urlset>
`
);
console.log(`[prerender] wrote dist/sitemap.xml (${locales.length} pages)`);
