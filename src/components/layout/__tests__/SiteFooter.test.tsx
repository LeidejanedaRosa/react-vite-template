import { afterEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '../../../test/test-utils'
import { SiteFooter } from '../SiteFooter'

describe('SiteFooter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a contentinfo landmark with the owner and the given year', () => {
    render(<SiteFooter owner='Marca' year={2030} />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2030 Marca')
  })

  it('defaults to the current year', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2031-06-15T12:00:00'))
    render(<SiteFooter owner='Marca' />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2031 Marca')
  })
})
