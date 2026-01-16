import { describe, expect, it, vi } from 'vitest'

import { render, screen, userEvent } from '../../../test/test-utils'
import { AccessibleLink } from '../Accessibility'

describe('AccessibleLink', () => {
  it('should render link with correct href and text', () => {
    render(<AccessibleLink href='/about'>About us</AccessibleLink>)

    const link = screen.getByRole('link', { name: 'About us' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })

  it('should apply primary variant by default', () => {
    render(<AccessibleLink href='/test'>Link</AccessibleLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('text-primary')
  })

  it('should apply secondary variant correctly', () => {
    render(
      <AccessibleLink href='/test' variant='secondary'>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('text-gray-600')
  })

  it('should apply ghost variant correctly', () => {
    render(
      <AccessibleLink href='/test' variant='ghost'>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('text-white')
  })

  it('should handle external links with proper attributes', () => {
    render(
      <AccessibleLink href='https://external.com' external>
        External link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should show external link icon for external links', () => {
    const { container } = render(
      <AccessibleLink href='https://external.com' external>
        External
      </AccessibleLink>
    )

    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('should add accessibility text for external links', () => {
    render(
      <AccessibleLink href='https://external.com' external>
        External
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'External (abre em nova aba)')
  })

  it('should preserve custom aria-label for external links', () => {
    render(
      <AccessibleLink
        href='https://external.com'
        external
        aria-label='Custom label'
      >
        External
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should handle aria-current="page" correctly', () => {
    render(
      <AccessibleLink href='/current' ariaCurrent='page'>
        Current page
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveClass('font-semibold')
  })

  it('should handle isCurrent prop as shorthand for aria-current="page"', () => {
    render(
      <AccessibleLink href='/current' isCurrent>
        Current
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('should apply different styles when isCurrent is true', () => {
    const { rerender } = render(
      <AccessibleLink href='/test' variant='primary'>
        Link
      </AccessibleLink>
    )

    let link = screen.getByRole('link')
    expect(link).toHaveClass('text-primary')
    expect(link).not.toHaveClass('font-semibold')

    rerender(
      <AccessibleLink href='/test' variant='primary' isCurrent>
        Link
      </AccessibleLink>
    )

    link = screen.getByRole('link')
    expect(link).toHaveClass('text-primary-700', 'font-semibold')
  })

  it('should support aria-current with different values', () => {
    const { rerender } = render(
      <AccessibleLink href='/step1' ariaCurrent='step'>
        Step 1
      </AccessibleLink>
    )

    let link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'step')

    rerender(
      <AccessibleLink href='/location' ariaCurrent='location'>
        Location
      </AccessibleLink>
    )

    link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'location')
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <AccessibleLink href='/test' onKeyDown={vi.fn()}>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    link.focus()
    expect(link).toHaveFocus()

    await user.keyboard('{Enter}')
  })

  it('should call onKeyDown handler when provided', async () => {
    const handleKeyDown = vi.fn()
    const user = userEvent.setup()

    render(
      <AccessibleLink href='/test' onKeyDown={handleKeyDown}>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    link.focus()
    await user.keyboard('{Enter}')

    expect(handleKeyDown).toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(
      <AccessibleLink href='/test' className='custom-class'>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('should have proper focus styles', () => {
    render(<AccessibleLink href='/test'>Link</AccessibleLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-primary'
    )
  })

  it('should filter out security props rel and target when not external', () => {
    render(
      <AccessibleLink href='/test' rel='nofollow' target='_self'>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).not.toHaveAttribute('rel')
    expect(link).not.toHaveAttribute('target')
  })

  it('should support all variant styles with isCurrent combinations', () => {
    const { rerender } = render(
      <AccessibleLink href='/test' variant='secondary' isCurrent>
        Link
      </AccessibleLink>
    )

    let link = screen.getByRole('link')
    expect(link).toHaveClass('text-gray-800', 'font-semibold')

    rerender(
      <AccessibleLink href='/test' variant='ghost' isCurrent>
        Link
      </AccessibleLink>
    )

    link = screen.getByRole('link')
    expect(link).toHaveClass('text-white', 'font-semibold')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(
      <AccessibleLink href='/test' ref={ref}>
        Link
      </AccessibleLink>
    )

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('should have transition classes for smooth interactions', () => {
    render(<AccessibleLink href='/test'>Link</AccessibleLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('transition-colors', 'duration-200')
  })

  it('should not show external icon for internal links', () => {
    const { container } = render(
      <AccessibleLink href='/internal'>Internal</AccessibleLink>
    )

    const icon = container.querySelector('svg')
    expect(icon).not.toBeInTheDocument()
  })

  it('should handle ariaCurrent taking precedence over isCurrent', () => {
    render(
      <AccessibleLink href='/test' isCurrent ariaCurrent='step'>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'step')
  })

  it('should handle ariaCurrent={false} correctly', () => {
    render(
      <AccessibleLink href='/test' ariaCurrent={false}>
        Link
      </AccessibleLink>
    )

    const link = screen.getByRole('link')
    expect(link).not.toHaveAttribute('aria-current')
  })
})
