import { expect, test } from '@playwright/test'

test.describe('Semantic HTML Structure Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.locator('header').waitFor({ timeout: 15000 })
    await page.locator('main').waitFor({ timeout: 15000 })
    await page.waitForLoadState('load')
  })

  test.describe('HTML5 Semantic Elements - WCAG 1.3.1', () => {
    test('should have exactly one main element', async ({ page }) => {
      const mainElements = await page.locator('main').count()
      expect(mainElements).toBe(1)
    })

    test('should have main element visible and not hidden', async ({
      page,
    }) => {
      const main = page.locator('main')
      await expect(main).toBeVisible()
    })

    test('should have at least one header element', async ({ page }) => {
      const headerCount = await page.locator('header').count()
      expect(headerCount).toBeGreaterThanOrEqual(1)
    })

    test('should have at least one footer element', async ({ page }) => {
      await page.locator('footer').first().waitFor({ timeout: 10000 })
      const footerCount = await page.locator('footer').count()
      expect(footerCount).toBeGreaterThanOrEqual(1)
    })

    test('should have navigation element', async ({ page }) => {
      const navCount = await page.locator('nav').count()
      expect(navCount).toBeGreaterThanOrEqual(1)
    })

    test('should use section elements for content grouping', async ({
      page,
    }) => {
      const sectionCount = await page.locator('section').count()
      expect(sectionCount).toBeGreaterThanOrEqual(3)
    })
  })

  test.describe('Heading Hierarchy - WCAG 1.3.1 & 2.4.6', () => {
    test('should have exactly one h1 element', async ({ page }) => {
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)
    })

    test('h1 should not be empty', async ({ page }) => {
      const h1Text = await page.locator('h1').first().textContent()
      const trimmedText = h1Text?.trim() || ''
      expect(trimmedText).toBeTruthy()
      expect(trimmedText.length).toBeGreaterThan(10)
    })

    test('should have proper heading hierarchy (no skipped levels)', async ({
      page,
    }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      const headingLevels = await Promise.all(
        headings.map(async h => {
          const tagName = await h.evaluate(el => el.tagName)
          return parseInt(tagName.substring(1))
        })
      )

      expect(headingLevels[0]).toBe(1)

      for (let i = 1; i < headingLevels.length; i++) {
        const previousLevel = headingLevels[i - 1]
        const currentLevel = headingLevels[i]
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
    })

    test('all headings should have text content', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      for (const heading of headings) {
        const text = await heading.textContent()
        expect(text?.trim()).toBeTruthy()
      }
    })

    test('section elements should have headings', async ({ page }) => {
      const sections = await page.locator('section').all()
      for (const section of sections) {
        const hasHeading =
          (await section.locator('h1, h2, h3, h4, h5, h6').count()) > 0
        const hasAriaLabel = await section.getAttribute('aria-label')
        const hasAriaLabelledby = await section.getAttribute('aria-labelledby')

        expect(hasHeading || hasAriaLabel || hasAriaLabelledby).toBeTruthy()
      }
    })
  })

  test.describe('ARIA Landmarks - WCAG 2.4.1', () => {
    test('navigation should have proper role or be nav element', async ({
      page,
    }) => {
      const navElements = await page.locator('nav, [role="navigation"]').count()
      expect(navElements).toBeGreaterThanOrEqual(1)
    })

    test('main content should have main landmark', async ({ page }) => {
      const mainLandmark = await page.locator('main, [role="main"]').count()
      expect(mainLandmark).toBe(1)
    })

    test('page should have contentinfo landmark (footer)', async ({ page }) => {
      await page
        .locator('footer, [role="contentinfo"]')
        .first()
        .waitFor({ timeout: 10000 })
      const contentinfo = await page
        .locator('footer, [role="contentinfo"]')
        .count()
      expect(contentinfo).toBeGreaterThanOrEqual(1)
    })

    test('page should have banner landmark (header)', async ({ page }) => {
      const banner = await page.locator('header, [role="banner"]').count()
      expect(banner).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('List Structure', () => {
    test('lists should be properly structured (ul/ol with li)', async ({
      page,
    }) => {
      const lists = await page.locator('ul, ol').all()
      for (const list of lists) {
        const listItems = await list.locator('> li').count()
        expect(listItems).toBeGreaterThan(0)
      }
    })

    test('navigation lists should use proper markup', async ({ page }) => {
      const navLists = await page.locator('nav ul, nav ol').all()
      for (const list of navLists) {
        const listItems = await list.locator('li').count()
        expect(listItems).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Form Structure - WCAG 1.3.1 & 3.3.2', () => {
    test('all input fields should have associated labels', async ({ page }) => {
      const inputs = await page
        .locator('input:not([type="hidden"]), textarea, select')
        .all()

      for (const input of inputs) {
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledby = await input.getAttribute('aria-labelledby')

        const hasLabel = id
          ? (await page.locator(`label[for="${id}"]`).count()) > 0
          : false

        expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy()
      }
    })

    test('required fields should be properly marked', async ({ page }) => {
      const requiredInputs = await page
        .locator('input[required], textarea[required], select[required]')
        .all()

      for (const input of requiredInputs) {
        const hasNativeRequired =
          (await input.getAttribute('required')) !== null
        const ariaRequired = await input.getAttribute('aria-required')

        const isProperlyMarked = hasNativeRequired || ariaRequired === 'true'

        expect(isProperlyMarked).toBeTruthy()
      }
    })
  })

  test.describe('Link Structure - WCAG 2.4.4 & 2.4.9', () => {
    test('all links should have meaningful text', async ({ page }) => {
      const links = await page.locator('a[href]').all()
      const genericTexts = [
        'click here',
        'read more',
        'more',
        'link',
        'clique aqui',
        'leia mais',
      ]

      for (const link of links) {
        const text = (await link.textContent())?.trim().toLowerCase()
        const ariaLabel = await link.getAttribute('aria-label')
        const title = await link.getAttribute('title')

        const hasContent = text || ariaLabel || title
        expect(hasContent).toBeTruthy()

        const textIsGeneric = text ? genericTexts.includes(text) : false
        expect(textIsGeneric).toBeFalsy()
      }
    })

    test('all links should have valid href attributes', async ({ page }) => {
      const links = await page.locator('a').all()

      for (const link of links) {
        await expect(link).toHaveAttribute('href')
        await expect(link).not.toHaveAttribute('href', '#')
        await expect(link).not.toHaveAttribute('href', 'javascript:void(0)')
      }
    })

    test('external links should indicate they open in new window', async ({
      page,
    }) => {
      const NEW_WINDOW_INDICATORS = [
        'nova',
        'new window',
        'new tab',
        'opens in',
        'external',
        'abre em',
        'nueva',
        'nouvel',
      ]

      const externalLinks = await page.locator('a[target="_blank"]').all()

      for (const link of externalLinks) {
        const ariaLabel = await link.getAttribute('aria-label')
        const title = await link.getAttribute('title')
        const text = await link.textContent()
        const rel = await link.getAttribute('rel')

        expect(rel).toContain('noopener')

        const hasAccessibleIndicator =
          ariaLabel !== null ||
          title !== null ||
          (text !== null && text.trim().length > 0)

        expect(hasAccessibleIndicator).toBeTruthy()

        const allText = [ariaLabel, title, text]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const indicatesNewWindow = NEW_WINDOW_INDICATORS.some(indicator =>
          allText.includes(indicator.toLowerCase())
        )

        expect(indicatesNewWindow).toBeTruthy()
      }
    })
  })

  test.describe('Table Structure - WCAG 1.3.1', () => {
    test('data tables should have proper structure', async ({ page }) => {
      const tables = await page.locator('table').all()

      for (const table of tables) {
        const hasThead = (await table.locator('thead').count()) > 0
        const hasTbody = (await table.locator('tbody').count()) > 0
        const hasCaption = (await table.locator('caption').count()) > 0
        const hasAriaLabel = await table.getAttribute('aria-label')

        expect(hasThead || hasTbody).toBeTruthy()
        expect(hasCaption || hasAriaLabel).toBeTruthy()
      }
    })

    test('table headers should use th elements', async ({ page }) => {
      const tables = await page.locator('table').all()

      for (const table of tables) {
        const headerCells = await table.locator('th').count()
        const hasScope = await table.locator('th[scope]').count()

        const shouldHaveScope = headerCells > 0 ? hasScope > 0 : true
        expect(shouldHaveScope).toBeTruthy()
      }
    })
  })

  test.describe('Semantic Content Structure', () => {
    test('should not use div for button functionality', async ({ page }) => {
      const divButtons = await page
        .locator('div[onclick], div[role="button"]')
        .count()
      expect(divButtons).toBe(0)
    })

    test('should use button elements for actions', async ({ page }) => {
      const buttons = await page
        .locator('button, [type="button"], [type="submit"]')
        .all()

      for (const button of buttons) {
        const text = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')
        expect(text?.trim() || ariaLabel).toBeTruthy()
      }
    })

    test('should use strong/em for emphasis, not b/i', async ({ page }) => {
      const deprecatedTags = await page.locator('b, i').count()
      const semanticTags = await page.locator('strong, em').count()

      const hasDeprecatedTags = deprecatedTags > 0
      const usesSemanticAlternatives = hasDeprecatedTags
        ? semanticTags > deprecatedTags
        : true

      expect(usesSemanticAlternatives).toBeTruthy()
    })
  })
})
