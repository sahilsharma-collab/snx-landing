// "The Retention Machine" as a horizontal story: one card per stage of a
// customer's first 90 days. Each card is tinted with Priya's status at that
// point, says when the message fires and why, and has a real phone rising
// out of it with the push on its lock screen. It plays on its own while on
// screen; scrolling, dragging, the arrows or the stops take over. Place it
// full-width: card 1 lines up with the page's content column.
import { useEffect, useRef, useState, type ReactNode, type PointerEvent, type WheelEvent } from 'react'
import { Link } from 'react-router-dom'
import { brand, journey } from '@/shared/config/site'
import { Bell, Refresh, ChevronLeft, ChevronRight, Arrow, Flashlight, Camera, When, Target } from '@/shared/icons'
import { Reveal, useInView } from '@/shared/motion'
import { Phone } from '@/shared/phone'
import type { JourneyStage } from '@/shared/types/site'

// left edge of the .shell content column, so card 1 lines up with headings
const EDGE = 'max(1rem, calc((100vw - 72rem) / 2 + 2rem))'
const AUTO_MS = 3600 // how long each card stays in front while auto-playing
const SLIDE_MS = 1200 // how long the glide to the next card takes
const RESUME_MS = 10000 // auto-play comes back this long after the visitor stops
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

interface DragState {
  x: number
  left: number
  moved: boolean
}

interface RetentionTimelineProps {
  link?: string
}

