import { COMPANY_INFO } from '../data/companyInfo'
import { JsonLdScript } from './JsonLdScript'

const SCHEMA_TYPE = '@type' as const
const SCHEMA_CONTEXT = 'https://schema.org'

/**
 * Organization Schema Component
 *
 * Generates Schema.org structured data for the organization.
 * Uses data from companyInfo.ts - update that file with your company data.
 *
 * @see https://schema.org/Organization
 * @see https://developers.google.com/search/docs/appearance/structured-data/organization
 */
export function OrganizationSchema() {
  const {
    name,
    legalName,
    url,
    logo,
    description,
    foundingDate,
    address,
    contact,
    social,
    seo,
  } = COMPANY_INFO

  const socialLinks = Object.values(social).filter(
    link => link && !link.includes('yourcompany')
  )

  const organizationSchema = {
    [SCHEMA_TYPE]: 'Organization' as const,
    '@id': `${url}/#organization`,
    name,
    legalName,
    url,
    logo: {
      [SCHEMA_TYPE]: 'ImageObject' as const,
      url: `${url}${logo}`,
      width: 200,
      height: 60,
    },
    image: `${url}${logo}`,
    description,
    foundingDate,
    address: {
      [SCHEMA_TYPE]: 'PostalAddress' as const,
      addressCountry: address.countryCode,
      addressRegion: address.state,
      addressLocality: address.city,
      streetAddress: `${address.street}, ${address.number}`,
      postalCode: address.zipCode,
    },
    contactPoint: [
      {
        [SCHEMA_TYPE]: 'ContactPoint' as const,
        telephone: contact.phone,
        email: contact.email,
        contactType: 'customer service',
        availableLanguage: ['Portuguese'],
      },
    ],
    sameAs: socialLinks,
  }

  const webSiteSchema = {
    [SCHEMA_TYPE]: 'WebSite' as const,
    '@id': `${url}/#website`,
    name,
    url,
    description,
    publisher: {
      '@id': `${url}/#organization`,
    },
    inLanguage: seo.language,
  }

  const structuredData = {
    '@context': SCHEMA_CONTEXT,
    '@graph': [webSiteSchema, organizationSchema],
  }

  return <JsonLdScript data={structuredData} />
}

/**
 * Breadcrumb Schema Component
 *
 * Generates Schema.org BreadcrumbList structured data.
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
interface BreadcrumbItem {
  name: string
  url?: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const { url: baseUrl } = COMPANY_INFO

  const breadcrumbSchema = {
    '@context': SCHEMA_CONTEXT,
    [SCHEMA_TYPE]: 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) => {
      const isLastItem = index === items.length - 1
      const listItem: Record<string, unknown> = {
        [SCHEMA_TYPE]: 'ListItem' as const,
        position: index + 1,
        name: item.name,
      }
      if (!isLastItem) {
        listItem.item =
          item.url ||
          `${baseUrl}/#${item.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')}`
      }
      return listItem
    }),
  }

  return <JsonLdScript data={breadcrumbSchema} />
}

/**
 * Article Schema Component
 *
 * Generates Schema.org Article structured data for blog posts.
 *
 * @see https://schema.org/Article
 */
interface ArticleSchemaProps {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  authorName?: string
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: ArticleSchemaProps) {
  const { url, name } = COMPANY_INFO

  const articleSchema = {
    '@context': SCHEMA_CONTEXT,
    [SCHEMA_TYPE]: 'Article' as const,
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      [SCHEMA_TYPE]: 'Person' as const,
      name: authorName || name,
    },
    publisher: {
      '@id': `${url}/#organization`,
    },
  }

  return <JsonLdScript data={articleSchema} />
}

/**
 * Product Schema Component
 *
 * Generates Schema.org Product structured data.
 *
 * @see https://schema.org/Product
 */
interface ProductSchemaProps {
  name: string
  description: string
  image: string
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  rating?: {
    value: number
    count: number
  }
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'BRL',
  availability = 'InStock',
  rating,
}: ProductSchemaProps) {
  const { url } = COMPANY_INFO

  const productSchema: Record<string, unknown> = {
    '@context': SCHEMA_CONTEXT,
    [SCHEMA_TYPE]: 'Product' as const,
    name,
    description,
    image,
    brand: {
      '@id': `${url}/#organization`,
    },
  }

  if (price) {
    productSchema.offers = {
      [SCHEMA_TYPE]: 'Offer' as const,
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    }
  }

  if (rating) {
    productSchema.aggregateRating = {
      [SCHEMA_TYPE]: 'AggregateRating' as const,
      ratingValue: rating.value,
      reviewCount: rating.count,
    }
  }

  return <JsonLdScript data={productSchema} />
}

/**
 * FAQ Schema Component
 *
 * Generates Schema.org FAQPage structured data.
 *
 * @see https://schema.org/FAQPage
 */
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const faqSchema = {
    '@context': SCHEMA_CONTEXT,
    [SCHEMA_TYPE]: 'FAQPage' as const,
    mainEntity: items.map(item => ({
      [SCHEMA_TYPE]: 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        [SCHEMA_TYPE]: 'Answer' as const,
        text: item.answer,
      },
    })),
  }

  return <JsonLdScript data={faqSchema} />
}
