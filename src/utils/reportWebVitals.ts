import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

/**
 * Reporta Core Web Vitals para analytics/monitoramento
 * Métricas: LCP, INP, CLS, FCP, TTFB
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onFCP(onPerfEntry)
    onINP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  } else {
    // Default: enviar para console em dev, analytics em prod
    const sendToAnalytics = (metric: Metric) => {
      if (import.meta.env.DEV) {
        console.log(metric)
      } else {
        // Enviar para Google Analytics, Sentry, ou seu serviço
        const body = JSON.stringify(metric)

        // Exemplo: Google Analytics
        if (window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(
              metric.name === 'CLS' ? metric.value * 1000 : metric.value
            ),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          })
        }

        // Exemplo: endpoint próprio
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics', body)
        }
      }
    }

    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }
}
