// Live mini-demos for each feature, shown inside a phone on /features and on
// every /features/<slug> page. Native app and push use the real app screens;
// the rest are small animated scenes.
import { useEffect, useState, type ComponentType } from 'react'
import { journey, ai } from '@/shared/config/site'
import { Check, Bell, Sparkle, Card, Film } from '@/shared/icons'
import { Phone, BrandAppScreen, LockScreen, SneakerAppScreen, vyntraNotes } from '@/shared/phone'
import { CountUp } from '@/shared/motion'

// Each feature's accent colour (glows, highlights on its detail page).
export const featureColor: Record<string, string> = {
  automations: '#C9F45B', analytics: '#4C8DFF', 'native-app': '#7B61FF', 'guide-ai': '#FF7BB0',
  push: '#F59E0B', personalization: '#7BE0C3', checkout: '#22C55E', content: '#FB7185',
}

const screens: Record<string, ComponentType> = {
  'native-app': () => <SneakerAppScreen />,
  push: () => <LockScreen notes={vyntraNotes} from="Vyntra" wallpaper="mono" icon="#C9F45B" />,
}

interface FeatureScreenProps {
  slug: string
}

export function FeatureScreen({ slug }: FeatureScreenProps) {
  const S = screens[slug]
  if (S) return <S />
  return <div className="h-full bg-ink px-3 pt-12 pb-7 text-white"><Demo slug={slug} /></div>
}


// ---- one small live demo per feature ----------------------------------
const panel = 'h-full w-full overflow-hidden rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10'

function Demo({ slug }: { slug: string }) {
  const map: Record<string, ComponentType> = { automations: Automations, analytics: Analytics, 'native-app': NativeApp, 'guide-ai': GuideAI, push: Push, personalization: Personal, checkout: Checkout, content: Content }
  const D = map[slug] ?? NativeApp
  return <D />
}

// cycles 0..n-1 every ms
export function useLoop(n: number, ms: number) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % n), ms)
    return () => clearInterval(t)
  }, [n, ms])
  return i
}

