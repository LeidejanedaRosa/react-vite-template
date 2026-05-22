import { describe, expect, it } from 'vitest'

import { render } from '../../../test/test-utils'
import { COMPANY_INFO } from '../../data/companyInfo'
import {
  ArticleSchema,
  BreadcrumbSchema,
  FAQSchema,
  OrganizationSchema,
  ProductSchema,
} from '../OrganizationSchema'

const getScriptData = (container: HTMLElement) => {
  const script = container.querySelector('script[type="application/ld+json"]')
  return JSON.parse(script?.innerHTML ?? '{}')
}

describe('OrganizationSchema', () => {
  it('renders a JSON-LD script tag', () => {
    const { container } = render(<OrganizationSchema />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('includes @context https://schema.org', () => {
    const { container } = render(<OrganizationSchema />)
    const data = getScriptData(container)
    expect(data['@context']).toBe('https://schema.org')
  })

  it('includes @graph with Organization and WebSite types', () => {
    const { container } = render(<OrganizationSchema />)
    const data = getScriptData(container)
    const types = data['@graph'].map(
      (item: Record<string, unknown>) => item['@type']
    )
    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
  })
})

describe('BreadcrumbSchema', () => {
  it('renders a JSON-LD script tag', () => {
    const { container } = render(
      <BreadcrumbSchema items={[{ name: 'Home' }, { name: 'Blog' }]} />
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('generates BreadcrumbList schema with correct item count', () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[{ name: 'Home' }, { name: 'Artigos' }, { name: 'Post' }]}
      />
    )
    const data = getScriptData(container)
    expect(data['@type']).toBe('BreadcrumbList')
    expect(data.itemListElement).toHaveLength(3)
  })

  it('sets position starting at 1', () => {
    const { container } = render(
      <BreadcrumbSchema items={[{ name: 'Home' }, { name: 'Sobre' }]} />
    )
    const data = getScriptData(container)
    expect(data.itemListElement[0].position).toBe(1)
    expect(data.itemListElement[1].position).toBe(2)
  })

  it('omits item URL for the last breadcrumb item', () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://example.com' },
          { name: 'Contato' },
        ]}
      />
    )
    const data = getScriptData(container)
    // Last item should not have an "item" property
    expect(data.itemListElement[1].item).toBeUndefined()
  })

  it('uses provided url for non-last breadcrumb items', () => {
    const { container } = render(
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://example.com/' },
          { name: 'Final' },
        ]}
      />
    )
    const data = getScriptData(container)
    expect(data.itemListElement[0].item).toBe('https://example.com/')
  })

  it('generates fallback url for non-last items without url', () => {
    const { container } = render(
      <BreadcrumbSchema items={[{ name: 'Sobre Nós' }, { name: 'Final' }]} />
    )
    const data = getScriptData(container)
    // Should contain a slug-ified version of the name
    expect(data.itemListElement[0].item).toContain('sobre-nos')
  })
})

describe('ArticleSchema', () => {
  const baseProps = {
    title: 'My Article',
    description: 'Article description',
    image: 'https://example.com/image.jpg',
    datePublished: '2024-01-01',
  }

  it('renders a JSON-LD script tag', () => {
    const { container } = render(<ArticleSchema {...baseProps} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('generates Article schema with correct type', () => {
    const { container } = render(<ArticleSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data['@type']).toBe('Article')
    expect(data.headline).toBe('My Article')
    expect(data.description).toBe('Article description')
  })

  it('uses datePublished as dateModified when dateModified is not provided', () => {
    const { container } = render(<ArticleSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data.dateModified).toBe('2024-01-01')
  })

  it('uses provided dateModified when specified', () => {
    const { container } = render(
      <ArticleSchema {...baseProps} dateModified='2024-06-15' />
    )
    const data = getScriptData(container)
    expect(data.dateModified).toBe('2024-06-15')
  })

  it('uses company name as author when authorName is not provided', () => {
    const { container } = render(<ArticleSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data.author.name).toBe(COMPANY_INFO.name)
  })

  it('uses provided authorName when specified', () => {
    const { container } = render(
      <ArticleSchema {...baseProps} authorName='Jane Doe' />
    )
    const data = getScriptData(container)
    expect(data.author.name).toBe('Jane Doe')
  })
})

describe('ProductSchema', () => {
  const baseProps = {
    name: 'My Product',
    description: 'Product description',
    image: 'https://example.com/product.jpg',
  }

  it('renders a JSON-LD script tag', () => {
    const { container } = render(<ProductSchema {...baseProps} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('generates Product schema with correct type', () => {
    const { container } = render(<ProductSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data['@type']).toBe('Product')
    expect(data.name).toBe('My Product')
  })

  it('includes offers when price is provided', () => {
    const { container } = render(<ProductSchema {...baseProps} price={99.9} />)
    const data = getScriptData(container)
    expect(data.offers).toBeDefined()
    expect(data.offers.price).toBe(99.9)
    expect(data.offers.priceCurrency).toBe('BRL')
  })

  it('does not include offers when price is not provided', () => {
    const { container } = render(<ProductSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data.offers).toBeUndefined()
  })

  it('includes aggregateRating when rating is provided', () => {
    const { container } = render(
      <ProductSchema {...baseProps} rating={{ value: 4.5, count: 120 }} />
    )
    const data = getScriptData(container)
    expect(data.aggregateRating).toBeDefined()
    expect(data.aggregateRating.ratingValue).toBe(4.5)
    expect(data.aggregateRating.reviewCount).toBe(120)
  })

  it('does not include aggregateRating when rating is not provided', () => {
    const { container } = render(<ProductSchema {...baseProps} />)
    const data = getScriptData(container)
    expect(data.aggregateRating).toBeUndefined()
  })

  it('uses custom currency when provided', () => {
    const { container } = render(
      <ProductSchema {...baseProps} price={50} currency='USD' />
    )
    const data = getScriptData(container)
    expect(data.offers.priceCurrency).toBe('USD')
  })

  it('uses custom availability when provided', () => {
    const { container } = render(
      <ProductSchema {...baseProps} price={50} availability='OutOfStock' />
    )
    const data = getScriptData(container)
    expect(data.offers.availability).toContain('OutOfStock')
  })
})

describe('FAQSchema', () => {
  const items = [
    { question: 'What is React?', answer: 'A UI library' },
    { question: 'What is Vite?', answer: 'A build tool' },
  ]

  it('renders a JSON-LD script tag', () => {
    const { container } = render(<FAQSchema items={items} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
  })

  it('generates FAQPage schema with correct type', () => {
    const { container } = render(<FAQSchema items={items} />)
    const data = getScriptData(container)
    expect(data['@type']).toBe('FAQPage')
  })

  it('maps all FAQ items to mainEntity', () => {
    const { container } = render(<FAQSchema items={items} />)
    const data = getScriptData(container)
    expect(data.mainEntity).toHaveLength(2)
    expect(data.mainEntity[0].name).toBe('What is React?')
    expect(data.mainEntity[0].acceptedAnswer.text).toBe('A UI library')
  })
})
