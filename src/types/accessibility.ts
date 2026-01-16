import type { HTMLAttributes } from 'react'

export interface AccessibilityProps extends HTMLAttributes<HTMLElement> {
  id?: string
}

export interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}
