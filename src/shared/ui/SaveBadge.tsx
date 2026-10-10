import type { ReactNode } from 'react'

export interface SaveBadgeProps {
  children?: ReactNode
  className?: string
}

export function SaveBadge({ children, className = '' }: SaveBadgeProps) {
  return <span className={`inline-flex items-center rounded-full bg-save/10 px-2.5 py-1 text-xs font-bold text-save ${className}`}>{children}</span>
}
