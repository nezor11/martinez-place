/**
 * Human-readable label of an icon component (the `name` stored in Sanity),
 * used for search, accessible names and the tech filter. Falls back to the
 * component name without the "Icon" suffix.
 */
const labels: Record<string, string> = {
  AndroidIcon: "Android",
  BehanceIcon: "Behance",
  CommercetoolsIcon: "commercetools",
  CsharpIcon: "C#",
  CSS3Icon: "CSS3",
  FractalIcon: "Fractal",
  GitBranchIcon: "Git",
  GitHubIcon: "GitHub",
  GraphqlIcon: "GraphQL",
  HTML5Icon: "HTML5",
  IllustratorIcon: "Illustrator",
  JavaScriptIcon: "JavaScript",
  JetpackComposeIcon: "Jetpack Compose",
  JQueryIcon: "jQuery",
  KotlinIcon: "Kotlin",
  LaravelIcon: "Laravel",
  LitmusIcon: "Litmus",
  MailchimpIcon: "Mailchimp",
  MauticIcon: "Mautic",
  MySQLIcon: "MySQL",
  NextJSIcon: "Next.js",
  NodeJSIcon: "Node.js",
  NuxtIcon: "Nuxt",
  PhotoshopIcon: "Photoshop",
  PhpIcon: "PHP",
  PrestashopIcon: "PrestaShop",
  ReactIcon: "React",
  ReactNativeIcon: "React Native",
  SanityIcon: "Sanity",
  SitecoreIcon: "Sitecore",
  StorybookIcon: "Storybook",
  TypeScriptIcon: "TypeScript",
  UmbracoIcon: "Umbraco",
  ViteIcon: "Vite",
  VueIcon: "Vue",
  WebPackIcon: "Webpack",
  WooCommerceIcon: "WooCommerce",
  WordpressIcon: "WordPress",
  ZeplinIcon: "Zeplin",
};

export const iconLabel = (name: string): string =>
  labels[name] ?? name.replace(/Icon$/, "");
