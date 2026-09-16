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
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

const { render, resumeFor, projectsFor, projectPath, locales, defaultLocale, localePath, localeFile, seo } =
  await import(resolve(root, "dist-ssr/entry-server.js"));

const pageUrl = (locale) => `${siteUrl}${localePath(locale)}`;
const projectUrl = (locale, slug) => `${siteUrl}${projectPath(locale, slug)}`;

/** Sanity CDN URL at the given width, as the site's sanityImageUrl does. */
const cdnImage = (src, width) => {
  if (!src) return null;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", "80");
  url.searchParams.set("w", String(width));
  url.searchParams.set("fit", "max");
  return url.toString();
};

const stripHtml = (html) => (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const truncate = (text, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;

/** Set an attribute on the first element matching `selector`, which must exist. */
const setAttr = (doc, selector, attribute, value) => {
  const element = doc.querySelector(selector);
  if (!element) throw new Error(`index.html has no ${selector}`);
  element.setAttribute(attribute, value);
};

/** Head values of a page: the resume itself, or one project of it. */
const headFor = (locale, project) => {
  const copy = seo[locale];
  if (!project) {
    return {
      title: copy.title,
      socialTitle: copy.socialTitle,
      description: copy.description,
      image: `${siteUrl}${localeFile("og", "png", locale)}`,
      imageAlt: copy.imageAlt,
      url: (l) => pageUrl(l),
    };
  }
  const { slide, slug } = project;
  const gallery = slide.images?.[0];
  const title = copy.projectTitle(slide.name, slide.slideTitle);
  return {
    title,
    socialTitle: title,
    description: truncate(slide.slideSummary || stripHtml(slide.slideDesc) || copy.description),
    image: cdnImage(gallery?.src ?? slide.slideImage?.src, 1200) ?? `${siteUrl}${localeFile("og", "png", locale)}`,
    imageAlt: gallery?.alt || slide.slideImage?.alt || slide.name,
    url: (l) => projectUrl(l, slug),
  };
};

/** Rewrite the template <head> for `locale` (and `project`) and return the HTML string. */
const localiseTemplate = (template, locale, project) => {
  const { document } = new JSDOM(template).window;
  const head = headFor(locale, project);
  const url = head.url(locale);

  document.documentElement.setAttribute("lang", locale);
  document.title = head.title;
  setAttr(document, 'meta[name="description"]', "content", head.description);
  setAttr(document, 'link[rel="canonical"]', "href", url);
  setAttr(document, 'meta[property="og:url"]', "content", url);
  setAttr(document, 'meta[property="og:title"]', "content", head.socialTitle);
  setAttr(document, 'meta[property="og:description"]', "content", head.description);
  setAttr(document, 'meta[property="og:image"]', "content", head.image);
  setAttr(document, 'meta[property="og:image:alt"]', "content", head.imageAlt);
  setAttr(document, 'meta[name="twitter:title"]', "content", head.socialTitle);
  setAttr(document, 'meta[name="twitter:description"]', "content", head.description);
  setAttr(document, 'meta[name="twitter:image"]', "content", head.image);

  const ogLocale = document.createElement("meta");
  ogLocale.setAttribute("property", "og:locale");
  ogLocale.setAttribute("content", locale === "es" ? "es_ES" : "en_US");
  document.head.appendChild(ogLocale);

  // Every page lists every language, itself included, plus x-default.
  for (const other of [...locales, "x-default"]) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", other);
    link.setAttribute("href", head.url(other === "x-default" ? defaultLocale : other));
    document.head.appendChild(link);
  }

  return `<!doctype html>\n${document.documentElement.outerHTML}\n`;
};

/** Structured data of a project page. */
const projectJsonLd = (locale, project) => {
  const resume = resumeFor(locale);
  const header = resume.pageBuilder.find((s) => s._type === "header") ?? {};
  const head = headFor(locale, project);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.slide.name,
    headline: project.slide.slideTitle,
    description: head.description,
    image: head.image,
    url: head.url(locale),
    dateCreated: project.slide.workDate?.slice(0, 10),
    inLanguage: locale,
    author: { "@type": "Person", name: header.name, url: pageUrl(locale) },
  };
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
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
  const html = await render(locale);
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

  // One page per project, under project/<slug>/, from the same template so
  // it loads the language's assets (absolute URLs) and hydrates the same app.
  let projectPages = 0;
  for (const project of projectsFor(locale)) {
    const projectHtml = await render(locale, project.slug);
    // Mirrors projectPath: dist/project/<slug>/ or dist/es/proyecto/<slug>/.
    const dir = resolve(root, "dist", projectPath(locale, project.slug).slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      resolve(dir, "index.html"),
      localiseTemplate(template, locale, project)
        .replace(marker, `<div id="root">${projectHtml}</div>`)
        .replace("</head>", `${projectJsonLd(locale, project)}</head>`)
    );
    projectPages += 1;
  }
  console.log(`[prerender] wrote ${projectPages} project pages under dist${projectPath(locale, "*")}`);
}

const lastModified = (resumeFor(defaultLocale)._updatedAt ?? new Date().toISOString()).slice(0, 10);
const alternatesFor = (urlOf) =>
  locales
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlOf(l)}"/>`)
    .join("\n");
const entry = (urlOf, locale, changefreq) => `  <url>
    <loc>${urlOf(locale)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
${alternatesFor(urlOf)}
  </url>`;
const projectSlugs = projectsFor(defaultLocale).map((p) => p.slug);
const sitemapEntries = [
  ...locales.map((locale) => entry(pageUrl, locale, "monthly")),
  ...locales.flatMap((locale) =>
    projectSlugs.map((slug) => entry((l) => projectUrl(l, slug), locale, "yearly"))
  ),
];
writeFileSync(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join("\n")}
</urlset>
`
);
console.log(`[prerender] wrote dist/sitemap.xml (${sitemapEntries.length} pages)`);
