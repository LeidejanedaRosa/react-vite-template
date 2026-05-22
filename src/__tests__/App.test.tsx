import { describe, expect, it } from 'vitest'

import App from '../App'
import { render, screen } from '../test/test-utils'

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

  it('renders the four tech stack cards', () => {
    render(<App />)
    expect(screen.getByText('React 19')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind 4')).toBeInTheDocument()
    expect(screen.getByText('Vite')).toBeInTheDocument()
  })
})
