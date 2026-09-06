/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Unsplash access key used only by Storybook stories. */
  readonly STORYBOOK_UNSPLASH_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
