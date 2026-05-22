import { createRef } from 'react'

import { describe, expect, it, vi } from 'vitest'

import { render, screen, userEvent } from '../../../test/test-utils'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600')
  })

  it('applies secondary variant', () => {
    render(<Button variant='secondary'>Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-white', 'border')
  })

  it('applies ghost variant', () => {
    render(<Button variant='ghost'>Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('applies danger variant', () => {
    render(<Button variant='danger'>Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('applies md size by default', () => {
    render(<Button>Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2')
  })

  it('applies sm size', () => {
    render(<Button size='sm'>Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5')
  })

  it('applies lg size', () => {
    render(<Button size='lg'>Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner and disables button when loading', () => {
    const { container } = render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument()
  })

  it('does not show spinner when not loading', () => {
    const { container } = render(<Button>Submit</Button>)
    expect(container.querySelector('svg.animate-spin')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>
    )
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('merges custom className', () => {
    render(<Button className='custom-class'>Btn</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
