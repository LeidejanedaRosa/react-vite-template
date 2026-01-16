import { Container } from '@components/layout'
import { Button } from '@components/ui'

function App() {
  return (
    <>
      {/* Meta tags nativas do React 19 */}
      <title>React Vite Template - Moderno e Escalável</title>
      <meta
        name="description"
        content="Template profissional para projetos React com Vite, TypeScript, Tailwind e todas as melhores práticas"
      />

      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold text-primary-600">
              React Vite Template
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Template moderno com React 19, Vite, TypeScript e Tailwind 4
            </p>

            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg">
                Começar
              </Button>
              <Button variant="secondary" size="lg">
                Documentação
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="font-semibold text-primary-600">React 19</div>
                <div className="text-gray-500">UI Library</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="font-semibold text-primary-600">TypeScript</div>
                <div className="text-gray-500">Type Safety</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="font-semibold text-primary-600">Tailwind 4</div>
                <div className="text-gray-500">Styling</div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="font-semibold text-primary-600">Vite</div>
                <div className="text-gray-500">Build Tool</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default App