function Automations() {
  const i = useLoop(journey.length + 1, 900)
  return (
    <div className={panel}>
      <p className="text-xs font-semibold text-mist">Running for Priya</p>
      <ol className="mt-3 space-y-2">
        {journey.map((j, k) => (
          <li key={j.day} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500 ${k < i ? 'bg-white/[0.07]' : 'opacity-35'}`}>
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: k < i ? j.status[1] : '#2A3358', boxShadow: k === i - 1 ? `0 0 12px ${j.status[1]}` : 'none' }} />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">{j.stage}</span>
              <span className="block truncate text-[11px] text-mist">{j.title}</span>
            </span>
            <span className="text-[11px] font-bold text-mist">{j.day}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Analytics() {
  const bars = [0.42, 0.55, 0.48, 0.66, 0.72, 0.68, 0.86]
  const stats: [string, string][] = [['Revenue', '$48,210'], ['App share', '34%'], ['Repeat rate', '41%'], ['AOV', '$62']]
  return (
    <div className={panel}>
      <p className="text-xs font-semibold text-mist">Sample store · last 7 days</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[0.06] p-2.5">
            <p className="text-[11px] text-mist">{k}</p>
            <p className="font-display text-lg font-bold"><CountUp value={v} duration={1200} /></p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-28 items-end gap-2">
        {bars.map((h, k) => (
          <div key={k} className="flex-1 rounded-t-md bg-gradient-to-t from-brand to-brand-2" style={{ height: `${h * 100}%`, animation: `bar-grow .9s ${k * 80}ms cubic-bezier(.2,.7,.2,1) both`, transformOrigin: 'bottom' }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-mist">{'MTWTFSS'.split('').map((d, k) => <span key={k} className="flex-1 text-center">{d}</span>)}</div>
    </div>
  )
}

function NativeApp() {
  return <div className="grid h-full place-items-start justify-center overflow-hidden"><div className="animate-phone-in"><Phone width={210}><BrandAppScreen toast={false} /></Phone></div></div>
}

function Push() {
  return <div className="grid h-full place-items-start justify-center overflow-hidden"><div className="animate-phone-in"><Phone width={210} finish="black" indicator="light"><LockScreen /></Phone></div></div>
}

function GuideAI() {
  const q = 'Why did repeat rate drop last month?'
  const a = '38 first-time buyers from the Diwali sale haven’t ordered again. Want me to draft a win-back push for them?'
  const [typed, setTyped] = useState('')
  useEffect(() => {
    let n = 0
    const t = setTimeout(() => {
      const id = setInterval(() => { n += 2; setTyped(a.slice(0, n)); if (n >= a.length) clearInterval(id) }, 30)
    }, 900)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`${panel} flex flex-col`}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-mist"><Sparkle className="size-3.5 text-cta" /> {ai.name}</p>
      <div className="mt-4 ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[13px] animate-fade-up">{q}</div>
      {typed && <div className="mt-3 max-w-[90%] rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2.5 text-[13px] leading-relaxed text-white/90">{typed}{typed.length < a.length && <span className="caret ml-0.5 inline-block h-3.5 w-[6px] translate-y-0.5 bg-cta" />}</div>}
      {typed.length >= a.length && (
        <div className="animate-fade-up mt-3 flex gap-2">
          <span className="rounded-full bg-cta px-3 py-1.5 text-xs font-bold text-ink">Draft the push</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">Show the list</span>
        </div>
      )}
      <p className="mt-auto text-[11px] text-mist/70">Example conversation</p>
    </div>
  )
}

function Personal() {
  const shoppers: [string, string, [string, string][]][] = [
    ['Priya', 'Bought a Vitamin C serum', [['#FDE68A', 'SPF 50 fluid'], ['#FBCFE8', 'Night cream'], ['#BFDBFE', 'Hydra gel']]],
    ['Arjun', 'Bought running shoes', [['#BBF7D0', 'Sports socks'], ['#C7D2FE', 'Water bottle'], ['#FED7AA', 'Energy gels']]],
  ]
  const i = useLoop(shoppers.length, 2600)
  const [name, what, picks] = shoppers[i]
  return (
    <div className={panel}>
      <p className="text-xs font-semibold text-mist">Same app, different home screen</p>
      <div key={name} className="animate-fade-up mt-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-pink to-brand font-display font-bold">{name[0]}</span>
        <span><b className="block text-sm">{name}</b><span className="text-xs text-mist">{what}</span></span>
      </div>
      <p className="mt-5 text-[11px] font-semibold tracking-wide text-mist uppercase">Picked for {name}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {picks.map(([c, n], k) => (
          <div key={n} className="animate-notif-in rounded-xl bg-white p-1.5 text-ink" style={{ animationDelay: `${k * 110}ms` }}>
            <div className="h-16 rounded-lg" style={{ background: `radial-gradient(120% 90% at 30% 15%, #fff, ${c})` }} />
            <p className="mt-1.5 truncate px-0.5 text-[11px] font-semibold">{n}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Checkout() {
  const opts: [string, string][] = [['UPI', 'Pay with any UPI app'], ['Cash on delivery', '₹49 handling'], ['Card', 'Visa, Mastercard, RuPay']]
  const i = useLoop(opts.length + 1, 1300)
  const done = i === opts.length
  return (
    <div className={`${panel} flex flex-col`}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-mist"><Card className="size-3.5" /> Checkout · ₹1,240</p>
      <ul className="mt-4 space-y-2">
        {opts.map(([t, s], k) => {
          const on = !done && k === i
          return (
            <li key={t} className={`flex items-center gap-3 rounded-xl px-3 py-3 ring-1 transition-all duration-300 ${on ? 'bg-white/10 ring-cta' : 'ring-white/10'}`}>
              <span className={`grid size-4 place-items-center rounded-full ring-2 ${on ? 'ring-cta' : 'ring-white/30'}`}>{on && <span className="size-2 rounded-full bg-cta" />}</span>
              <span><b className="block text-[13px]">{t}</b><span className="text-[11px] text-mist">{s}</span></span>
            </li>
          )
        })}
      </ul>
      <div className={`mt-auto flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors ${done ? 'bg-save text-white' : 'bg-cta text-ink'}`}>
        {done ? <><Check className="size-4" strokeWidth={3} /> Order placed</> : 'Pay now'}
      </div>
    </div>
  )
}

function Content() {
  const reels: [string, string, string][] = [['#F9A8D4', '#BE185D', 'New drop'], ['#A5B4FC', '#4338CA', 'How to use'], ['#FCD34D', '#B45309', 'Behind the scenes']]
  const i = useLoop(reels.length, 2200)
  return (
    <div className={panel}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-mist"><Film className="size-3.5" /> Shoppable reels</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {reels.map(([a, b, t], k) => (
          <div key={t} className={`relative h-48 overflow-hidden rounded-xl transition-transform duration-500 ${k === i ? 'scale-[1.04] ring-2 ring-cta' : 'opacity-70'}`} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
            <div className="absolute inset-x-1.5 top-1.5 h-[3px] overflow-hidden rounded-full bg-white/30">
              {k === i && <div key={i} className="h-full bg-white" style={{ animation: 'grow-w 2.2s linear both' }} />}
            </div>
            <p className="absolute inset-x-1.5 bottom-8 text-[10px] font-bold">{t}</p>
            <span className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-white py-1 text-center text-[9px] font-bold text-ink">Shop now</span>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-mist"><Bell className="size-3" /> Blog and collections sync from Shopify</p>
    </div>
  )
}
