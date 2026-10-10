// Shapes for everything in src/shared/config/site.ts. Kept here so components
// can import a type without pulling in the data, and so the data file reads as
// a plain content file with the types doing the checking.

export type StatusKey = 'core' | 'live' | 'beta' | 'soon' | 'mixed'
export type MoodKey = 'laugh' | 'smile' | 'meh' | 'annoyed' | 'frown'

export interface Brand {
  name: string
  slug: string
  tagline: string
  demoUrl: string
  salesEmail: string
}

export interface Stat {
  value: string
  label: string
}

export interface Plan {
  id: string
  name: string
  monthly: number
  blurb: string
  cta: string
  features: string[]
  popular?: boolean
  note?: string
}

/** A feature-matrix cell: true = included, false = not, string = a note. */
export type MatrixCell = boolean | string
/** [label, growthValue, proValue] */
export type MatrixRow = [string, MatrixCell, MatrixCell]
export interface MatrixGroup {
  group: string
  rows: MatrixRow[]
}

/** `caps` entries are a bare string, or [text, status] when one item's status
 *  differs from the feature's overall status. */
export type FeatureCap = string | [string, StatusKey]
/** [heading, items] */
export type FeatureGroup = [string, string[]]

export interface Feature {
  slug: string
  icon: string
  name: string
  short: string
  status: StatusKey
  hero: string
  sub: string
  what?: string
  groups?: FeatureGroup[]
  caps?: FeatureCap[]
  how?: string
  next: string[]
}

export interface WhyUsItem {
  icon: string
  problem: string
  fix: string
  outcome: string
  status: StatusKey
}

export interface HowStep {
  icon: string
  label: string
  title: string
  body: string
  chip: string
  you: string
  when: string
}

/** [label, hexColor, moodKey] */
export type JourneyStatus = [string, string, MoodKey]
export interface JourneyStage {
  day: string
  stage: string
  title: string
  body: string
  trigger: string
  goal: string
  status: JourneyStatus
  template: string
}

/** 'yes' full · 'part' partial/beta · 'no' none · null = text-only cell. */
export type CompareMark = 'yes' | 'part' | 'no' | null
/** [mark] or [mark, note]. */
export type CompareCell = [CompareMark] | [CompareMark, string]
/** [label, us, ...competitors] */
export type CompareRow = [string, ...CompareCell[]]
export interface CompareGroup {
  group: string
  rows: CompareRow[]
}

export interface CompetitorStrip {
  visual: string
  title: string
  body: string
}
export interface CompetitorPlan {
  tier: string
  them: number | null
  themLabel?: string
  us: number
}
export interface Competitor {
  name: string
  checked: string | null
  line: string
  pills: string[]
  strips: CompetitorStrip[]
  fair: string
  counter: string
  pricing: string
  priceCheckedOn?: string
  // NOTE: PricingPage reads `verifiedOn`, but the data only sets
  // `priceCheckedOn` — so the "checked …" date currently renders blank.
  // Kept as-is to preserve existing behavior; see the refactor notes.
  verifiedOn?: string
  plans?: CompetitorPlan[]
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  metric: string
  metricLabel: string
}

export interface Calculator {
  appShare: number
  revShare: number
  min: number
  max: number
  step: number
  start: number
}

export interface UpcomingPost {
  topic: string
  title: string
}
