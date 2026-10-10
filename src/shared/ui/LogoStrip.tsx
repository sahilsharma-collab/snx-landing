import { logos } from '@/shared/config/site'

export interface LogoStripProps {
  dark?: boolean
  label?: string
}

export function LogoStrip({ dark = false, label = 'Brands that went from website to app' }: LogoStripProps) {
  const row = [...logos, ...logos]
  return (
    <div>
      <p className={`mb-7 text-center text-sm ${dark ? 'text-white/50' : 'text-body'}`}>{label}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-16">
          {row.map((l, i) => (
            <span key={i} className={`font-display text-2xl font-bold tracking-tight whitespace-nowrap transition-colors sm:text-3xl ${dark ? 'text-white/45 hover:text-white' : 'text-ink/35 hover:text-ink'}`}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
