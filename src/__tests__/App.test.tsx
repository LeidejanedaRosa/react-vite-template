import { describe, expect, it } from 'vitest'

import App from '../App'
import { render, screen, within } from '../test/test-utils'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'React Vite Template' })
    ).toBeInTheDocument()
  })

  it('renders the subtitle paragraph', () => {
    render(<App />)
    expect(
      screen.getByText(/Template moderno com React 19/)
    ).toBeInTheDocument()
  })

  it('renders primary and secondary buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Documentação' })
    ).toBeInTheDocument()
  })

  it('renders the four tech stack cards as a list', () => {
    render(<App />)
    const stack = screen.getByRole('region', { name: 'Stack incluída' })
    const items = within(stack).getAllByRole('listitem')
    expect(
      items.map(item => within(item).getByRole('heading').textContent)
    ).toEqual(['React 19', 'TypeScript', 'Tailwind 4', 'Vite'])
  })

  it('renders exactly one of each page landmark', () => {
    render(<App />)
    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
  })

  it('gives the main landmark the id the skip link in index.html targets', () => {
    render(<App />)
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('points every nav link at a section that exists on the page', () => {
    const { container } = render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    for (const link of within(nav).getAllByRole('link')) {
      const id = link.getAttribute('href')!.slice(1)
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    }
  })

  it('keeps a single h1 and leaves the meta description to index.html', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(document.querySelector('meta[name="description"]')).toBeNull()
  })
})
