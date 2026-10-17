// Phone frame + the app screens drawn inside it. Screens are plain markup
// (no images) so they stay crisp at any resolution, animate, and are easy
// to re-theme. The frame is modelled on a titanium iPhone 15 Pro: metal rim,
// side buttons, punch-hole camera, glass glare and home indicator.
import { useEffect, useRef, useState, type CSSProperties, type ComponentType, type ReactNode } from 'react'
import { Bell, Cart, Heart, Star, Gift, Check, Clock, Sparkle, ShoppingBag, Truck, Lock, Menu, Flashlight, Camera, DragHandle, Mobile, Arrow } from '@/shared/icons'
import { useTicker } from '@/shared/motion'
import { brand } from '@/shared/config/site'
import { photo } from '@/shared/config/photos'

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>

export type FinishKey = 'titanium' | 'black' | 'blue' | 'white'

const finishes: Record<FinishKey, { metal: string; side: string }> = {
  titanium: {
    metal: 'linear-gradient(135deg,#8f8a84 0%,#ece8e2 12%,#7b766f 28%,#cfcac3 46%,#6d6863 64%,#e2ddd6 82%,#8b8680 100%)',
    side: 'linear-gradient(90deg,#5f5b56,#d9d4cd 50%,#6f6a65)',
  },
  black: {
    metal: 'linear-gradient(135deg,#2c2c31 0%,#8d8d95 12%,#232327 30%,#5c5c64 48%,#1b1b1f 66%,#7a7a82 84%,#2a2a2f 100%)',
    side: 'linear-gradient(90deg,#1f1f23,#76767e 50%,#25252a)',
  },
  blue: {
    metal: 'linear-gradient(135deg,#363e4c 0%,#a8b3c6 12%,#2d3442 30%,#6d7a90 48%,#252b37 66%,#94a0b5 84%,#343c4a 100%)',
    side: 'linear-gradient(90deg,#272d39,#8e9ab0 50%,#2f3644)',
  },
  white: {
    metal: 'linear-gradient(135deg,#bdbdbd 0%,#ffffff 14%,#c9c9c9 32%,#f4f4f4 50%,#b2b2b2 68%,#fafafa 84%,#c4c4c4 100%)',
    side: 'linear-gradient(90deg,#a9a9a9,#ffffff 50%,#b5b5b5)',
  },
}

interface PhoneFrameProps {
  children?: ReactNode
  className?: string
  width?: number
  finish?: FinishKey
  indicator?: 'light' | 'dark'
}

interface PhoneProps extends PhoneFrameProps {
  designWidth?: number
}

