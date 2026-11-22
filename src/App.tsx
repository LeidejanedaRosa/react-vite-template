import { Container, SiteFooter, SiteHeader } from '@components/layout'
import { Button, MainContent } from '@components/ui'

const BRAND = 'React Vite Template'

const NAV_ITEMS = [
  { href: '#inicio', label: 'Início' },
  { href: '#recursos', label: 'Recursos' },
]

const STACK = [
  { name: 'React 19', role: 'UI Library' },
  { name: 'TypeScript', role: 'Type Safety' },
  { name: 'Tailwind 4', role: 'Styling' },
  { name: 'Vite', role: 'Build Tool' },
]

function App() {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader brand={BRAND} navItems={NAV_ITEMS} />

      <MainContent className='flex flex-1 items-center'>
        <Container className='py-16 text-center'>
          <section id='inicio' aria-labelledby='inicio-titulo'>
            <h1
              id='inicio-titulo'
              className='text-primary-600 mb-4 text-4xl font-bold sm:text-6xl'
            >
              {BRAND}
            </h1>
            <p className='mb-8 text-xl text-gray-600'>
              Template moderno com React 19, Vite, TypeScript e Tailwind 4
            </p>

            <div className='flex flex-wrap justify-center gap-4'>
              <Button variant='primary' size='lg'>
                Começar
              </Button>
              <Button variant='secondary' size='lg'>
                Documentação
              </Button>
            </div>
          </section>

          <section
            id='recursos'
            aria-labelledby='recursos-titulo'
            className='mt-12'
          >
            <h2 id='recursos-titulo' className='sr-only'>
              Stack incluída
            </h2>
            <ul className='mx-auto grid max-w-3xl grid-cols-2 gap-6 text-sm md:grid-cols-4'>
              {STACK.map(item => (
                <li key={item.name} className='rounded-lg bg-white p-4 shadow'>
                  <h3 className='text-primary-600 font-semibold'>
                    {item.name}
                  </h3>
                  <p className='text-gray-500'>{item.role}</p>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </MainContent>

      <SiteFooter owner={BRAND} />
    </div>
  )
}

export default App
