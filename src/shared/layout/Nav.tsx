import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand, competitors, compareUrl } from '@/shared/config/site'
import { Menu, Cross, Book, Scale, Arrow, type IconComponent } from '@/shared/icons'
import { DemoButton } from '@/shared/ui'
import { Logo } from './Logo'

const links: { to: string; label: string }[] = [
  { to: '/features', label: 'Features' },
  { to: '/#how', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
]

interface ResItem {
  to: string
  label: string
  desc: string
  icon: IconComponent
}
interface ResGroup {
  label: string
  items: ResItem[]
}

// Resources dropdown: the blog, plus one comparison page per competitor.
const resources: ResGroup[] = [
  { label: 'Learn', items: [{ to: '/blog', label: 'Blog', desc: 'Guides on apps, retention and D2C growth', icon: Book }] },
  {
    label: 'Compare',
    items: [
      ...Object.keys(competitors).map((key) => ({ to: compareUrl(key), label: `${brand.name} vs ${competitors[key].name}`, desc: `Features and price, side by side`, icon: Scale })),
    ],
  },
]

const Chevron = ({ className = 'size-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg>
)

function ResourcesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const active = ['/blog', '/compare'].some((p) => pathname.startsWith(p))

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => { if (e.type === 'keydown' ? (e as KeyboardEvent).key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true"
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${active || open ? 'text-white' : 'text-mist hover:text-white'}`}>
        Resources <Chevron className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* a small mega-menu: links with descriptions, plus a featured comparison */}
      <div className={`absolute top-full left-1/2 w-[560px] -translate-x-1/2 pt-4 transition-all duration-200 ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
        <span className="absolute top-2.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-t border-l border-white/10 bg-ink-2" aria-hidden />
        <div className="grid grid-cols-[1fr_200px] gap-2 rounded-2xl border border-white/10 bg-ink-2/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="p-1">
            {resources.map((g) => (
              <div key={g.label} className="mb-1 last:mb-0">
                <p className="eyebrow px-3 pt-2 pb-1.5 text-[11px] text-mist/70">{g.label}</p>
                {g.items.map(({ to, label, desc, icon: Ic }) => (
                  <Link key={to} to={to} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-mist ring-1 ring-white/10 transition-colors group-hover:bg-brand/20 group-hover:text-white"><Ic className="size-4" /></span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{label}</span>
                      <span className="block text-xs text-mist">{desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <Link to={compareUrl('appbrew')} className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-2 p-4 text-white">
            <span className="absolute -top-10 -right-10 size-32 rounded-full bg-cta/30 blur-2xl transition-transform duration-500 group-hover:scale-125" aria-hidden />
            <span className="relative w-fit rounded-full bg-cta px-2 py-0.5 text-[11px] font-bold text-ink">Side by side</span>
            <span className="relative">
              <span className="block font-display text-lg leading-tight font-bold">{brand.name} vs {competitors.appbrew.name}, feature by feature</span>
              <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-white/85">See the comparison <Arrow className="size-3.5 transition-transform group-hover:translate-x-1" /></span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Logo />
        {/* links sit in one capsule, so the bar reads as a single control */}
        <nav className="hidden items-center gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-full px-4 py-1.5 text-sm font-medium transition-all ${isActive && !l.to.includes('#') ? 'bg-white/10 text-white' : 'text-mist hover:bg-white/5 hover:text-white'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="px-4 py-1.5"><ResourcesMenu /></div>
        </nav>
        <div className="flex items-center gap-2">
          <DemoButton className="hidden !px-5 !py-2.5 !text-sm sm:inline-flex" />
          <button className="grid size-10 place-items-center rounded-full text-white md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <Cross /> : <Menu />}
          </button>
        </div>
      </div>
      {/* reading progress */}
      <div className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-gradient-to-r from-brand via-brand-2 to-cta" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      {open && (
        <nav className="shell flex flex-col gap-1 pb-5 md:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/5">{l.label}</Link>
          ))}
          <p className="eyebrow px-3 pt-3 pb-1 text-xs text-mist">Resources</p>
          {resources.flatMap((g) => g.items.map((i) => (
            <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/5">
              {i.label}
            </Link>
          )))}
          <DemoButton className="mt-2 w-full" onClick={() => setOpen(false)} />
        </nav>
      )}
    </header>
  )
}

export default Nav