// width: CSS width of the whole device. indicator: home bar colour.
// Geometry follows an iPhone 15 Pro: a 1179×2556 screen, a thin black
// border, a titanium rim, and corners that share one centre (rim, border and
// screen radii step down together), which is what makes it read as real.
// designWidth: build the phone at this size, then shrink the whole thing to
// `width`, like a scaled screenshot. Use it for small phones so the screen
// keeps its real proportions instead of squashing the content.
export function Phone({ designWidth, ...p }: PhoneProps) {
  if (!designWidth || designWidth <= (p.width ?? 272)) return <PhoneFrame {...p} />
  const k = (p.width ?? 272) / designWidth
  const { width, className = '', ...rest } = p
  const H = phoneHeight(designWidth)
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height: H * k }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${k})` }}>
        <PhoneFrame width={designWidth} {...rest} />
      </div>
    </div>
  )
}

function phoneHeight(W: number) {
  const rim = Math.max(2.5, W * 0.0115)
  const border = W * 0.03
  return (W - 2 * (rim + border)) / (1179 / 2556) + 2 * (rim + border)
}

function PhoneFrame({ children, className = '', width = 272, finish = 'titanium', indicator = 'dark' }: PhoneFrameProps) {
  const f = finishes[finish] ?? finishes.titanium
  const W = width
  const rim = Math.max(2.5, W * 0.0115) // visible titanium edge
  const border = W * 0.03 // black glass border around the display
  const R = W * 0.168 // outer corner radius
  const sw = W - 2 * (rim + border) // screen width
  const sh = sw / (1179 / 2556) // screen height
  const H = sh + 2 * (rim + border)
  const btn = (side: 'left' | 'right', top: number, len: number) => (
    <span className="absolute rounded-[2px]" style={{
      [side]: -rim * 0.85, top: H * top, height: H * len, width: rim * 1.15,
      background: f.side,
      boxShadow: `inset ${side === 'left' ? '1px' : '-1px'} 0 0 rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.4)`,
    } as CSSProperties} />
  )
  const band = (side: 'left' | 'right', top: number) => <span className="absolute bg-black/30" style={{ [side]: 0, top: H * top, width: rim, height: Math.max(2, W * 0.008) } as CSSProperties} />

  return (
    <div className={`iphone relative shrink-0 ${className}`} style={{ width: W, height: H }}>
      {/* side buttons: action + volume on the left, power on the right */}
      {btn('left', 0.165, 0.04)}
      {btn('left', 0.235, 0.072)}
      {btn('left', 0.325, 0.072)}
      {btn('right', 0.255, 0.112)}

      {/* titanium rim */}
      <div className="absolute inset-0" style={{
        borderRadius: R, background: f.metal,
        boxShadow: '0 1px 1px rgba(0,0,0,0.3), 0 18px 36px -14px rgba(0,0,0,0.55), 0 50px 90px -30px rgba(0,0,0,0.6), inset 0 0 0 0.6px rgba(255,255,255,0.5), inset 0 1.5px 1px rgba(255,255,255,0.45)',
      }}>
        {/* fine highlight running round the middle of the rim */}
        <div className="absolute" style={{ inset: rim * 0.45, borderRadius: R - rim * 0.45, boxShadow: '0 0 0 0.6px rgba(255,255,255,0.18)' }} />
        {/* antenna bands */}
        {band('left', 0.1)}{band('right', 0.1)}{band('left', 0.9)}{band('right', 0.9)}
      </div>

      {/* black border + display */}
      <div className="absolute bg-black" style={{ inset: rim, borderRadius: R - rim, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 4px rgba(0,0,0,0.9)' }}>
        <div className="iphone-screen absolute overflow-hidden bg-white text-ink" style={{ inset: border, borderRadius: R - rim - border }}>
          {/* punch-hole camera: a small centred circle, so it hides less of the screen than an island */}
          <span className="absolute left-1/2 z-[70] -translate-x-1/2 rounded-full" style={{
            top: sw * 0.032, width: sw * 0.06, height: sw * 0.06,
            background: 'radial-gradient(circle at 35% 35%, #4a5a8a 0%, #1a2238 30%, #050508 60%)',
            boxShadow: 'inset 0 0 1px rgba(140,170,255,0.6), 0 0 0 1px rgba(0,0,0,0.6)',
          }} />
          {children}
          <div className={`absolute left-1/2 z-[70] -translate-x-1/2 rounded-full ${indicator === 'light' ? 'bg-white/90' : 'bg-black/85'}`}
            style={{ bottom: sw * 0.022, width: sw * 0.35, height: Math.max(3.5, sw * 0.013) }} />
          <div className="iphone-glare" />
        </div>
      </div>
    </div>
  )
}

const Signal = () => (
  <svg viewBox="0 0 18 12" className="h-[10px] w-auto" fill="currentColor" aria-hidden>
    <rect x="0" y="8" width="3" height="4" rx=".8" /><rect x="5" y="5.5" width="3" height="6.5" rx=".8" /><rect x="10" y="3" width="3" height="9" rx=".8" /><rect x="15" y="0" width="3" height="12" rx=".8" />
  </svg>
)
const Wifi = () => (
  <svg viewBox="0 0 16 12" className="h-[10px] w-auto" fill="currentColor" aria-hidden>
    <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 008 .4 10.3 10.3 0 00.8 3.3L2 4.6a8.6 8.6 0 016-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 008 4 6.7 6.7 0 003.4 5.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.4c-.6 0-1.1.2-1.5.6L8 11.6 9.5 10c-.4-.4-.9-.6-1.5-.6z" />
  </svg>
)
const Battery = () => (
  <span className="flex items-center gap-[1px]">
    <span className="relative h-[11px] w-[22px] rounded-[3.5px] border border-current/40 p-[1.5px]">
      <span className="block h-full w-[80%] rounded-[1.5px] bg-current" />
    </span>
    <span className="h-[4px] w-[1.5px] rounded-r-sm bg-current/40" />
  </span>
)

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div data-statusbar className={`relative z-[65] flex h-11 shrink-0 items-center justify-between pr-6 pl-8 pt-0.5 text-[12px] font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
      <span>9:41</span>
      <span className="flex items-center gap-[5px]"><Signal /><Wifi /><Battery /></span>
    </div>
  )
}

function TabBar({ accent, active = 0 }: { accent: string; active?: number }) {
  const tabs: [string, IconComponent][] = [['Home', Sparkle], ['Shop', Heart], ['Rewards', Gift], ['Cart', Cart]]
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-around border-t border-black/5 bg-white/90 px-3 pt-2 pb-6 backdrop-blur-xl">
      {tabs.map(([t, Ic], i) => (
        <span key={t} className="relative flex flex-col items-center gap-0.5 text-[9px] font-semibold" style={{ color: i === active ? accent : '#9AA0B4' }}>
          <Ic className="size-[18px]" />
          {t}
          {t === 'Cart' && <span className="absolute -top-1 right-0 grid size-3.5 place-items-center rounded-full text-[8px] text-white" style={{ background: accent }}>2</span>}
        </span>
      ))}
    </div>
  )
}

interface ToastProps {
  icon?: IconComponent
  title: ReactNode
  body: ReactNode
  accent: string
  from?: string
}

function Toast({ icon: Ic = Bell, title, body, accent, from = 'Ilvana' }: ToastProps) {
  return (
    <div className="animate-toast absolute inset-x-2.5 top-12 z-40 flex gap-2.5 rounded-[18px] bg-white/80 p-2.5 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.45)] ring-1 ring-black/5 backdrop-blur-xl">
      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: accent }}><Ic className="size-4" /></span>
      <span className="min-w-0 text-[10px] leading-tight">
        <span className="flex justify-between text-[8.5px] text-ink/45"><span className="font-semibold uppercase">{from}</span><span>now</span></span>
        <b className="block text-[10.5px]">{title}</b>
        <span className="text-ink/60">{body}</span>
      </span>
    </div>
  )
}

interface ProductProps {
  from?: string
  to?: string
  shape?: 'bottle' | 'jar' | 'shirt' | 'shoe' | 'bag'
  className?: string
  img?: string
  pos?: string
}

