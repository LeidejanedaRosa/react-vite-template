import React from 'react'

interface PlayIconProps {
  className?: string
}

export const PlayIcon: React.FC<PlayIconProps> = ({
  className = 'w-4 h-4',
}) => {
  return (
    <svg
      className={className}
      fill='currentColor'
      viewBox='0 0 24 24'
      role='presentation'
    >
      <path d='M8 5v14l11-7z' />
    </svg>
  )
}
