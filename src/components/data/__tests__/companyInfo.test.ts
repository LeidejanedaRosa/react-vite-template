import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  COMPANY_INFO,
  formatCNPJ,
  getFullAddress,
  getSocialLinks,
  hasPlaceholderData,
} from '../companyInfo'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('hasPlaceholderData', () => {
  it('returns true when using default placeholder name', () => {
    expect(hasPlaceholderData()).toBe(true)
  })

  it('returns true when name is customized but url is still placeholder', () => {
    vi.spyOn(COMPANY_INFO as { name: string }, 'name', 'get').mockReturnValue(
      'Custom Company'
    )
    expect(hasPlaceholderData()).toBe(true)
  })

  it('returns false when both name and url are customized', () => {
    vi.spyOn(COMPANY_INFO as { name: string }, 'name', 'get').mockReturnValue(
      'Custom Company'
    )
    vi.spyOn(COMPANY_INFO as { url: string }, 'url', 'get').mockReturnValue(
      'https://customcompany.com'
    )
    expect(hasPlaceholderData()).toBe(false)
  })
})

describe('getFullAddress', () => {
  it('returns a formatted address string', () => {
    const address = getFullAddress()
    expect(address).toContain(COMPANY_INFO.address.street)
    expect(address).toContain(COMPANY_INFO.address.number)
    expect(address).toContain(COMPANY_INFO.address.city)
    expect(address).toContain(COMPANY_INFO.address.state)
    expect(address).toContain(COMPANY_INFO.address.zipCode)
  })

  it('excludes empty complement from address', () => {
    const address = getFullAddress()
    // complement is '' so it should be filtered out
    expect(address).not.toMatch(/,\s*,/)
  })
})

describe('getSocialLinks', () => {
  it('returns an array of objects with platform and url', () => {
    const links = getSocialLinks()
    expect(Array.isArray(links)).toBe(true)
  })

  it('filters out placeholder social links containing "yourcompany"', () => {
    const links = getSocialLinks()
    links.forEach(link => {
      expect(link.url).not.toContain('yourcompany')
    })
  })

  it('maps non-placeholder links to {platform, url} objects', () => {
    const mockSocial = {
      ...COMPANY_INFO.social,
      instagram: 'https://instagram.com/acme',
    } as unknown as typeof COMPANY_INFO.social
    vi.spyOn(COMPANY_INFO, 'social', 'get').mockReturnValue(mockSocial)
    const links = getSocialLinks()
    expect(links).toContainEqual({
      platform: 'instagram',
      url: 'https://instagram.com/acme',
    })
  })
})

describe('formatCNPJ', () => {
  it('formats a 14-digit CNPJ string correctly', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('formats a CNPJ that already has formatting by stripping and re-formatting', () => {
    expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81')
  })

  it('returns the original string when CNPJ does not have 14 digits', () => {
    expect(formatCNPJ('123')).toBe('123')
  })

  it('returns the original string for an empty input', () => {
    expect(formatCNPJ('')).toBe('')
  })
})