// Stylised studio "product photo": a lit gradient backdrop, a glossy object
// with a label, and a soft contact shadow so it reads as a real packshot.
function Product({ from, to, shape = 'bottle', className = '', img, pos = 'center' }: ProductProps) {
  if (img) return <span className={`relative block overflow-hidden rounded-[12px] bg-[#EEE] ${className}`}><img src={img} alt="" draggable="false" loading="lazy" className="absolute inset-0 size-full object-cover" style={{ objectPosition: pos }} /></span>
  const glass = 'linear-gradient(90deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.97) 30%, rgba(255,255,255,.8) 62%, rgba(255,255,255,.5) 100%)'
  const label = <span className="absolute inset-x-[12%] top-[38%] h-[30%] rounded-[2px]" style={{ background: `linear-gradient(90deg, ${to}cc, ${to})` }} />
  const shapes: Record<NonNullable<ProductProps['shape']>, ReactNode> = {
    bottle: <>
      <span className="absolute bottom-[18%] left-1/2 h-[50%] w-[30%] -translate-x-1/2 rounded-[30%_30%_14%_14%/18%_18%_8%_8%] shadow-[inset_-3px_0_6px_rgba(0,0,0,.08)]" style={{ background: glass }}>{label}</span>
      <span className="absolute bottom-[67%] left-1/2 h-[13%] w-[15%] -translate-x-1/2 rounded-t-[4px]" style={{ background: 'linear-gradient(90deg,#2a2a2e,#6b6b72 45%,#1f1f23)' }} />
    </>,
    jar: <>
      <span className="absolute bottom-[18%] left-1/2 h-[34%] w-[48%] -translate-x-1/2 rounded-[10px] shadow-[inset_-4px_0_8px_rgba(0,0,0,.08)]" style={{ background: glass }}>{label}</span>
      <span className="absolute bottom-[51%] left-1/2 h-[10%] w-[50%] -translate-x-1/2 rounded-[4px]" style={{ background: `linear-gradient(90deg, ${to}, #ffffffaa 45%, ${to})` }} />
    </>,
    shirt: <span className="absolute top-[20%] left-1/2 h-[58%] w-[52%] -translate-x-1/2 [clip-path:polygon(25%_0,75%_0,100%_18%,85%_35%,78%_28%,78%_100%,22%_100%,22%_28%,15%_35%,0_18%)]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.7), #fff 45%, rgba(255,255,255,.75))' }} />,
    shoe: <span className="absolute bottom-[26%] left-[16%] h-[26%] w-[66%] rounded-[40%_60%_12px_12px] shadow-[inset_0_-5px_0_rgba(0,0,0,.18)]" style={{ background: glass }} />,
    bag: <>
      <span className="absolute bottom-[56%] left-1/2 h-[16%] w-[26%] -translate-x-1/2 rounded-t-full border-[3px] border-b-0 border-white/80" />
      <span className="absolute bottom-[18%] left-1/2 h-[40%] w-[46%] -translate-x-1/2 rounded-b-[10px] rounded-t-[4px]" style={{ background: glass }} />
    </>,
  }
  return (
    <span className={`relative block overflow-hidden rounded-[12px] ${className}`} style={{ background: `radial-gradient(120% 90% at 30% 15%, ${from}, ${to})` }}>
      <span className="absolute inset-x-[18%] bottom-[12%] h-[8%] rounded-[50%] bg-black/25 blur-[4px]" />
      {shapes[shape]}
      <span className="absolute inset-0 bg-[radial-gradient(60%_40%_at_25%_10%,rgba(255,255,255,.45),transparent_70%)]" />
    </span>
  )
}

// ---- 0. Lock screen: push notifications stacking in, one after another ----
type LockNote = [IconComponent, string, string]

const lockNotes: LockNote[] = [
  [ShoppingBag, 'Your cart misses you', '2 items are still in stock. 10% off, today only.'],
  [Star, 'You earned 120 points', 'You’re 260 points away from a free gift.'],
  [Bell, 'Back in stock: Rose clay mask', 'You asked us to tell you. Grab it before it’s gone.'],
  [Truck, 'Out for delivery', 'Your order arrives today between 2 and 4 pm.'],
]

// Lock-screen wallpapers, so not every phone looks the same.
type WallpaperKey = 'blue' | 'sunset' | 'mono'

const wallpapers: Record<WallpaperKey, CSSProperties> = {
  blue: { background: 'repeating-radial-gradient(circle at 50% 115%, #2D6BFF 0 22px, #3E7CFF 23px 44px), linear-gradient(#1D3FD6,#4A86FF)', backgroundBlendMode: 'soft-light' },
  sunset: { background: 'radial-gradient(120% 70% at 50% 110%, #FF9A62 0%, transparent 60%), radial-gradient(90% 60% at 20% 20%, #FF5E8A 0%, transparent 60%), linear-gradient(180deg, #3A1C71 0%, #D76D77 60%, #FFAF7B 100%)' },
  mono: { background: 'radial-gradient(80% 50% at 70% 20%, rgba(201,244,91,0.35), transparent 60%), radial-gradient(70% 50% at 20% 80%, rgba(123,97,255,0.35), transparent 60%), #0B0B10' },
}

interface LockScreenProps {
  notes?: LockNote[]
  from?: string
  wallpaper?: WallpaperKey
  icon?: string
}

