import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, features, trustPoints } from '@/shared/config/site'
import { DemoButton, SectionHead, StatusPill, CtaBand } from '@/shared/ui'
import { iconFor, Arrow, Check, Bell, Sparkle, Shopify, Cart, Heart, Gift } from '@/shared/icons'
import { FeatureScreen, useLoop } from '@/shared/sections'
import { Phone } from '@/shared/phone'
import { photo } from '@/shared/config/photos'
import { Reveal, Tilt } from '@/shared/motion'
import { HowItWorks } from '@/shared/sections'
import type { FeatureCap } from '@/shared/types/site'

export function FeaturesPage() {
  useEffect(() => { document.title = `Features | ${brand.name}` }, [])
  return (
    <>
      <Hero />
      <HowItWorks id="how-it-works" />
      <Story />
      <Roadmap />
      <CtaBand />
    </>
  )
}

// ---- Hero: watch the app being built from the store ------------------------
// Phases: 0 empty · 1 brand header · 2 banner · 3 products · 4 tab bar ·
// 5 push lands · 6–7 hold, then it starts over.
const sources: [string, number][] = [
  ['Logo & colours', 1],
  ['Banners', 2],
  ['Products & collections', 3],
  ['Navigation', 4],
  ['Push & automations', 5],
]

function Hero() {
  const phase = useLoop(8, 1100)
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="glow absolute inset-0" />
      <div className="grid-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="shell relative grid items-center gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-20">
        <div className="animate-fade-up">
          <p className="eyebrow text-cta">Features</p>
          <h1 className="h-display mt-5">An app that <span className="text-gradient">grows your store</span>, not just shows it.</h1>
          <p className="mt-6 max-w-xl text-lg text-mist sm:text-xl">We build a native app from your Shopify store, designed around your brand, with the automations, analytics and AI copilot that keep shoppers coming back.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <DemoButton />
            <a href="#story" className="btn btn-ghost-dark">Explore features</a>
          </div>
        </div>

        <div className="relative flex items-center justify-center gap-6 lg:justify-end">
          {/* what we pull from the store */}
          <div className="relative hidden w-[210px] shrink-0 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 backdrop-blur sm:block">
            <p className="flex items-center gap-2 text-xs font-semibold text-mist"><Shopify className="size-4 text-[#95BF47]" /> From your Shopify store</p>
            <ul className="mt-3 space-y-1.5">
              {sources.map(([label, at]) => {
                const done = phase >= at
                const now = phase === at
                return (
                  <li key={label} className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-all duration-300 ${now ? 'bg-white/10 text-white' : done ? 'text-white/80' : 'text-mist/50'}`}>
                    <span className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors ${done ? 'bg-cta text-ink' : 'ring-1 ring-white/20'}`}>{done && <Check className="size-2.5" strokeWidth={4} />}</span>
                    {label}
                  </li>
                )
              })}
            </ul>
            {/* data flowing into the phone */}
            <svg className="absolute top-1/2 -right-6 h-2 w-6 overflow-visible" aria-hidden>
              <line x1="0" y1="4" x2="24" y2="4" stroke="#C9F45B" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" className="animate-[dash-flow_0.6s_linear_infinite]" />
            </svg>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -m-10 rounded-full bg-brand/30 blur-[70px]" />
            <div className="animate-phone-in relative"><Tilt max={6}><Phone width={262}><BuildScreen phase={phase} /></Phone></Tilt></div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface BuildScreenProps {
  phase: number
}

