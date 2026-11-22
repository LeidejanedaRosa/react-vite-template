import { Container } from './Container'

export interface NavItem {
  href: string
  label: string
}

export interface SiteHeaderProps {
  brand: string
  navItems: NavItem[]
}

export function SiteHeader({ brand, navItems }: SiteHeaderProps) {
  return (
    <header className='border-b border-gray-200 bg-white'>
      <Container className='flex items-center justify-between py-4'>
        <a href='/' className='text-primary-700 text-lg font-bold'>
          {brand}
        </a>
        <nav aria-label='Principal'>
          <ul className='flex gap-6 text-sm font-medium'>
            {navItems.map(item => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className='hover:text-primary-700 text-gray-700'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
