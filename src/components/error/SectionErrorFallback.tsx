interface SectionErrorFallbackProps {
  sectionName?: string
  onRetry?: () => void
}

export const SectionErrorFallback = ({
  sectionName,
  onRetry,
}: SectionErrorFallbackProps) => {
  return (
    <div className='px-4 py-12'>
      <div className='mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm'>
        <div className='mx-auto mb-4 h-12 w-12 text-amber-500'>
          <svg
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h3 className='mb-2 text-lg font-medium text-gray-900'>
          {sectionName
            ? `Não foi possível carregar: ${sectionName}`
            : 'Não foi possível carregar esta seção'}
        </h3>
        <p className='mb-4 text-sm text-gray-600'>
          Ocorreu um erro ao carregar este conteúdo. Tente novamente.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 font-medium text-white transition-colors duration-200'
            type='button'
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}
