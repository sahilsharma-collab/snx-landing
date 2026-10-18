import { useState } from 'react'
import { brand, blogTopics, upcomingPosts } from '@/shared/config/site'
import { CtaBand } from '@/shared/ui'
import { Check } from '@/shared/icons'
import { Reveal } from '@/shared/motion'
import { useSeo } from '@/shared/seo'
import { photo } from '@/shared/config/photos'

// PLACEHOLDER: no articles yet. The planned guides show as "Coming soon".
// Swap in posts when they exist.
const topicColor: Record<string, [string, string]> = { Retention: ['#C9F45B', '#7BE0C3'], Push: ['#F59E0B', '#FB7185'], 'App design': ['#7B61FF', '#4C8DFF'], 'D2C India': ['#22C55E', '#C9F45B'], Analytics: ['#4C8DFF', '#7BE0C3'] }

export function BlogPage() {
  useSeo({ title: 'Blog', description: `Practical guides for Shopify brands growing with an app — retention, push notifications, app design and D2C growth, from the ${brand.name} team.` })
  const [topic, setTopic] = useState('All')
  const shown = upcomingPosts.filter((p) => topic === 'All' || p.topic === topic)

  return (
    <>
      <Hero />

      {/* upcoming guides */}
      <section className="bg-paper pt-12 pb-16 sm:pt-14 sm:pb-24">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brand">Coming soon</p>
              <h2 className="h-section mt-3">Guides we’re writing.</h2>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0" role="tablist" aria-label="Topics">
              {['All', ...blogTopics].map((t) => (
                <button key={t} role="tab" aria-selected={topic === t} onClick={() => setTopic(t)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${topic === t ? 'bg-ink text-white' : 'bg-card text-body ring-1 ring-line hover:text-ink'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div key={topic} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <article key={p.title} className="animate-fade-up group flex flex-col overflow-hidden rounded-[28px] bg-card ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(8,12,28,0.35)]" style={{ animationDelay: `${i * 70}ms` }}>
                <Cover topic={p.topic} seed={upcomingPosts.indexOf(p)} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.12em] text-body uppercase">{p.topic}</span>
                    <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-body ring-1 ring-line">Coming soon</span>
                  </div>
                  <h3 className="mt-3 text-xl leading-snug font-bold">{p.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Subscribe />
      <CtaBand />
    </>
  )
}

// Hero: a light editorial masthead — eyebrow + title on the left, intro on the
// right, over a faded dot grid with a soft brand glow, closed by a divider.
function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-28 pb-10 text-ink sm:pt-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{ backgroundImage: 'radial-gradient(rgba(8,12,28,.12) 1px,transparent 1px)', backgroundSize: '22px 22px', WebkitMaskImage: 'linear-gradient(#000,transparent 70%)', maskImage: 'linear-gradient(#000,transparent 70%)' }} />
      <div className="pointer-events-none absolute -top-[180px] -right-[120px] size-[520px] rounded-full" aria-hidden style={{ background: 'radial-gradient(circle,rgba(123,97,255,.18),transparent 65%)' }} />
      <div className="shell relative">
        <div className="grid items-end gap-10 border-b border-line pb-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <span className="eyebrow text-brand">The {brand.name} journal</span>
            <h1 className="h-display mt-4">Field notes on <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#7B61FF,#4C8DFF)' }}>growth.</span></h1>
          </div>
          <p className="text-lg leading-relaxed text-pretty text-body">Practical guides for Shopify brands growing with an app. Our first guides are on the way.</p>
        </div>
      </div>
    </section>
  )
}

// Abstract cover art, different for every card, in the topic's colours.
const covers = [photo.bagsHand, photo.blogNotif, photo.blogSketch, photo.blogIndia, photo.blogAnalytics, photo.serumWhite]

interface CoverProps {
  topic: string
  seed: number
}

function Cover({ topic, seed }: CoverProps) {
  const [a, b] = topicColor[topic] ?? ['#7B61FF', '#4C8DFF']
  const img = covers[seed]
  if (img) return (
    <div className="relative h-44 overflow-hidden">
      <img src={img} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 mix-blend-multiply" style={{ background: `linear-gradient(160deg, transparent 40%, ${b}99)` }} />
      <span className="absolute bottom-3 left-3 size-2.5 rounded-full" style={{ background: a, boxShadow: `0 0 12px ${a}` }} />
    </div>
  )
  const shapes = [
    <><span className="absolute -right-6 -bottom-10 size-40 rounded-full" style={{ background: a }} /><span className="absolute top-6 left-6 size-16 rounded-2xl bg-white/80" /></>,
    <><span className="absolute inset-x-8 bottom-0 h-24 rounded-t-full" style={{ background: a }} /><span className="absolute top-7 right-8 size-10 rounded-full bg-white/80" /></>,
    <>{[0, 1, 2, 3].map((k) => <span key={k} className="absolute bottom-6 w-6 rounded-t-md bg-white/80" style={{ left: 28 + k * 34, height: 30 + k * 18 }} />)}<span className="absolute -top-8 -right-8 size-28 rounded-full" style={{ background: a }} /></>,
  ]
  return (
    <div className="relative h-40 overflow-hidden" style={{ background: `linear-gradient(135deg, ${b}, #10172F)` }}>
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">{shapes[seed % shapes.length]}</div>
    </div>
  )
}

function Subscribe() {
  const [sent, setSent] = useState(false)
  return (
    <section className="bg-paper pb-16 sm:pb-24">
      <div className="shell">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-card p-8 ring-1 ring-line sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Get the first guides when they’re out.</h2>
            <p className="mt-2 text-body">One email when a new guide is published. Nothing else.</p>
          </div>
          {sent ? (
            <p className="flex items-center gap-2 font-semibold text-save" role="status"><Check className="size-5" strokeWidth={2.5} /> You’re on the list.</p>
          ) : (
            <form className="flex w-full max-w-md flex-col gap-2 rounded-full bg-paper p-1.5 ring-1 ring-line focus-within:ring-brand sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
              <label className="sr-only" htmlFor="sub-email">Email</label>
              <input id="sub-email" type="email" required placeholder="you@yourstore.com" className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 focus:outline-none" />
              <button className="btn btn-cta">Notify me</button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
