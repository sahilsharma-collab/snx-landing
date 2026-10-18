import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand, competitors, compareUrl } from '@/shared/config/site'
import { Menu, Cross, BlogGlyph, CompareGlyph, type IconComponent } from '@/shared/icons'
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
  { label: 'Learn', items: [{ to: '/blog', label: 'Blog', desc: 'Guides on apps, retention and D2C growth', icon: BlogGlyph }] },
  {
    label: 'Compare',
    items: [
      ...Object.keys(competitors).map((key) => ({ to: compareUrl(key), label: `${brand.name} vs ${competitors[key].name}`, desc: `Features and price, side by side`, icon: CompareGlyph })),
    ],
  },
]

const Chevron = ({ className = 'size-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 9l6 6 6-6" /></svg>
)

// Bespoke marks for the Resources menu: a blog page with a brand title line and a
// cta "new" dot; two overlapping cards (one gradient) for the comparison rows.
const BlogMark = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
    <rect x="4" y="3" width="14" height="16" rx="3.5" fill="#F5F7FF" />
    <rect x="7" y="7" width="8" height="2" rx="1" fill="#7B61FF" />
    <rect x="7" y="11" width="8" height="1.6" rx=".8" fill="#A3AAC4" />
    <rect x="7" y="14" width="5" height="1.6" rx=".8" fill="#A3AAC4" />
    <circle cx="17" cy="4" r="3" fill="#C9F45B" stroke="#10172F" strokeWidth="1.5" />
  </svg>
)
const CompareMark = () => (
  <svg width="24" height="22" viewBox="0 0 24 22" aria-hidden>
    <rect x="2" y="7" width="12" height="12" rx="4" fill="rgba(255,255,255,.28)" />
    <rect x="10" y="3" width="12" height="12" rx="4" fill="url(#appitup-cg)" stroke="#10172F" strokeWidth="1.5" />
    <rect x="17" y="1" width="5" height="5" rx="1.6" fill="#C9F45B" transform="rotate(-12 19.5 3.5)" />
  </svg>
)

