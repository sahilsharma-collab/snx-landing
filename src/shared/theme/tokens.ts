// The single source of truth for brand colour and type.
//
// These same values are mirrored into the Tailwind theme in
// src/shared/styles/index.css (@theme), so utility classes like `bg-ink`,
// `text-cta` and `font-display` resolve to exactly what's defined here.
// Change a value in both places — or import from here when you need the raw
// value in TS/JS (inline styles, canvas, gradients built in code, etc.).

export const colors = {
  ink: '#080C1C', // dark bands: deep navy
  ink2: '#10172F', // cards on dark
  ink3: '#1A2344',
  cream: '#F5F7FF', // headline white on dark
  paper: '#F6F5F1', // light bands
  card: '#FFFFFF',
  line: '#E6E3DC',
  body: '#4A4F63', // body copy on light
  mist: '#A3AAC4', // body copy on dark
  brand: '#7B61FF', // violet
  brand2: '#4C8DFF', // blue
  mint: '#7BE0C3',
  pink: '#FF7BB0',
  cta: '#C9F45B', // the one CTA colour, every page
  ctaHover: '#B8E746',
  save: '#1F9D55',
} as const

export const fonts = {
  display: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
  sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
} as const

export type ColorToken = keyof typeof colors
export type FontToken = keyof typeof fonts
