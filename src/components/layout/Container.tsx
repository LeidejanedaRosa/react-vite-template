import { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({
  children,
  size = 'xl',
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        {
          'max-w-screen-sm': size === 'sm',
          'max-w-3xl': size === 'md',
          'max-w-5xl': size === 'lg',
          'max-w-7xl': size === 'xl',
          'max-w-full': size === 'full',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
