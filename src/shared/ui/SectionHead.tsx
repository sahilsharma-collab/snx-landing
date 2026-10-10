import type { ReactNode } from 'react'

export interface SectionHeadProps {
  eyebrow?: ReactNode
  title: ReactNode
  sub?: ReactNode
  dark?: boolean
  center?: boolean
  className?: string
}

export function SectionHead({ eyebrow, title, sub, dark = false, center = false, className = '' }: SectionHeadProps) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${dark ? 'text-cta' : 'text-brand'}`}>{eyebrow}</p>}
      <h2 className={`h-section ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {sub && <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-mist' : 'text-body'}`}>{sub}</p>}
    </div>
  )
}