function ResourcesMenu({ onDark, scrolled }: { onDark: boolean; scrolled: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const { pathname } = useLocation()
  const active = ['/blog', '/compare'].some((p) => pathname.startsWith(p))

  // A brief close delay lets the cursor cross the gap to the panel without it snapping shut.
  const show = () => { clearTimeout(timer.current); setOpen(true) }
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 140) }

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      const t = e.target as Node
      if (e.type === 'keydown' ? (e as KeyboardEvent).key === 'Escape' : !ref.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true"
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${active || open ? (onDark ? 'text-white' : 'text-ink') : onDark ? 'text-mist hover:text-white' : 'text-ink/60 hover:text-ink'}`}>
        Resources <Chevron className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* mega-menu — a compact 640px card centered under the navbar. Rendered in a
          portal (not inside the pill) so its backdrop-blur matches the navbar's
          instead of being clipped by the pill's own backdrop-filter. */}
      {createPortal(
        <div ref={panelRef} onMouseEnter={show} onMouseLeave={hide}
          className={`fixed left-1/2 z-[60] w-[640px] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 transition-all duration-200 ${scrolled ? 'top-[4.75rem]' : 'top-[4.25rem]'} ${open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}>
        <div className="grid grid-cols-[minmax(0,1fr)_248px] gap-2.5 rounded-3xl border border-white/10 bg-ink/70 p-2.5 shadow-[0_24px_60px_rgba(8,12,28,0.3)] backdrop-blur-xl">
          {/* gradient shared by the compare marks */}
          <svg width="0" height="0" className="absolute" aria-hidden><defs><linearGradient id="appitup-cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7B61FF" /><stop offset="1" stopColor="#4C8DFF" /></linearGradient></defs></svg>

          <div className="flex flex-col gap-1 px-1.5 py-2.5">
            {resources.map((g, gi) => (
              <Fragment key={g.label}>
                {gi > 0 && <div className="mx-2.5 my-1.5 h-px bg-white/[0.08]" />}
                <div className="px-2.5 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">{g.label}</div>
                {g.items.map(({ to, label, desc }) => {
                  const learn = g.label === 'Learn'
                  return (
                    <Link key={to} to={to} className={`group flex gap-3 rounded-[14px] p-2.5 transition-colors hover:bg-white/[0.06] ${learn ? 'items-start' : 'items-center'}`}>
                      <span className={`flex size-10 flex-none items-center justify-center rounded-xl ${learn ? 'border border-brand/35 bg-brand/[0.16]' : 'border border-white/10 bg-white/5'}`}>
                        {learn ? <BlogMark /> : <CompareMark />}
                      </span>
                      <span className="flex flex-1 flex-col gap-0.5">
                        <span className="text-[15px] font-semibold text-cream">{label}</span>
                        <span className="text-[13px] leading-[1.45] text-mist">{desc}</span>
                      </span>
                      {!learn && <span className="self-center text-[15px] text-cta opacity-0 transition-opacity group-hover:opacity-100">→</span>}
                    </Link>
                  )
                })}
              </Fragment>
            ))}
          </div>

          <Link to={compareUrl('appbrew')} className="relative flex flex-col gap-3 overflow-hidden rounded-[18px] border border-white/[0.08] p-[18px]" style={{ backgroundColor: '#1A2344', backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px,transparent 1px)', backgroundSize: '14px 14px' }}>
            <span className="relative self-start rounded-full bg-cta px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-ink">Side by side</span>
            <span className="relative flex h-[118px] items-end justify-center gap-2.5" aria-hidden>
              <span className="flex h-[88px] w-[62px] -rotate-6 flex-col gap-[5px] rounded-[14px] border border-white/[0.12] bg-white/[0.07] p-[9px]">
                <span className="h-6 rounded-[5px] bg-white/[0.12]" />
                <span className="h-1 w-[70%] rounded-[2px] bg-white/[0.14]" />
                <span className="h-1 w-[45%] rounded-[2px] bg-white/[0.14]" />
                <span className="mt-auto text-[9px] font-semibold text-mist">{competitors.appbrew.name}</span>
              </span>
              <span className="flex h-[108px] w-[74px] rotate-[4deg] flex-col gap-[5px] rounded-[16px] bg-cream p-[9px] shadow-[0_12px_30px_rgba(8,12,28,0.5)]">
                <span className="h-[30px] rounded-[6px]" style={{ background: 'linear-gradient(135deg,#7B61FF,#4C8DFF)' }} />
                <span className="flex gap-1"><span className="h-4 flex-1 rounded-[4px] bg-line" /><span className="h-4 flex-1 rounded-[4px] bg-line" /></span>
                <span className="h-1 w-[60%] rounded-[2px] bg-line" />
                <span className="mt-auto font-display text-[10px] font-extrabold tracking-[-0.02em] text-ink">{brand.name}</span>
              </span>
            </span>
            <span className="relative font-display text-[17px] font-bold leading-[1.2] tracking-[-0.02em] text-cream">{brand.name} vs {competitors.appbrew.name}, feature by feature</span>
            <span className="relative text-[14px] font-semibold text-cta">See the comparison →</span>
          </Link>
        </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

// `solid` forces the frosted pill from the top (no transparent state) — use it on
// light-hero pages (blog, privacy, etc.) where a see-through white nav won't read.
export function Nav({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // The nav content is always white (it sits over a dark hero or the dark pill).
  const onDark = true
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 8)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  // Light-hero (`solid`) nav: a constant floating frosted pill (same height and
  // position throughout) that only changes WIDTH — wide at the top, a little
  // narrower after scrolling. Dark-hero nav: transparent + flush at the top,
  // condensing into the pill on scroll.
  const topBar = solid ? '' : 'md:h-16 md:border-transparent md:bg-transparent md:pl-0 md:pr-0 md:shadow-none md:backdrop-blur-none'
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* at the top: transparent, blends into the hero. on scroll: condenses into a
          floating pill bar (rounded ends + blurred background). */}
      <div className={`mx-auto w-full max-w-[76rem] px-2 pt-3 transition-all duration-300 sm:px-6 lg:px-8 ${solid || scrolled ? '' : 'md:pt-0'}`}>
        {/* on mobile the pill is always visible; on md+ dark heroes show a taller bar
            at the top that condenses into the floating pill on scroll, while light
            heroes keep a constant floating pill whose width narrows on scroll */}
        <div className={`relative flex h-14 items-center justify-between gap-6 rounded-full border border-white/10 bg-ink/70 pl-5 pr-3 shadow-[0_14px_40px_-14px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-[height,background-color,box-shadow,border-color,padding] duration-300 ${scrolled ? '' : topBar}`}>
          {/* content colour: white when over the dark hero / scrolled pill; dark on light-top pages */}
          <Logo light={onDark} />
          {/* plain inline links — no surrounding capsule */}
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-full px-4 py-1.5 text-sm font-medium transition-all ${(isActive && !l.to.includes('#')) ? (onDark ? 'bg-white/10 text-white' : 'bg-ink/10 text-ink') : onDark ? 'text-mist hover:bg-white/5 hover:text-white' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'}`}>
                {l.label}
              </NavLink>
            ))}
            <div className="px-4 py-1.5"><ResourcesMenu onDark={onDark} scrolled={scrolled || solid} /></div>
          </nav>
          <div className="flex items-center gap-2">
            <DemoButton className="hidden !px-5 !py-2.5 !text-sm sm:inline-flex" />
            <button className={`grid size-10 place-items-center rounded-full md:hidden ${onDark ? 'text-white' : 'text-ink'}`} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              {open ? <Cross /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        // same padded wrapper as the navbar, so the menu's box lines up with the
        // pill and keeps the same side gap instead of touching the screen edges.
        <div className="mx-auto w-full max-w-[76rem] px-2 sm:px-6 lg:px-8 md:hidden">
          <nav className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-ink/70 p-2 pb-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl" aria-label="Mobile">
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
        </div>
      )}
    </header>
  )
}

export default Nav
