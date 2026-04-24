/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_METRIKA_ID: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  dataLayer?: unknown[]
  ym?: (...args: unknown[]) => void
}
