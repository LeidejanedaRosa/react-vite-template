import { describe, expect, it } from 'vitest'

import { render } from '../../../../test/test-utils'
import { PauseIcon } from '../PauseIcon'
import { PlayIcon } from '../PlayIcon'

describe('PlayIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<PlayIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default class w-4 h-4', () => {
    const { container } = render(<PlayIcon />)
    expect(container.querySelector('svg')).toHaveClass('w-4', 'h-4')
  })

  it('applies custom className', () => {
    const { container } = render(<PlayIcon className='h-8 w-8' />)
    expect(container.querySelector('svg')).toHaveClass('w-8', 'h-8')
  })

  it('has role="presentation"', () => {
    const { container } = render(<PlayIcon />)
    expect(container.querySelector('svg')).toHaveAttribute(
      'role',
      'presentation'
    )
  })
})

describe('PauseIcon', () => {
  it('renders an svg element', () => {
    const { container } = render(<PauseIcon />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default class w-4 h-4', () => {
    const { container } = render(<PauseIcon />)
    expect(container.querySelector('svg')).toHaveClass('w-4', 'h-4')
  })

  it('applies custom className', () => {
    const { container } = render(<PauseIcon className='h-6 w-6' />)
    expect(container.querySelector('svg')).toHaveClass('w-6', 'h-6')
  })

  it('has role="presentation"', () => {
    const { container } = render(<PauseIcon />)
    expect(container.querySelector('svg')).toHaveAttribute(
      'role',
      'presentation'
    )
  })
})
