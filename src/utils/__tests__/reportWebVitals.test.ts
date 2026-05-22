import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockOnCLS = vi.fn()
const mockOnFCP = vi.fn()
const mockOnINP = vi.fn()
const mockOnLCP = vi.fn()
const mockOnTTFB = vi.fn()

vi.mock('web-vitals', () => ({
  onCLS: mockOnCLS,
  onFCP: mockOnFCP,
  onINP: mockOnINP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
}))

describe('reportWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls all web-vitals handlers when a function callback is provided', async () => {
    const { reportWebVitals } = await import('../reportWebVitals')
    const callback = vi.fn()

    reportWebVitals(callback)

    expect(mockOnCLS).toHaveBeenCalledWith(callback)
    expect(mockOnFCP).toHaveBeenCalledWith(callback)
    expect(mockOnINP).toHaveBeenCalledWith(callback)
    expect(mockOnLCP).toHaveBeenCalledWith(callback)
    expect(mockOnTTFB).toHaveBeenCalledWith(callback)
  })

  it('registers internal analytics handler when no callback is provided', async () => {
    const { reportWebVitals } = await import('../reportWebVitals')

    reportWebVitals()

    expect(mockOnCLS).toHaveBeenCalledTimes(1)
    expect(mockOnFCP).toHaveBeenCalledTimes(1)
    expect(mockOnINP).toHaveBeenCalledTimes(1)
    expect(mockOnLCP).toHaveBeenCalledTimes(1)
    expect(mockOnTTFB).toHaveBeenCalledTimes(1)

    // Verify the registered handler is a function
    const handler = mockOnCLS.mock.calls[0][0]
    expect(typeof handler).toBe('function')
  })

  it('registers internal analytics handler when callback is not a function', async () => {
    const { reportWebVitals } = await import('../reportWebVitals')

    // @ts-expect-error testing non-function value
    reportWebVitals('not-a-function')

    expect(mockOnCLS).toHaveBeenCalledTimes(1)
    const handler = mockOnCLS.mock.calls[0][0]
    expect(typeof handler).toBe('function')
  })

  it('internal handler logs metric to console in dev mode', async () => {
    const { reportWebVitals } = await import('../reportWebVitals')
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    reportWebVitals()

    const handler = mockOnCLS.mock.calls[0][0]
    const metric = { name: 'LCP', value: 1200, id: 'v3-123' }
    handler(metric)

    expect(consoleSpy).toHaveBeenCalledWith(metric)
    consoleSpy.mockRestore()
  })
})
