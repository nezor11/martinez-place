#!/usr/bin/env node
/**
 * Builds public/resume.pdf (and resume.<locale>.pdf for every other
 * language) from src/data/resume.<locale>.json, the same content the site
 * renders, with @react-pdf/renderer, so the downloadable resume never drifts
 * from the page. Runs before the Vite build; Vite copies public/ to dist/,
 * so the files ship as /resume.pdf and /resume.es.pdf.
 *
 * Usage: node scripts/build-pdf.mjs [--locale es]
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import { localeFile, localePath, localesFromArgv, pdfMessages, resumeDataFile } from "./locales.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://martinez.place";
const h = React.createElement;

// --- fonts -----------------------------------------------------------------
// TTF versions of the site's Raleway subsets (react-pdf embeds TTF/OTF only;
// WOFF2 loads but renders no glyphs). Generated from public/font with
// fontTools: TTFont(woff2).flavor = None; save(ttf).
const fontDir = resolve(root, "scripts/fonts");
const raleway = [
  ["Raleway-Regular.ttf", 400, "normal"],
  ["Raleway-Italic.ttf", 400, "italic"],
  ["Raleway-Medium.ttf", 500, "normal"],
  ["Raleway-Bold.ttf", 700, "normal"],
];
let family = "Helvetica";
try {
  Font.register({
    family: "Raleway",
    fonts: raleway.map(([file, fontWeight, fontStyle]) => ({
      src: resolve(fontDir, file),
      fontWeight,
      fontStyle,
    })),
  });
  family = "Raleway";
} catch (error) {
  console.warn(`[build-pdf] could not register Raleway, using Helvetica: ${error}`);
}
Font.registerHyphenationCallback((word) => [word]);

// --- content helpers -------------------------------------------------------
const year = (iso) => (iso ? new Date(iso).getUTCFullYear() : null);
const dateRange = (start, finish, t) => {
  const a = year(start);
  const b = year(finish);
  if (!a) return "";
  if (!finish) return `${a} > ${t.current}`;
  return a === b ? `${a}` : `${a} > ${b}`;
};

/** Portable text blocks -> [{ bullet, runs: [{ text, bold, italic }] }]. */
const blocksToParagraphs = (blocks) =>
  (Array.isArray(blocks) ? blocks : [])
    .filter((block) => block?._type === "block")
    .map((block) => ({
      bullet: Boolean(block.listItem),
      runs: (block.children || []).map((child) => ({
        text: child.text || "",
        bold: (child.marks || []).includes("strong"),
        italic: (child.marks || []).includes("em"),
      })),
    }))
    .filter((p) => p.runs.some((r) => r.text.trim()));

/** The profile subtitle is stored as HTML lines; turn it into bullets. */
const htmlToLines = (html) =>
  String(html || "")
    .split(/<br\s*\/?>/i)
    .map((line) => line.replace(/<[^>]+>/g, "").trim().replace(/^_/, "").trim())
    .filter(Boolean);

const titleCase = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const iconLabel = (name) =>
  ({
    HTML5Icon: "HTML5",
    CSS3Icon: "CSS3",
    JavaScriptIcon: "JavaScript",
    TypeScriptIcon: "TypeScript",
    NodeJSIcon: "Node.js",
    WebPackIcon: "Webpack",
    NextJSIcon: "Next.js",
    VueIcon: "Vue",
    ViteIcon: "Vite",
    NuxtIcon: "Nuxt",
    ReactIcon: "React",
    WordpressIcon: "WordPress",
    PhpIcon: "PHP",
    GitBranchIcon: "Git",
    CommercetoolsIcon: "commercetools",
    KotlinIcon: "Kotlin",
    ReactNativeIcon: "React Native",
    AndroidIcon: "Android",
    JetpackComposeIcon: "Jetpack Compose",
  })[name] || name.replace(/Icon$/, "");

// --- styles ----------------------------------------------------------------
const rose = "#e11d48";
const ink = "#111827";
const muted = "#4b5563";
const styles = StyleSheet.create({
  page: { fontFamily: family, fontSize: 9.5, color: ink, paddingTop: 40, paddingBottom: 48, paddingHorizontal: 44, lineHeight: 1.4 },
  name: { fontSize: 24, fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.15 },
  role: { fontSize: 12, color: rose, textTransform: "uppercase", marginTop: 6, letterSpacing: 1 },
  contact: { marginTop: 6, color: muted, fontSize: 9 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: rose, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 0.8, borderBottomColor: "#fecdd3" },
  item: { marginBottom: 8 },
  itemHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  company: { fontSize: 10.5, fontWeight: 700 },
  jobTitle: { fontWeight: 500, color: muted, marginBottom: 2 },
  date: { color: muted, fontSize: 8.5 },
  paragraph: { marginBottom: 2 },
  bullet: { flexDirection: "row", marginBottom: 1 },
  bulletDot: { width: 10, color: rose },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
  skills: { color: muted },
  columns: { flexDirection: "row", gap: 18 },
  column: { flex: 1 },
  project: { flexDirection: "row", marginBottom: 4 },
  projectYear: { width: 30, color: muted, fontSize: 8, paddingTop: 1 },
  projectBody: { flex: 1 },
  link: { color: rose, textDecoration: "none" },
  footer: { position: "absolute", bottom: 22, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: "#9ca3af" },
});

