interface SectionErrorFallbackProps {
  sectionName?: string
  onRetry?: () => void
}

export const SectionErrorFallback = ({
  sectionName,
  onRetry,
}: SectionErrorFallbackProps) => {
  return (
    <div className='py-12 px-4'>
      <div className='max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm'>
        <div className='w-12 h-12 mx-auto mb-4 text-amber-500'>
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
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          {sectionName
            ? `Não foi possível carregar: ${sectionName}`
            : 'Não foi possível carregar esta seção'}
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          Ocorreu um erro ao carregar este conteúdo. Tente novamente.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className='bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200'
            type='button'
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  )
}
