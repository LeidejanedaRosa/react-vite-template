import { Container } from '@components/layout'
import { Button } from '@components/ui'

function App() {
  return (
    <>
      {/* Meta tags nativas do React 19 */}
      <title>React Vite Template - Moderno e Escalável</title>
      <meta
        name='description'
        content='Template profissional para projetos React com Vite, TypeScript, Tailwind e todas as melhores práticas'
      />

      <Container>
        <div className='flex min-h-screen flex-col items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-primary-600 mb-4 text-6xl font-bold'>
              React Vite Template
            </h1>
            <p className='mb-8 text-xl text-gray-600'>
              Template moderno com React 19, Vite, TypeScript e Tailwind 4
            </p>

            <div className='flex justify-center gap-4'>
              <Button variant='primary' size='lg'>
                Começar
              </Button>
              <Button variant='secondary' size='lg'>
                Documentação
              </Button>
            </div>

            <div className='mt-12 grid grid-cols-2 gap-6 text-sm md:grid-cols-4'>
              <div className='rounded-lg bg-white p-4 shadow'>
                <div className='text-primary-600 font-semibold'>React 19</div>
                <div className='text-gray-500'>UI Library</div>
              </div>
              <div className='rounded-lg bg-white p-4 shadow'>
                <div className='text-primary-600 font-semibold'>TypeScript</div>
                <div className='text-gray-500'>Type Safety</div>
              </div>
              <div className='rounded-lg bg-white p-4 shadow'>
                <div className='text-primary-600 font-semibold'>Tailwind 4</div>
                <div className='text-gray-500'>Styling</div>
              </div>
              <div className='rounded-lg bg-white p-4 shadow'>
                <div className='text-primary-600 font-semibold'>Vite</div>
                <div className='text-gray-500'>Build Tool</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default App
