import { Container } from './Container'

export interface SiteFooterProps {
  owner: string
  year?: number
}

export function SiteFooter({
  owner,
  year = new Date().getFullYear(),
}: SiteFooterProps) {
  return (
    <footer className='border-t border-gray-200 bg-white'>
      <Container className='py-6 text-center text-sm text-gray-600'>
        <p>
          © {year} {owner}
        </p>
      </Container>
    </footer>
  )
}
