import { useState } from 'react'
import { brand, plans, planMatrix, yearlyDiscount, competitors, compareUrl } from '@/shared/config/site'
import { DemoButton, SectionHead, Faq, CtaBand, Cell, SaveBadge, TextLink, TrustRow } from '@/shared/ui'
import { Check, Percent } from '@/shared/icons'
import type { Plan, MatrixGroup, MatrixCell } from '@/shared/types/site'

const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

const faqs: [string, string][] = [
  ['Is there a free trial?', 'Yes. Both plans come with a free trial, and we build a preview of your own store as an app before you pay anything.'],
  ['Do you take a cut of my sales?', 'No. You pay one flat monthly price. We take 0% commission on orders made in your app, however much you sell.'],
  ['Can I cancel any time?', 'Yes. Monthly plans can be cancelled at any time. Yearly plans run to the end of the year you paid for.'],
  ['Who pays the App Store and Google Play fees?', 'Apple charges $99 a year and Google a one-time $25 for a developer account. These are paid to them directly, and we set the accounts up for you.'],
  ['Can you build a feature just for my brand?', 'Yes. Industry features like a step tracker or shade finder are included on Pro and available as add-ons on Growth. For anything beyond that, talk to us.'],
]

export function PricingPage() {
  const [yearly, setYearly] = useState(true)
  const price = (m: number) => (yearly ? m * (1 - yearlyDiscount) : m)
  const ab = competitors.appbrew

  return (
    <>
      <section className="relative overflow-hidden bg-ink pt-16 pb-40 text-center text-white sm:pt-20">
        <div className="glow absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow text-cta">Pricing</p>
          <h1 className="h-display mx-auto mt-5 max-w-3xl">Simple pricing. <span className="text-gradient">0% commission.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-mist">One flat price for your iOS and Android apps. Keep every rupee and dollar your customers spend.</p>

          <div className="mt-10 inline-flex items-center gap-1 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10" role="radiogroup" aria-label="Billing period">
            {([[false, 'Monthly'], [true, 'Yearly']] as [boolean, string][]).map(([v, l]) => (
              <button key={l} role="radio" aria-checked={yearly === v} onClick={() => setYearly(v)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${yearly === v ? 'bg-white text-ink' : 'text-mist hover:text-white'}`}>
                {l}{v && <span className="rounded-full bg-cta px-2 py-0.5 text-[11px] font-bold text-ink">Save {Math.round(yearlyDiscount * 100)}%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper pb-20">
        <div className="shell -mt-28 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* the card always shows the list price ($299 / $599); yearly savings go underneath */}
          {plans.map((p) => <PlanCard key={p.id} plan={p} price={p.monthly} yearlyTotal={yearly ? price(p.monthly) * 12 : null} />)}
        </div>

        <div className="shell mt-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-save px-7 py-6 text-white sm:flex-row">
            <p className="flex items-center gap-3 font-display text-xl font-bold sm:text-2xl"><Percent className="size-7" /> 0% commission on your sales. On every plan.</p>
            <p className="text-sm text-white/85">No revenue share, no transaction fees, no surprises.</p>
          </div>
        </div>
      </section>

      <section className="bg-paper pb-20 sm:pb-28">
        <div className="shell">
          <SectionHead eyebrow="Compare plans" title="Everything in each plan." className="mb-10" />
          <Matrix />
        </div>
      </section>

      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead dark eyebrow={`Comparing with ${ab.name}?`} title="Pay for your app, not a cut of your sales." />
            <TextLink dark to={compareUrl('appbrew')}>Full {ab.name} comparison</TextLink>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {([
              ['A published price', 'Both plans are on this page. No sales call needed to find out what you’ll pay, and no enterprise contract to start.'],
              ['Designed around your brand', 'On Pro, our team designs your app from your brand brief. Not a template you have to fill in yourself.'],
              ['0% commission, always', 'However much your app sells, we take nothing from your orders. One flat monthly price.'],
            ] as [string, string][]).map(([t, b]) => (
              <div key={t} className="rounded-3xl bg-ink-2 p-6 ring-1 ring-white/10">
                <p className="font-display text-xl font-bold">{t}</p>
                <p className="mt-2 leading-relaxed text-mist">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-mist">{ab.name} lists Starter at ${ab.plans![0].them}/mo and Pro at ${ab.plans![1].them}/mo on their public pricing page, checked {ab.verifiedOn}.</p>
        </div>
      </section>

      <section className="bg-paper pt-20 sm:pt-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHead eyebrow="FAQ" title="Pricing questions." />
            <div className="mt-8 rounded-3xl bg-ink p-7 text-white">
              <p className="font-display text-2xl font-bold">Need something custom?</p>
              <p className="mt-2 text-mist">Features built only for your brand, beyond what’s in Pro. Tell us what you need.</p>
              <a href={`mailto:${brand.salesEmail}`} className="btn btn-ghost-dark mt-6">Talk to sales</a>
            </div>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}

interface PlanCardProps {
  plan: Plan
  price: number
  yearlyTotal: number | null
}

function PlanCard({ plan: p, price, yearlyTotal }: PlanCardProps) {
  const hot = p.popular
  const isSales = p.cta === 'Talk to sales'
  return (
    <div className={`relative flex flex-col rounded-[28px] p-7 sm:p-8 ${hot ? 'bg-ink text-white shadow-[0_30px_60px_-20px_rgba(123,97,255,0.5)] ring-2 ring-brand lg:-mt-4 lg:mb-4' : 'bg-card ring-1 ring-line'}`}>
      {hot && <span className="absolute -top-3.5 left-7 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3.5 py-1 text-xs font-bold text-white">Most popular</span>}
      <p className="font-display text-2xl font-bold">{p.name}</p>
      {p.note && <p className="mt-1 text-sm font-semibold text-cta">{p.note}</p>}
      <p className={`mt-2 text-sm leading-relaxed ${hot ? 'text-mist' : 'text-body'}`}>{p.blurb}</p>
      <p className="mt-7 font-display text-5xl font-extrabold">{fmt(price)}<span className={`text-lg font-semibold ${hot ? 'text-mist' : 'text-body'}`}>/mo</span></p>
      <p className={`mt-1 h-5 text-sm ${hot ? 'text-mist' : 'text-body'}`}>{yearlyTotal ? `${fmt(yearlyTotal)} billed yearly · save ${fmt(price * 12 - yearlyTotal)}` : 'Billed monthly'}</p>
      <p className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold ${hot ? 'bg-cta text-ink' : 'bg-save/10 text-save'}`}><Percent className="size-3.5" /> 0% commission</p>
      <ul className="mt-7 space-y-3 text-[15px]">
        {p.features.map((f) => (
          <li key={f} className="flex gap-3"><Check className={`mt-0.5 size-5 shrink-0 ${hot ? 'text-cta' : 'text-brand'}`} strokeWidth={2.5} />{f}</li>
        ))}
      </ul>
      <div className="mt-auto pt-9">
        {isSales ? (
          <a href={`mailto:${brand.salesEmail}`} className="btn btn-ghost w-full">Talk to sales</a>
        ) : (
          <DemoButton className="w-full">{p.cta}</DemoButton>
        )}
      </div>
    </div>
  )
}

function Matrix() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 max-md:[contain:paint] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:px-0">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 rounded-[24px] bg-card text-left ring-1 ring-line">
        <thead className="z-10 md:sticky md:top-16">
          <tr>
            <th className="w-[40%] rounded-tl-[24px] bg-card px-6 py-5 text-sm font-semibold text-body">Feature</th>
            {plans.map((p) => (
              <th key={p.id} className={`px-4 py-5 text-center font-display text-lg font-bold last:rounded-tr-[24px] ${p.popular ? 'bg-[#EDEAFF] text-brand' : 'bg-card'}`}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planMatrix.map((g) => (
            <MatrixGroup key={g.group} g={g} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface MatrixGroupProps {
  g: MatrixGroup
}

function MatrixGroup({ g }: MatrixGroupProps) {
  return (
    <>
      <tr><td colSpan={plans.length + 1} className="border-t border-line bg-paper px-6 py-3 text-xs font-bold tracking-wider text-ink uppercase">{g.group}</td></tr>
      {g.rows.map(([label, ...vals]) => (
        <tr key={label}>
          <td className="border-t border-line px-6 py-4 text-[15px]">{label}</td>
          {(vals as MatrixCell[]).map((v, i) => (
            <td key={i} className={`border-t border-line px-4 py-4 text-center ${plans[i].popular ? 'bg-brand/5' : ''}`}><Cell v={v} highlight={plans[i].popular} /></td>
          ))}
        </tr>
      ))}
    </>
  )
}
