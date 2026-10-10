import { useState } from 'react'
import { Plus } from '@/shared/icons'

export interface FaqProps {
  /** [question, answer] pairs. */
  items: [string, string][]
}

export function Faq({ items }: FaqProps) {
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-line rounded-[24px] bg-card ring-1 ring-line">
      {items.map(([q, a], i) => (
        <div key={q}>
          <button className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold sm:px-8" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {q}
            <Plus className={`size-5 shrink-0 text-brand transition-transform ${open === i ? 'rotate-45' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden px-6 text-body sm:px-8"><p className="pb-6 leading-relaxed">{a}</p></div>
          </div>
        </div>
      ))}
    </div>
  )
}
