import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react'
import { brand, heroVariants, stats, plans, competitors, compareUrl, whyUs, calculator, ai } from '@/shared/config/site'
import { Phone, MorphPhone, LockScreen, WebsiteScreen, BrandAppScreen, FashionStoreScreen, HealthScreen, BeautyScreen, FashionScreen, FoodScreen, type FinishKey } from '@/shared/phone'
import { DemoButton, TrustRow, SectionHead, LogoStrip, Testimonial, CtaBand, TextLink, SaveBadge, StatusPill } from '@/shared/ui'
import { Reveal, CountUp, Tilt, Words, spotlight, useTicker, useInView } from '@/shared/motion'
import { photo } from '@/shared/config/photos'
import { HowItWorks } from '@/shared/sections'
import { RetentionTimeline } from '@/shared/sections'
import { Gift, Percent, Check, Swap, Sparkle, Bell, Apple, Android, Star, ChevronLeft, ChevronRight, Dumbbell, Shirt, Basket, Palette, TrendUp, iconFor } from '@/shared/icons'

export function HomePage() {
  return (
    <>
      <Hero />
      <Bento />
      <HowItWorks />
      <Retention />
      <Calculator />
      <WhyUs />
      <Industries />
      <Teasers />
      <Proof />
      <CtaBand />
    </>
  )
}

function Hero() {
  const { search } = useLocation()
  const h = heroVariants[new URLSearchParams(search).get('v') ?? ''] ?? Object.values(heroVariants)[0]
  const hlAt = 100 + h.before.split(' ').length * 70 // highlight lands right after the lead-in words
  // a smaller phone on short laptop screens, so the whole hero fits in one screen
  const phoneW = typeof window !== 'undefined' && window.innerHeight <= 760 ? 250 : 290
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="glow absolute inset-0" />
      <div className="grid-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]" />
      {/* desktop: fills the screen below the sticky nav (h-16 + 1px border); the logo strip sits just below the fold */}
      <div className="shell relative grid items-center gap-12 pt-14 pb-12 lg:min-h-[calc(100svh-65px)] lg:grid-cols-[1.1fr_1fr] lg:py-10 short:py-6">
        <div>
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-mist ring-1 ring-white/10">
            <span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-cta/70" /><span className="relative size-2 rounded-full bg-cta" /></span>
            {h.pill}
          </p>
          <h1 className="h-display mt-6 short:mt-4 short:text-[4.1rem]">
            <Words text={h.before} start={100} />
            <span className="word" style={{ animationDelay: `${hlAt}ms` }}><span className="text-gradient">{h.highlight}</span></span>{' '}
            {h.after && <Words text={h.after} start={hlAt + 80} />}
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-mist sm:text-xl" style={{ animationDelay: '650ms' }}>
            {h.sub}
          </p>
          <div className="animate-fade-up mt-9 flex gap-2.5 sm:gap-3 [&>*]:min-w-0 [&>*]:flex-1 sm:[&>*]:flex-none" style={{ animationDelay: '800ms' }}>
            <DemoButton />
            <Link to="/pricing" className="btn btn-ghost-dark">See pricing</Link>
          </div>
          <TrustRow className="animate-fade-up mt-7" style={{ animationDelay: '950ms' }} />
        </div>

        {/* one phone, two worlds: drag the handle to turn the website into the app */}
        <div className="relative mx-auto flex w-full max-w-[460px] flex-col items-center">
          <div className="absolute top-10 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg,#7B61FF,#4C8DFF,#C9F45B,#7B61FF)] opacity-25 blur-[90px]" />
          <div className="animate-phone-in relative" style={{ animationDelay: '200ms' }}>
            <Tilt max={6}><MorphPhone width={phoneW} /></Tilt>
          </div>
          <FloatCard className="top-[16%] left-0 lg:-left-8" delay={1100}>
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-white"><Gift className="size-4" /></span>
            <span><b className="block">+120 points</b><span className="text-xs text-body">earned on order #1042</span></span>
          </FloatCard>
          <FloatCard className="top-[62%] right-0 lg:-right-6" delay={1350}>
            <span className="grid size-8 place-items-center rounded-xl bg-cta text-ink"><Percent className="size-4" /></span>
            <span><b className="block">0% commission</b><span className="text-xs text-body">on every app sale</span></span>
          </FloatCard>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-9"><LogoStrip dark /></div>
    </section>
  )
}

