import { useState } from 'react'
import { Arrow } from '@/shared/icons'
import { Phone, LockScreen, SneakerAppScreen, GroceryAppScreen, vyntraNotes } from '@/shared/phone'
import { Reveal } from '@/shared/motion'
import { TrustRow } from './TrustRow'

export function CtaBand() {
  const [sent, setSent] = useState(false)
  return (
    <section id="book-demo" className="relative scroll-mt-24 overflow-hidden bg-ink px-4 pt-24 text-cream sm:pt-32">
      <div className="grid-dots absolute inset-0 opacity-60 [mask-image:linear-gradient(#000,transparent_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(55%_80%_at_50%_100%,rgba(123,97,255,0.5),transparent_70%)]" />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="h-section text-white sm:text-6xl">Your customers are on their phones. <span className="text-gradient">Be there.</span></h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-mist">A 20-minute call. We’ll show you your own store as an app, before you pay anything.</p>
        {sent ? (
          <p className="mx-auto mt-9 max-w-md rounded-2xl bg-white/10 px-6 py-5 font-semibold text-white" role="status">Thanks! We’ll email you within one working day to pick a time.</p>
        ) : (
          <form className="mx-auto mt-9 flex max-w-md flex-col gap-3 rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/15 backdrop-blur-xl focus-within:ring-cta sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <label className="sr-only" htmlFor="demo-url">Your store URL</label>
            <input id="demo-url" required placeholder="yourstore.com" className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-white placeholder:text-mist/70 focus:outline-none" />
            <button className="btn btn-cta">Book a demo <Arrow className="size-4" /></button>
          </form>
        )}
        <TrustRow className="mt-7 justify-center" />
      </Reveal>
      {/* three phones rising out of the bottom edge: only their top half shows.
          The box is wide enough that nothing is clipped at the sides. */}
      <Reveal from="scale" delay={150} className="relative mx-auto mt-16 h-[330px] max-w-5xl overflow-hidden [mask-image:linear-gradient(#000_80%,transparent)] sm:h-[380px]">
        <div className="flex items-start justify-center pt-4 [perspective:1600px]">
          <div className="relative z-0 -mr-14 mt-14 hidden sm:block" style={{ transform: 'rotateY(18deg) rotateZ(-4deg)', filter: 'brightness(.8)' }}>
            <Phone width={250} finish="black" indicator="light"><LockScreen notes={vyntraNotes} from="Vyntra" wallpaper="mono" icon="#C9F45B" /></Phone>
          </div>
          <div className="relative z-10">
            <Phone width={290} finish="black" indicator="light"><SneakerAppScreen /></Phone>
          </div>
          <div className="relative z-0 -ml-14 mt-14 hidden sm:block" style={{ transform: 'rotateY(-18deg) rotateZ(4deg)', filter: 'brightness(.8)' }}>
            <Phone width={250} finish="white"><GroceryAppScreen /></Phone>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
