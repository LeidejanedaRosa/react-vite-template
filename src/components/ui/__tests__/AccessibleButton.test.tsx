import { describe, expect, it, vi } from 'vitest'

import { render, screen, userEvent } from '../../../test/test-utils'
import { AccessibleButton } from '../Accessibility'

describe('AccessibleButton', () => {
  it('should render button with correct text', () => {
    render(<AccessibleButton>Click me</AccessibleButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard navigation (Enter)', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard navigation (Space)', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard(' ')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<AccessibleButton disabled>Disabled button</AccessibleButton>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('should not fire click events when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <AccessibleButton onClick={handleClick} disabled>
        Disabled
      </AccessibleButton>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should have proper ARIA attributes', () => {
    render(
      <AccessibleButton
        aria-label='Custom label'
        aria-describedby='description'
      >
        Button
      </AccessibleButton>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('aria-describedby', 'description')
  })

  it('should apply different variants correctly', () => {
    const { rerender } = render(
      <AccessibleButton variant='primary'>Primary</AccessibleButton>
    )

    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-cta')

    rerender(<AccessibleButton variant='secondary'>Secondary</AccessibleButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary')

    rerender(<AccessibleButton variant='ghost'>Ghost</AccessibleButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent')
  })

  it('should apply different sizes correctly', () => {
    const { rerender } = render(
      <AccessibleButton size='sm'>Small</AccessibleButton>
    )

    let button = screen.getByRole('button')
    expect(button).toHaveClass('px-3', 'py-2', 'text-sm')

    rerender(<AccessibleButton size='lg'>Large</AccessibleButton>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-4', 'text-lg')
  })

  it('should show loading state correctly', () => {
    render(<AccessibleButton loading>Loading button</AccessibleButton>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should not throw when clicked without an onClick handler', async () => {
    const user = userEvent.setup()
    render(<AccessibleButton>No handler</AccessibleButton>)
    // Clicking a non-disabled button with no onClick should not throw
    await user.click(screen.getByRole('button'))
  })

  it('should call onKeyDown handler when provided', async () => {
    const handleKeyDown = vi.fn()
    const user = userEvent.setup()

    render(
      <AccessibleButton onKeyDown={handleKeyDown}>Button</AccessibleButton>
    )

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Tab}')

    expect(handleKeyDown).toHaveBeenCalled()
  })

  it('should not fire click events when loading', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <AccessibleButton onClick={handleClick} loading>
        Loading
      </AccessibleButton>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should support custom loading text for i18n', () => {
    render(
      <AccessibleButton loading loadingText='Loading...'>
        Submit
      </AccessibleButton>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Loading...')
    expect(button).toHaveAttribute('aria-label', 'Loading...')
  })
})
