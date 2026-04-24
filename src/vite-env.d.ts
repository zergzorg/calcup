/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_METRIKA_ID: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Module augmentation must import to avoid replacing the module with moduleDetection:force
import type {} from 'vue-router'

declare global {
  interface Window {
    dataLayer?: unknown[]
    ym?: (...args: unknown[]) => void
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'site' | 'workspace'
    categorySlug?: string
    toolSlug?: string
    noindex?: boolean
  }
}