export function RetentionTimeline({ link }: RetentionTimelineProps) {
  const box = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const [at, setAt] = useState(0)
  const [auto, setAuto] = useState(true)
  const drag = useRef<DragState | null>(null)
  const target = useRef<number | null>(null) // where a smooth scroll is heading, so fast clicks stack up
  const dragged = useRef(false) // the last press was a drag, not a click
  const glide = useRef(0) // the running scroll animation
  const resume = useRef<ReturnType<typeof setTimeout> | undefined>(undefined) // timer that turns auto-play back on
  const seen = useInView(box, '0px 0px -25% 0px')

  // Which card is in front.
  useEffect(() => {
    const el = track.current
    if (!el) return
    const on = () => {
      const max = el.scrollWidth - el.clientWidth
      const f = max > 0 ? el.scrollLeft / max : 0
      const start = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
      let best = 0, dist = Infinity
      cards.current.forEach((c, i) => {
        if (!c) return
        const d = Math.abs(c.getBoundingClientRect().left - start)
        if (d < dist) { dist = d; best = i }
      })
      setAt(f > 0.98 ? journey.length - 1 : best)
      if (dist < 2 || f > 0.98 || f < 0.001) target.current = null
    }
    on()
    el.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const n = Math.max(0, Math.min(i, journey.length - 1))
    const c = cards.current[n]
    if (!c) return
    target.current = n
    const start = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)
    const from = el.scrollLeft
    const to = Math.min(el.scrollWidth - el.clientWidth, from + c.getBoundingClientRect().left - start)
    cancelAnimationFrame(glide.current)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.scrollLeft = to; return }
    // a slow, eased glide instead of the browser's quick smooth-scroll
    el.style.scrollSnapType = 'none'
    const t0 = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / SLIDE_MS)
      el.scrollLeft = from + (to - from) * ease(k)
      if (k < 1) glide.current = requestAnimationFrame(step)
      else el.style.scrollSnapType = ''
    }
    glide.current = requestAnimationFrame(step)
  }
  // The visitor took over: stop auto-play, and bring it back once they leave it alone.
  const pause = () => {
    setAuto(false)
    clearTimeout(resume.current)
    resume.current = setTimeout(() => setAuto(true), RESUME_MS)
  }
  useEffect(() => () => { clearTimeout(resume.current); cancelAnimationFrame(glide.current) }, [])
  const take = (i: number) => { pause(); go(i) }

  // Plays on its own, round and round, while on screen. A steady interval (not
  // a timer re-armed on each card change) so it can never get stuck; it only
  // pauses for a while after the visitor scrolls, drags or clicks.
  const atRef = useRef(0)
  atRef.current = at
  useEffect(() => {
    if (!auto || !seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      const i = target.current ?? atRef.current
      go(i < journey.length - 1 ? i + 1 : 0) // loops back to Day 0
    }, AUTO_MS)
    return () => clearInterval(t)
  }, [auto, seen])

  // Drag to scroll with a mouse (touch already scrolls natively).
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || (e.target as HTMLElement).closest('a,button')) return
    pause()
    cancelAnimationFrame(glide.current)
    drag.current = { x: e.clientX, left: track.current!.scrollLeft, moved: false }
    track.current!.style.scrollSnapType = 'none'
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    if (Math.abs(e.clientX - d.x) > 4) d.moved = true
    track.current!.scrollLeft = d.left - (e.clientX - d.x)
  }
  const up = () => {
    if (!drag.current) return
    dragged.current = drag.current.moved
    drag.current = null
    track.current!.style.scrollSnapType = ''
    go(at)
  }

  const colors = journey.map((j) => j.status[1])
  const fill = at / (journey.length - 1)

  return (
    <div ref={box}>
      {/* progress line + stops */}
      <div className="shell">
        <div className="flex items-start gap-6">
          <div className="relative flex-1">
            <div className="absolute top-[10px] right-2 left-2 h-[3px] rounded-full bg-white/10" />
            {/* the full status gradient, revealed as Priya moves along */}
            <div className="absolute top-[10px] right-2 left-2 h-[3px] rounded-full transition-[clip-path] duration-700 ease-out"
              style={{ background: `linear-gradient(90deg, ${colors.join(', ')})`, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0 round 99px)` }} />
            <ol className="relative flex justify-between">
              {journey.map((j, i) => (
                <li key={j.day} className={`flex flex-col ${i === 0 ? 'items-start' : i === journey.length - 1 ? 'items-end' : 'items-center'}`}>
                  <button onClick={() => take(i)} className="group relative grid size-[22px] place-items-center" aria-label={`${j.day}: ${j.stage}`} aria-current={i === at ? 'step' : undefined}>
                    {i === at && <span className="absolute inset-0 animate-ping rounded-full opacity-50" style={{ background: j.status[1] }} />}
                    <span className={`relative size-3.5 rounded-full ring-4 ring-ink transition-all duration-300 ${i === at ? 'scale-125' : 'group-hover:scale-110'}`}
                      style={{ background: i <= at ? j.status[1] : '#2A3358' }} />
                  </button>
                  <span className={`mt-2 font-display text-xs font-bold transition-colors sm:text-sm ${i <= at ? 'text-white' : 'text-mist/50'}`}>{j.day}</span>
                  <span className={`hidden text-xs transition-colors md:block ${i === at ? 'text-white/70' : 'text-mist/40'}`}>{j.stage}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="hidden gap-2 sm:flex">
            {([[-1, ChevronLeft, 'Previous stage'], [1, ChevronRight, 'Next stage']] as const).map(([d, Ic, l]) => (
              <button key={l} onClick={() => take((target.current ?? at) + d)} aria-label={l} disabled={(d < 0 && at === 0) || (d > 0 && at === journey.length - 1)}
                className="grid size-11 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-30">
                <Ic className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* the story */}
      <div ref={track} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        onWheel={(e: WheelEvent<HTMLDivElement>) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { pause(); cancelAnimationFrame(glide.current) } }} onTouchStart={() => { pause(); cancelAnimationFrame(glide.current) }}
        className="mt-10 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-3 pb-4 select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: EDGE, paddingRight: EDGE, scrollPaddingLeft: EDGE }}>
        {journey.map((j, i) => {
          const on = i === at
          const c = j.status[1]
          return (
            <Reveal key={j.day} delay={i * 90} className="shrink-0 snap-start">
              <article ref={(n) => { cards.current[i] = n }} onClick={() => { if (dragged.current) { dragged.current = false; return } take(i) }}
                className={`group relative h-[540px] w-[80vw] max-w-[330px] cursor-pointer overflow-hidden rounded-[30px] p-6 transition-all duration-500 sm:w-[330px] ${on ? '-translate-y-2' : 'hover:-translate-y-1'}`}
                style={{
                  background: `radial-gradient(120% 70% at 0% 0%, ${c}30, transparent 60%), linear-gradient(180deg, #151C38, #0D1228)`,
                  boxShadow: on ? `inset 0 0 0 1.5px ${c}, 0 30px 60px -30px ${c}88` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                }}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold text-ink" style={{ background: c }}>{j.status[0]}</span>
                  <span className="text-xs font-semibold text-white/40 tabular-nums">{String(i + 1).padStart(2, '0')} / {String(journey.length).padStart(2, '0')}</span>
                </div>
                <p className="mt-5 font-display text-5xl leading-none font-extrabold tracking-tight text-white">{j.day}</p>
                <p className="mt-2 text-lg font-semibold text-white/90">{j.stage}</p>

                <dl className="mt-5 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5"><dt className="grid size-7 shrink-0 place-items-center rounded-lg" style={{ background: `${c}26`, color: c }}><When className="size-[15px]" strokeWidth={2.1} /><span className="sr-only">When it fires</span></dt><dd className="text-white/75">{j.trigger}</dd></div>
                  <div className="flex items-center gap-2.5"><dt className="grid size-7 shrink-0 place-items-center rounded-lg" style={{ background: `${c}26`, color: c }}><Target className="size-[15px]" strokeWidth={2.1} /><span className="sr-only">What it’s for</span></dt><dd className="text-white/75">{j.goal}</dd></div>
                </dl>

                {/* a real phone rising out of the card, with the push on its lock screen */}
                {/* a phone rising out of the card: only its top half shows */}
                <div className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${on ? 'translate-y-0' : 'translate-y-10 group-hover:translate-y-6'}`} style={{ top: 300 }}>
                  <Phone width={250} finish="black" indicator="light"><Lock j={j} live={on} /></Phone>
                </div>
              </article>
            </Reveal>
          )
        })}

        {/* the loop closes */}
        <Reveal delay={journey.length * 90} className="shrink-0 snap-start">
          <article className="flex h-[540px] w-[80vw] max-w-[320px] flex-col justify-between rounded-[30px] bg-cta p-7 text-ink sm:w-[320px]">
            <div>
              <span className="grid size-12 place-items-center rounded-2xl bg-ink text-cta"><Refresh className="size-5" /></span>
              <p className="mt-6 font-display text-[2rem] leading-[1.05] font-extrabold">She orders again. The ladder resets.</p>
              <p className="mt-4 text-ink/70">Every message goes out once per person per stage. No double sends, no manual work.</p>
              <p className="mt-5 text-sm text-ink/70">Each one is written for the shopper:</p>
              <p className="mt-2 rounded-2xl bg-ink/[0.06] p-3.5 text-[15px] leading-relaxed font-medium">
                Thanks <Tag>{'{name}'}</Tag>! Loving your <Tag>{'{product}'}</Tag>? You might like <Tag>{'{recommendation}'}</Tag>.
              </p>
            </div>
            {link && <Link to={link} className="inline-flex items-center gap-1.5 font-bold">See all 15 journeys <Arrow className="size-4" /></Link>}
          </article>
        </Reveal>
      </div>
    </div>
  )
}

export default RetentionTimeline

const Tag = ({ children }: { children: ReactNode }) => <span className="mx-0.5 rounded-md bg-ink px-1.5 py-0.5 font-mono text-[0.8em] text-cta">{children}</span>

interface LockProps {
  j: JourneyStage
  live: boolean
}

// Priya's lock screen on that day: wallpaper tinted with her status, and the push.
function Lock({ j, live }: LockProps) {
  const c = j.status[1]
  return (
    <div className="relative h-full overflow-hidden text-white" style={{ background: `radial-gradient(90% 55% at 50% 0%, ${c}66, transparent 70%), linear-gradient(180deg, #2A2F63 0%, #141A3C 55%, #0B0F24 100%)` }}>
      <p className="pt-12 text-center text-[11px] font-semibold text-white/80">{j.day} after first order</p>
      <p className="text-center font-display text-[56px] leading-none font-semibold tracking-[-0.04em]">9:41</p>
      <div key={live ? 'live' : 'idle'} className={`mx-2.5 mt-5 flex gap-2.5 rounded-[18px] bg-white/90 p-2.5 text-ink shadow-lg backdrop-blur-xl ${live ? 'animate-notif-in' : ''}`} style={{ animationDelay: '250ms' }}>
        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-gradient-to-br from-brand to-brand-2 text-white"><Bell className="size-4" /></span>
        <span className="min-w-0 text-[10px] leading-tight">
          <span className="flex justify-between text-[9px] text-ink/50"><b className="uppercase">Ilvana</b><span>now</span></span>
          <b className="mt-0.5 block text-[11px]">{j.title}</b>
          <span className="text-ink/65">{j.body}</span>
        </span>
      </div>
      <div className="absolute inset-x-7 bottom-8 flex justify-between">
        {[Flashlight, Camera].map((Ic, k) => <span key={k} className="grid size-8 place-items-center rounded-full bg-black/30 backdrop-blur"><Ic className="size-3.5" /></span>)}
      </div>
    </div>
  )
}
