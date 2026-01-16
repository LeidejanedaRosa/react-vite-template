import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('WCAG 2.1 AA Accessibility Tests - Axe-core', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Automated Accessibility Scanning', () => {
    test('should pass WCAG 2.1 Level AA compliance (required)', async ({
      page,
    }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should pass best practices checks (optional)', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['best-practice'])
        .analyze()

      const BEST_PRACTICE_THRESHOLD = 10
      expect(accessibilityScanResults.violations.length).toBeLessThan(
        BEST_PRACTICE_THRESHOLD
      )
    })
  })

  test.describe('Manual Keyboard Navigation Tests', () => {
    test('should navigate through interactive elements with Tab key', async ({
      page,
    }) => {
      const focusedElements: string[] = []

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        const focused = await page.evaluate(
          () =>
            `${document.activeElement?.tagName}:${document.activeElement?.textContent?.slice(0, 20) ?? ''}`
        )
        focusedElements.push(focused)
      }

      const uniqueFocusedElements = new Set(focusedElements)
      expect(uniqueFocusedElements.size).toBeGreaterThan(1)
      expect(focusedElements[0]).not.toBe('BODY:')
    })

    test('should have visible focus indicators on interactive elements', async ({
      page,
    }) => {
      const firstFocusable = page.locator('a, button').first()
      await expect(firstFocusable).toBeVisible()

      const hasVisibleFocus = await firstFocusable.evaluate(el => {
        const unfocusedStyles = window.getComputedStyle(el)
        const before = {
          outline: unfocusedStyles.outline,
          boxShadow: unfocusedStyles.boxShadow,
          border: unfocusedStyles.border,
        }

        el.focus()
        const focusedStyles = window.getComputedStyle(el)

        return (
          focusedStyles.outline !== before.outline ||
          focusedStyles.boxShadow !== before.boxShadow ||
          focusedStyles.border !== before.border
        )
      })

      expect(hasVisibleFocus).toBeTruthy()
    })

    test('should have skip navigation link', async ({ page }) => {
      const skipLink = page.locator('a[href="#main-content"]')
      await expect(skipLink).toBeAttached()

      // Skip link should be focusable and contain skip/pular text
      const skipLinkText = await skipLink.textContent()
      expect(skipLinkText?.toLowerCase()).toMatch(/skip|pular/)
    })
  })

  test.describe('Responsive and Zoom Tests', () => {
    test('content should reflow at 320px width without horizontal scrolling', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 568 })

      const hasHorizontalScroll = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        )
      })

      expect(hasHorizontalScroll).toBeFalsy()
    })

    test('page should be readable at 200% zoom', async ({
      page,
      browserName,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })

      await page.evaluate(browser => {
        if (browser === 'chromium') {
          document.documentElement.style.zoom = '200%'
        } else {
          document.documentElement.style.transform = 'scale(2)'
          document.documentElement.style.transformOrigin = 'top left'
          document.documentElement.style.width = '50%'
        }
      }, browserName)

      await page.waitForLoadState('load')

      const mainLocator = page.locator('main').first()
      await expect(mainLocator).toBeVisible()
      await expect(mainLocator).not.toBeEmpty()

      const hasHorizontalScroll = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth
        const clientWidth = document.documentElement.clientWidth
        const threshold = 10
        return scrollWidth > clientWidth + threshold
      })

      expect(hasHorizontalScroll).toBeFalsy()
    })
  })

  test.describe('Page Metadata and Structure', () => {
    test('page should have descriptive title', async ({ page }) => {
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title).not.toBe('Document')
      expect(title).not.toBe('Untitled')
    })

    test('page should have lang attribute', async ({ page }) => {
      const htmlLocator = page.locator('html')
      await expect(htmlLocator).toHaveAttribute('lang')
      const lang = await htmlLocator.getAttribute('lang')
      expect(lang).toMatch(/^[a-z]{2,3}(-[A-Za-z]{4})?(-[A-Z]{2})?$/i)
    })
  })
})
