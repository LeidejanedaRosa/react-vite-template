import { expect, test } from '@playwright/test'

test.describe('Performance & Core Web Vitals Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { timeout: 60000 })
  })

  test.describe('Performance Metrics - Google Core Web Vitals', () => {
    test('should have acceptable Largest Contentful Paint (LCP)', async ({
      page,
    }) => {
      const url = page.url()
      const isLocalDev = url.includes('localhost') || url.includes('127.0.0.1')

      // Skip strict LCP testing in local dev - performance metrics are unreliable
      if (isLocalDev) {
        // Just verify the page loaded and has visible content
        await page.waitForLoadState('domcontentloaded')
        const hasContent = page.locator('main')
        await expect(hasContent).toBeVisible()
        return
      }

      const lcp = await page.evaluate(() => {
        return new Promise<number>(resolve => {
          let resolved = false
          const observer = new PerformanceObserver(list => {
            if (resolved) return
            const entries = list.getEntries()
            const lastEntry = entries[
              entries.length - 1
            ] as PerformanceEntry & {
              renderTime?: number
              loadTime?: number
            }
            const lcpValue = lastEntry.renderTime || lastEntry.loadTime || 0
            if (lcpValue > 0) {
              resolved = true
              observer.disconnect()
              resolve(lcpValue)
            }
          })
          observer.observe({ type: 'largest-contentful-paint', buffered: true })

          setTimeout(() => {
            if (!resolved) {
              observer.disconnect()
              resolve(-1)
            }
          }, 5000)
        })
      })

      expect(lcp).toBeGreaterThan(0)
      expect(lcp).toBeLessThan(2500)
    })

    test('should have acceptable Cumulative Layout Shift (CLS)', async ({
      page,
    }) => {
      await page.waitForLoadState('load')

      const cls = await page.evaluate(() => {
        return new Promise<number>(resolve => {
          let clsValue = 0
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
              const layoutShift = entry as PerformanceEntry & {
                hadRecentInput?: boolean
                value?: number
              }
              if (layoutShift.hadRecentInput) continue
              clsValue += layoutShift.value ?? 0
            }
          }).observe({ type: 'layout-shift', buffered: true })

          setTimeout(() => resolve(clsValue), 3000)
        })
      })

      expect(cls).toBeLessThan(0.1)
    })

    test('should have acceptable First Contentful Paint (FCP)', async ({
      page,
    }) => {
      const url = page.url()
      const isLocalDev = url.includes('localhost') || url.includes('127.0.0.1')

      // Skip strict FCP testing in local dev - performance metrics are unreliable
      if (isLocalDev) {
        await page.waitForLoadState('domcontentloaded')
        const hasContent = page.locator('body')
        await expect(hasContent).toBeVisible()
        return
      }

      const fcp = await page.evaluate(() => {
        const fcpEntry = performance
          .getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint')
        return fcpEntry?.startTime ?? -1
      })

      expect(fcp).toBeGreaterThan(0)
      expect(fcp).toBeLessThan(1800)
    })

    test('should have acceptable DOM Interactive Time', async ({ page }) => {
      const domInteractive = await page.evaluate(() => {
        const navigationTiming = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        return navigationTiming.domInteractive
      })

      expect(domInteractive).toBeLessThan(3800)
    })
  })

  test.describe('Resource Loading', () => {
    test('should not have render-blocking resources', async ({ page }) => {
      const renderBlockingResources = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link'))

        return links.filter(link => {
          const rel = link.rel || ''
          const asAttribute = link.getAttribute('as')
          const media = link.getAttribute('media')

          const isStylesheet = rel.includes('stylesheet')

          if (!isStylesheet) {
            return false
          }

          const isPreloaded = rel.includes('preload') && asAttribute === 'style'

          const hasNonRenderBlockingMedia =
            media !== null &&
            media.trim() !== '' &&
            (media.includes('print') || media.includes('('))

          const isRenderBlocking = !isPreloaded && !hasNonRenderBlockingMedia

          return isRenderBlocking
        }).length
      })

      expect(renderBlockingResources).toBeLessThanOrEqual(2)
    })

    test('images should use modern formats (WebP, AVIF)', async ({ page }) => {
      const allImages = await page.locator('img').all()
      const images = allImages.slice(0, 15)
      let modernFormatCount = 0

      for (const img of images) {
        const src = await img.getAttribute('src')

        if (src && (src.includes('.webp') || src.includes('.avif'))) {
          modernFormatCount++
          continue
        }

        const parent = await img.evaluateHandle(el => el.parentElement)
        try {
          const parentTagName = await parent.evaluate(el =>
            el?.tagName.toLowerCase()
          )

          if (parentTagName === 'picture') {
            const sources = await parent.evaluate(el => {
              const sourceElements = el?.querySelectorAll('source')
              return Array.from(sourceElements || []).map(
                s => s.getAttribute('type') || ''
              )
            })

            if (
              sources.some(
                type => type.includes('webp') || type.includes('avif')
              )
            ) {
              modernFormatCount++
            }
          }
        } finally {
          await parent.dispose()
        }
      }

      expect(images.length).toBeGreaterThan(0)
      const modernFormatPercentage = (modernFormatCount / images.length) * 100
      expect(modernFormatPercentage).toBeGreaterThanOrEqual(50)
    })

    test('images should have width and height attributes', async ({ page }) => {
      const images = await page.locator('img').all()

      for (const img of images) {
        const width = await img.getAttribute('width')
        const height = await img.getAttribute('height')
        const style = await img.getAttribute('style')

        const hasDimensions =
          (width && height) ||
          (style && (style.includes('width') || style.includes('height')))

        expect(hasDimensions).toBeTruthy()
      }
    })

    test('should implement lazy loading for below-fold images', async ({
      page,
    }) => {
      const images = await page.locator('img').all()
      let lazyLoadCount = 0

      for (const img of images.slice(3)) {
        const loading = await img.getAttribute('loading')
        if (loading === 'lazy') {
          lazyLoadCount++
        }
      }

      const hasEnoughImages = images.length > 3
      const shouldHaveLazyLoad = hasEnoughImages ? lazyLoadCount > 0 : true
      expect(shouldHaveLazyLoad).toBeTruthy()
    })
  })

  test.describe('JavaScript Performance', () => {
    test('should not have excessive DOMContentLoaded handler execution time', async ({
      page,
    }) => {
      const domContentLoadedDuration = await page.evaluate(() => {
        const navigationTiming = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        return (
          navigationTiming.domContentLoadedEventEnd -
          navigationTiming.domContentLoadedEventStart
        )
      })

      expect(domContentLoadedDuration).toBeLessThan(1000)
    })

    test('should not have long tasks', async ({ page, browserName }) => {
      test.skip(
        browserName === 'firefox',
        'Long task observer not supported in Firefox'
      )

      await page.waitForLoadState('load')

      const longTasks = await page.evaluate(() => {
        return new Promise<number>(resolve => {
          try {
            const tasks: number[] = []
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                tasks.push(entry.duration)
              }
            }).observe({ type: 'longtask', buffered: true })

            setTimeout(() => resolve(tasks.length), 3000)
          } catch {
            resolve(-1)
          }
        })
      })

      if (longTasks === -1) {
        test.skip(true, 'PerformanceObserver for longtask not available')
        return
      }

      expect(longTasks).toBeLessThanOrEqual(8)
    })
  })

  test.describe('Network Performance', () => {
    test('should use HTTP/2 or HTTP/3', async ({ page }) => {
      const url = page.url()
      const isLocalDev =
        url.includes('localhost') ||
        url.includes('127.0.0.1') ||
        !process.env.CI

      const protocol = await page.evaluate(() => {
        const navigationEntry = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming & { nextHopProtocol?: string }
        return navigationEntry.nextHopProtocol
      })

      test.skip(isLocalDev, 'HTTP/2 not available in local dev')
      expect(protocol).toMatch(/h2|h3/)
    })

    test('should have acceptable page load time', async ({ page }) => {
      const url = page.url()
      const isLocalDev = url.includes('localhost') || url.includes('127.0.0.1')

      const loadTime = await page.evaluate(() => {
        const navigationTiming = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        return navigationTiming.loadEventEnd - navigationTiming.fetchStart
      })
      const threshold = isLocalDev ? 30000 : 3000
      expect(loadTime).toBeLessThan(threshold)
    })
  })

  test.describe('Mobile Performance', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const isResponsive = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth
      })

      expect(isResponsive).toBeTruthy()
    })

    test('should have touch-friendly interactive elements', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      const allButtons = await page.locator('button').all()
      const limitedButtons = allButtons.slice(0, 10)
      const ctaButtons = []

      for (const button of limitedButtons) {
        const text = await button.textContent()
        if (text && text.trim().length > 0) {
          ctaButtons.push(button)
        }
      }

      let touchFriendlyCount = 0
      for (const button of ctaButtons.slice(0, 5)) {
        const box = await button.boundingBox()
        if (box && box.height >= 40) {
          touchFriendlyCount++
        }
      }

      expect(touchFriendlyCount).toBeGreaterThanOrEqual(1)
    })
  })
})

