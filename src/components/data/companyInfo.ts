/**
 * Company/Project Information
 *
 * This file centralizes all company/project data used throughout the application.
 * Update these values before deploying to production.
 *
 * Used by:
 * - SEO meta tags (index.html)
 * - Schema.org structured data
 * - Footer and contact sections
 * - Legal pages
 */

export const COMPANY_INFO = {
  // Basic Info
  name: 'Your Company Name',
  legalName: 'Your Company Legal Name',
  description:
    'A brief description of your company or project. This will be used in meta descriptions and SEO.',
  shortDescription: 'Short tagline for your company',

  // URLs
  url: 'https://www.yourcompany.com',
  logo: '/logo.svg',
  ogImage: '/og-image.jpg', // 1200x630px recommended

  // Contact
  contact: {
    email: 'contact@yourcompany.com',
    phone: '+55 11 99999-9999',
    whatsapp: '+5511999999999',
  },

  // Address
  address: {
    street: 'Your Street',
    number: '123',
    complement: '',
    neighborhood: 'Your Neighborhood',
    city: 'Your City',
    state: 'SP',
    zipCode: '00000-000',
    country: 'Brasil',
    countryCode: 'BR',
  },

  // Social Media
  social: {
    instagram: 'https://www.instagram.com/yourcompany/',
    linkedin: 'https://www.linkedin.com/company/yourcompany/',
    facebook: 'https://www.facebook.com/yourcompany/',
    twitter: 'https://twitter.com/yourcompany',
    youtube: 'https://www.youtube.com/@yourcompany',
  },

  // Business Info
  foundingDate: '2024',
  industry: 'Technology',

  // SEO
  seo: {
    title: 'Your Company - Main Tagline',
    titleTemplate: '%s | Your Company',
    keywords: [
      'keyword1',
      'keyword2',
      'keyword3',
      'your industry',
      'your service',
    ],
    locale: 'pt_BR',
    language: 'pt-BR',
    themeColor: '#3b82f6',
  },

  // Legal (Brazilian specific - adjust for your country)
  legal: {
    cnpj: '00.000.000/0000-00',
    registrationNumber: '',
  },
} as const

/**
 * Type for company info
 */
export type CompanyInfo = typeof COMPANY_INFO

/**
 * Checks if company info has placeholder values
 * Use this to warn during build if data hasn't been updated
 */
export const hasPlaceholderData = (): boolean => {
  return (
    COMPANY_INFO.name === 'Your Company Name' ||
    COMPANY_INFO.url === 'https://www.yourcompany.com'
  )
}

/**
 * Get full address as string
 */
export const getFullAddress = (): string => {
  const { street, number, complement, neighborhood, city, state, zipCode } =
    COMPANY_INFO.address

  const parts = [
    `${street}, ${number}`,
    complement,
    neighborhood,
    `${city} - ${state}`,
    zipCode,
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Get social media links as array (filters out placeholder values)
 */
export const getSocialLinks = () => {
  return Object.entries(COMPANY_INFO.social)
    .filter(([, url]) => url && !url.includes('yourcompany'))
    .map(([platform, url]) => ({ platform, url }))
}

/**
 * Formats CNPJ for display
 * @param cnpj - CNPJ string with or without formatting
 * @returns Formatted CNPJ string
 */
export const formatCNPJ = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return cnpj

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}
