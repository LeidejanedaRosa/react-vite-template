import { describe, expect, it } from 'vitest'

import { render } from '../../../test/test-utils'
import { Container } from '../Container'

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(<Container>Hello</Container>)
    expect(getByText('Hello')).toBeInTheDocument()
  })

  it('applies default xl max-width', () => {
    const { container } = render(<Container>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-xl')
  })

  it('applies sm max-width', () => {
    const { container } = render(<Container size='sm'>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-sm')
  })

  it('applies md max-width', () => {
    const { container } = render(<Container size='md'>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-md')
  })

  it('applies lg max-width', () => {
    const { container } = render(<Container size='lg'>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-lg')
  })

  it('applies full max-width', () => {
    const { container } = render(<Container size='full'>content</Container>)
    expect(container.firstChild).toHaveClass('max-w-full')
  })

  it('merges custom className', () => {
    const { container } = render(
      <Container className='custom-class'>content</Container>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('passes down extra HTML attributes', () => {
    const { container } = render(
      <Container data-testid='my-container'>content</Container>
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'my-container')
  })
})
