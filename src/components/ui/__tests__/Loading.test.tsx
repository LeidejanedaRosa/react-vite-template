import { describe, expect, it } from 'vitest'

import { render } from '../../../test/test-utils'
import { LoadingSpinner, SectionSkeleton } from '../Loading'

describe('LoadingSpinner', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<LoadingSpinner />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin', 'text-primary-600', 'w-12', 'h-12')
  })

  it('should render spinner with small size', () => {
    const { container } = render(<LoadingSpinner size='sm' />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-6', 'h-6')
  })

  it('should render spinner with medium size', () => {
    const { container } = render(<LoadingSpinner size='md' />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-12', 'h-12')
  })

  it('should render spinner with large size', () => {
    const { container } = render(<LoadingSpinner size='lg' />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-16', 'h-16')
  })

  it('should apply custom className', () => {
    const { container } = render(<LoadingSpinner className='custom-class' />)
    const wrapper = container.querySelector('.flex')

    expect(wrapper).toHaveClass('custom-class')
  })

  it('should have proper SVG structure for animation', () => {
    const { container } = render(<LoadingSpinner />)
    const svg = container.querySelector('svg')
    const circle = svg?.querySelector('circle')
    const path = svg?.querySelector('path')

    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')

    expect(circle).toBeInTheDocument()
    expect(circle).toHaveClass('opacity-25')
    expect(circle).toHaveAttribute('stroke', 'currentColor')

    expect(path).toBeInTheDocument()
    expect(path).toHaveClass('opacity-75')
    expect(path).toHaveAttribute('fill', 'currentColor')
  })

  it('should center spinner with flexbox', () => {
    const { container } = render(<LoadingSpinner />)
    const wrapper = container.querySelector('.flex')

    expect(wrapper).toHaveClass('items-center', 'justify-center')
  })

  it('should have proper accessibility attributes for screen readers', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('[role="status"]')
    const svg = container.querySelector('svg')

    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveAttribute('aria-label', 'Carregando conteúdo')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('SectionSkeleton', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<SectionSkeleton />)
    const skeleton = container.querySelector('.animate-pulse')

    expect(skeleton).toBeInTheDocument()
  })

  it('should have responsive padding and background', () => {
    const { container } = render(<SectionSkeleton />)
    const wrapper = container.firstChild as HTMLElement

    expect(wrapper).toHaveClass('py-24', 'bg-gray-50')
  })

  it('should have max-width container', () => {
    const { container } = render(<SectionSkeleton />)
    const innerContainer = container.querySelector('.max-w-screen-2xl')

    expect(innerContainer).toBeInTheDocument()
    expect(innerContainer).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })

  it('should render skeleton header elements', () => {
    const { getByTestId } = render(<SectionSkeleton />)
    const headerBlock = getByTestId('skeleton-header')

    expect(headerBlock).toBeInTheDocument()
    expect(headerBlock).toHaveClass(
      'h-8',
      'rounded',
      'w-1/3',
      'mx-auto',
      'mb-8'
    )
  })

  it('should render skeleton description element', () => {
    const { getByTestId } = render(<SectionSkeleton />)
    const descriptionBlock = getByTestId('skeleton-description')

    expect(descriptionBlock).toBeInTheDocument()
    expect(descriptionBlock).toHaveClass(
      'h-4',
      'rounded',
      'w-2/3',
      'mx-auto',
      'mb-12'
    )
  })

  it('should render three skeleton cards in grid', () => {
    const { container } = render(<SectionSkeleton />)
    const grid = container.querySelector('.grid')
    const cards = container.querySelectorAll(
      '.bg-white.p-8.rounded-xl.shadow-lg'
    )

    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'gap-8')
    expect(cards).toHaveLength(3)
  })

  it('should have proper card structure', () => {
    const { container } = render(<SectionSkeleton />)
    const firstCard = container.querySelector('.bg-white.p-8')
    const cardElements = firstCard?.querySelectorAll('.bg-gray-200')

    expect(firstCard).toHaveClass('rounded-xl', 'shadow-lg')
    expect(cardElements?.length).toBeGreaterThan(0)
  })

  it('should apply pulse animation', () => {
    const { container } = render(<SectionSkeleton />)
    const pulseContainer = container.querySelector('.animate-pulse')

    expect(pulseContainer).toBeInTheDocument()
  })

  it('should have semantic structure for loading state', () => {
    const { container } = render(<SectionSkeleton />)

    expect(container.querySelector('.py-24')).toBeInTheDocument()
    expect(container.querySelector('.max-w-screen-2xl')).toBeInTheDocument()
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes for screen readers', () => {
    const { container } = render(<SectionSkeleton />)
    const skeleton = container.querySelector('[role="status"]')

    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-label', 'Carregando seção')
  })
})
