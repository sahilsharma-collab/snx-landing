// "How it works": sits under the home hero and at the top of /features.
// A connected stepper on the left, and a live preview on the right that acts
// out each step. Every step says what the merchant has to do (almost nothing)
// and when it happens. Steps 2–3 are the hook: competitors hand you a builder,
// we learn your brand and design the app for you.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type KeyboardEvent } from 'react'
import { brand, howSteps, ai } from '@/shared/config/site'
import { iconFor, Apple, Android, Shopify, Check, Sparkle, Clock, User, Mobile } from '@/shared/icons'
import { DemoButton, SectionHead } from '@/shared/ui'
import { Reveal, useInView } from '@/shared/motion'
import { Phone, BrandAppScreen, LockScreen } from '@/shared/phone'

const STEP_MS = 5600

interface HowItWorksProps {
  id?: string
}

export function HowItWorks({ id = 'how' }: HowItWorksProps) {
  const [at, setAt] = useState(0)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const [p, setP] = useState(0) // progress through the current step, 0..1
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, '0px')
  const running = auto && seen && !paused

  // Advances on its own; hovering pauses it, picking a step stops it.
  useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number
    let last = performance.now()
    const tick = (t: number) => {
      const dt = t - last
      last = t
      setP((v) => {
        const n = v + dt / STEP_MS
        if (n >= 1) { setAt((i) => (i + 1) % howSteps.length); return 0 }
        return n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  const pick = (i: number) => { setAuto(false); setP(0); setAt((i + howSteps.length) % howSteps.length) }
  const onKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); pick(at + 1) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); pick(at - 1) }
  }
  // how far the rail is filled: finished steps plus progress through this one
  const rail = ((at + (auto ? p : 0)) / (howSteps.length - 1)) * 100

  return (
    <section id={id} ref={ref} className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-cream sm:py-28"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="glow absolute inset-0 opacity-40" />
      <div className="shell relative">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead dark eyebrow="How it works" title="Your brand, designed and built into an app." sub={`No app builder to learn. Tell us about your brand, and our team, powered by ${ai.name}, designs, builds and publishes your app.`} />
          {/* the merchant's total effort, summed up */}
          <div className="shrink-0 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold tracking-[0.14em] text-mist uppercase">Your part, start to finish</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">1 click + 1 call + 1 approval</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-cta"><Sparkle className="size-4" /> We do everything else.</p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* the steps, joined by a rail that fills as we go */}
          <ol className="relative" onKeyDown={onKey} aria-label="Steps">
            <div className="absolute top-7 bottom-7 left-[27px] w-[2px] rounded-full bg-white/10" aria-hidden>
              <div className="w-full rounded-full bg-gradient-to-b from-brand via-brand-2 to-cta" style={{ height: `${Math.min(100, rail)}%` }} />
            </div>
            {howSteps.map((s, i) => {
              const Ic = iconFor(s.icon)
              const on = i === at
              const done = i < at
              return (
                <li key={s.label} className="relative">
                  <button onClick={() => pick(i)} aria-current={on ? 'step' : undefined}
                    className="group flex w-full gap-5 rounded-2xl py-3 text-left focus-visible:outline-offset-4">
                    <span className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl transition-all duration-500 ${on ? 'scale-105 bg-cta text-ink shadow-[0_0_34px_-4px_rgba(201,244,91,0.75)]' : done ? 'bg-gradient-to-br from-brand to-brand-2 text-white' : 'bg-ink-2 text-mist ring-1 ring-white/15 group-hover:text-white'}`}>
                      {done ? <Check className="size-5" strokeWidth={3} /> : <Ic className="size-5" />}
                    </span>
                    <span className="min-w-0 flex-1 pt-1">
                      <span className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold tracking-[0.14em] uppercase ${on ? 'text-cta' : 'text-mist/70'}`}>
                        Step {i + 1} · {s.label}
                        <span className="font-semibold tracking-normal normal-case text-mist/60">{s.when}</span>
                      </span>
                      <span className={`mt-1 block font-display text-xl font-bold transition-colors ${on ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}>{s.title}</span>
                      <span className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-2 leading-relaxed text-mist">{s.body}</span>
                          <span className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-cta/10 px-3 py-1.5 text-xs font-bold text-cta ring-1 ring-cta/25"><User className="size-3.5" /> Your part: {s.you}</span>
                            <span className="inline-flex rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">{s.chip}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  {/* on phones the preview opens right under the active step */}
                  {on && <div className="animate-fade-up mt-2 mb-4 ml-0 lg:hidden"><Stage at={i} /></div>}
                </li>
              )
            })}
          </ol>

          <div className="hidden lg:sticky lg:top-24 lg:block"><Stage at={at} progress={auto ? p : 1} paused={paused && auto} /></div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <DemoButton>See your app free</DemoButton>
          <p className="text-sm text-mist">Live in about 14 days. You only spend about an hour of it.</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

interface StageProps {
  at: number
  progress?: number
  paused?: boolean
}

// The preview window: header with the step and the merchant's part, the
// animated scene, and a thin progress line while it auto-plays.
function Stage({ at, progress = 1, paused = false }: StageProps) {
  const s = howSteps[at]
  const scenes = [ConnectPanel, DiscoverPanel, DesignPanel, DevelopPanel, PublishPanel]
  const Scene = scenes[at]
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-ink-3 to-ink-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
      <div className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
        <span className="flex gap-1.5">{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />)}</span>
        <span className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <span className="relative flex size-2"><span className={`absolute inset-0 rounded-full bg-cta/70 ${paused ? '' : 'animate-ping'}`} /><span className="relative size-2 rounded-full bg-cta" /></span>
          {paused ? 'Paused' : 'Live preview'} · Step {at + 1} of {howSteps.length}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-mist sm:flex"><Clock className="size-3.5" /> {s.when}</span>
      </div>
      <div className="h-[2px] bg-white/5"><div className="h-full bg-gradient-to-r from-brand to-cta" style={{ width: `${progress * 100}%` }} /></div>
      <div className="relative h-[440px] overflow-hidden sm:h-[470px]">
        <div className="grid-dots absolute inset-0 opacity-70" />
        <div key={at} className="animate-stage absolute inset-0"><Scene /></div>
      </div>
      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-3 text-sm">
        <span className="font-semibold text-white">{s.title}</span>
        <span className="shrink-0 rounded-full bg-cta px-2.5 py-1 text-xs font-bold text-ink">You: {s.you}</span>
      </div>
    </div>
  )
}

// ---- one animated scene per step ----------------------------------------
interface CardProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const Card = ({ className = '', style, children }: CardProps) => (
  <div className={`rounded-2xl bg-white p-4 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] ${className}`} style={style}>{children}</div>
)

function ConnectPanel() {
  const items: [string, string][] = [['Products', '1,284'], ['Collections', '36'], ['Logo & colours', 'Done'], ['Pages & blog', '42'], ['Customers', '18,903']]
  return (
    <div className="grid h-full place-items-center px-6 py-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#95BF47] text-white shadow-lg"><Shopify className="size-7" /></span>
          <span className="relative h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <span className="absolute inset-y-0 w-10 animate-[sync_1.2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-cta to-transparent" />
          </span>
          <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 text-white shadow-lg">
            <Mobile className="size-6" />
          </span>
        </div>
        <p className="mt-4 text-center text-sm text-mist">Syncing your Shopify store with {brand.name}…</p>
        <Card className="mt-6 space-y-2.5">
          {items.map(([k, v], i) => (
            <div key={k} className="animate-fade-up flex items-center justify-between text-sm" style={{ animationDelay: `${300 + i * 450}ms` }}>
              <span className="flex items-center gap-2.5"><Check className="size-4 text-save" strokeWidth={2.75} />{k}</span>
              <span className="font-semibold text-body">{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

function DiscoverPanel() {
  const fields: [string, string[]][] = [
    ['Brand values', ['Gentle', 'Clean', 'Science-backed']],
    ['Who buys from you', ['Women 25–40', 'Skincare-curious', 'Metro India']],
    ['What the app must do', ['Routine reminders', 'Reorder in one tap', 'Loyalty points']],
  ]
  return (
    <div className="grid h-full place-items-center px-6 py-6">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold">Brand brief</p>
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">Kickoff call</span>
        </div>
        <div className="mt-4 space-y-4">
          {fields.map(([label, chips], i) => (
            <div key={label}>
              <p className="text-xs font-semibold tracking-wide text-body uppercase">{label}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {chips.map((c, k) => (
                  <span key={c} className="animate-notif-in rounded-full bg-paper px-3 py-1.5 text-sm font-medium ring-1 ring-line" style={{ animationDelay: `${300 + i * 900 + k * 220}ms` }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="animate-fade-up mt-5 flex items-center gap-2 rounded-xl bg-save/10 px-3 py-2 text-sm font-semibold text-save" style={{ animationDelay: '3200ms' }}>
          <Check className="size-4" strokeWidth={3} /> Brief approved. Ready to design.
        </p>
      </Card>
    </div>
  )
}

function DesignPanel() {
  return (
    <div className="relative h-full">
      <div className="absolute top-8 left-6 z-10 hidden sm:block">
        <Card className="animate-fade-up w-48" style={{ animationDelay: '300ms' }}>
          <p className="text-xs font-semibold tracking-wide text-body uppercase">Palette</p>
          <div className="mt-2 flex gap-1.5">{['#7B61FF', '#4C8DFF', '#F7F6FB', '#C9F45B'].map((c) => <span key={c} className="size-7 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}</div>
          <p className="mt-3 text-xs font-semibold tracking-wide text-body uppercase">Type</p>
          <p className="font-display text-xl font-bold">Aa Bricolage</p>
        </Card>
        <Card className="animate-fade-up mt-3 w-48 !p-3" style={{ animationDelay: '900ms' }}>
          <p className="flex items-center gap-1.5 text-xs font-bold text-brand"><Sparkle className="size-3.5" /> {ai.name}</p>
          <p className="mt-1 text-xs text-body">3 layouts suggested from your brief. Designer picked #2.</p>
        </Card>
      </div>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-10 sm:translate-x-0">
        <div className="animate-phone-in"><Phone width={200} designWidth={262}><BrandAppScreen toast={false} /></Phone></div>
      </div>
      <span className="animate-fade-up absolute right-6 bottom-8 z-10 rounded-full bg-cta px-3 py-1.5 text-xs font-bold text-ink shadow-lg sm:right-auto sm:left-10" style={{ animationDelay: '1500ms' }}><Check className="mr-1 inline size-3.5 -translate-y-px" strokeWidth={3} />Approved by you</span>
    </div>
  )
}

function DevelopPanel() {
  const log = ['Generating screens from approved design', 'Connecting Shopify catalogue + checkout', 'Wiring push, analytics, loyalty', 'Running tests on 24 devices']
  const builds: [typeof Apple, string, string][] = [[Apple, 'iOS build', 'bg-white'], [Android, 'Android build', 'bg-[#3DDC84]']]
  return (
    <div className="grid h-full place-items-center px-6 py-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-[#05070F] p-4 font-mono text-[13px] ring-1 ring-white/10">
          {log.map((l, i) => (
            <p key={l} className="animate-fade-up flex gap-2 py-0.5 text-white/80" style={{ animationDelay: `${200 + i * 500}ms` }}>
              <Check className="mt-0.5 size-4 shrink-0 text-cta" strokeWidth={2.5} />{l}
            </p>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {builds.map(([Ic, l, bar], i) => (
            <Card key={l} className="!p-3.5">
              <p className="flex items-center gap-2 text-sm font-bold"><Ic className="size-4" /> {l}</p>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-line">
                <div className={`h-full rounded-full ${bar === 'bg-white' ? 'bg-ink' : bar}`} style={{ animation: `grow-w 3s ${600 + i * 300}ms cubic-bezier(.3,.7,.3,1) both` }} />
              </div>
              <p className="mt-1.5 text-xs text-body">Native · connected to your store</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function PublishPanel() {
  const stores: [typeof Apple, string, string][] = [[Apple, 'App Store', 'bg-ink text-white'], [Android, 'Google Play', 'bg-[#3DDC84] text-ink']]
  return (
    <div className="relative h-full">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0">
        <div className="animate-phone-in"><Phone width={200} designWidth={262} finish="black" indicator="light"><LockScreen wallpaper="sunset" /></Phone></div>
      </div>
      <div className="absolute right-6 bottom-10 z-10 hidden w-56 space-y-3 sm:block">
        {stores.map(([Ic, l, tone], i) => (
          <Card key={l} className="animate-notif-in flex items-center gap-3 !p-3" style={{ animationDelay: `${500 + i * 400}ms` }}>
            <span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Ic className="size-5" /></span>
            <span className="flex-1"><b className="block text-sm">{l}</b><span className="text-xs text-body">Approved</span></span>
            <span className="rounded-full bg-save/10 px-2 py-1 text-[11px] font-bold text-save">LIVE</span>
          </Card>
        ))}
        <Card className="animate-notif-in !p-3" style={{ animationDelay: '1400ms' }}>
          <p className="text-xs text-body">Launch dashboard · first week</p>
          <p className="font-display text-2xl font-extrabold">2,418 <span className="text-sm font-semibold text-body">installs</span></p>
        </Card>
      </div>
    </div>
  )
}
