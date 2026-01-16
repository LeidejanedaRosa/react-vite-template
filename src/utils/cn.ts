import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes do Tailwind CSS de forma inteligente
 * Resolve conflitos e mescla classes condicionais
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