// --- components ------------------------------------------------------------
const Runs = ({ runs }) =>
  h(
    Text,
    null,
    ...runs.map((run, i) =>
      h(Text, { key: i, style: [run.bold && styles.bold, run.italic && styles.italic].filter(Boolean) }, run.text)
    )
  );

const Paragraphs = ({ blocks }) =>
  h(
    View,
    null,
    ...blocksToParagraphs(blocks).map((p, i) =>
      p.bullet
        ? h(View, { key: i, style: styles.bullet }, h(Text, { style: styles.bulletDot }, "•"), h(View, { style: { flex: 1 } }, h(Runs, { runs: p.runs })))
        : h(View, { key: i, style: styles.paragraph }, h(Runs, { runs: p.runs }))
    )
  );

const Bullets = ({ lines }) =>
  h(View, null, ...lines.map((line, i) => h(View, { key: i, style: styles.bullet }, h(Text, { style: styles.bulletDot }, "•"), h(Text, { style: { flex: 1 } }, line))));

const InfoSection = ({ section, t }) =>
  h(
    View,
    { style: styles.section },
    h(Text, { style: styles.sectionTitle }, section.titleSection),
    section.subtitleSection ? h(View, { style: { marginBottom: 6 } }, h(Bullets, { lines: htmlToLines(section.subtitleSection) })) : null,
    ...(section.sections || []).map((item) =>
      h(
        View,
        { key: item._key, style: styles.item, wrap: false },
        item.company
          ? h(
              View,
              { style: styles.itemHead },
              item.infoUrl ? h(Link, { src: item.infoUrl, style: [styles.company, styles.link] }, item.company) : h(Text, { style: styles.company }, item.company),
              h(Text, { style: styles.date }, dateRange(item.startDate, item.finishDate, t))
            )
          : null,
        item.jobTitle ? h(Text, { style: styles.jobTitle }, item.jobTitle) : null,
        h(Paragraphs, { blocks: item.jobDesc })
      )
    )
  );

const Portfolio = ({ section, t }) => {
  const slides = (section.sliderDetails?.slides || [])
    .map((s) => s.slideDetails)
    .filter(Boolean)
    .sort((a, b) => String(b.workDate || "").localeCompare(String(a.workDate || "")));
  const half = Math.ceil(slides.length / 2);
  const Project = (s) =>
    h(
      View,
      { key: s._id, style: styles.project, wrap: false },
      h(Text, { style: styles.projectYear }, String(year(s.workDate) ?? "")),
      h(
        View,
        { style: styles.projectBody },
        h(
          Text,
          null,
          h(Text, { style: styles.bold }, s.slideTitle || s.name),
          s.company ? h(Text, { style: { color: muted } }, `  ·  ${titleCase(s.company)}`) : null
        ),
        s.slideSummary ? h(Text, { style: { color: muted, fontSize: 8.5 } }, s.slideSummary) : null
      )
    );
  return h(
    View,
    { style: styles.section },
    h(Text, { style: styles.sectionTitle }, section.titleSection || t.portfolio),
    h(
      View,
      { style: styles.columns },
      h(View, { style: styles.column }, ...slides.slice(0, half).map(Project)),
      h(View, { style: styles.column }, ...slides.slice(half).map(Project))
    )
  );
};

const generated = new Date().toISOString().slice(0, 10);

const buildPdf = async (locale) => {
  const t = pdfMessages[locale];
  const dataFile = resolve(root, resumeDataFile(locale));
  const outFile = resolve(root, "public", localeFile("resume", "pdf", locale));
  const pageUrl = `${siteUrl}${localePath(locale)}`;
  if (!existsSync(dataFile)) {
    console.error(`[build-pdf] ${dataFile} is missing; run fetch-resume first`);
    process.exit(1);
  }
  const resume = JSON.parse(readFileSync(dataFile, "utf8"));
  const header = resume.pageBuilder.find((s) => s._type === "header") || {};
  const contact = header.contactDetails || {};
  const skills = (header.icons || []).map((i) => iconLabel(i.iconDetails?.name || "")).filter(Boolean);

  const doc = h(
    Document,
    { title: `${header.name} – ${header.jobDescHeader}`, author: header.name, subject: t.subject, creator: siteUrl, language: locale },
    h(
      Page,
      { size: "A4", style: styles.page },
      h(Text, { style: styles.name }, header.name),
      h(Text, { style: styles.role }, header.jobDescHeader),
      h(
        Text,
        { style: styles.contact },
        [contact.email, contact.phone, contact.address].filter(Boolean).join("   ·   "),
        "   ·   ",
        h(Link, { src: pageUrl, style: styles.link }, "martinez.place")
      ),
      skills.length ? h(View, { style: styles.section }, h(Text, { style: styles.sectionTitle }, t.skills), h(Text, { style: styles.skills }, skills.join("  ·  "))) : null,
      ...resume.pageBuilder.map((section) =>
        section._type === "infoSection"
          ? h(InfoSection, { key: section._key, section, t })
          : section._type === "sliderSection"
            ? h(Portfolio, { key: section._key, section, t })
            : null
      ),
      h(
        View,
        { style: styles.footer, fixed: true },
        h(Text, null, `${header.name} · ${siteUrl} · ${t.generated} ${generated}`),
        h(Text, { render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` })
      )
    )
  );

  mkdirSync(dirname(outFile), { recursive: true });
  await renderToFile(doc, outFile);
  console.log(`[build-pdf] wrote ${outFile} (${family})`);
};

for (const locale of localesFromArgv(process.argv)) {
  await buildPdf(locale);
}