interface FloatCardProps {
  children: ReactNode
  delay?: number
  className?: string
}

function FloatCard({ children, delay = 0, className = '' }: FloatCardProps) {
  return (
    <div className={`animate-fade-up absolute z-20 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="animate-float-slow flex items-center gap-2 rounded-2xl bg-white/95 py-2 pr-3 pl-2 text-xs text-ink sm:gap-3 sm:py-2.5 sm:pr-4 sm:pl-2.5 sm:text-sm shadow-[0_24px_50px_-14px_rgba(0,0,0,0.6)]">{children}</div>
    </div>
  )
}

// ---- Bento: live mini-demos of what a website can't do ------------------
interface BentoCardProps {
  className?: string
  children: ReactNode
  dark?: boolean
}

function BentoCard({ className = '', children, dark = false }: BentoCardProps) {
  return (
    <Reveal className={className}>
      <div onMouseMove={spotlight} className={`spot group relative h-full overflow-hidden rounded-[28px] p-6 ring-1 transition-all duration-500 hover:-translate-y-1 sm:p-7 ${dark ? 'bg-ink text-white ring-white/10 hover:shadow-[0_30px_60px_-30px_rgba(8,12,28,0.8)]' : 'bg-card ring-line [--spot:rgba(123,97,255,0.10)] hover:shadow-[0_30px_60px_-30px_rgba(8,12,28,0.25)]'}`}>
        {children}
      </div>
    </Reveal>
  )
}

function Bento() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="shell">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead eyebrow="What your website can’t do" title={<>Everything a browser tab can’t give you.</>} />
          <p className="max-w-sm text-lg text-body">Every tile below is live. This is the stuff that turns a one-time buyer into someone who opens your app every week.</p>
        </Reveal>

        <div className="mt-14 grid auto-rows-[minmax(250px,auto)] gap-4 md:grid-cols-6">
          <BentoCard dark className="md:col-span-3 md:row-span-2">
            <span className="grid size-10 place-items-center rounded-xl bg-cta text-ink"><Bell className="size-5" /></span>
            <h3 className="mt-5 text-2xl font-bold">Push that lands on the lock screen</h3>
            <p className="mt-2 max-w-sm text-mist">Not the spam folder. Cart reminders, back-in-stock and win-back messages, sent on their own.</p>
            <div className="mt-8 flex justify-center">
              <div className="transition-transform duration-500 group-hover:-translate-y-1.5"><Phone width={230} finish="black" indicator="light"><LockScreen wallpaper="sunset" /></Phone></div>
            </div>
          </BentoCard>
          <BentoCard className="md:col-span-3"><LoyaltyDemo /></BentoCard>
          <BentoCard className="md:col-span-3"><ThemeDemo /></BentoCard>
          <BentoCard className="md:col-span-2"><IndustryDemo /></BentoCard>
          <BentoCard dark className="md:col-span-2">
            <p className="text-gradient font-display text-7xl leading-none font-extrabold">0%</p>
            <h3 className="mt-3 text-xl font-bold">Commission. Forever.</h3>
            <ul className="mt-4 space-y-1.5 text-sm text-mist">
              {['No revenue share', 'No per-order fee', 'One flat monthly price'].map((t) => <li key={t} className="flex items-center gap-2"><Check className="size-4 text-cta" strokeWidth={3} />{t}</li>)}
            </ul>
          </BentoCard>
          <BentoCard className="md:col-span-2">
            <div className="flex gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-ink text-white"><Apple /></span>
              <span className="grid size-10 place-items-center rounded-xl bg-[#3DDC84] text-ink"><Android /></span>
            </div>
            <p className="mt-5 font-display text-5xl font-extrabold tracking-tight"><CountUp value={stats[0].value} /></p>
            <p className="mt-1 text-body">{stats[0].label}. Both stores, one setup.</p>
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function LoyaltyDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const step = useTicker(4, 1800, ref)
  const pts = 980 + step * 120
  const tiers: Array<[string, number]> = [['Silver', 0], ['Gold', 1200], ['Platinum', 2500]]
  return (
    <div ref={ref}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Loyalty that feels like a game</h3>
          <p className="mt-2 max-w-xs text-body">Points, tiers and app-only rewards, right in their pocket.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600"><Star className="size-5 fill-current" /></span>
      </div>
      <div className="mt-6 rounded-2xl bg-paper p-4">
        <div className="flex items-end justify-between">
          <p className="font-display text-4xl font-extrabold tabular-nums">{pts.toLocaleString('en-US')}<span className="ml-1 text-base font-semibold text-body">pts</span></p>
          <span key={step} className="animate-notif-in rounded-full bg-save/10 px-2.5 py-1 text-xs font-bold text-save">+120 · order placed</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-gradient-to-r from-brand via-brand-2 to-cta transition-[width] duration-700 ease-out" style={{ width: `${Math.min(100, (pts / 2500) * 100)}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs font-semibold">
          {tiers.map(([t, at]) => <span key={t} className={pts >= at ? 'text-ink' : 'text-body/50'}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

interface Theme {
  prompt: string
  name: string
  c: [string, string, string]
}

const themes: Theme[] = [
  { prompt: 'Brand values: gentle, clean, science-backed', name: 'Soft glow', c: ['#F7C6D0', '#E5989B', '#6D2E46'] },
  { prompt: 'Brand values: bold, sporty, high energy', name: 'Sprint', c: ['#C9F45B', '#111827', '#2563EB'] },
  { prompt: 'Brand values: calm, earthy, premium', name: 'Terra', c: ['#E7DCC8', '#A3826C', '#3F4A3C'] },
]

function ThemeDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const i = useTicker(themes.length, 4200, ref)
  const t = themes[i]
  const [typed, setTyped] = useState('')
  useEffect(() => {
    setTyped('')
    let n = 0
    const id = setInterval(() => { n += 1; setTyped(t.prompt.slice(0, n)); if (n >= t.prompt.length) clearInterval(id) }, 38)
    return () => clearInterval(id)
  }, [t.prompt])
  const done = typed.length === t.prompt.length
  return (
    <div ref={ref} className="grid h-full gap-5 sm:grid-cols-[1fr_auto]">
      <div>
        <span className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand"><Sparkle className="size-5" /></span>
        <h3 className="mt-4 text-2xl font-bold">AI designs from your brand brief</h3>
        <div className="mt-4 rounded-xl bg-ink px-3.5 py-3 font-mono text-[13px] text-white">
          <span className="text-cta">›</span> {typed}<span className="caret ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-cta" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          {t.c.map((c, k) => <span key={c + i} className="animate-notif-in size-7 rounded-full ring-2 ring-white shadow" style={{ background: c, animationDelay: `${k * 90 + 200}ms`, opacity: done ? 1 : 0.15 }} />)}
          <span className="ml-1 text-sm font-semibold text-body">{done ? `Theme: ${t.name}` : 'Designing…'}</span>
        </div>
      </div>
      {/* mini app preview that re-skins itself */}
      <div className="mx-auto">
        <Phone width={150}>
          <div className="h-full bg-white">
            <div className="h-[72px] px-2.5 pt-8 transition-colors duration-700" style={{ background: t.c[1] }}>
              <p className="text-[9px] font-bold" style={{ color: t.c[0] }}>Hi Priya 👋</p>
            </div>
            <div className="space-y-1.5 p-2">
              <div className="h-3 rounded-full transition-colors duration-700" style={{ background: t.c[0] }} />
              <div className="grid grid-cols-2 gap-1.5">{[0, 1, 2, 3].map((k) => <div key={k} className="h-12 rounded-md transition-colors duration-700" style={{ background: k % 2 ? t.c[0] : `${t.c[2]}22` }} />)}</div>
              <div className="h-4 rounded-full transition-colors duration-700" style={{ background: t.c[2] }} />
            </div>
          </div>
        </Phone>
      </div>
    </div>
  )
}

function IndustryDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const screens: Array<[string, () => ReactNode, FinishKey]> = [['Fitness', HealthScreen, 'blue'], ['Beauty', BeautyScreen, 'white'], ['Fashion', FashionScreen, 'black'], ['Grocery', FoodScreen, 'titanium']]
  const i = useTicker(screens.length, 2600, ref)
  const [label, Screen, finish] = screens[i]
  return (
    <div ref={ref} className="grid h-full grid-cols-[1fr_auto] gap-4">
      <div>
        <h3 className="text-xl font-bold">Built for <span key={label} className="animate-fade-up inline-block text-brand">{label}</span></h3>
        <p className="mt-1 text-sm text-body">Features made for what you sell.</p>
      </div>
      <div key={label} className="animate-fade-up self-center"><Phone width={130} designWidth={250} finish={finish}><Screen /></Phone></div>
    </div>
  )
}

function Retention() {
  return (
    <section className="aurora py-20 text-cream sm:py-28">
      <div className="shell relative">
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead dark eyebrow="The retention machine" title="One order in. A repeat customer out." sub="Our automations watch every customer and send the right message at the right moment, every day, on their own. Follow Priya through her first 90 days." />
          <div className="grid shrink-0 grid-cols-3 gap-2">
            {[['15', 'journeys built in'], ['24/7', 'runs on its own'], ['0', 'manual work']].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white/[0.05] px-4 py-3 text-center ring-1 ring-white/10">
                <p className="font-display text-2xl font-extrabold text-cta">{v}</p>
                <p className="mt-0.5 text-xs text-mist">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="relative mt-14"><RetentionTimeline link="/features/automations" /></div>
    </section>
  )
}

// ---- Revenue calculator ------------------------------------------------
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

function Calculator() {
  const c = calculator
  const [rev, setRev] = useState(c.start)
  const app = rev * c.appShare
  const plan = rev < 150000 ? plans[0] : plans[1]
  const fee = app * 12 * c.revShare
  const pct = ((rev - c.min) / (c.max - c.min)) * 100
  return (
    <section className="bg-card py-20 sm:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <SectionHead eyebrow="Do the maths" title="What would your app be worth?" sub="Slide to your monthly online sales. We’ll show how much could flow through your own app, and what you keep with 0% commission." />
          <p className="mt-6 text-xs text-body/70">Uses our store average ({Math.round(c.appShare * 100)}% of sales through the app) and a {c.revShare * 100}% revenue-share fee for comparison. Your results will vary.</p>
        </Reveal>
        <Reveal from="scale" delay={120} className="rounded-[32px] bg-ink p-6 text-white ring-1 ring-white/10 sm:p-9">
          <label className="block">
            <span className="flex items-baseline justify-between">
              <span className="text-sm text-mist">Monthly online sales</span>
              <span className="font-display text-3xl font-extrabold tabular-nums">{money(rev)}</span>
            </span>
            <input type="range" min={c.min} max={c.max} step={c.step} value={rev} onChange={(e) => setRev(Number(e.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#C9F45B]"
              style={{ background: `linear-gradient(90deg,#C9F45B ${pct}%,rgba(255,255,255,0.12) ${pct}%)` }} />
          </label>

          <div className="mt-8">
            <div className="flex h-11 overflow-hidden rounded-xl text-xs font-bold">
              <div className="grid place-items-center bg-white/10 text-white/80 transition-all duration-500" style={{ width: `${100 - c.appShare * 100}%` }}>Website</div>
              <div className="grid place-items-center bg-gradient-to-r from-brand to-brand-2 transition-all duration-500" style={{ width: `${c.appShare * 100}%` }}>App</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="through your app / month" value={money(app)} accent />
            <Stat label={`you keep a year vs ${c.revShare * 100}% rev share`} value={money(fee)} />
            <Stat label={`suggested plan: ${plan.name}`} value={`$${plan.monthly}/mo`} />
          </div>
          <DemoButton className="mt-8 w-full">Show me my app</DemoButton>
        </Reveal>
      </div>
    </section>
  )
}

interface StatProps {
  label: string
  value: string
  accent?: boolean
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className={`font-display text-2xl font-extrabold tabular-nums ${accent ? 'text-cta' : 'text-white'}`}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-mist">{label}</p>
    </div>
  )
}

function WhyUs() {
  const [withUs, setWithUs] = useState(true)
  return (
    <section id="why" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="shell">
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead eyebrow="Why us" title="Not a copy of your website. An upgrade." sub="An app shouldn’t just repeat your website. We keep everything that works and add what a website can’t do." />
          <div role="tablist" aria-label="Compare" className="flex shrink-0 rounded-full bg-card p-1.5 ring-1 ring-line">
            {([[false, 'Your website'], [true, `With ${brand.name}`]] as Array<[boolean, string]>).map(([v, l]) => (
              <button key={l} role="tab" aria-selected={withUs === v} onClick={() => setWithUs(v)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${withUs === v ? (v ? 'bg-ink text-white shadow' : 'bg-line text-ink') : 'text-body hover:text-ink'}`}>{l}</button>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <div className="mx-auto lg:sticky lg:top-24">
            <Tilt max={7}>
              <div key={String(withUs)} className="animate-fade-up">
                <Phone finish={withUs ? 'white' : 'black'}>{withUs ? <FashionStoreScreen /> : <WebsiteScreen />}</Phone>
              </div>
            </Tilt>
            <button onClick={() => setWithUs(!withUs)} className="mx-auto mt-6 flex items-center gap-2 text-sm font-semibold text-brand"><Swap className="size-4" /> Flip to {withUs ? 'your website' : `the ${brand.name} app`}</button>
          </div>
          <ul className="grid gap-3">
            {whyUs.map((w, i) => {
              const Ic = iconFor(w.icon)
              return (
                <Reveal as="li" key={w.fix} delay={i * 70} className={`grid gap-4 rounded-3xl p-5 ring-1 transition-all duration-300 sm:grid-cols-[auto_1fr_200px] sm:items-center sm:gap-5 sm:p-6 ${withUs ? 'bg-card ring-line' : 'bg-paper ring-line/60'}`}>
                  <span className={`grid size-11 place-items-center rounded-2xl transition-colors ${withUs ? 'bg-brand/10 text-brand' : 'bg-line text-body'}`}><Ic className="size-5" /></span>
                  <div>
                    <p className={`text-sm transition-all ${withUs ? 'text-body/60 line-through' : 'font-semibold text-ink'}`}>{w.problem}</p>
                    <p className={`mt-1 font-display text-lg font-bold transition-all ${withUs ? 'text-ink' : 'text-ink/30'}`}>
                      {w.fix}{w.status !== 'live' && <StatusPill status={w.status} className="ml-2 align-middle" />}
                    </p>
                  </div>
                  {/* the result, as its own column rather than a badge */}
                  <div className={`border-t border-line pt-4 transition-opacity duration-300 sm:self-stretch sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 sm:flex sm:flex-col sm:justify-center ${withUs ? 'opacity-100' : 'opacity-40'}`}>
                    <p className={`flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase ${withUs ? 'text-save' : 'text-body'}`}><TrendUp className="size-3.5" strokeWidth={2.4} /> Result</p>
                    <p className="mt-1 text-sm leading-snug font-semibold text-ink">{w.outcome}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

interface Industry {
  id: string
  label: string
  Icon: typeof Dumbbell
  glow: string
  Screen: () => ReactNode
  finish: FinishKey
  title: string
  body: string
  points: string[]
}

const industries: Industry[] = [
  { id: 'health', label: 'Health & fitness', Icon: Dumbbell, glow: '#10B981', Screen: HealthScreen, finish: 'blue', title: 'A step tracker that sells protein.', body: 'Shoppers walk, earn rewards, and come back to the app every day, not only when they need to reorder.', points: ['Walking and step challenges', 'Workout log', 'Rewards unlocked by activity'] },
  { id: 'beauty', label: 'Beauty', Icon: Sparkle, glow: '#E11D74', Screen: BeautyScreen, finish: 'white', title: 'A shade finder in every pocket.', body: 'Fewer returns, more confident first orders, and a routine that brings customers back.', points: ['Camera shade finder', 'AM / PM routine planner', 'Replenishment reminders'] },
  { id: 'fashion', label: 'Fashion', Icon: Shirt, glow: '#A78BFA', Screen: FashionScreen, finish: 'black', title: 'The right size, first time.', body: 'Size guidance built on what similar shoppers kept, plus lookbooks that sell the whole outfit.', points: ['Smart size guide', 'Shoppable lookbooks', 'Back-in-stock by size'] },
  { id: 'food', label: 'Food & grocery', Icon: Basket, glow: '#EA580C', Screen: FoodScreen, finish: 'titanium', title: 'The weekly shop in one tap.', body: 'Saved baskets and live tracking turn a one-off order into a weekly habit.', points: ['One-tap reorder lists', 'Live delivery tracking', 'Scheduled deliveries'] },
]

// A coverflow of phones: the chosen industry slides to the centre and comes
// forward; the others turn away and dim. Rotates on its own until touched.
function Industries() {
  const [at, setAt] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hover, setHover] = useState(false)
  const [gap, setGap] = useState(260)
  const ref = useRef<HTMLDivElement>(null)
  const ind = industries[at]

  useEffect(() => {
    const on = () => setGap(window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 220 : 270)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  const seen = useInView(ref, '0px')
  useEffect(() => {
    if (!auto || hover || !seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setAt((i) => (i + 1) % industries.length), 5000)
    return () => clearTimeout(t)
  }, [at, auto, hover, seen])

  const pick = (i: number) => { setAuto(false); setAt((i + industries.length) % industries.length) }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); pick(at + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); pick(at - 1) }
  }

  return (
    <section id="industries" ref={ref} className="relative scroll-mt-16 overflow-hidden bg-ink py-20 text-cream sm:py-28"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="glow absolute inset-0 opacity-40" />
      <div className="shell relative">
        <Reveal><SectionHead dark center eyebrow="Industries" title="Features built for what you sell." sub="This is the part no website builder can copy: extras made for your industry that give shoppers a reason to keep your app." /></Reveal>

        {/* the lineup */}
        <div className="relative mt-12 h-[500px] [perspective:1600px] sm:h-[600px]" onKeyDown={onKey} role="tablist" aria-label="Industries">
          <div className="absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[90px] transition-colors duration-700" style={{ background: ind.glow }} />
          <div className="absolute bottom-0 left-1/2 h-10 w-[300px] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />
          {industries.map((d, i) => {
            // circular: there is always a phone on each side of the active one
            const n = industries.length
            const o = ((i - at + n + Math.floor(n / 2)) % n) - Math.floor(n / 2)
            const on = o === 0
            return (
              <button key={d.id} role="tab" aria-selected={on} aria-label={d.label} tabIndex={on ? 0 : -1} onClick={() => pick(i)}
                className="absolute top-0 left-1/2 origin-bottom transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)]"
                style={{
                  transform: `translateX(calc(-50% + ${o * gap}px)) translateZ(${on ? 0 : -160}px) rotateY(${o * -16}deg) scale(${on ? 1 : 0.82})`,
                  zIndex: 10 - Math.abs(o),
                  opacity: Math.abs(o) > 1 ? 0 : on ? 1 : 0.5,
                  filter: on ? 'none' : 'brightness(.55) saturate(.8)',
                  pointerEvents: Math.abs(o) > 1 ? 'none' : 'auto',
                }}>
                <Phone width={gap < 200 ? 220 : 262} finish={d.finish}><d.Screen /></Phone>
              </button>
            )
          })}
          {/* arrows */}
          {([[-1, ChevronLeft, 'Previous industry', 'left-0 sm:left-4'], [1, ChevronRight, 'Next industry', 'right-0 sm:right-4']] as Array<[number, typeof ChevronLeft, string, string]>).map(([dir, Ch, label, pos]) => (
            <button key={label} onClick={() => pick(at + dir)} aria-label={label}
              className={`absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20 ${pos}`}><Ch className="size-5" /></button>
          ))}
        </div>

        {/* industry switcher */}
        <div className="-mx-4 mt-10 flex justify-start gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:justify-center">
          {industries.map((d, i) => (
            <button key={d.id} onClick={() => pick(i)} aria-pressed={i === at}
              className={`relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${i === at ? 'bg-cta text-ink' : 'bg-white/5 text-mist ring-1 ring-white/10 hover:text-white'}`}>
              <d.Icon className="size-4" />{d.label}
              {i === at && auto && !hover && seen && <span key={at} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-ink/30" style={{ animation: 'step-bar 5000ms linear both' }} />}
            </button>
          ))}
        </div>

        {/* what this industry gets */}
        <div key={at} className="mx-auto mt-10 max-w-2xl text-center">
          <h3 className="animate-fade-up text-3xl font-bold sm:text-4xl">{ind.title}</h3>
          <p className="animate-fade-up mt-4 text-lg leading-relaxed text-mist" style={{ animationDelay: '80ms' }}>{ind.body}</p>
          {/* plain feature list: a dot in the industry's colour, thin dividers between */}
          <ul className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
            {ind.points.map((p, k) => (
              <li key={p} className="animate-fade-up flex items-center gap-2.5 text-[15px] font-medium text-white/85 sm:px-5 sm:not-last:border-r sm:not-last:border-white/15" style={{ animationDelay: `${150 + k * 90}ms` }}>
                <span className="size-1.5 rounded-full" style={{ background: ind.glow, boxShadow: `0 0 10px ${ind.glow}` }} />{p}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-sm text-mist">Included on Pro, available as an add-on on Growth.</p>
        </div>
      </div>
    </section>
  )
}

function Teasers() {
  const from = Math.min(...plans.map((p) => p.monthly))
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="shell grid gap-5 md:grid-cols-2">
        <Reveal className="flex flex-col rounded-[32px] bg-card p-8 ring-1 ring-line transition-transform duration-500 hover:-translate-y-1 sm:p-10">
          <p className="eyebrow text-brand">Pricing</p>
          <p className="mt-4 font-display text-5xl font-extrabold">From $<CountUp value={from} /><span className="text-2xl text-body">/month</span></p>
          <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-save"><Percent className="size-5" /> 0% commission on your sales</p>
          <p className="mt-4 leading-relaxed text-body">One flat monthly price. No revenue share, no surprise fees as you grow.</p>
          <div className="mt-auto pt-8"><TextLink to="/pricing">See all plans</TextLink></div>
        </Reveal>
        <Reveal delay={120} className="relative flex flex-col overflow-hidden rounded-[32px] bg-ink p-8 text-white transition-transform duration-500 hover:-translate-y-1 sm:p-10">
          <div className="glow absolute inset-0 opacity-70" />
          <div className="relative flex h-full flex-col">
            <p className="eyebrow text-cta">What’s included</p>
            <p className="mt-4 font-display text-5xl font-extrabold">Everything in. Nothing taken.</p>
            <ul className="mt-6 space-y-2.5 text-white/85">
              {['Custom brand design by our team on Pro', `${ai.name} and 15 automations built in`, '0% commission on every order'].map((t) => (
                <li key={t} className="flex items-center gap-2.5"><span className="size-1.5 rounded-full bg-cta" />{t}</li>
              ))}
            </ul>
            <div className="mt-auto pt-8"><TextLink dark to={compareUrl('appbrew')}>See how we compare with {competitors.appbrew.name}</TextLink></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section className="bg-paper pb-4">
      <div className="shell space-y-14">
        <Lifestyle />
        <LogoStrip />
        <Reveal><Testimonial /></Reveal>
      </div>
    </section>
  )
}

// Real shoppers, on their phones: where your app will live.
function Lifestyle() {
  return (
    <div>
      <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="h-section max-w-xl">Your customers already shop on their phones.</h2>
        <p className="max-w-sm text-lg text-body">Be the app they open, not the tab they close.</p>
      </Reveal>
      <div className="grid gap-4 md:h-[540px] md:grid-cols-[1.1fr_1fr_1fr] md:grid-rows-2">
        <Reveal className="relative h-[460px] overflow-hidden rounded-[28px] md:row-span-2 md:h-auto">
          <img src={photo.shopperPhone} alt="A shopper on her phone, holding shopping bags" loading="lazy" className="absolute inset-0 size-full object-cover object-top" />
          <div className="absolute inset-x-4 bottom-4 z-10 flex animate-float-slow gap-2.5 rounded-[18px] bg-white/90 p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-brand to-brand-2 text-white"><Bell className="size-4" /></span>
            <span className="min-w-0 text-[12px] leading-snug">
              <span className="flex justify-between text-[10px] text-ink/50"><b className="uppercase">Ilvana</b><span>now</span></span>
              <b className="block text-[13px]">Your cart misses you</b>
              <span className="text-ink/60">2 items are still in stock. 10% off, today only.</span>
            </span>
          </div>
        </Reveal>
        <Reveal delay={100} className="relative h-56 overflow-hidden rounded-[28px] md:col-span-2 md:h-auto">
          <img src={photo.bagsHand} alt="Shopping bags" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <span className="absolute top-4 left-4 rounded-full bg-cta px-3 py-1.5 text-xs font-bold text-ink">Order placed in the app</span>
        </Reveal>
        <Reveal delay={180} className="relative h-56 overflow-hidden rounded-[28px] md:h-auto">
          <img src={photo.shopperStreet} alt="A shopper on a call, out with her shopping" loading="lazy" className="absolute inset-0 size-full object-cover object-top" />
        </Reveal>
        <Reveal delay={240} className="flex min-h-56 flex-col justify-between rounded-[28px] bg-ink p-6 text-white md:min-h-0">
          <p className="font-display text-5xl font-extrabold text-cta"><CountUp value={stats[2].value} /></p>
          <p className="text-mist">{stats[2].label}, across stores running a {brand.name} app.</p>
        </Reveal>
      </div>
    </div>
  )
}

export default HomePage
