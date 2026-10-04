// Builds gtm/GTM-P585TC7L.json, the Google Tag Manager container for the
// site, in GTM's import format (Admin > Import container). Edit the event
// list here when src/utils/analytics.ts gains or loses an event, run
// `node gtm/build-container.mjs`, import the file in GTM and publish.
//
// Only built-in tag types are used: the site's CSP blocks Custom HTML tags
// and Custom JavaScript variables.
import { writeFileSync } from "node:fs";

const ACCOUNT = "6380448033";
const CONTAINER = "266029435";
const PUBLIC_ID = "GTM-P585TC7L";
const MEASUREMENT_ID = "G-2Y5TLT4KLL";

/** Data-layer events pushed by the site and the parameters each one carries. */
const EVENTS = {
  project_open: ["project", "source"],
  portfolio_filter: ["technology"],
  portfolio_search: ["search_term", "results"],
  video_play: ["project"],
  copy_link: ["project"],
  contact_click: ["method"],
  cv_download: ["file_name"],
  outbound_click: ["link_domain", "link_url"],
  language_switch: ["site_language"],
  theme_toggle: ["theme"],
};

const ids = { accountId: ACCOUNT, containerId: CONTAINER };
const template = (key, value) => ({ type: "TEMPLATE", key, value });
let nextId = 1;
const id = () => String(nextId++);

const params = [...new Set(Object.values(EVENTS).flat())];
const variable = params.map((name) => ({
  ...ids,
  variableId: id(),
  name: `DLV - ${name}`,
  type: "v",
  parameter: [
    { type: "INTEGER", key: "dataLayerVersion", value: "2" },
    { type: "BOOLEAN", key: "setDefaultValue", value: "false" },
    template("name", name),
  ],
  formatValue: {},
}));

const trigger = Object.keys(EVENTS).map((event) => ({
  ...ids,
  triggerId: id(),
  name: `Event - ${event}`,
  type: "CUSTOM_EVENT",
  customEventFilter: [
    {
      type: "EQUALS",
      parameter: [template("arg0", "{{_event}}"), template("arg1", event)],
    },
  ],
}));

const common = {
  tagFiringOption: "ONCE_PER_EVENT",
  monitoringMetadata: { type: "MAP" },
  consentSettings: { consentStatus: "NOT_SET" },
};

const tag = [
  {
    ...ids,
    tagId: id(),
    name: "GA4 - Google tag",
    type: "googtag",
    parameter: [template("tagId", MEASUREMENT_ID)],
    // Built-in "Initialization - All Pages" trigger.
    firingTriggerId: ["2147479573"],
    ...common,
  },
  ...Object.entries(EVENTS).map(([event, names], index) => ({
    ...ids,
    tagId: id(),
    name: `GA4 - ${event}`,
    type: "gaawe",
    parameter: [
      { type: "BOOLEAN", key: "sendEcommerceData", value: "false" },
      template("eventName", event),
      template("measurementIdOverride", MEASUREMENT_ID),
      {
        type: "LIST",
        key: "eventSettingsTable",
        list: names.map((name) => ({
          type: "MAP",
          map: [
            template("parameter", name),
            template("parameterValue", `{{DLV - ${name}}}`),
          ],
        })),
      },
    ],
    firingTriggerId: [trigger[index].triggerId],
    ...common,
  })),
];

const container = {
  exportFormatVersion: 2,
  containerVersion: {
    path: `accounts/${ACCOUNT}/containers/${CONTAINER}/versions/0`,
    ...ids,
    containerVersionId: "0",
    container: {
      path: `accounts/${ACCOUNT}/containers/${CONTAINER}`,
      ...ids,
      name: "martinez.place",
      publicId: PUBLIC_ID,
      usageContext: ["WEB"],
    },
    tag,
    trigger,
    variable,
    builtInVariable: [{ ...ids, type: "EVENT", name: "Event" }],
  },
};

const file = new URL(`./${PUBLIC_ID}.json`, import.meta.url);
writeFileSync(file, `${JSON.stringify(container, null, 2)}\n`);
console.log(
  `wrote gtm/${PUBLIC_ID}.json: ${tag.length} tags, ${trigger.length} triggers, ${variable.length} variables`,
);