// The app screen, assembling itself one piece at a time.
function BuildScreen({ phase }: BuildScreenProps) {
  const accent = '#2B2620'
  const products: [string, string, string][] = [[photo.shirtLinen, 'Linen shirt', '₹3,290'], [photo.shirtBlue, 'Indigo overshirt', '₹4,150'], [photo.sneakers, 'Canvas low', '₹2,890'], [photo.fashionLook, 'Linen dress', '₹4,990']]
  const sk = 'rounded-xl bg-black/[0.06] animate-pulse'
  return (
    <div className="relative h-full overflow-hidden bg-[#F4EFE8] text-ink">
      {phase >= 5 && (
        <div className="animate-notif-in absolute inset-x-2.5 top-11 z-40 flex gap-2.5 rounded-[18px] bg-white/90 p-2.5 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur-xl">
          <span className="grid size-8 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: accent }}><Bell className="size-4" /></span>
          <span className="min-w-0 text-[10px] leading-tight">
            <span className="flex justify-between text-[8.5px] text-ink/45"><b className="uppercase">Linnave</b><span>now</span></span>
            <b className="block text-[10.5px]">Our app is live 🎉</b>
            <span className="text-ink/60">The Linen Edit is here. 15% off in the app.</span>
          </span>
        </div>
      )}

      {/* header */}
      {phase >= 1 ? (
        <div className="animate-fade-up bg-[#2B2620] px-4 pt-11 pb-4 text-[#F4EFE8]">
          <div className="flex items-center justify-between">
            <span className="font-display text-[13px] font-bold tracking-[0.3em]">LINNAVE</span>
            <Cart className="size-4" />
          </div>
          <p className="mt-2 text-[11px] text-white/80">Hi Priya, welcome back</p>
        </div>
      ) : (
        <div className="px-4 pt-11 pb-4"><div className={`h-6 w-24 ${sk}`} /><div className={`mt-2 h-3 w-32 ${sk}`} /></div>
      )}

      {/* banner */}
      <div className="mx-3 mt-3">
        {phase >= 2
          ? <div className="animate-notif-in relative flex h-24 flex-col justify-end overflow-hidden rounded-2xl p-3 text-white"><img src={photo.fashionLook} alt="" className="absolute inset-0 size-full object-cover" style={{ objectPosition: '50% 20%' }} /><span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><b className="relative text-[13px]">The Linen Edit</b><span className="relative text-[10px] text-white/80">15% off, app only</span></div>
          : <div className={`h-24 ${sk}`} />}
      </div>

      {/* products */}
      <p className="mx-4 mt-3 text-[11px] font-bold">{phase >= 3 ? 'New in' : <span className={`inline-block h-3 w-20 ${sk}`} />}</p>
      <div className="mx-3 mt-2 grid grid-cols-2 gap-2">
        {products.map(([img, n, p], k) => phase >= 3 ? (
          <div key={n} className="animate-notif-in rounded-xl bg-white p-1.5 shadow-sm" style={{ animationDelay: `${k * 90}ms` }}>
            <img src={img} alt="" draggable="false" className="h-14 w-full rounded-lg object-cover" />
            <p className="mt-1 text-[9.5px] font-semibold">{n}</p>
            <p className="text-[9px] text-ink/50">{p}</p>
          </div>
        ) : <div key={n} className={`h-[86px] ${sk}`} />)}
      </div>

      {/* tab bar */}
      <div className={`absolute inset-x-0 bottom-0 flex justify-around border-t border-black/5 bg-white/95 px-3 pt-2 pb-6 transition-all duration-500 ${phase >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        {([['Home', Sparkle], ['Shop', Heart], ['Rewards', Gift], ['Cart', Cart]] as const).map(([t, Ic], k) => (
          <span key={t} className="flex flex-col items-center gap-0.5 text-[9px] font-semibold" style={{ color: k === 0 ? accent : '#9AA0B4' }}><Ic className="size-[17px]" />{t}</span>
        ))}
      </div>

      {/* status pill */}
      {phase < 4 && (
        <span className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap text-white shadow-lg">
          <span className="size-1.5 animate-pulse rounded-full bg-cta" /> Building your app…
        </span>
      )}
    </div>
  )
}

// ---- Feature story: a sticky phone, features scrolling past it ------------
// Whichever feature is in the middle of the screen takes over the phone.
function Story() {
  const [at, setAt] = useState(0)
  const blocks = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setAt(Number((e.target as HTMLElement).dataset.i)) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    blocks.current.forEach((b) => b && io.observe(b))
    return () => io.disconnect()
  }, [])

  const f = features[at]

  return (
    <section id="story" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="shell">
        <Reveal><SectionHead eyebrow="All features" title="Everything your app does, one at a time." sub="Scroll through. Every feature is tagged honestly: Live means you can use it today, Beta means it works and is still being polished." /></Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* the sticky phone (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 -m-12 rounded-full bg-brand/15 blur-[70px]" />
                <Phone width={290} finish={(['titanium', 'black', 'blue', 'white'] as const)[at % 4]}>
                  <div key={at} className="animate-stage h-full"><FeatureScreen slug={f.slug} /></div>
                </Phone>
              </div>
              {/* where we are */}
              <div className="mt-7 flex items-center gap-1.5">
                {features.map((x, i) => (
                  <button key={x.slug} onClick={() => blocks.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label={x.name}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === at ? 'w-8 bg-ink' : 'w-1.5 bg-ink/20 hover:bg-ink/40'}`} />
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-body">{String(at + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')} · {f.name}</p>
            </div>
          </div>

          {/* the features */}
          <ol>
            {features.map((x, i) => {
              const Ic = iconFor(x.icon)
              const on = i === at
              const caps = (x.caps ?? x.groups!.flatMap(([, items]) => items)).slice(0, 3)
              return (
                <li key={x.slug} ref={(n) => { blocks.current[i] = n }} data-i={i}
                  className={`flex flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[78vh] lg:py-0 ${on ? 'opacity-100' : 'lg:opacity-30'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`grid size-11 place-items-center rounded-xl transition-colors duration-500 ${on ? 'bg-ink text-cta' : 'bg-card text-brand ring-1 ring-line'}`}><Ic className="size-5" /></span>
                    <span className="font-display text-sm font-bold text-body">{String(i + 1).padStart(2, '0')}</span>
                    <StatusPill status={x.status} />
                  </div>
                  <h3 className="mt-5 text-3xl font-bold sm:text-4xl">{x.name}</h3>
                  <p className="mt-3 max-w-lg text-lg leading-relaxed text-body">{x.hero}</p>
                  <ul className="mt-6 max-w-lg space-y-3">
                    {caps.map((c: FeatureCap) => {
                      const [text] = Array.isArray(c) ? c : [c]
                      return <li key={text} className="flex gap-3 text-[15px]"><Check className="mt-0.5 size-[18px] shrink-0 text-brand" strokeWidth={2.5} /><span className="text-ink/80">{text.replace(/\s*\(.*\)$/, '')}</span></li>
                    })}
                  </ul>
                  <Link to={`/features/${x.slug}`} className="group mt-7 inline-flex w-fit items-center gap-1.5 font-semibold text-brand">
                    Everything in {x.name} <Arrow className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  {/* phones and tablets: the demo sits right here */}
                  <div className="mt-8 flex justify-center lg:hidden">
                    <Phone width={240}><FeatureScreen slug={x.slug} /></Phone>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <ul className="mt-16 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
          {trustPoints.map((t) => (
            <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-ink sm:px-6 sm:not-last:border-r sm:not-last:border-line">
              <span className="size-1.5 rounded-full bg-brand" />{t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ---- Roadmap ---------------------------------------------------------------
function Roadmap() {
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <div className="shell">
        <Reveal><SectionHead dark eyebrow="What’s coming" title="On the roadmap." sub="What we’re building next. Tell us on your demo call which ones matter most to you." /></Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Ic = iconFor(f.icon)
            return (
              <Reveal key={f.slug} delay={(i % 4) * 90}>
                <div className="group h-full rounded-3xl bg-ink-2 p-6 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-white/25">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-white/5 text-cta ring-1 ring-white/10"><Ic className="size-4" /></span>
                    <Link to={`/features/${f.slug}`} className="font-display text-lg leading-tight font-bold hover:text-cta">{f.name}</Link>
                  </div>
                  <ul className="mt-5 space-y-2.5 text-sm text-mist">
                    {f.next.map((n) => <li key={n} className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand" />{n}</li>)}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
