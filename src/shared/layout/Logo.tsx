import { Link } from 'react-router-dom'
import { brand } from '@/shared/config/site'
import { Mobile } from '@/shared/icons'

export interface LogoProps {
  light?: boolean
}

export function Logo({ light = true }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display text-xl font-extrabold ${light ? 'text-white' : 'text-ink'}`}>
      <span className="grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-brand to-brand-2 text-white">
        <Mobile className="size-[18px]" strokeWidth={2.2} />
      </span>
      {brand.name}
    </Link>
  )
}
