import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, competitors, compareUrl } from '@/shared/config/site'
import { CtaBand } from '@/shared/ui'
import { Arrow, Check, Shield, Scale } from '@/shared/icons'
import { Logo } from '@/shared/layout'
import { Reveal, CountUp } from '@/shared/motion'
import { useLoop } from '@/shared/sections'
import { useSeo } from '@/shared/seo'
import { scoreFor } from '@/features/compare/scoring'

export function CompareHubPage() {
  useSeo({ title: 'Compare', description: `See how ${brand.name} compares to AppBrew, Shopney and other Shopify app builders — features and pricing, side by side.` })
  const keys = Object.keys(competitors)
  const [pick, setPick] = useState(keys[0])
  const c = competitors[pick]
  const score = scoreFor(pick)

  return (
    <>
      <Hero names={keys.map((k) => competitors[k].name)} />

      {/* pick what you use today */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="shell">
          <Reveal className="text-center">
            <p className="eyebrow text-brand">Start here</p>
            <h2 className="h-section mt-3">What are you using today?</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Your current app">
            {keys.map((k) => (
              <button key={k} role="tab" aria-selected={pick === k} onClick={() => setPick(k)}
                className={`rounded-2xl px-6 py-3.5 font-display text-lg font-bold transition-all ${pick === k ? 'bg-ink text-white shadow-lg' : 'bg-card text-body ring-1 ring-line hover:text-ink'}`}>
                {competitors[k].name}
              </button>
            ))}
          </div>

          <div key={pick} className="animate-stage mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            {/* the score */}
            <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-8">
              <div className="glow absolute inset-0 opacity-70" />
              <div className="relative">
                <p className="text-sm text-mist">{brand.name} vs {c.name}</p>
                <p className="mt-2 font-display text-2xl leading-snug font-bold">{c.line}</p>
                <div className="mt-7 space-y-3">
                  {([[score.lead.length, `${brand.name} leads`, 'bg-cta'], [score.tie.length, 'Level', 'bg-white/60'], [score.behind.length, `${c.name} leads`, 'bg-white/25']] as [number, string, string][]).map(([n, l, bar]) => {
                    const total = score.lead.length + score.tie.length + score.behind.length
                    return (
                      <div key={l}>
                        <div className="flex justify-between text-sm"><span className="text-mist">{l}</span><b><CountUp value={n} duration={900} /></b></div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${bar}`} style={{ width: `${(n / total) * 100}%`, animation: 'grow-w .9s cubic-bezier(.2,.7,.2,1) both' }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* the biggest differences */}
            <div className="flex flex-col rounded-[28px] bg-card p-7 ring-1 ring-line sm:p-8">
              <p className="eyebrow text-brand">Biggest differences</p>
              <ul className="mt-5 space-y-3">
                {score.lead.slice(0, 3).map((t, i) => (
                  <li key={t} className="animate-fade-up flex gap-3" style={{ animationDelay: `${i * 90}ms` }}>
                    <Check className="mt-0.5 size-[18px] shrink-0 text-brand" strokeWidth={2.5} />
                    <span><b className="text-ink">{brand.name}:</b> <span className="text-body">{t}</span></span>
                  </li>
                ))}
                {score.behind.slice(0, 1).map((t) => (
                  <li key={t} className="animate-fade-up flex gap-3" style={{ animationDelay: '300ms' }}>
                    <Scale className="mt-0.5 size-[18px] shrink-0 text-body" />
                    <span><b className="text-ink">{c.name}:</b> <span className="text-body">{t}</span></span>
                  </li>
                ))}
              </ul>
              <Link to={compareUrl(pick)} className="btn btn-cta mt-auto self-start !mt-8">See the full comparison <Arrow className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* how we compare */}
      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-cta">How we compare</p>
            <h2 className="h-section mt-3">Fair, or it’s not worth reading.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {([
              [Scale, 'Public information only', 'Every row comes from the other app’s public site and pricing page, with the date we checked.'],
              [Shield, 'Where they lead, too', 'Each guide has a “Being fair” section and counts the rows where the other app is ahead.'],
              [Check, 'Beta is marked as beta', 'If one of our features isn’t fully live, it shows as partial, never as a full tick.'],
            ] as [React.ComponentType<{ className?: string }>, string, string][]).map(([Ic, t, b], i) => (
              <Reveal key={t} delay={i * 110} className="rounded-3xl bg-ink-2 p-6 ring-1 ring-white/10">
                <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-cta ring-1 ring-white/10"><Ic className="size-5" /></span>
                <p className="mt-5 font-display text-xl font-bold">{t}</p>
                <p className="mt-2 leading-relaxed text-mist">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

// Hero: our logo against a rotating line-up of the apps people compare us with.
function Hero({ names }: { names: string[] }) {
  const i = useLoop(names.length, 2000)
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="glow absolute inset-0" />
      <div className="grid-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="shell relative py-16 text-center lg:py-24">
        <p className="eyebrow text-cta">Compare</p>
        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6">
          <span className="animate-[slide-l_.8s_cubic-bezier(.2,.7,.2,1)_both] rounded-2xl bg-white/5 px-5 py-3 ring-1 ring-white/15"><Logo /></span>
          <span className="animate-[vs-pop_.6s_.5s_cubic-bezier(.3,1.6,.5,1)_both] grid size-12 place-items-center rounded-full bg-cta font-display text-sm font-extrabold text-ink shadow-[0_0_40px_rgba(201,244,91,0.5)]">vs</span>
          <span className="relative inline-grid h-[52px] min-w-[150px] overflow-hidden rounded-2xl bg-white/5 px-5 ring-1 ring-white/15">
            <span key={i} className="animate-[word-in_.6s_cubic-bezier(.2,.7,.2,1)_both] self-center font-display text-xl font-extrabold text-white/80">{names[i]}</span>
          </span>
        </div>
        <h1 className="h-display mx-auto mt-10 max-w-3xl">How {brand.name} compares.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-mist">Honest, side-by-side comparisons, including where the other app is a fine choice.</p>
      </div>
    </section>
  )
}
