#!/usr/bin/env node
/**
 * Builds public/og.png (1200x630), the image shown when the site is shared
 * on LinkedIn, X, Slack and similar, from src/data/resume.<locale>.json, plus
 * og.<locale>.png for every other language. Uses satori (layout to SVG with
 * the site's Raleway fonts) and resvg (SVG to PNG), so it needs no browser
 * and runs the same on Vercel, in CI and locally.
 *
 * Usage: node scripts/build-og.mjs [--locale es]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { localeFile, localesFromArgv, resumeDataFile } from "./locales.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "martinez.place";
const width = 1200;
const height = 630;

/** Profile photo as a data URI (JPEG, 400px) so satori can inline it. */
const loadPhoto = async (header) => {
  const url = header.imageDetails?.url;
  if (!url) return null;
  try {
    const response = await fetch(`${url}?w=400&h=400&fit=crop&fm=jpg&q=85`);
    if (!response.ok) throw new Error(`status ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch (error) {
    console.warn(`[build-og] photo skipped: ${error instanceof Error ? error.message : error}`);
    return null;
  }
};

const font = (file) => readFileSync(resolve(root, "scripts/fonts", file));
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length === 1 ? children[0] : children } });
const rose = "#e11d48";

const buildOg = async (locale) => {
const dataFile = resolve(root, resumeDataFile(locale));
const outFile = resolve(root, "public", localeFile("og", "png", locale));
if (!existsSync(dataFile)) {
  console.error(`[build-og] ${dataFile} is missing; run fetch-resume first`);
  process.exit(1);
}
const resume = JSON.parse(readFileSync(dataFile, "utf8"));
const header = resume.pageBuilder.find((s) => s._type === "header") ?? {};
const name = header.name ?? "Jorge Martínez";
const role = header.jobDescHeader ?? "";
const city = (header.contactDetails?.address ?? "").replace(/^\d+\s*/, "") || "Barcelona";
const skills = (header.icons ?? [])
  .map((i) => i.iconDetails?.name ?? "")
  .map((n) => ({ HTML5Icon: "HTML5", CSS3Icon: "CSS3", JavaScriptIcon: "JavaScript", TypeScriptIcon: "TypeScript", NodeJSIcon: "Node.js", WebPackIcon: "Webpack", NextJSIcon: "Next.js", VueIcon: "Vue", ViteIcon: "Vite", NuxtIcon: "Nuxt", ReactIcon: "React", WordpressIcon: "WordPress", PhpIcon: "PHP", GitBranchIcon: "Git", CommercetoolsIcon: "commercetools", KotlinIcon: "Kotlin", ReactNativeIcon: "React Native" })[n] ?? n.replace(/Icon$/, ""))
  .filter(Boolean)
  .slice(0, 8);
const photo = await loadPhoto(header);

const tree = h(
  "div",
  { style: { width, height, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "72px 88px", background: "linear-gradient(135deg, #0b1020 0%, #020617 100%)", color: "#f8fafc", fontFamily: "Raleway" } },
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 720 } },
    h("div", { style: { fontSize: 82, fontWeight: 700, letterSpacing: -1, lineHeight: 1.05 } }, name),
    h("div", { style: { fontSize: 34, fontWeight: 500, color: rose, textTransform: "uppercase", letterSpacing: 6, marginTop: 18 } }, role),
    h("div", { style: { fontSize: 26, color: "#94a3b8", marginTop: 26 } }, `${city}  ·  ${siteUrl}`),
    h(
      "div",
      { style: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 40 } },
      ...skills.map((s) => h("div", { style: { fontSize: 20, fontWeight: 500, color: "#cbd5e1", border: "2px solid #334155", borderRadius: 999, padding: "6px 16px" } }, s))
    )
  ),
  photo
    ? h("div", { style: { display: "flex", width: 300, height: 300, borderRadius: 24, overflow: "hidden", border: `6px solid ${rose}`, transform: "rotate(-3deg)" } }, h("img", { src: photo, width: 300, height: 300, style: { objectFit: "cover" } }))
    : null
);

const svg = await satori(tree, {
  width,
  height,
  fonts: [
    { name: "Raleway", data: font("Raleway-Regular.ttf"), weight: 400, style: "normal" },
    { name: "Raleway", data: font("Raleway-Medium.ttf"), weight: 500, style: "normal" },
    { name: "Raleway", data: font("Raleway-Bold.ttf"), weight: 700, style: "normal" },
  ],
});
const png = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, png);
console.log(`[build-og] wrote ${outFile} (${(png.length / 1024).toFixed(0)} KB)`);
};

for (const locale of localesFromArgv(process.argv)) {
  await buildOg(locale);
}
