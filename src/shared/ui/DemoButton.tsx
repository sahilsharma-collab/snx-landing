import { Link } from 'react-router-dom'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { brand } from '@/shared/config/site'
import { Arrow } from '@/shared/icons'

export type DemoButtonProps = {
  className?: string
  children?: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>

// The one primary CTA — same colour, same label, on every page.
export function DemoButton({ className = '', children = 'Book a demo', ...p }: DemoButtonProps) {
  const inner = <>{children} <Arrow className="size-4" /></>
  // An on-page anchor goes through the router so it works with both the
  // normal and the hash-routed single-file build.
  if (brand.demoUrl.startsWith('#')) {
    return <Link to={{ pathname: '/', hash: brand.demoUrl }} className={`btn btn-cta ${className}`} {...p}>{inner}</Link>
  }
  return <a href={brand.demoUrl} className={`btn btn-cta ${className}`} {...p}>{inner}</a>
}
