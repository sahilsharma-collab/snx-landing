import type { HTMLAttributes } from 'react'
import { Percent, Apple, Android, Shopify } from '@/shared/icons'

export type TrustRowProps = {
  dark?: boolean
  className?: string
} & HTMLAttributes<HTMLUListElement>

// Trust signals that sit right beside CTAs.
export function TrustRow({ dark = true, className = '', ...p }: TrustRowProps) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${dark ? 'text-mist' : 'text-body'} ${className}`} {...p}>
      <li className="flex items-center gap-1.5"><Percent className={`size-4 ${dark ? 'text-cta' : 'text-save'}`} /> 0% commission</li>
      <li className={`flex items-center gap-1.5 ${dark ? 'text-white' : 'text-ink'}`} aria-label="iOS and Android">
        <Apple className="size-[18px]" /><span className={`text-sm font-semibold ${dark ? 'text-mist' : 'text-body'}`} aria-hidden>+</span><Android className="size-[18px] text-[#3DDC84]" />
      </li>
      {/* PLACEHOLDER: swap for the real App Store rating once the plugin has one */}
      <li className="flex items-center gap-1.5"><Shopify className="size-4 text-[#95BF47]" /> Built for Shopify</li>
    </ul>
  )
}
