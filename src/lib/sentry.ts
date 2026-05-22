import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production'

  if (!dsn) {
    /* v8 ignore start */
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Sentry DSN não configurado')
    }
    /* v8 ignore stop */
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
    /* v8 ignore next 2 */
    tracesSampleRate:
      Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) || 1.0,

    // Session Replay
    /* v8 ignore start */
    replaysSessionSampleRate:
      Number(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE) || 0.1,
    replaysOnErrorSampleRate:
      Number(import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE) || 1.0,
    /* v8 ignore stop */

    // Filtrar erros irrelevantes
    // eslint-disable-next-line complexity
    beforeSend(event, hint) {
      // Ignorar erros de extensões do browser
      if (
        event.exception?.values?.[0]?.value?.includes('extension') ||
        /* v8 ignore next */
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
