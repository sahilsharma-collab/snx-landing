// Small animation helpers: scroll reveal, count-up numbers, 3D mouse tilt,
// and word-by-word headlines. All of them respect prefers-reduced-motion
// through the CSS in src/shared/styles/index.css.
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// True once the element has scrolled into view (and stays true).
export function useInView(ref: RefObject<Element | null>, margin = '0px 0px -12% 0px') {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, seen])
  return seen
}

export interface RevealProps {
  as?: ElementType
  from?: 'up' | 'scale' | 'left' | 'right'
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  [key: string]: unknown
}

// <Reveal from="scale" delay={120}> fades + slides its children in on scroll.
export function Reveal({ as: Tag = 'div', from = 'up', delay = 0, className = '', style, children, ...p }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref)
  const dir = from === 'up' ? '' : `from-${from}`
  const Component = Tag as ElementType
  return (
    <Component ref={ref} className={`reveal ${dir} ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...p}>
      {children}
    </Component>
  )
}

export interface CountUpProps {
  value: string | number
  duration?: number
  className?: string
}

// Counts the number inside a label like "32%", "500+" or "14 days" up from 0.
export function CountUp({ value, duration = 1600, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref)
  const m = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/)
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen || !m) return
    if (reduced()) { setN(target); return }
    let raf: number
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      setN(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span className={className}>{value}</span>
  const shown = Number.isInteger(target) ? Math.round(n).toLocaleString('en-US') : n.toFixed(1)
  return <span ref={ref} className={className}>{m[1]}{shown}{m[3]}</span>
}

export interface TiltProps {
  max?: number
  className?: string
  children?: ReactNode
}

// Tilts its child in 3D toward the mouse and moves the phone glare with it.
export function Tilt({ max = 10, className = '', children }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced()) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(1100px) rotateY(${(x - 0.5) * max * 2}deg) rotateX(${(0.5 - y) * max * 1.4}deg)`
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 60}%`)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.removeProperty('--gx')
    el.style.removeProperty('--gy')
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={className}
      style={{ transition: 'transform .5s cubic-bezier(.2,.7,.2,1)', transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
    </div>
  )
}

export interface WordsProps {
  text: string
  start?: number
  step?: number
}

// Splits a string into words that blur-rise in one after another.
export function Words({ text, start = 0, step = 70 }: WordsProps) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="word" style={{ animationDelay: `${start + i * step}ms` }}>{w}{' '}</span>
  ))
}

// Cycles 0..count-1 every `ms` while on screen (for auto-playing demos).
export function useTicker(count: number, ms: number, ref: RefObject<Element | null>) {
  const [i, setI] = useState(0)
  const seen = useInView(ref, '0px')
  useEffect(() => {
    if (!seen || reduced()) return
    const t = setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => clearInterval(t)
  }, [seen, count, ms])
  return i
}

// Moves a soft spotlight under the cursor (see .spot in index.css).
export function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}