export function LockScreen({ notes = lockNotes, from = 'Ilvana', wallpaper = 'blue', icon = 'linear-gradient(135deg,#7B61FF,#4C8DFF)' }: LockScreenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const at = useTicker(notes.length, 2200, ref)
  const shown = [0, 1, 2].map((k) => notes[(at - k + notes.length) % notes.length])
  return (
    <div ref={ref} className="relative h-full overflow-hidden text-white" style={wallpapers[wallpaper] ?? wallpapers.blue}>
      {wallpaper === 'blue' && <div className="absolute inset-0 bg-gradient-to-b from-[#1530B8]/70 via-transparent to-[#0B1F8F]/40" />}
      <div className="relative">
        <StatusBar light />
        <p className="mt-2 text-center text-[12px] font-semibold text-white/85">Friday, October 9</p>
        <p className="text-center font-display text-[68px] leading-[0.95] font-semibold tracking-[-0.04em] text-white/95 drop-shadow-sm">9:41</p>
        <div className="mx-2.5 mt-5 grid gap-1.5">
          {shown.map(([Ic, t, b], i) => (
            <div key={`${at}-${i}`} className={`flex gap-2.5 rounded-[18px] bg-white/25 p-2.5 ring-1 ring-white/20 backdrop-blur-xl ${i === 0 ? 'animate-notif-in' : ''}`}
              style={{ opacity: 1 - i * 0.22, transform: `scale(${1 - i * 0.025})` }}>
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: icon }}><Ic className="size-4" /></span>
              <span className="min-w-0 text-[10px] leading-tight">
                <span className="flex justify-between text-[8.5px] text-white/70"><b className="uppercase">{from}</b><span>{i === 0 ? 'now' : `${i * 4}m ago`}</span></span>
                <b className="mt-0.5 block text-[10.5px]">{t}</b>
                <span className="text-white/80">{b}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-8 bottom-9 flex justify-between">
        {[Flashlight, Camera].map((Ic, i) => <span key={i} className="grid size-9 place-items-center rounded-full bg-black/25 text-white backdrop-blur-md"><Ic className="size-4" /></span>)}
      </div>
    </div>
  )
}

// ---- 1. "Your website today": a mobile browser showing a plain store -----
export function WebsiteScreen() {
  return (
    <div className="flex h-full flex-col bg-[#F3F3F3] text-[#555]">
      <StatusBar />
      <div className="mx-3 flex items-center gap-2 rounded-[10px] bg-[#E4E4E4] px-3 py-1.5 text-[10px]"><Lock className="size-3" /> yourstore.com</div>
      <div className="mt-2 flex items-center justify-between bg-white px-4 py-3 text-[11px] font-bold tracking-widest">
        <Menu className="size-4" /> YOUR STORE <Cart className="size-4" />
      </div>
      <div className="mx-3 mt-3 grid h-24 place-items-center rounded-md bg-[#D6D6D6] text-[13px] font-bold text-[#888]">SALE UP TO 20%</div>
      <p className="mx-4 mt-4 text-[11px] font-bold">All products</p>
      <div className="mx-3 mt-2 grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-md bg-white p-1.5">
            <div className="h-20 rounded bg-[#E2E2E2]" />
            <p className="mt-1.5 h-1.5 w-3/4 rounded bg-[#DADADA]" />
            <p className="mt-1 text-[9px]">₹1,299</p>
          </div>
        ))}
      </div>
      <div className="mt-auto bg-[#333] px-4 pt-3 pb-7 text-[9px] leading-snug text-white/80">
        We use cookies to improve your experience. <u>Accept</u>
      </div>
    </div>
  )
}

