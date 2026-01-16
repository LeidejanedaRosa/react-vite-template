import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production'

  if (!dsn) {
    console.warn('Sentry DSN não configurado')
    return
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate:
      Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) || 1.0,

    // Session Replay
    replaysSessionSampleRate:
      Number(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) || 0.1,
    replaysOnErrorSampleRate:
      Number(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE) || 1.0,

    // Filtrar erros irrelevantes
    beforeSend(event, hint) {
      // Ignorar erros de extensões do browser
      if (
        event.exception?.values?.[0]?.value?.includes('extension') ||
        event.exception?.values?.[0]?.value?.includes('chrome-extension')
      ) {
        return null
      }

      // Ignorar erros de scripts externos (ads, analytics, etc)
      const error = hint.originalException
      if (error instanceof Error && error.stack) {
        if (
          error.stack.includes('google') ||
          error.stack.includes('facebook') ||
          error.stack.includes('analytics')
        ) {
          return null
        }
      }

      return event
    },
  })
}
