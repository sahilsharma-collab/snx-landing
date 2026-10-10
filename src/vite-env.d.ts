/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set by .env.standalone — switches the router to hash URLs for the
   *  single-file build (npm run build:html). */
  readonly VITE_STANDALONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
