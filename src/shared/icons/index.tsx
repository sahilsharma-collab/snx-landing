// One icon set for the whole site: Lucide (consistent 24px line icons) for
// UI, Simple Icons for official brand marks. The names below are what the
// rest of the code imports, so swapping a glyph only happens here.
import type { SVGProps } from 'react'
import {
  Check as LCheck, X, ArrowRight, Bell as LBell, BellRing as LBellRing, ShoppingCart, Star as LStar, Sparkles,
  Palette as LPalette, Percent as LPercent, Plug as LPlug, Paintbrush, Rocket as LRocket, Heart as LHeart,
  Gift as LGift, Clock as LClock, ArrowLeftRight, ShieldCheck, Plus as LPlus, Menu as LMenu, BarChart3,
  Smartphone, User as LUser, CreditCard, Clapperboard, RefreshCw, MessageSquare, Code2,
  ShoppingBag as LShoppingBag, Truck as LTruck, Lock as LLock, Flashlight as LFlashlight, Camera as LCamera,
  ChevronLeft as LChevronLeft, ChevronRight as LChevronRight, ChevronsLeftRight, Dumbbell as LDumbbell,
  Shirt as LShirt, ShoppingBasket as LBasket, Laugh, Smile, Meh, Annoyed, Frown, Smartphone as LPhone, TrendingUp, BookOpen, Scale as LScale, LayoutGrid, CalendarClock, Target as LTarget,
  type LucideIcon, type LucideProps,
} from 'lucide-react'
import { siApple, siAndroid, siShopify } from 'simple-icons'

export type IconComponent = (props: LucideProps) => JSX.Element

// Lucide icons with the site's defaults: 20px, a slightly finer stroke.
const wrap = (Icon: LucideIcon): IconComponent => {
  const C = ({ className = 'size-5', strokeWidth = 1.85, ...p }: LucideProps) => (
    <Icon className={className} strokeWidth={strokeWidth} aria-hidden {...p} />
  )
  return C
}

export const Check = wrap(LCheck)
export const Cross = wrap(X)
export const Arrow = wrap(ArrowRight)
export const Bell = wrap(LBell)
export const BellRing = wrap(LBellRing)
export const Cart = wrap(ShoppingCart)
export const Star = wrap(LStar)
export const Sparkle = wrap(Sparkles)
export const Palette = wrap(LPalette)
export const Percent = wrap(LPercent)
export const Plug = wrap(LPlug)
export const Brush = wrap(Paintbrush)
export const Rocket = wrap(LRocket)
export const Heart = wrap(LHeart)
export const Gift = wrap(LGift)
export const Clock = wrap(LClock)
export const Swap = wrap(ArrowLeftRight)
export const Shield = wrap(ShieldCheck)
export const Plus = wrap(LPlus)
export const Menu = wrap(LMenu)
export const Chart = wrap(BarChart3)
export const Mobile = wrap(Smartphone)
export const User = wrap(LUser)
export const Card = wrap(CreditCard)
export const Film = wrap(Clapperboard)
export const Refresh = wrap(RefreshCw)
export const Chat = wrap(MessageSquare)
export const Code = wrap(Code2)
export const ShoppingBag = wrap(LShoppingBag)
export const Truck = wrap(LTruck)
export const Lock = wrap(LLock)
export const Flashlight = wrap(LFlashlight)
export const Camera = wrap(LCamera)
export const ChevronLeft = wrap(LChevronLeft)
export const ChevronRight = wrap(LChevronRight)
export const DragHandle = wrap(ChevronsLeftRight)
export const Dumbbell = wrap(LDumbbell)
export const Shirt = wrap(LShirt)
export const Basket = wrap(LBasket)
export const Phone = wrap(LPhone)
export const TrendUp = wrap(TrendingUp)
export const Book = wrap(BookOpen)
export const Scale = wrap(LScale)

// Custom, on-brand glyphs for the Resources menu (not stock lucide).
// Blog: an article/journal page with a bold title + text lines and a corner fold.
export const BlogGlyph: IconComponent = ({ className = 'size-5', strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M14 3.5H7A2.5 2.5 0 0 0 4.5 6v12A2.5 2.5 0 0 0 7 20.5h10A2.5 2.5 0 0 0 19.5 18V9z" />
    <path d="M14 3.5V9h5.5" />
    <path d="M8 13h8" />
    <path d="M8 16.5h5.5" />
  </svg>
)
// Compare: two panels side by side with a dashed "versus" divider.
export const CompareGlyph: IconComponent = ({ className = 'size-5', strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <rect x="3.5" y="5" width="7" height="14" rx="2.2" />
    <rect x="13.5" y="5" width="7" height="14" rx="2.2" />
    <path d="M12 3.5v17" strokeDasharray="1.4 2.6" opacity="0.7" />
  </svg>
)
export const Grid = wrap(LayoutGrid)
export const When = wrap(CalendarClock)
export const Target = wrap(LTarget)

// Customer mood faces for the retention journey.
export const moods: Record<string, IconComponent> = { laugh: wrap(Laugh), smile: wrap(Smile), meh: wrap(Meh), annoyed: wrap(Annoyed), frown: wrap(Frown) }

interface SimpleIcon {
  title: string
  path: string
}

// Official brand marks (filled, single colour).
const brandMark = (icon: SimpleIcon) => {
  const C = ({ className = 'size-5', ...p }: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-label={icon.title} {...p}><path d={icon.path} /></svg>
  )
  return C
}
export const Apple = brandMark(siApple)
export const Android = brandMark(siAndroid)
export const Shopify = brandMark(siShopify)

// Look up an icon by the name used in src/shared/config/site.ts.
export const iconFor = (name: string): IconComponent => {
  const map: Record<string, IconComponent> = { bell: Bell, cart: Cart, chart: Chart, phone: Mobile, user: User, card: Card, film: Film, refresh: Refresh, sparkle: Sparkle, plug: Plug, rocket: Rocket, chat: Chat, palette: Palette, brush: Brush, code: Code }
  return map[name] ?? Sparkle
}
