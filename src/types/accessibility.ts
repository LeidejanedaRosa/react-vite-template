import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export interface AccessibilityProps extends HTMLAttributes<HTMLElement> {
  id?: string
}

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}
