// One template for every /features/<slug> page:
// hero with the feature running in a phone → what it does (+ how, as steps)
// → capabilities as numbered tiles → (automations: the journey) → what's
// next on a timeline → up next.
import { Link, Navigate, useParams } from 'react-router-dom'
import { features } from '@/shared/config/site'
import { useSeo } from '@/shared/seo'
import { DemoButton, SectionHead, StatusPill, CtaBand } from '@/shared/ui'
import { iconFor, Arrow } from '@/shared/icons'
import { Phone } from '@/shared/phone'
import { Reveal, Tilt, spotlight } from '@/shared/motion'
import { FeatureScreen, featureColor } from '@/shared/sections'
import { RetentionTimeline } from '@/shared/sections'
import type { FeatureCap } from '@/shared/types/site'

export function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const i = features.findIndex((x) => x.slug === slug)
  const f = features[i]
  useSeo({ title: f?.name ?? 'Features', description: f?.sub ?? 'Features that turn your Shopify store into a branded iOS and Android app.' })
  if (!f) return <Navigate to="/features" replace />

  const Ic = iconFor(f.icon)
  const c = featureColor[f.slug] ?? '#7B61FF'
  // title is null for the ungrouped fallback; items may carry per-item status
  const groups: [string | null, FeatureCap[]][] = f.groups ?? [[null, f.caps!]]
  const next = features[(i + 1) % features.length]
  const others = features.filter((x) => x.slug !== f.slug && x.slug !== next.slug)
  // "Install → connect → we build…" reads best as steps
  const steps = f.how?.includes('→') ? f.how.split('.')[0].split('→').map((x) => x.trim()) : null
  const howRest = steps ? f.how!.split('.').slice(1).join('.').trim() : f.how

  return (
    <>
      {/* Hero: the feature, running */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0" style={{ background: `radial-gradient(45% 55% at 78% 45%, ${c}40, transparent 70%), radial-gradient(35% 40% at 10% 90%, rgba(76,141,255,0.18), transparent 70%)` }} />
        <div className="grid-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="shell relative grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="animate-fade-up">
            <nav className="flex items-center gap-2 text-sm text-mist" aria-label="Breadcrumb">
              <Link to="/features" className="hover:text-white">Features</Link><span>/</span><span className="text-white">{f.name}</span>
            </nav>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl text-ink" style={{ background: c }}><Ic className="size-5" /></span>
              <StatusPill status={f.status} dark />
            </div>
            <h1 className="mt-6 font-display text-[2.5rem] leading-[1.03] font-extrabold tracking-[-0.03em] sm:text-6xl">{f.hero}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">{f.sub}</p>
            <div className="mt-9 flex gap-2.5 sm:gap-3 [&>*]:min-w-0 [&>*]:flex-1 sm:[&>*]:flex-none">
              <DemoButton />
              <Link to="/features" className="btn btn-ghost-dark">All features</Link>
            </div>
          </div>
          <div className="relative mx-auto">
            <div className="absolute inset-0 -m-14 rounded-full opacity-50 blur-[80px]" style={{ background: c }} />
            {[420, 540].map((s) => <div key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" style={{ width: s, height: s }} />)}
            <div className="animate-phone-in relative"><Tilt max={7}><Phone width={270}><FeatureScreen slug={f.slug} /></Phone></Tilt></div>
          </div>
        </div>
      </section>

      {/* What it does, and how */}
      {(f.what || f.how) && (
        <section className="bg-paper py-20 sm:py-28">
          <div className="shell">
            {f.what && (
              <Reveal className="max-w-4xl">
                <p className="eyebrow text-brand">What it does</p>
                <p className="mt-5 font-display text-3xl leading-[1.2] font-bold tracking-tight sm:text-[2.6rem]">{f.what}</p>
              </Reveal>
            )}
            {steps && (
              <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {steps.map((s, k) => (
                  <Reveal as="li" key={s} delay={k * 110} className="relative rounded-2xl bg-card p-5 ring-1 ring-line">
                    <span className="font-display text-sm font-bold" style={{ color: k === steps.length - 1 ? '#1F9D55' : '#7B61FF' }}>Step {k + 1}</span>
                    <p className="mt-2 font-display text-lg font-bold first-letter:uppercase">{s}</p>
                    {k < steps.length - 1 && <Arrow className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-paper text-body lg:block" />}
                  </Reveal>
                ))}
              </ol>
            )}
            {howRest && (
              <Reveal delay={150} className="mt-8 flex max-w-4xl gap-4 rounded-3xl bg-ink p-6 text-white sm:p-7">
                <span className="mt-2 size-2.5 shrink-0 rounded-full" style={{ background: c, boxShadow: `0 0 14px ${c}` }} />
                <div>
                  <p className="eyebrow text-mist">How it works</p>
                  <p className="mt-2 text-lg leading-relaxed">{howRest}</p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Capabilities as numbered tiles */}
      <section className={`bg-paper pb-20 sm:pb-28 ${f.what || f.how ? '' : 'pt-20 sm:pt-28'}`}>
        <div className="shell">
          <Reveal><SectionHead eyebrow="Key capabilities" title="What’s inside." /></Reveal>
          {(() => {
            let n = 0
            return groups.map(([title, items]) => (
              <div key={title ?? 'all'} className="mt-10">
                {title && <p className="mb-4 text-sm font-bold tracking-[0.14em] text-body uppercase">{title}</p>}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((it: FeatureCap) => {
                    const [text, status] = Array.isArray(it) ? it : [it]
                    n += 1
                    return (
                      <Reveal key={text} delay={(n % 3) * 90}>
                        <div onMouseMove={spotlight} className="spot group flex h-full flex-col rounded-3xl bg-card p-6 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(8,12,28,0.35)] [--spot:rgba(123,97,255,0.08)]">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-3xl font-extrabold text-ink/15 transition-colors group-hover:text-brand">{String(n).padStart(2, '0')}</span>
                            {status && <StatusPill status={status} />}
                          </div>
                          <p className={`mt-4 leading-relaxed ${status === 'soon' ? 'text-body' : 'text-ink'}`}>{text}</p>
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            ))
          })()}
        </div>
      </section>

      {f.slug === 'automations' && (
        <section className="overflow-hidden bg-ink py-20 text-white sm:py-28">
          <div className="shell">
            <SectionHead dark eyebrow="See it run" title="One customer, five automatic messages." sub="Watch her first 90 days, and what lands on her phone at each step." className="mb-12" />
          </div>
          <RetentionTimeline />
        </section>
      )}

      {/* What's next, on a timeline */}
      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="shell">
          <Reveal className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-cta">What you can add next</p>
            <StatusPill status="soon" dark />
          </Reveal>
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <div className="absolute top-[7px] right-0 left-0 hidden border-t border-dashed border-white/20 lg:block" aria-hidden />
            {f.next.map((n, k) => (
              <Reveal as="li" key={n} delay={k * 120} className="relative">
                <span className="relative block size-3.5 rounded-full ring-4 ring-ink" style={{ background: c }} />
                <p className="mt-4 text-xs font-bold tracking-[0.14em] text-mist uppercase">Planned</p>
                <p className="mt-1 font-display text-xl font-bold">{n}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Up next */}
      <section className="bg-paper pt-20 pb-4 sm:pt-24">
        <div className="shell">
          <Link to={`/features/${next.slug}`} className="group relative block overflow-hidden rounded-[32px] bg-ink p-8 text-white sm:p-10">
            <div className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(60% 90% at 90% 50%, ${featureColor[next.slug] ?? c}45, transparent 70%)` }} />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow text-mist">Up next</p>
                <p className="mt-3 font-display text-3xl font-bold sm:text-4xl">{next.name}</p>
                <p className="mt-2 max-w-lg text-mist">{next.short}</p>
              </div>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-cta text-ink transition-transform duration-300 group-hover:translate-x-1.5"><Arrow className="size-6" /></span>
            </div>
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {others.map((o) => {
              const OIc = iconFor(o.icon)
              return (
                <Link key={o.slug} to={`/features/${o.slug}`} className="inline-flex items-center gap-2 rounded-full bg-card py-2 pr-4 pl-2 text-sm font-semibold ring-1 ring-line transition hover:ring-brand/40">
                  <span className="grid size-7 place-items-center rounded-full text-ink" style={{ background: `${featureColor[o.slug]}55` }}><OIc className="size-3.5" /></span>{o.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
