import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockInit = vi.fn()
const mockBrowserTracingIntegration = vi.fn(() => ({ name: 'BrowserTracing' }))
const mockReplayIntegration = vi.fn(() => ({ name: 'Replay' }))

vi.mock('@sentry/react', () => ({
  init: mockInit,
  browserTracingIntegration: mockBrowserTracingIntegration,
  replayIntegration: mockReplayIntegration,
}))

describe('initSentry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('does not call Sentry.init when VITE_SENTRY_DSN is not set', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', '')
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(mockInit).not.toHaveBeenCalled()
  })

  it('calls Sentry.init with the DSN when VITE_SENTRY_DSN is set', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: 'https://test@sentry.io/123' })
    )
  })

  it('uses production as default environment when VITE_SENTRY_ENVIRONMENT is not set', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    vi.stubEnv('VITE_SENTRY_ENVIRONMENT', '')
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({ environment: 'production' })
    )
  })

  it('uses the provided VITE_SENTRY_ENVIRONMENT', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    vi.stubEnv('VITE_SENTRY_ENVIRONMENT', 'staging')
    const { initSentry } = await import('../sentry')
    initSentry()
    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({ environment: 'staging' })
    )
  })

  it('registers browserTracing and replay integrations', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    expect(mockBrowserTracingIntegration).toHaveBeenCalled()
    expect(mockReplayIntegration).toHaveBeenCalledWith({
      maskAllText: true,
      blockAllMedia: true,
    })
  })

  it('beforeSend filters out browser extension errors', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const event = {
      exception: { values: [{ value: 'Error from chrome-extension://abc' }] },
    }
    expect(beforeSend(event, {})).toBeNull()
  })

  it('beforeSend filters out errors from "extension" keyword', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const event = {
      exception: { values: [{ value: 'Error from browser extension' }] },
    }
    expect(beforeSend(event, {})).toBeNull()
  })

  it('beforeSend filters out errors from external scripts (google)', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const error = new Error('Google error')
    error.stack = 'Error\n    at https://google.com/script.js:1:1'
    expect(beforeSend({}, { originalException: error })).toBeNull()
  })

  it('beforeSend filters out errors from external scripts (facebook)', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const error = new Error('Facebook error')
    error.stack = 'Error\n    at https://facebook.com/fbevents.js:1:1'
    expect(beforeSend({}, { originalException: error })).toBeNull()
  })

  it('beforeSend filters out errors from analytics scripts', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const error = new Error('Analytics error')
    error.stack = 'Error\n    at https://cdn.analytics.com/track.js:1:1'
    expect(beforeSend({}, { originalException: error })).toBeNull()
  })

  it('beforeSend allows legitimate app errors through', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const event = { exception: { values: [{ value: 'App error' }] } }
    const error = new Error('App error')
    error.stack = 'Error\n    at app.js:10:5'
    expect(beforeSend(event, { originalException: error })).toBe(event)
  })

  it('uses custom sample rates from env vars', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    vi.stubEnv('VITE_SENTRY_TRACES_SAMPLE_RATE', '0.5')
    vi.stubEnv('VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE', '0.2')
    vi.stubEnv('VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE', '0.8')
    const { initSentry } = await import('../sentry')
    initSentry()

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0.5,
        replaysSessionSampleRate: 0.2,
        replaysOnErrorSampleRate: 0.8,
      })
    )
  })

  it('beforeSend allows events with non-Error exceptions through', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', 'https://test@sentry.io/123')
    const { initSentry } = await import('../sentry')
    initSentry()

    const { beforeSend } = mockInit.mock.calls[0][0]
    const event = { exception: { values: [{ value: 'Some error' }] } }
    // hint.originalException is not an Error instance
    expect(beforeSend(event, { originalException: 'string error' })).toBe(event)
  })
})
