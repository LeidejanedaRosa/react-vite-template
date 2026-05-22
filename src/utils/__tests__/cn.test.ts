import { describe, expect, it } from 'vitest'

import { cn } from '../cn'

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes with object syntax', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
  })

  it('merges tailwind classes resolving conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles undefined values', () => {
    expect(cn(undefined, 'foo')).toBe('foo')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })

  it('handles array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('merges conflicting background classes, keeping the last one', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })
})