// ---- 2. The same store, as a brand app ----------------------------------
export function BrandAppScreen({ toast = true }: { toast?: boolean }) {
  const accent = '#7B61FF'
  return (
    <div className="relative h-full bg-[#F7F6FB]">
      {toast && <Toast accent={accent} title="Your cart misses you 🛍️" body="2 items are still in stock. 10% off, today only." />}
      <div className="rounded-b-[28px] bg-gradient-to-br from-[#7B61FF] to-[#4C8DFF] pb-5 text-white">
        <StatusBar light />
        <div className="px-5">
          <p className="text-[11px] text-white/75">Welcome back</p>
          <p className="font-display text-[20px] leading-tight font-bold">Hi Priya 👋</p>
          <div className="mt-3 rounded-[16px] bg-white/15 p-3 ring-1 ring-white/20">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 font-semibold"><Star className="size-3 fill-current text-amber-300" /> 1,240 points</span>
              <span className="text-white/75">260 to next reward</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/20"><div className="h-full w-[82%] rounded-full bg-[#C9F45B]" /></div>
          </div>
        </div>
      </div>
      <div className="mx-4 -mt-3 flex items-center justify-between rounded-[14px] bg-[#C9F45B] px-3 py-2 text-[10px] font-bold text-ink shadow-sm">
        <span className="flex items-center gap-1"><Mobile className="size-3.5" /> App-only: 15% off today</span><span className="flex items-center gap-0.5">Shop <Arrow className="size-3" /></span>
      </div>
      <p className="mx-5 mt-4 text-[12px] font-bold">Picked for you</p>
      <div className="mt-2 flex gap-2.5 overflow-hidden px-4">
        {([[photo.serumClear, 'Glow serum', '₹899'], [photo.creamWhite, 'Day cream', '₹649'], [photo.serumAmber, 'Vitamin C drops', '₹1,099']] as [string, string, string][]).map(([img, n, p]) => (
          <div key={n} className="w-[92px] shrink-0 rounded-[14px] bg-white p-1.5 shadow-sm">
            <Product img={img} className="h-[84px]" />
            <p className="mt-1.5 truncate px-0.5 text-[9.5px] font-semibold">{n}</p>
            <p className="px-0.5 text-[9px] text-ink/50">{p}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-[14px] bg-white p-2.5 shadow-sm">
        <span className="grid size-7 place-items-center rounded-full bg-[#EDE9FF] text-[#7B61FF]"><Bell className="size-3.5" /></span>
        <span className="text-[9.5px] leading-tight"><b>Back in stock:</b> Rose clay mask<br /><span className="text-ink/50">You asked us to tell you</span></span>
      </div>
      <TabBar accent={accent} />
    </div>
  )
}

// ---- 3. Industry screens -----------------------------------------------
interface RingProps {
  pct: number
  color: string
  size?: number
  stroke?: number
  children?: ReactNode
}

function Ring({ pct, color, size = 132, stroke = 12, children }: RingProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-black/5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ '--ring-full': c, animation: 'ring 1.4s ease-out both' } as CSSProperties} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function HealthScreen() {
  const accent = '#10B981'
  return (
    <div className="relative h-full bg-[#F2FBF7]">
      <Toast accent={accent} from="Ferro Fuel" icon={Sparkle} title="2,158 steps to go 🔥" body="Hit 10k today and unlock 10% off protein." />
      <StatusBar />
      <div className="px-5">
        <p className="text-[11px] text-ink/50">Today’s walk</p>
        <p className="font-display text-[19px] font-bold">Step challenge</p>
      </div>
      <div className="mt-3">
        <Ring pct={0.78} color={accent}>
          <div><p className="font-display text-[26px] leading-none font-extrabold">7,842</p><p className="mt-1 text-[9px] text-ink/50">of 10,000 steps</p></div>
        </Ring>
      </div>
      <div className="mx-5 mt-4 flex items-end justify-between gap-1.5">
        {[0.5, 0.8, 0.65, 1, 0.9, 0.4, 0.78].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-[4px]" style={{ height: 38 * h, background: i === 6 ? accent : '#CDEFE2' }} />
            <span className="text-[8px] text-ink/40">{'MTWTFSS'[i]}</span>
          </div>
        ))}
      </div>
      <p className="mx-5 mt-4 text-[11px] font-bold">Fuel your walk</p>
      <div className="mx-4 mt-2 grid grid-cols-2 gap-2">
        {([[photo.protein, 'Whey vanilla'], [photo.proteinJar, 'Protein blend']] as [string, string][]).map(([img, n]) => (
          <div key={n} className="rounded-[12px] bg-white p-1.5 shadow-sm">
            <Product img={img} className="h-16" />
            <p className="mt-1 text-[9px] font-semibold">{n}</p>
          </div>
        ))}
      </div>
      <TabBar accent={accent} />
    </div>
  )
}

export function BeautyScreen() {
  const accent = '#E11D74'
  const shades = ['#F6D7C3', '#EBC2A5', '#D9A57F', '#C08A62', '#9C6B4A', '#6E4A33']
  return (
    <div className="relative h-full bg-[#FFF5F8]">
      <StatusBar />
      <div className="px-5">
        <p className="text-[11px] text-ink/50">Shade finder</p>
        <p className="font-display text-[19px] font-bold">Find your match</p>
      </div>
      <div className="relative mx-auto mt-3 size-[140px] overflow-hidden rounded-full ring-4 ring-white">
        <img src={photo.face} alt="" draggable="false" className="absolute inset-0 size-full object-cover" style={{ objectPosition: '50% 30%' }} />
        <span className="absolute inset-3 rounded-full border-2 border-dashed border-white/80" />
        <span className="absolute inset-x-6 h-px bg-white/90 shadow-[0_0_8px_white]" style={{ animation: 'scan 3s ease-in-out infinite' }} />
      </div>
      <p className="mt-3 text-center text-[10px] text-ink/50">Scanning under natural light…</p>
      <div className="mx-5 mt-3 flex justify-between">
        {shades.map((s, i) => <span key={s} className={`size-7 rounded-full ${i === 2 ? 'ring-2 ring-offset-2' : ''}`} style={{ background: s, '--tw-ring-color': accent } as CSSProperties} />)}
      </div>
      <div className="mx-4 mt-4 rounded-[16px] bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Product img={photo.serumWhite} className="size-12" />
          <div className="text-[10px] leading-tight">
            <p className="font-bold">Your match: Warm Sand 03</p>
            <p className="text-ink/50">96% match · Skin tint</p>
            <p className="mt-1 flex items-center gap-0.5 font-bold" style={{ color: accent }}>Add to routine <Arrow className="size-3" /></p>
          </div>
        </div>
      </div>
      <TabBar accent={accent} active={1} />
    </div>
  )
}

export function FashionScreen() {
  const accent = '#111827'
  return (
    <div className="relative h-full bg-[#F7F5F2]">
      <StatusBar />
      <div className="px-5">
        <p className="text-[11px] text-ink/50">Linen overshirt</p>
        <p className="font-display text-[19px] font-bold">Size guide</p>
      </div>
      <Product img={photo.fashionLook} pos="50% 20%" className="mx-4 mt-3 h-[130px]" />
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="rounded-[12px] bg-white p-2.5"><p className="text-ink/50">Height</p><p className="font-bold">165 cm</p></div>
        <div className="rounded-[12px] bg-white p-2.5"><p className="text-ink/50">Usual fit</p><p className="font-bold">Regular</p></div>
      </div>
      <div className="mx-4 mt-2 flex gap-1.5">
        {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
          <span key={s} className={`grid h-8 flex-1 place-items-center rounded-[10px] text-[10px] font-bold ${s === 'M' ? 'bg-ink text-white' : 'bg-white text-ink/60'}`}>{s}</span>
        ))}
      </div>
      <div className="mx-4 mt-2 flex items-center gap-2 rounded-[12px] bg-[#E8F6EE] p-2.5 text-[9.5px] leading-tight text-[#166534]">
        <Check className="size-4 shrink-0" strokeWidth={3} /> 92% of shoppers like you kept size M
      </div>
      <p className="mx-5 mt-3 text-[11px] font-bold">Complete the look</p>
      <div className="mx-4 mt-2 grid grid-cols-3 gap-2">
        {[photo.sneakers, photo.shirtBlue, photo.shirtLinen].map((img) => <Product key={img} img={img} className="h-14" />)}
      </div>
      <TabBar accent={accent} active={1} />
    </div>
  )
}

