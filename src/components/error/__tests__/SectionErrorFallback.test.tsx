import { describe, expect, it, vi } from 'vitest'

import { render, screen, userEvent } from '../../../test/test-utils'
import { SectionErrorFallback } from '../SectionErrorFallback'

describe('SectionErrorFallback', () => {
  it('renders default message when no sectionName is provided', () => {
    render(<SectionErrorFallback />)
    expect(
      screen.getByText('Não foi possível carregar esta seção')
    ).toBeInTheDocument()
  })

  it('renders section-specific message when sectionName is provided', () => {
    render(<SectionErrorFallback sectionName='Produtos' />)
    expect(
      screen.getByText('Não foi possível carregar: Produtos')
    ).toBeInTheDocument()
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<SectionErrorFallback />)
    expect(
      screen.queryByRole('button', { name: 'Tentar novamente' })
    ).not.toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<SectionErrorFallback onRetry={onRetry} />)
    expect(
      screen.getByRole('button', { name: 'Tentar novamente' })
    ).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(<SectionErrorFallback onRetry={onRetry} />)
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders the error description text', () => {
    render(<SectionErrorFallback />)
    expect(
      screen.getByText(
        'Ocorreu um erro ao carregar este conteúdo. Tente novamente.'
      )
    ).toBeInTheDocument()
  })
})
