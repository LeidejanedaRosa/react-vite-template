import React, { forwardRef } from 'react'

import type {
  AccessibilityProps,
  SkipLinkProps,
} from '../../types/accessibility'

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children, ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className='sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[1600] focus:bg-primary focus:text-secondary focus:px-4 focus:py-2 focus:text-base focus:font-medium focus:rounded-br focus:shadow-lg'
      {...props}
    >
      {children}
    </a>
  )
)

SkipLink.displayName = 'SkipLink'

interface MainContentProps extends AccessibilityProps {
  children: React.ReactNode
  className?: string
}

export const MainContent = forwardRef<HTMLElement, MainContentProps>(
  ({ children, className = '', id = 'main-content', ...props }, ref) => (
    <main
      ref={ref}
      id={id}
      className={`focus:outline-none ${className}`}
      tabIndex={-1}
      {...props}
    >
      {children}
    </main>
  )
)

MainContent.displayName = 'MainContent'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  asChild?: boolean
}

export const ScreenReaderOnly = ({
  children,
  asChild = false,
}: ScreenReaderOnlyProps) => {
  if (asChild) {
    const child = children as React.ReactElement<{ className?: string }>
    return React.cloneElement(child, {
      className: `sr-only ${child.props.className || ''}`.trim(),
    })
  }

  return <span className='sr-only'>{children}</span>
}

interface AccessibleButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  disabled?: boolean
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Carregando...',
      disabled,
      'aria-label': ariaLabel,
      className = '',
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    ]

    const variantClasses = {
      primary: 'bg-cta hover:bg-cta-800 text-secondary focus:ring-cta-500',
      secondary:
        'bg-secondary hover:bg-gray-50 text-primary border-2 border-primary focus:ring-primary',
      ghost: 'bg-transparent hover:bg-gray-100 text-primary focus:ring-primary',
    }

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    }

    const isDisabled = disabled || loading

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && onClick) {
        onClick(event)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (onKeyDown) {
        onKeyDown(event)
      }
    }

    return (
      <button
        ref={ref}
        type='button'
        className={[
          ...baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        disabled={isDisabled}
        aria-label={loading ? loadingText : ariaLabel}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {loading && (
          <span className='mr-2' aria-hidden='true'>
            <LoadingSpinner />
          </span>
        )}
        {loading ? loadingText : children}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

const LoadingSpinner = () => (
  <svg
    className='animate-spin h-4 w-4'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-hidden='true'
    data-testid='loading-spinner'
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
)

const getVariantClasses = (
  variant: 'primary' | 'secondary' | 'ghost',
  isCurrentPage: boolean
) => {
  const variantClasses = {
    primary: isCurrentPage
      ? 'text-primary-700 font-semibold'
      : 'text-primary hover:text-gray-200',
    secondary: isCurrentPage
      ? 'text-gray-800 font-semibold'
      : 'text-gray-600 hover:text-gray-800',
    ghost: isCurrentPage
      ? 'text-white font-semibold'
      : 'text-white hover:text-gray-200 hover:underline',
  }
  return variantClasses[variant]
}

const filterSecurityProps = (props: Record<string, unknown>) => {
  const propsToRemove = ['rel', 'target']
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !propsToRemove.includes(key))
  )
}

const computeAriaLabel = (
  external: boolean,
  ariaLabel: string | undefined,
  children: React.ReactNode
) => {
  return external ? ariaLabel || `${children} (abre em nova aba)` : ariaLabel
}

interface AccessibleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  external?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  isCurrent?: boolean
  ariaCurrent?:
    | boolean
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | 'true'
}

export const AccessibleLink = forwardRef<
  HTMLAnchorElement,
  AccessibleLinkProps
>(
  (
    {
      children,
      external = false,
      variant = 'primary',
      'aria-label': ariaLabel,
      className = '',
      href,
      onKeyDown,
      isCurrent,
      ariaCurrent,
      ...props
    },
    ref
  ) => {
    const currentValue =
      ariaCurrent !== undefined ? ariaCurrent : isCurrent ? 'page' : undefined

    const isCurrentPage = Boolean(currentValue)

    const baseClasses = [
      'inline-flex items-center font-medium rounded',
      'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
    ]

    const variantClass = getVariantClasses(variant, isCurrentPage)

    const safeProps = filterSecurityProps(props)
    const computedAriaLabel = computeAriaLabel(external, ariaLabel, children)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (onKeyDown) {
        onKeyDown(event)
      }
    }

    return (
      <a
        ref={ref}
        href={href}
        className={[...baseClasses, variantClass, className].join(' ')}
        onKeyDown={handleKeyDown}
        aria-current={currentValue || undefined}
        {...safeProps}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        aria-label={computedAriaLabel}
      >
        {children}
        {external && (
          <span className='ml-1' aria-hidden='true'>
            <ExternalLinkIcon />
          </span>
        )}
      </a>
    )
  }
)

AccessibleLink.displayName = 'AccessibleLink'

const ExternalLinkIcon = () => (
  <svg
    className='h-4 w-4'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />
    <path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
  </svg>
)