export function FoodScreen() {
  const accent = '#EA580C'
  const items: [string, string, boolean][] = [['Oat milk, 1L', '×2', true], ['Sourdough loaf', '×1', true], ['Free-range eggs', '×12', true], ['Greek yoghurt', '×1', false]]
  return (
    <div className="relative h-full bg-[#FFF8F1]">
      <Toast accent={accent} from="Harvo Fresh" icon={Clock} title="Out for delivery 🛵" body="Ravi is 12 minutes away with your order." />
      <StatusBar />
      <div className="px-5">
        <p className="text-[11px] text-ink/50">Every Sunday</p>
        <p className="font-display text-[19px] font-bold">Your usual basket</p>
      </div>
      <Product img={photo.groceryBag} className="mx-4 mt-2 h-14" />
      <div className="mx-4 mt-2 space-y-1.5">
        {items.map(([n, q, on]) => (
          <div key={n} className="flex items-center gap-2.5 rounded-[12px] bg-white p-2.5 text-[10.5px]">
            <span className={`grid size-4 place-items-center rounded-[5px] ${on ? 'text-white' : 'ring-1 ring-ink/20'}`} style={on ? { background: accent } : {}}>{on && <Check className="size-3" strokeWidth={3} />}</span>
            <span className="flex-1 font-medium">{n}</span>
            <span className="text-ink/40">{q}</span>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 rounded-[16px] bg-white p-3">
        <p className="text-[10px] font-bold">Delivery tracking</p>
        <div className="mt-2.5 flex items-center">
          {['Packed', 'On the way', 'Delivered'].map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center">
                <span className={`h-0.5 flex-1 ${i === 0 ? 'opacity-0' : ''}`} style={{ background: i <= 1 ? accent : '#E5E7EB' }} />
                <span className="size-3 rounded-full" style={{ background: i <= 1 ? accent : '#E5E7EB' }} />
                <span className={`h-0.5 flex-1 ${i === 2 ? 'opacity-0' : ''}`} style={{ background: i < 1 ? accent : '#E5E7EB' }} />
              </div>
              <span className="text-[8.5px] text-ink/50">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 mt-3 rounded-full py-2.5 text-center text-[11px] font-bold text-white" style={{ background: accent }}>Reorder all · ₹1,240</div>
      <TabBar accent={accent} active={3} />
    </div>
  )
}

// ---- Website → app morph: one phone, a wipe that turns the plain mobile
// site into the brand app. Sweeps on its own; visitors can drag it. --------
export function MorphPhone({ width = 290, finish = 'titanium' }: { width?: number; finish?: FinishKey }) {
  const [cut, setCut] = useState(88)
  const drag = useRef(false)
  const idleUntil = useRef(0)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCut(50); return }
    let raf: number
    const t0 = performance.now()
    const tick = (t: number) => {
      if (!drag.current && t > idleUntil.current) {
        // ease back and forth: mostly showing the app, with a peek at the website
        const k = (Math.sin((t - t0) / 1900 - 1.2) + 1) / 2
        setCut(8 + k * 80)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const r = box.current!.getBoundingClientRect()
    setCut(Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)))
  }
  const start = (e: React.PointerEvent<HTMLDivElement>) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e) }
  const end = () => { drag.current = false; idleUntil.current = performance.now() + 3500 }

  return (
    <Phone width={width} finish={finish}>
      {/* one status bar across both screens: each screen hides its own, so the split never shows two */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[67]"><StatusBar /></div>
      <div ref={box} className="absolute inset-0 cursor-ew-resize touch-none select-none [&_[data-statusbar]]:invisible" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
        role="slider" aria-label="Compare your website with the app" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(cut)}>
        <div className="absolute inset-0"><WebsiteScreen /></div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${cut}%)` }}><WatchAppScreen /></div>
        <div className="pointer-events-none absolute inset-y-0 z-[66] w-[2px] bg-white shadow-[0_0_14px_rgba(201,244,91,0.9)]" style={{ left: `${cut}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cta text-ink shadow-lg ring-4 ring-white/70"><DragHandle className="size-5" strokeWidth={2.5} /></span>
        </div>
        <span className="pointer-events-none absolute bottom-20 left-3 z-[66] rounded-full bg-black/70 px-2 py-1 text-[9px] font-bold text-white transition-opacity" style={{ opacity: cut > 30 ? 1 : 0 }}>Your website</span>
        <span className="pointer-events-none absolute right-3 bottom-20 z-[66] rounded-full bg-cta px-2 py-1 text-[9px] font-bold text-ink transition-opacity" style={{ opacity: cut < 70 ? 1 : 0 }}>{brand.name} app</span>
      </div>
    </Phone>
  )
}

// ---- More brands, so every phone on the site isn't the same app ---------

// VYNTRA. — a sneaker brand: dark, bold, lime.
export const vyntraNotes: LockNote[] = [
  [ShoppingBag, 'Still thinking about the Cloud Runner?', 'Your size 9 is almost gone.'],
  [Sparkle, 'New drop: Trail Pro', 'Members get first access. Live now in the app.'],
  [Truck, 'Your order is on its way', 'Arriving tomorrow before 1 pm.'],
]

