import React from 'react'

interface PauseIconProps {
  className?: string
}

export const PauseIcon: React.FC<PauseIconProps> = ({
  className = 'w-4 h-4',
}) => {
  return (
    <svg
      className={className}
      fill='currentColor'
      viewBox='0 0 24 24'
      role='presentation'
    >
      <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
    </svg>
  )
}
