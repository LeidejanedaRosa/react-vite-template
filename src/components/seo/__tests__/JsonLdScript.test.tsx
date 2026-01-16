import { describe, expect, it } from 'vitest'

import { render } from '../../../test/test-utils'
import { JsonLdScript } from '../JsonLdScript'

describe('JsonLdScript', () => {
  const sampleData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Test Company',
  }

  describe('rendering', () => {
    it('should render a script element', () => {
      const { container } = render(<JsonLdScript data={sampleData} />)

      const script = container.querySelector('script')
      expect(script).toBeInTheDocument()
    })

    it('should have correct type attribute', () => {
      const { container } = render(<JsonLdScript data={sampleData} />)

      const script = container.querySelector('script')
      expect(script).toHaveAttribute('type', 'application/ld+json')
    })

    it('should contain valid JSON', () => {
      const { container } = render(<JsonLdScript data={sampleData} />)

      const script = container.querySelector('script')
      const content = script?.innerHTML

      expect(() => JSON.parse(content!)).not.toThrow()
    })

    it('should contain correct data', () => {
      const { container } = render(<JsonLdScript data={sampleData} />)

      const script = container.querySelector('script')
      const parsedContent = JSON.parse(script?.innerHTML || '{}')

      expect(parsedContent['@context']).toBe('https://schema.org')
      expect(parsedContent['@type']).toBe('Organization')
      expect(parsedContent.name).toBe('Test Company')
    })
  })

  describe('prettyPrint option', () => {
    it('should output minified JSON by default', () => {
      const { container } = render(<JsonLdScript data={sampleData} />)

      const script = container.querySelector('script')
      const content = script?.innerHTML

      expect(content).not.toContain('\n')
    })

    it('should output formatted JSON when prettyPrint is true', () => {
      const { container } = render(
        <JsonLdScript data={sampleData} prettyPrint={true} />
      )

      const script = container.querySelector('script')
      const content = script?.innerHTML

      expect(content).toContain('\n')
    })
  })

  describe('XSS prevention', () => {
    it('should escape closing script tags', () => {
      const maliciousData = {
        '@type': 'Test',
        content: '</script><script>alert("xss")</script>',
      }

      const { container } = render(<JsonLdScript data={maliciousData} />)

      const script = container.querySelector('script')
      const content = script?.innerHTML

      expect(content).not.toContain('</script>')
      expect(content).toContain('<\\/script>')
    })

    it('should handle nested malicious content', () => {
      const maliciousData = {
        '@type': 'Test',
        nested: {
          content: '</script>',
        },
      }

      const { container } = render(<JsonLdScript data={maliciousData} />)

      const script = container.querySelector('script')
      const content = script?.innerHTML

      expect(content).not.toContain('</script>')
    })
  })

  describe('complex data structures', () => {
    it('should handle arrays', () => {
      const dataWithArray = {
        '@type': 'ItemList',
        itemListElement: [
          { '@type': 'ListItem', position: 1 },
          { '@type': 'ListItem', position: 2 },
        ],
      }

      const { container } = render(<JsonLdScript data={dataWithArray} />)

      const script = container.querySelector('script')
      const parsedContent = JSON.parse(script?.innerHTML || '{}')

      expect(parsedContent.itemListElement).toHaveLength(2)
    })

    it('should handle nested objects', () => {
      const nestedData = {
        '@type': 'Organization',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
        },
      }

      const { container } = render(<JsonLdScript data={nestedData} />)

      const script = container.querySelector('script')
      const parsedContent = JSON.parse(script?.innerHTML || '{}')

      expect(parsedContent.address['@type']).toBe('PostalAddress')
      expect(parsedContent.address.addressCountry).toBe('BR')
    })

    it('should handle empty objects', () => {
      const { container } = render(<JsonLdScript data={{}} />)

      const script = container.querySelector('script')
      const parsedContent = JSON.parse(script?.innerHTML || '{}')

      expect(parsedContent).toEqual({})
    })
  })
})