export function SneakerAppScreen() {
  const lime = '#C9F45B'
  return (
    <div className="relative h-full bg-[#0E0E10] text-white">
      <StatusBar light />
      <div className="flex items-center justify-between px-4">
        <span className="font-display text-[19px] font-black tracking-tight italic">VYNTRA<span style={{ color: lime }}>.</span></span>
        <span className="flex items-center gap-3 text-white/80"><Heart className="size-4" /><Cart className="size-4" /></span>
      </div>
      <div className="relative mx-3 mt-3 h-[150px] overflow-hidden rounded-[18px]" style={{ background: lime }}>
        <img src={photo.sneakers} alt="" draggable="false" className="absolute top-0 right-0 h-full w-[62%] object-cover" />
        <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#C9F45B] via-[#C9F45B] to-transparent" />
        <div className="absolute bottom-3 left-3 text-ink">
          <p className="text-[8.5px] font-bold tracking-widest uppercase">New drop</p>
          <p className="font-display text-[22px] leading-[0.9] font-black italic">CLOUD<br />RUNNER</p>
          <span className="mt-2 inline-block rounded-full bg-ink px-2.5 py-1 text-[9px] font-bold text-white">Shop now</span>
        </div>
      </div>
      <div className="mt-3 flex gap-1.5 overflow-hidden px-3">
        {['All', 'Running', 'Lifestyle', 'Trail'].map((c, i) => (
          <span key={c} className={`shrink-0 rounded-full px-3 py-1.5 text-[9.5px] font-bold ${i === 1 ? 'text-ink' : 'bg-white/10 text-white/70'}`} style={i === 1 ? { background: lime } : undefined}>{c}</span>
        ))}
      </div>
      <p className="mx-4 mt-3 flex justify-between text-[11px] font-bold">Trending <span className="font-medium text-white/45">See all</span></p>
      <div className="mx-3 mt-2 grid grid-cols-2 gap-2">
        {([[photo.runner, 'Run Club', 'Join free', '50% 40%'], [photo.sneakers, 'Court Low', '₹6,499', 'center']] as [string, string, string, string][]).map(([img, n, p, pos]) => (
          <div key={n} className="rounded-[14px] bg-white/[0.06] p-1.5">
            <Product img={img} pos={pos} className="h-[70px]" />
            <p className="mt-1.5 px-0.5 text-[9.5px] font-semibold">{n}</p>
            <p className="px-0.5 text-[9px] text-white/50">{p}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-white/10 bg-[#0E0E10]/95 px-3 pt-2 pb-6 backdrop-blur">
        {([['Home', Sparkle], ['Shop', Heart], ['Drops', Bell], ['Bag', Cart]] as [string, IconComponent][]).map(([t, Ic], i) => (
          <span key={t} className="flex flex-col items-center gap-0.5 text-[9px] font-semibold" style={{ color: i === 0 ? lime : 'rgba(255,255,255,0.45)' }}><Ic className="size-[17px]" />{t}</span>
        ))}
      </div>
    </div>
  )
}

// LINNAVE — a fashion label: cream, editorial, quiet.
export function FashionStoreScreen() {
  const ink = '#2B2620'
  return (
    <div className="relative h-full bg-[#F4EFE8]" style={{ color: ink }}>
      <StatusBar />
      <p className="text-center font-display text-[13px] font-bold tracking-[0.35em]">LINNAVE</p>
      <div className="relative mt-3 h-[205px] overflow-hidden">
        <img src={photo.fashionLook} alt="" draggable="false" className="absolute inset-0 size-full object-cover" style={{ objectPosition: '50% 18%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 text-white">
          <p className="text-[8.5px] font-semibold tracking-[0.25em] uppercase">Summer 26</p>
          <p className="font-display text-[22px] leading-none font-bold">The Linen Edit</p>
          <p className="mt-1.5 flex items-center gap-1 text-[9.5px] font-semibold">Shop the edit <Arrow className="size-3" /></p>
        </div>
      </div>
      <p className="mx-4 mt-3 flex justify-between text-[11px] font-bold tracking-wide uppercase">New in <span className="font-medium normal-case opacity-50">View all</span></p>
      <div className="mt-2 flex gap-2 overflow-hidden px-4">
        {([[photo.shirtLinen, 'Linen shirt', '₹3,290'], [photo.shirtBlue, 'Indigo overshirt', '₹4,150'], [photo.sneakers, 'Canvas low', '₹2,890']] as [string, string, string][]).map(([img, n, p]) => (
          <div key={n} className="w-[86px] shrink-0">
            <Product img={img} className="h-[100px] !rounded-[4px]" />
            <p className="mt-1.5 truncate text-[9.5px] font-semibold">{n}</p>
            <p className="text-[9px] opacity-60">{p}</p>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-black/5 bg-[#F4EFE8]/95 px-3 pt-2 pb-6">
        {([['Home', Sparkle], ['Shop', Heart], ['Saved', Gift], ['Bag', Cart]] as [string, IconComponent][]).map(([t, Ic], i) => (
          <span key={t} className="flex flex-col items-center gap-0.5 text-[9px] font-semibold" style={{ color: i === 0 ? ink : '#A39A8E' }}><Ic className="size-[17px]" />{t}</span>
        ))}
      </div>
    </div>
  )
}

// Harvo Fresh — a quick-commerce grocer: fresh green, fast.
export function GroceryAppScreen() {
  const green = '#16A34A'
  return (
    <div className="relative h-full bg-[#F2F8F3]">
      <StatusBar />
      <div className="px-4">
        <p className="flex items-center gap-1 text-[9.5px] font-bold" style={{ color: green }}><Clock className="size-3" /> Delivering in 12 min</p>
        <p className="font-display text-[18px] font-bold">Harvo Fresh</p>
        <div className="mt-2 rounded-[12px] bg-white px-3 py-2 text-[10px] text-ink/40 shadow-sm ring-1 ring-black/5">Search “eggs”, “sourdough”…</div>
      </div>
      <div className="relative mx-3 mt-3 h-[88px] overflow-hidden rounded-[16px]">
        <img src={photo.groceryBag} alt="" draggable="false" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14532D]/85 to-transparent" />
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-white">
          <p className="font-display text-[14px] leading-tight font-bold">Fresh this<br />morning</p>
          <p className="mt-1 text-[9px] text-white/80">Free delivery over ₹499</p>
        </div>
      </div>
      <div className="mx-3 mt-3 grid grid-cols-4 gap-1.5 text-center">
        {([['🥬', 'Veg', '#DCFCE7'], ['🍎', 'Fruit', '#FEE2E2'], ['🥛', 'Dairy', '#E0F2FE'], ['🥖', 'Bakery', '#FEF3C7']] as [string, string, string][]).map(([e, n, bg]) => (
          <div key={n}><div className="grid h-11 place-items-center rounded-[12px] text-[18px]" style={{ background: bg }}>{e}</div><p className="mt-1 text-[9px] font-semibold">{n}</p></div>
        ))}
      </div>
      <p className="mx-4 mt-3 text-[11px] font-bold">Buy again</p>
      <div className="mx-3 mt-1.5 space-y-1.5">
        {([['Oat milk, 1L', '₹189'], ['Free-range eggs ×12', '₹139']] as [string, string][]).map(([n, p]) => (
          <div key={n} className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2 text-[10px] shadow-sm">
            <span className="font-medium">{n}</span>
            <span className="flex items-center gap-2"><span className="text-ink/50">{p}</span><span className="grid size-5 place-items-center rounded-md text-[12px] font-bold text-white" style={{ background: green }}>+</span></span>
          </div>
        ))}
      </div>
      <TabBar accent={green} />
    </div>
  )
}

// QUELLON — a watchmaker: cream and gold, unhurried. The hero's app.
export function WatchAppScreen() {
  const gold = '#B08D57'
  const ink = '#1F1B16'
  const ref = useRef<HTMLDivElement>(null)
  const straps: [string, string, string][] = [['Mint', '#7FD1B9', photo.watchMint], ['Blush', '#F2C6C2', photo.watchPink], ['Noir', '#222', photo.watchBlack]]
  const at = useTicker(straps.length, 2400, ref)
  return (
    <div ref={ref} className="relative h-full bg-[#F6F2EB]" style={{ color: ink }}>
      <StatusBar />
      <div className="flex items-center justify-between px-4">
        <Menu className="size-4 opacity-70" />
        <span className="font-display text-[14px] font-bold tracking-[0.4em]">QUELLON</span>
        <Cart className="size-4 opacity-70" />
      </div>
      <div className="relative mx-3 mt-3 h-[178px] overflow-hidden rounded-[18px]">
        <img src={photo.watchHand} alt="" draggable="false" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-[8.5px] font-semibold tracking-[0.25em] uppercase" style={{ color: '#F3DFB8' }}>New · Meridian</p>
          <p className="font-display text-[20px] leading-none font-bold">The Meridian 38</p>
          <p className="mt-1 text-[9.5px] text-white/80">Free engraving, only in the app</p>
        </div>
      </div>
      <div className="mx-4 mt-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold">Strap: <span className="opacity-60">{straps[at][0]}</span></span>
        <span className="flex gap-1.5">
          {straps.map(([n, c], i) => <span key={n} className="size-4 rounded-full transition-all" style={{ background: c, boxShadow: i === at ? `0 0 0 2px #F6F2EB, 0 0 0 3.5px ${gold}` : 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />)}
        </span>
      </div>
      <p className="mx-4 mt-3 text-[11px] font-bold tracking-wide uppercase">The collection</p>
      <div className="mt-2 flex gap-2 overflow-hidden px-3">
        {straps.map(([n, , img], i) => (
          <div key={n} className={`w-[86px] shrink-0 rounded-[12px] bg-white p-1.5 shadow-sm transition-all ${i === at ? 'ring-1' : ''}`} style={i === at ? { '--tw-ring-color': gold } as CSSProperties : undefined}>
            <Product img={img} className="h-[78px] !rounded-[8px]" />
            <p className="mt-1.5 px-0.5 text-[9.5px] font-semibold">Meridian {n}</p>
            <p className="px-0.5 text-[9px] opacity-55">₹14,900</p>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 rounded-full py-2.5 text-center text-[10.5px] font-bold text-white" style={{ background: ink }}>Book a try-on at our studio</div>
      <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-black/5 bg-[#F6F2EB]/95 px-3 pt-2 pb-6">
        {([['Home', Sparkle], ['Shop', Heart], ['Saved', Gift], ['Bag', Cart]] as [string, IconComponent][]).map(([t, Ic], i) => (
          <span key={t} className="flex flex-col items-center gap-0.5 text-[9px] font-semibold" style={{ color: i === 0 ? gold : '#A79F93' }}><Ic className="size-[17px]" />{t}</span>
        ))}
      </div>
    </div>
  )
}
