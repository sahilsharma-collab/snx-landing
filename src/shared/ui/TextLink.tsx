import { Link, type To } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Arrow } from '@/shared/icons'

export interface TextLinkProps {
  to: To
  children?: ReactNode
  dark?: boolean
}

export function TextLink({ to, children, dark = false }: TextLinkProps) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-1.5 font-semibold ${dark ? 'text-cta' : 'text-brand'}`}>
      {children} <Arrow className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
