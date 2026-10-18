// One template for every /compare/<us>-vs-<competitor> page. Only two
// columns render: us and the one competitor in the URL.
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { brand, ai, competitors, compareRows, compareColumns, plans } from '@/shared/config/site'
import { DemoButton, SectionHead, CtaBand, LogoStrip, StatusPill } from '@/shared/ui'
import { Logo } from '@/shared/layout'
import { Check, Cross, Plug, Brush, Rocket, Sparkle } from '@/shared/icons'
import { Reveal, CountUp } from '@/shared/motion'
import { useSeo } from '@/shared/seo'
import { scoreFor } from './scoring'
import type { CompareCell, CompareGroup, Competitor } from '@/shared/types/site'

export function ComparePage() {
  const { slug = '' } = useParams()
  const key = slug.split('-vs-').find((p) => competitors[p])
  const c = key ? competitors[key] : undefined
  const us = brand.name
  const [diffOnly, setDiffOnly] = useState(false)
  useSeo({ title: c ? `${us} vs ${c.name}` : 'Compare', brandSuffix: false, description: c ? `${us} vs ${c.name}, feature by feature — how they compare on price, native app features and commission for Shopify brands.` : 'Compare Shopify app builders side by side.' })
  if (!c) return <Navigate to="/compare" replace />

  const col = compareColumns.indexOf(key as string) + 2
  const score = scoreFor(key as string)
  // a row is a difference when the two marks (or notes) aren't the same
  const differs = (r: CompareGroup['rows'][number]) => JSON.stringify(r[1]) !== JSON.stringify(r[col])
  const rows = compareRows.map((g) => ({ ...g, rows: g.rows.filter((r) => !diffOnly || differs(r)) })).filter((g) => g.rows.length)

  return (
    <>
      {/* 1. Hero: the matchup, and an honest score */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="glow absolute inset-0" />
        <div className="grid-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="shell relative py-16 text-center lg:py-20">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <span className="animate-[slide-l_.8s_cubic-bezier(.2,.7,.2,1)_both] rounded-2xl bg-white/5 px-5 py-3 ring-1 ring-white/15"><Logo /></span>
            <span className="animate-[vs-pop_.6s_.5s_cubic-bezier(.3,1.6,.5,1)_both] grid size-12 place-items-center rounded-full bg-cta font-display text-sm font-extrabold text-ink shadow-[0_0_40px_rgba(201,244,91,0.5)]">vs</span>
            <span className="animate-[slide-r_.8s_cubic-bezier(.2,.7,.2,1)_both] rounded-2xl bg-white/5 px-5 py-3 font-display text-xl font-extrabold text-white/80 ring-1 ring-white/15">{c.name}</span>
          </div>
          <h1 className="h-display mx-auto mt-10 max-w-4xl">{us} vs {c.name}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">{c.line}</p>

          {/* scoreboard */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-2 rounded-3xl bg-white/[0.04] p-2 ring-1 ring-white/10">
            {([[score.lead.length, `Where ${us} leads`, 'text-cta'], [score.tie.length, 'Level', 'text-white'], [score.behind.length, `Where ${c.name} leads`, 'text-white/70']] as [number, string, string][]).map(([n, l, tone]) => (
              <div key={l} className="rounded-2xl bg-white/[0.04] px-3 py-4">
                <p className={`font-display text-4xl font-extrabold ${tone}`}><CountUp value={n} duration={1200} /></p>
                <p className="mt-1 text-xs text-mist sm:text-sm">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-mist/70">Counted from the table below. We show where they lead too.</p>
          <div className="mt-9 flex justify-center"><DemoButton /></div>
        </div>
      </section>

      {/* 2. At-a-glance verdict */}
      <section className="bg-paper pt-14 sm:pt-20">
        <div className="shell text-center">
          <p className="eyebrow text-brand">Why teams choose {us}</p>
          <ul className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
            {c.pills.map((p) => (
              <li key={p} className="flex items-center gap-2.5 font-semibold text-ink sm:px-5 sm:not-last:border-r sm:not-last:border-line">
                <span className="size-1.5 rounded-full bg-brand" />{p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. The comparison table */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="shell">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHead eyebrow="Side by side" title={`${us} vs ${c.name}, feature by feature.`} />
            <div className="flex flex-col items-start gap-4 md:items-end">
              <button type="button" role="switch" aria-checked={diffOnly} onClick={() => setDiffOnly(!diffOnly)} className="flex items-center gap-3 text-sm font-semibold text-ink">
                <span className={`relative h-6 w-11 rounded-full transition-colors ${diffOnly ? 'bg-brand' : 'bg-line'}`}><span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${diffOnly ? 'translate-x-5' : ''}`} /></span>
                Show only differences
              </button>
              <Legend />
            </div>
          </div>

          {/* desktop / tablet */}
          <table className="hidden w-full border-separate border-spacing-0 rounded-[24px] bg-card text-left ring-1 ring-line sm:table">
            <thead className="sticky top-16 z-10">
              <tr>
                <th className="w-[44%] rounded-tl-[24px] bg-card px-6 py-5 text-sm font-semibold text-body">Capability</th>
                <th className="w-[28%] bg-ink px-4 py-5 text-center text-white"><span className="inline-flex items-center gap-2 font-display text-lg font-bold"><span className="size-2.5 rounded-full bg-cta" />{us}</span></th>
                <th className="rounded-tr-[24px] bg-card px-4 py-5 text-center font-display text-lg font-bold text-body">{c.name}</th>
              </tr>
            </thead>
            {rows.map((g) => (
              <tbody key={g.group}>
                <tr><td colSpan={3} className="border-t border-line bg-paper/70 px-6 py-2.5 text-xs font-bold tracking-[0.14em] text-body uppercase">{g.group}</td></tr>
                {g.rows.map((r) => (
                  <tr key={r[0]} className="animate-fade-up">
                    <td className="border-t border-line px-6 py-4 text-[15px]">{r[0]}</td>
                    <td className="border-t border-brand/10 bg-brand/5 px-4 py-4 text-center"><Mark v={r[1] as CompareCell} ours /></td>
                    <td className="border-t border-line px-4 py-4 text-center"><Mark v={r[col] as CompareCell} /></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>

          {/* phone: one card per row */}
          <div className="space-y-6 sm:hidden">
            {rows.map((g) => (
              <div key={g.group}>
                <p className="mb-2 text-xs font-bold tracking-[0.14em] text-body uppercase">{g.group}</p>
                <div className="space-y-2">
                  {g.rows.map((r) => (
                    <div key={r[0]} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                      <p className="font-semibold">{r[0]}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-xl bg-brand/5 p-3 ring-1 ring-brand/15"><p className="mb-2 text-xs font-bold text-brand">{us}</p><Mark v={r[1] as CompareCell} ours /></div>
                        <div className="rounded-xl bg-paper p-3"><p className="mb-2 text-xs font-bold text-body">{c.name}</p><Mark v={r[col] as CompareCell} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-body">
            Comparison based on publicly available information{c.checked ? ` as of ${c.checked}` : ''}. Our Beta features are marked as partial. Trademarks belong to their owners.
          </p>
        </div>
      </section>

      {/* 4. Deep-dive strips */}
      <section className="bg-ink py-20 text-white sm:py-28">
        <div className="shell space-y-16 sm:space-y-24">
          {c.strips.map((s, i) => (
            <Reveal key={s.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? 'lg:order-2' : ''}>
                <p className="eyebrow text-cta">0{i + 1}</p>
                <h2 className="mt-4 text-3xl leading-tight font-bold sm:text-4xl">{s.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-mist">{s.body}</p>
              </div>
              <Visual kind={s.visual} c={c} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Where they're a fine choice + 7. pricing angle */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="shell grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-[28px] bg-card p-7 ring-1 ring-line sm:p-9">
            <p className="eyebrow text-brand">Being fair</p>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Where {c.name} is a fine choice</h2>
            <p className="mt-4 leading-relaxed text-body">{c.fair}</p>
            <p className="mt-4 font-semibold leading-relaxed text-ink">{c.counter}</p>
          </Reveal>
          <Reveal delay={120} className="rounded-[28px] bg-card p-7 ring-1 ring-line sm:p-9">
            <p className="eyebrow text-brand">Pricing</p>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">How the pricing differs</h2>
            <p className="mt-4 leading-relaxed text-body">{c.pricing}</p>
            {c.priceCheckedOn && <p className="mt-4 text-xs text-body">{c.name} prices from their public pricing page, checked {c.priceCheckedOn}.</p>}
          </Reveal>
        </div>
      </section>

      {/* 6. Switching */}
      <section className="bg-paper pb-20 sm:pb-28">
        <div className="shell">
          <SectionHead eyebrow="Switching" title={`Switching from ${c.name}? We’ll bring your catalogue across.`} sub="Your products, collections and customers live in Shopify, so they come with you. Your current app keeps running until the new one is live." />
          <ol className="relative mt-12 grid gap-4 md:grid-cols-3">
            <div className="absolute top-[52px] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-brand via-brand-2 to-cta md:block" aria-hidden />
            {([
              [Plug, 'Connect', 'Install from the Shopify App Store. Your catalogue and branding sync automatically.'],
              [Brush, 'We rebuild it', `We learn your brand, then ${ai.name} and our team design and build your new app. You review and approve.`],
              [Rocket, 'Go live', 'We handle App Store and Google Play. Automations and analytics switch on from day one.'],
            ] as [React.ComponentType<{ className?: string }>, string, string][]).map(([Ic, t, d], i) => (
              <Reveal as="li" key={t} delay={i * 120} className="relative rounded-[28px] bg-card p-7 ring-1 ring-line">
                <span className="relative grid size-10 place-items-center rounded-full bg-ink font-display font-bold text-cta">{i + 1}</span>
                <h3 className="mt-5 flex items-center gap-2 text-xl font-bold"><Ic className="size-5 text-brand" /> {t}</h3>
                <p className="mt-2 leading-relaxed text-body">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Social proof + final CTA */}
      <section className="bg-paper"><div className="shell"><LogoStrip /></div></section>
      <CtaBand />
    </>
  )
}

// ✓ full · ◐ partial / beta · ✕ none, with an optional note underneath.
function Mark({ v: [mark, note], ours = false }: { v: CompareCell; ours?: boolean }) {
  const icon = {
    yes: <span className={ours ? 'text-brand' : 'text-ink/70'}><Check className="size-5" strokeWidth={2.5} /><span className="sr-only">Yes</span></span>,
    part: <span className={`inline-block size-4 rounded-full border-2 ${ours ? 'border-brand bg-[linear-gradient(90deg,var(--color-brand)_50%,transparent_50%)]' : 'border-ink/40 bg-[linear-gradient(90deg,rgba(8,12,28,.4)_50%,transparent_50%)]'}`}><span className="sr-only">Partial</span></span>,
    no: <span><span className="font-semibold text-ink/25" aria-hidden>—</span><span className="sr-only">No</span></span>,
  }[mark as string]
  return (
    <span className="inline-flex flex-col items-center gap-1.5">
      {icon}
      {note && <span className={`text-[13px] leading-snug ${ours ? 'font-semibold text-ink' : 'text-body'}`}>{note}</span>}
    </span>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-4 text-sm text-body">
      <li className="flex items-center gap-2"><Mark v={['yes']} /> Full</li>
      <li className="flex items-center gap-2"><Mark v={['part']} /> Partial / beta</li>
      <li className="flex items-center gap-2"><Mark v={['no']} /> Not offered</li>
    </ul>
  )
}

// Small illustrations for the deep-dive strips.
function Visual({ kind, c }: { kind: string; c: Competitor }) {
  const box = 'rounded-[28px] bg-ink-2 p-7 ring-1 ring-white/10 sm:p-9'
  if (kind === 'price') {
    return (
      <div className={box}>
        <p className="text-sm text-mist">{brand.name} plans, published up front</p>
        <ul className="mt-5 divide-y divide-white/10">
          {plans.map((p) => (
            <li key={p.id} className="flex items-baseline justify-between py-3.5">
              <span className="font-semibold">{p.name}{p.popular && <span className="ml-2 rounded-full bg-cta px-2 py-0.5 align-middle text-[11px] font-bold text-ink">Most popular</span>}</span>
              <span className="font-display text-2xl font-bold">${p.monthly}<span className="text-sm font-normal text-mist">/mo</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-mist">0% commission on every plan. No enterprise contract to start.</p>
      </div>
    )
  }
  if (kind === 'journeys') {
    const list = ['Abandoned-cart recovery', 'Order & delivery updates', 'Post-purchase picks', 'Replenishment reminders', '3-stage win-back ladder', 'Category cross-sell', 'Re-engage inactive', 'New-product broadcasts']
    return (
      <div className={box}>
        <p className="text-sm text-mist">Running every day, on their own</p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {list.map((j) => <li key={j} className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3.5 py-2.5 text-sm font-semibold"><span className="size-2 rounded-full bg-cta" />{j}</li>)}
        </ul>
      </div>
    )
  }
  if (kind === 'india') {
    return (
      <div className={box}>
        <div className="flex items-center justify-between"><p className="text-sm text-mist">Checkout options</p><StatusPill status="beta" dark /></div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {['COD', 'UPI', 'GoKwik', 'Razorpay', 'Shopify checkout'].map((x) => <span key={x} className="rounded-xl bg-white/10 px-4 py-2.5 font-display font-bold">{x}</span>)}
        </div>
        <p className="mt-8 text-sm text-mist">Order quality view (example)</p>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full"><div className="w-[58%] bg-cta" /><div className="w-[42%] bg-brand" /></div>
        <div className="mt-2 flex justify-between text-xs text-mist"><span>Prepaid</span><span>COD</span></div>
      </div>
    )
  }
  if (kind === 'analytics') {
    const bars = [100, 46, 38, 33, 30, 28]
    return (
      <div className={box}>
        <p className="text-sm text-mist">Retention cohort (example)</p>
        <div className="mt-6 flex h-40 items-end gap-3">
          {bars.map((b, i) => <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand to-brand-2" style={{ height: `${b}%` }} />)}
        </div>
        <div className="mt-2 flex justify-between text-xs text-mist"><span>Month 0</span><span>Month 5</span></div>
      </div>
    )
  }
  // 'ai'
  return (
    <div className={box}>
      <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm text-mist"><Sparkle className="size-4 text-cta" /> {ai.name}</p><StatusPill status="beta" dark /></div>
      <p className="mt-5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-3 text-sm">Write a win-back push for shoppers who haven’t ordered in 60 days.</p>
      <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-3 text-sm leading-relaxed">
        <p className="font-semibold">We’ve missed you, {'{name}'}</p>
        <p className="text-mist">Your favourites have company. See what’s new since your last order.</p>
        <p className="mt-2 text-xs text-cta">Draft, ready for you to approve</p>
      </div>
    </div>
  )
}
