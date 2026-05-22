import React, { ErrorInfo, ReactNode } from 'react'

import * as Sentry from '@sentry/react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

type ErrorHandler = (error: Error, errorInfo: ErrorInfo) => void

interface FallbackProps {
  error?: Error
  resetError: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode

  fallback?: ReactNode | ((fallbackProps: FallbackProps) => ReactNode)
  onError?: ErrorHandler
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Em produção, enviar erro para o Sentry com contexto completo
    /* v8 ignore start */
    if (import.meta.env.PROD) {
      Sentry.withScope(scope => {
        // Tags para facilitar filtragem no Sentry
        scope.setTag('errorBoundary', 'custom')
        scope.setTag('environment', import.meta.env.MODE)

        // Contexto adicional sobre o erro
        scope.setContext('errorInfo', {
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })

        // Nível do erro
        scope.setLevel('error')

        // Capturar exceção no Sentry
        Sentry.captureException(error)
      })
    }
    /* v8 ignore stop */

    // Em desenvolvimento, log do erro para debugging
    /* v8 ignore start */
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    /* v8 ignore stop */

    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            resetError: this.resetError,
          })
        }
        return this.props.fallback
      }

      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center'>
              <div className='shrink-0'>
                <svg
                  className='h-8 w-8 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.695-.833-3.464 0L.33 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Algo deu errado
                </h3>
              </div>
            </div>
            <div className='mb-4 text-sm text-gray-600'>
              Ocorreu um erro inesperado. Nossa equipe foi notificada e está
              trabalhando para resolver o problema.
            </div>
            <div className='flex flex-col gap-2'>
              <button
                onClick={this.resetError}
                className='bg-primary-600 hover:bg-primary-700 w-full rounded-md px-4 py-2 font-medium text-white transition-colors duration-200'
                type='button'
              >
                Tentar novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                className='w-full rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-300'
                type='button'
              >
                Recarregar página
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className='mt-4 rounded bg-gray-100 p-3 text-xs'>
                <summary className='cursor-pointer font-medium'>
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className='mt-2 whitespace-pre-wrap text-red-600'>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
export type { FallbackProps }
