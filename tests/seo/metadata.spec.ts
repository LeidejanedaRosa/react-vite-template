import { expect, test } from '@playwright/test'

test.describe('SEO Metadata Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Essential Meta Tags - WCAG 2.1 & Google SEO Guidelines', () => {
    test('should have valid html lang attribute', async ({ page }) => {
      const htmlLang = page.locator('html')
      await expect(htmlLang).toHaveAttribute('lang')
      const lang = await htmlLang.getAttribute('lang')
      expect(lang).toMatch(/^[a-z]{2,3}(-[A-Za-z]{2,4})?$/i)
    })

    test('should have proper document title', async ({ page }) => {
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThanOrEqual(70)
      expect(title).not.toBe('Document')
      expect(title).not.toBe('Untitled')
    })

    test('should have meta description', async ({ page }) => {
      const description = page.locator('meta[name="description"]')
      await expect(description).toHaveAttribute('content')
      const content = await description.getAttribute('content')
      expect(content!.length).toBeGreaterThan(50)
      expect(content!.length).toBeLessThanOrEqual(160)
    })

    test('should have viewport meta tag', async ({ page }) => {
      const viewport = page.locator('meta[name="viewport"]')
      await expect(viewport).toHaveAttribute('content')
      const content = await viewport.getAttribute('content')
      expect(content).toContain('width=device-width')
      expect(content).toContain('initial-scale=1')
    })

    test('should have charset declaration', async ({ page }) => {
      const charset = page.locator('meta[charset]')
      const charsetValue = await charset.getAttribute('charset')
      expect(charsetValue?.toLowerCase()).toBe('utf-8')
    })
  })

  test.describe('Open Graph Tags - Social Media SEO', () => {
    test('should have og:title', async ({ page }) => {
      const ogTitle = page.locator('meta[property="og:title"]')
      await expect(ogTitle).toHaveAttribute('content')
      const content = await ogTitle.getAttribute('content')
      expect(content!.length).toBeGreaterThan(10)
    })

    test('should have og:description', async ({ page }) => {
      const ogDescription = page.locator('meta[property="og:description"]')
      await expect(ogDescription).toHaveAttribute('content')
      const content = await ogDescription.getAttribute('content')
      expect(content!.length).toBeGreaterThan(50)
    })

    test('should have og:image', async ({ page }) => {
      const ogImage = page.locator('meta[property="og:image"]')
      await expect(ogImage).toHaveAttribute('content')
      const content = await ogImage.getAttribute('content')
      expect(content).toMatch(/\.(jpg|jpeg|png|webp|avif|svg)(\?[^?]*)?$/i)
    })

    test('should have og:url', async ({ page }) => {
      const ogUrl = page.locator('meta[property="og:url"]')
      await expect(ogUrl).toHaveAttribute('content')
      const content = await ogUrl.getAttribute('content')
      expect(content).toMatch(/^https?:\/\//)
    })

    test('should have og:type', async ({ page }) => {
      const ogType = page.locator('meta[property="og:type"]')
      await expect(ogType).toHaveAttribute('content')
      const content = await ogType.getAttribute('content')
      expect(['website', 'article', 'business.business', 'product']).toContain(
        content
      )
    })

    test('should have og:locale', async ({ page }) => {
      const ogLocale = page.locator('meta[property="og:locale"]')
      await expect(ogLocale).toHaveAttribute('content')
      const content = await ogLocale.getAttribute('content')
      expect(content).toMatch(/^[a-z]{2}_[A-Z]{2}$/)
    })
  })

  test.describe('Twitter Card Tags', () => {
    test('should have twitter:card', async ({ page }) => {
      const twitterCard = page.locator('meta[name="twitter:card"]')
      await expect(twitterCard).toHaveAttribute('content')
      const content = await twitterCard.getAttribute('content')
      expect(['summary', 'summary_large_image']).toContain(content)
    })

    test('should have twitter:title', async ({ page }) => {
      const twitterTitle = page.locator('meta[name="twitter:title"]')
      await expect(twitterTitle).toHaveAttribute('content')
    })

    test('should have twitter:description', async ({ page }) => {
      const twitterDesc = page.locator('meta[name="twitter:description"]')
      await expect(twitterDesc).toHaveAttribute('content')
    })

    test('should have twitter:image', async ({ page }) => {
      const twitterImage = page.locator('meta[name="twitter:image"]')
      await expect(twitterImage).toHaveAttribute('content')
    })
  })

  test.describe('Canonical URL', () => {
    test('should have canonical link', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveAttribute('href')
      const href = await canonical.getAttribute('href')
      expect(href).toMatch(/^https?:\/\//)
    })

    test('canonical should not have query parameters', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveAttribute('href')
      const href = await canonical.getAttribute('href')
      expect(href).not.toContain('?')
    })
  })

  test.describe('Robots Meta Tag', () => {
    test('should have robots meta tag', async ({ page }) => {
      const robots = page.locator('meta[name="robots"]')
      await expect(robots).toHaveAttribute('content')
    })

    test('should allow indexing and following', async ({ page }) => {
      const robots = page.locator('meta[name="robots"]')
      await expect(robots).toHaveAttribute('content')
      const content = await robots.getAttribute('content')

      const tokens = content!
        .split(',')
        .map(token => token.trim().toLowerCase())

      expect(tokens).toContain('index')
      expect(tokens).toContain('follow')
      expect(tokens).not.toContain('noindex')
      expect(tokens).not.toContain('nofollow')
    })
  })

  test.describe('Keywords Meta Tag', () => {
    test('should have keywords meta tag', async ({ page }) => {
      const keywords = page.locator('meta[name="keywords"]')
      await expect(keywords).toHaveAttribute('content')
      const content = await keywords.getAttribute('content')
      expect(content!.length).toBeGreaterThan(10)
    })

    test('should not have excessive keyword repetition (keyword stuffing)', async ({
      page,
    }) => {
      const keywords = page.locator('meta[name="keywords"]')
      const content = await keywords.getAttribute('content')

      const keywordList = content!
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0)

      const keywordCount = keywordList.reduce(
        (acc, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      const maxRepetitions = Math.max(...Object.values(keywordCount))
      expect(maxRepetitions).toBeLessThanOrEqual(2)
    })
  })

  test.describe('Description Quality', () => {
    test('should not use keyword stuffing in meta description', async ({
      page,
    }) => {
      const descriptionLocator = page.locator('meta[name="description"]')
      await expect(descriptionLocator).toHaveAttribute('content')
      const description = await descriptionLocator.getAttribute('content')

      expect(description!.trim().length).toBeGreaterThan(0)
      const words = description!
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 0)
      expect(words.length).toBeGreaterThan(0)
      const wordCount = words.reduce(
        (acc, word) => {
          acc[word] = (acc[word] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
      const maxRepetitions = Math.max(...Object.values(wordCount))
      expect(maxRepetitions).toBeLessThanOrEqual(4)
    })
  })
})
