/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_URL: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_ENVIRONMENT: string
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_FEATURE_NEW_UI: string
  readonly VITE_FEATURE_BETA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend Window interface for analytics
interface Window {
  gtag?: (...args: unknown[]) => void
}
