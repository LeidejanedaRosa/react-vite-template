import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role='status'
      aria-label='Carregando conteúdo'
    >
      <svg
        className={`animate-spin text-primary-600 ${sizeClasses[size]}`}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  )
}

const SectionSkeleton: React.FC = () => (
  <div className='py-24 bg-gray-50' role='status' aria-label='Carregando seção'>
    <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='animate-pulse'>
        <div
          data-testid='skeleton-header'
          className='h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8'
        />
        <div
          data-testid='skeleton-description'
          className='h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12'
        />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='bg-white p-8 rounded-xl shadow-lg'>
              <div className='h-12 bg-gray-200 rounded mb-4' />
              <div className='h-6 bg-gray-200 rounded mb-4' />
              <div className='space-y-2'>
                <div className='h-4 bg-gray-200 rounded' />
                <div className='h-4 bg-gray-200 rounded w-3/4' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export { LoadingSpinner, SectionSkeleton }
