import { describe, expect, it } from 'vitest'

import {
  COMPANY_INFO,
  formatCNPJ,
  getFullAddress,
  getSocialLinks,
  hasPlaceholderData,
} from '../companyInfo'

describe('hasPlaceholderData', () => {
  it('returns true when using default placeholder name', () => {
    expect(hasPlaceholderData()).toBe(true)
  })

  it('returns true when name is customized but url is still placeholder', () => {
    const info = COMPANY_INFO as unknown as Record<string, string>
    const originalName = info.name
    info.name = 'Custom Company'

    try {
      expect(hasPlaceholderData()).toBe(true)
    } finally {
      info.name = originalName
    }
  })

  it('returns false when both name and url are customized', () => {
    const info = COMPANY_INFO as unknown as Record<string, string>
    const originalName = info.name
    const originalUrl = info.url
    info.name = 'Custom Company'
    info.url = 'https://customcompany.com'

    try {
      expect(hasPlaceholderData()).toBe(false)
    } finally {
      info.name = originalName
      info.url = originalUrl
    }
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
    // COMPANY_INFO is typed as const but not Object.freeze'd — safe to mutate in tests
    const social = COMPANY_INFO.social as Record<string, string>
    const original = social.instagram
    social.instagram = 'https://instagram.com/acme'

    try {
      const links = getSocialLinks()
      expect(links).toContainEqual({
        platform: 'instagram',
        url: 'https://instagram.com/acme',
      })
    } finally {
      social.instagram = original
    }
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
