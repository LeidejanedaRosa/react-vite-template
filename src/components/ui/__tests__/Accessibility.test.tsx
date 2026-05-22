import { describe, expect, it } from 'vitest'

import { render, screen } from '../../../test/test-utils'
import { MainContent, ScreenReaderOnly, SkipLink } from '../Accessibility'

describe('SkipLink', () => {
  it('should render skip link with correct href', () => {
    render(<SkipLink href='#main'>Skip to content</SkipLink>)

    const link = screen.getByRole('link', { name: 'Skip to content' })
    expect(link).toHaveAttribute('href', '#main')
  })

  it('should be visually hidden by default but visible on focus', () => {
    render(<SkipLink href='#main'>Skip to content</SkipLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('sr-only')
    expect(link).toHaveClass('focus:not-sr-only')
  })

  it('should have proper focus styles', () => {
    render(<SkipLink href='#main'>Skip to content</SkipLink>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass(
      'focus:absolute',
      'focus:top-0',
      'focus:left-0',
      'focus:z-1600',
      'focus:bg-primary',
      'focus:text-secondary'
    )
  })
})

describe('MainContent', () => {
  it('should render main element with correct attributes', () => {
    render(<MainContent>Main content</MainContent>)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('id', 'main-content')
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  it('should accept custom id', () => {
    render(<MainContent id='custom-main'>Content</MainContent>)

    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'custom-main')
  })

  it('should apply custom className', () => {
    render(<MainContent className='custom-class'>Content</MainContent>)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('custom-class')
  })

  it('should be focusable for accessibility', () => {
    render(<MainContent>Content</MainContent>)

    const main = screen.getByRole('main')
    expect(main).toHaveClass('focus:outline-none')
  })
})

describe('ScreenReaderOnly', () => {
  it('should render content that is visually hidden', () => {
    render(<ScreenReaderOnly>Hidden content</ScreenReaderOnly>)

    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('should have screen reader only styles', () => {
    const { container } = render(
      <ScreenReaderOnly>Hidden content</ScreenReaderOnly>
    )

    const element = container.firstChild
    expect(element).toHaveClass('sr-only')
  })

  it('should render as span by default', () => {
    const { container } = render(
      <ScreenReaderOnly>Hidden content</ScreenReaderOnly>
    )

    const element = container.firstChild
    expect(element?.nodeName).toBe('SPAN')
  })

  it('should clone child element when asChild is true', () => {
    render(
      <ScreenReaderOnly asChild>
        <div data-testid='child-element'>Hidden content</div>
      </ScreenReaderOnly>
    )

    const element = screen.getByTestId('child-element')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('sr-only')
    expect(element.nodeName).toBe('DIV')
  })

  it('should preserve existing className when asChild is true', () => {
    render(
      <ScreenReaderOnly asChild>
        <div className='existing-class' data-testid='existing-class-element'>
          Hidden content
        </div>
      </ScreenReaderOnly>
    )

    const element = screen.getByTestId('existing-class-element')
    expect(element).toHaveClass('sr-only', 'existing-class')
  })

  it('should handle child without className when asChild is true', () => {
    render(
      <ScreenReaderOnly asChild>
        <button data-testid='button-child'>Click me</button>
      </ScreenReaderOnly>
    )

    const button = screen.getByTestId('button-child')
    expect(button).toHaveClass('sr-only')
    expect(button.nodeName).toBe('BUTTON')
  })
})