test.describe('SEO Content Quality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Content Depth and Quality', () => {
    test('main content should have substantial text', async ({ page }) => {
      await page.waitForLoadState('load', { timeout: 30000 })

      const sections = page.locator('main section')
      await sections.first().waitFor({
        state: 'visible',
        timeout: 15000,
      })

      const sectionPromises = [1, 2, 3, 4].map(index =>
        sections.nth(index).waitFor({ state: 'visible', timeout: 15000 })
      )

      const results = await Promise.allSettled(sectionPromises)
      const loadedSections = results.filter(r => r.status === 'fulfilled')

      expect(loadedSections.length).toBeGreaterThanOrEqual(3)

      await page.locator('main section').last().waitFor({
        state: 'attached',
        timeout: 20000,
      })

      await page.waitForFunction(
        () => {
          const main = document.querySelector('main')
          const wordCount =
            main?.textContent?.split(/\s+/).filter(Boolean).length || 0
          return wordCount > 100
        },
        { timeout: 30000 }
      )

      const mainContent = await page.locator('main').textContent()
      const wordCount = mainContent?.split(/\s+/).filter(Boolean).length || 0

      expect(wordCount).toBeGreaterThan(100)
    })

    test('should have unique content per page', async ({ page }) => {
      await page.locator('main section').first().waitFor({
        state: 'attached',
        timeout: 10000,
      })
      await page.waitForLoadState('load')

      const mainContent = await page.locator('main').textContent()
      // Use role="banner" to select the main site header (not section headers)
      const headerContent = await page
        .locator('header[role="banner"]')
        .textContent()
      const footerContent = await page.locator('footer').first().textContent()

      const mainWordCount =
        mainContent?.split(/\s+/).filter(Boolean).length || 0
      const totalWordCount = (
        (mainContent || '') +
        (headerContent || '') +
        (footerContent || '')
      )
        .split(/\s+/)
        .filter(Boolean).length

      expect(totalWordCount).toBeGreaterThan(0)
      const mainContentPercentage = (mainWordCount / totalWordCount) * 100
      expect(mainContentPercentage).toBeGreaterThan(40)
    })

    test('should have relevant internal linking', async ({ page }) => {
      const internalLinks = await page
        .locator('a[href^="/"], a[href^="#"]')
        .count()

      expect(internalLinks).toBeGreaterThan(5)
    })

    test('should not have broken internal links', async ({ page }) => {
      const internalLinks = await page
        .locator('a[href^="/"], a[href^="#"]')
        .all()

      for (const link of internalLinks) {
        await expect(link).not.toHaveAttribute('href', '#')
      }
    })
  })

  test.describe('H1 and Headings', () => {
    test('h1 should have meaningful content', async ({ page }) => {
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()

      const h1Text = await h1.textContent()
      expect(h1Text?.trim().length).toBeGreaterThan(5)
    })

    test('should have multiple headings for content structure', async ({
      page,
    }) => {
      const headings = await page.locator('h1, h2, h3').count()
      expect(headings).toBeGreaterThan(1)
    })
  })

  test.describe('Structured Data', () => {
    test('should have structured data markup', async ({ page }) => {
      const jsonLd = await page
        .locator('script[type="application/ld+json"]')
        .count()

      expect(jsonLd).toBeGreaterThan(0)
    })

    test('structured data should be valid JSON', async ({ page }) => {
      const jsonLdElements = await page
        .locator('script[type="application/ld+json"]')
        .all()

      for (const element of jsonLdElements) {
        const content = await element.textContent()

        expect(content).not.toBeNull()
        expect(content?.trim()).toBeTruthy()

        expect(() => JSON.parse(content ?? '')).not.toThrow()
      }
    })

    test('should have organization schema', async ({ page }) => {
      const jsonLdElements = await page
        .locator('script[type="application/ld+json"]')
        .all()

      let hasOrgSchema = false
      for (const element of jsonLdElements) {
        const content = await element.textContent()

        const trimmedContent = content?.trim() || ''

        if (trimmedContent.length === 0) continue

        try {
          const data = JSON.parse(trimmedContent)

          const isOrganization =
            data['@type'] === 'Organization' ||
            data['@type']?.includes?.('Organization')

          const hasOrgInGraph =
            Array.isArray(data['@graph']) &&
            data['@graph'].some(
              (item: { '@type'?: string | string[] }) =>
                item['@type'] === 'Organization' ||
                item['@type']?.includes?.('Organization')
            )

          if (isOrganization || hasOrgInGraph) {
            hasOrgSchema = true
            break
          }
        } catch {
          continue
        }
      }

      expect(hasOrgSchema).toBeTruthy()
    })
  })

  test.describe('URL Structure', () => {
    test('URL should be descriptive and clean', async ({ page }) => {
      const url = page.url()
      expect(url).not.toContain('?id=')
      expect(url).not.toContain('&')
      expect(url).not.toMatch(/\d{5,}/)
    })

    test('URL should use HTTPS', async ({ page }) => {
      const url = page.url()
      const isLocalDev = url.includes('localhost') || url.includes('127.0.0.1')

      test.skip(isLocalDev, 'HTTPS not available in local dev')
      expect(url).toMatch(/^https:\/\//)
    })
  })
})
