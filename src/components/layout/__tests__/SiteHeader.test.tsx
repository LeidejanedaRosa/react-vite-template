import { describe, expect, it } from 'vitest'

import { render, screen, within } from '../../../test/test-utils'
import { SiteHeader } from '../SiteHeader'

const NAV_ITEMS = [
  { href: '#inicio', label: 'Início' },
  { href: '#recursos', label: 'Recursos' },
]

describe('SiteHeader', () => {
  it('renders a banner landmark with the brand linking home', () => {
    render(<SiteHeader brand='Marca' navItems={NAV_ITEMS} />)
    const banner = screen.getByRole('banner')
    expect(within(banner).getByRole('link', { name: 'Marca' })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('labels the navigation so screen readers can tell it apart', () => {
    render(<SiteHeader brand='Marca' navItems={NAV_ITEMS} />)
    expect(
      screen.getByRole('navigation', { name: 'Principal' })
    ).toBeInTheDocument()
  })

  it('renders each nav item as a list item link, in order', () => {
    render(<SiteHeader brand='Marca' navItems={NAV_ITEMS} />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const links = within(nav).getAllByRole('link')
    expect(links.map(link => link.textContent)).toEqual(['Início', 'Recursos'])
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '#inicio',
      '#recursos',
    ])
    expect(within(nav).getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders an empty list when there are no nav items', () => {
    render(<SiteHeader brand='Marca' navItems={[]} />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).queryAllByRole('link')).toHaveLength(0)
  })
})
