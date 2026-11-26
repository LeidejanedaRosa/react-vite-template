import '@testing-library/jest-dom'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// waitFor/findBy desistem em 1 s por padrão, perto do tempo do primeiro teste de um arquivo (que
// paga o aquecimento). Com a CPU disputada, falham sem defeito nenhum. O limite só diz quando
// desistir: o waitFor termina assim que a condição vale. Ver docs/DECISIONS.md (2026-11-26).
configure({ asyncUtilTimeout: 3000 })

// Cleanup após cada teste
afterEach(() => {
  cleanup()
})

// Mock de window.matchMedia (usado por muitos componentes)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock de IntersectionObserver
const MockIntersectionObserver = class {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  readonly scrollMargin: string = ''
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
}
global.IntersectionObserver =
  MockIntersectionObserver as typeof IntersectionObserver
