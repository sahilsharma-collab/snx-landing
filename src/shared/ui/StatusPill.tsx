import { statuses } from '@/shared/config/site'
import type { StatusKey } from '@/shared/types/site'

export interface StatusPillProps {
  status: StatusKey
  dark?: boolean
  className?: string
}

// Live / Beta / Coming soon tag. Beta and roadmap items must never look Live.
export function StatusPill({ status, dark = false, className = '' }: StatusPillProps) {
  const tone: Record<StatusKey, string> = {
    live: dark ? 'bg-cta/15 text-cta' : 'bg-save/10 text-save',
    core: dark ? 'bg-white/10 text-white' : 'bg-ink text-white',
    beta: dark ? 'bg-brand/25 text-[#C4B8FF]' : 'bg-brand/10 text-brand',
    soon: dark ? 'bg-white/5 text-mist ring-1 ring-white/15' : 'bg-line text-body',
    mixed: dark ? 'bg-amber-400/15 text-amber-300' : 'bg-amber-100 text-amber-800',
  }
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${tone[status]} ${className}`}>{statuses[status]}</span>
}
