import { Check } from '@/shared/icons'

export interface CellProps {
  v: boolean | string
  highlight?: boolean
}

// One cell of any comparison / feature table.
export function Cell({ v, highlight }: CellProps) {
  if (v === true) return <span className={`inline-flex ${highlight ? 'text-brand' : 'text-ink/70'}`}><Check className="size-5" strokeWidth={2.5} /><span className="sr-only">Yes</span></span>
  if (v === false) return <span><span className="font-semibold text-ink/25" aria-hidden>—</span><span className="sr-only">No</span></span>
  return <span className={`text-sm ${highlight ? 'font-semibold text-ink' : 'text-body'}`}>{v}</span>
}
