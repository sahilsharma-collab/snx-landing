// Everything a non-developer may need to change lives in this file.
// Values marked PLACEHOLDER are waiting on the partner / management
// (see "Open questions" in the research brief).
import type {
  Brand,
  HeroVariant,
  Stat,
  Plan,
  MatrixGroup,
  StatusKey,
  Feature,
  WhyUsItem,
  HowStep,
  JourneyStage,
  CompareGroup,
  Competitor,
  Testimonial,
  Calculator,
  UpcomingPost,
} from '@/shared/types/site'

export const brand: Brand = {
  name: 'Nuvo', // PLACEHOLDER: product name not decided yet
  slug: 'nuvo',
  tagline: 'We don’t clone your website. We build your brand.',
  // Where every "Book a demo" button goes. Swap for a Calendly / HubSpot link.
  demoUrl: '#book-demo',
  salesEmail: 'sales@example.com', // PLACEHOLDER
}

// Home hero copy. Pick a variant with ?v=<key> in the URL (e.g. /?v=original)
// to test them side by side; with no ?v= the first one is shown.
// `highlight` is the part of the headline drawn in the shimmer gradient.
// PLACEHOLDER: the ₹2–3 lakh uplift is an estimate, not yet backed by data.
export const heroVariants: Record<string, HeroVariant> = {
  lakh: {
    pill: 'Shopify store → iOS + Android app',
    before: 'Your website, made',
    highlight: 'better',
    after: 'as an app.',
    sub: 'Already doing ₹15–20 lakh a month on Shopify? Your own app could add ₹2–3 lakh more, every month. We add the features your website can’t have, designed around your brand, with 0% commission.',
  },
  original: {
    pill: 'Shopify store → iOS + Android app',
    before: 'Your website, made',
    highlight: 'better',
    after: 'as an app.',
    sub: 'We don’t just copy your website into an app. We add the features your website can’t have, and build your brand while we do it. Designed around your brand, with AI built in and 0% commission.',
  },
}

// Hero stats — PLACEHOLDER numbers, to be supplied by the partner.
export const stats: Stat[] = [
  { value: '14 days', label: 'from signup to live on both stores' },
  { value: '500+', label: 'stores already running an app' },
  { value: '32%', label: 'of revenue comes through the app' },
]

// Pricing: two plans, Growth and Pro. Pro is the one we push.
export const yearlyDiscount = 0.2 // PLACEHOLDER: 20% off when billed yearly

export const plans: Plan[] = [
  {
    id: 'growth',
    name: 'Growth',
    monthly: 299,
    blurb: 'For brands getting their app live and bringing shoppers back.',
    cta: 'Start free trial',
    features: [
      'iOS and Android apps',
      'Brand templates, set up for you',
      'Automated push notifications',
      'Cart and back-in-stock reminders',
      'Analytics dashboard',
      'Email and chat support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 599,
    popular: true,
    note: 'The plan most brands choose', // PLACEHOLDER: keep only while it's true
    blurb: 'For brands that want an app designed around them, with every growth tool.',
    cta: 'Start free trial',
    features: [
      'Everything in Growth',
      'Custom brand design by our team',
      'Loyalty points and rewards',
      'Industry features (step tracker, shade finder…)',
      'AI copilot (beta)',
      'Dedicated account manager, priority SLA',
    ],
  },
]

// Full feature matrix on /pricing. true = included, false = not, string = note.
export const planMatrix: MatrixGroup[] = [
  { group: 'Your app', rows: [
    ['iOS and Android apps', true, true],
    ['Commission on your sales', '0%', '0%'],
    ['Brand templates', true, true],
    ['Custom brand design by our team', false, true],
  ]},
  { group: 'Keep your customers', rows: [
    ['Push notifications', 'Automated', 'Automated + segmented'],
    ['Abandoned cart reminders', true, true],
    ['Back-in-stock alerts', true, true],
    ['Loyalty points and rewards', false, true],
    ['Personalised recommendations', true, true],
    ['App-only offers', true, true],
  ]},
  { group: 'Beyond a store', rows: [
    ['Industry features (step tracker, shade finder…)', 'Add-on', true],
    ['AI copilot (beta)', false, true],
    ['Analytics', true, true],
  ]},
  { group: 'Support', rows: [
    ['Support', 'Email + chat', 'Dedicated manager'],
    ['SLA', false, 'Priority'],
  ]},
]

// The built-in AI. AppBrew's is called "Milo"; ours needs its own name.
export const ai = {
  name: 'Guide AI', // PLACEHOLDER: name not decided (other ideas: Sage, Copilot, Muse)
}

// Status tags shown on features. Keep Beta / Coming soon honest: anything
// not fully live must not be shown as Live.
export const statuses: Record<StatusKey, string> = {
  core: 'Core',
  live: 'Live',
  beta: 'Beta',
  soon: 'Coming soon',
  mixed: 'Partly live',
}

// ---- Features: /features (cards) and /features/<slug> (detail pages) ------
// `caps` items are strings, or [text, status] when one item differs from the
// feature's overall status. `groups` replaces `caps` when they need headings.
export const features: Feature[] = [
  {
    slug: 'automations',
    icon: 'refresh',
    name: 'Lifecycle automations',
    short: '15 ready-made journeys (win-back, replenishment, cart recovery) on autopilot.',
    status: 'live',
    hero: 'Retention on autopilot. 15 journeys, zero manual work.',
    sub: 'The moment someone buys, lapses or abandons a cart, the right message goes out automatically.',
    what: 'A daily engine works out who is due for each journey and sends personalised, rotating copy, exactly once per person per stage.',
    groups: [
      ['Transactional', ['Order confirmed, payment received, shipped, out for delivery, delivered']],
      ['Lifecycle', ['Abandoned-cart recovery: 5 rotating messages, quiet-hours aware', 'New-product broadcasts']],
      ['Personalised', ['Post-purchase recommendations', 'Replenishment reminders', 'A 3-stage win-back ladder, plus recurring win-back', 'Category cross-sell', 'Re-engage inactive shoppers']],
      ['Control', ['Editable timing on every journey (“send 21–44 days after purchase”)', 'Editable copy with {name}, {product} and {recommendation} merge tags', 'No double sends: re-runs never repeat a message, and a new order resets a customer’s ladder']],
    ],
    how: 'Runs once a day at 3:30 PM IST for each store, with a full delivery history log.',
    next: ['A/B testing per journey', 'SMS and email channels', 'AI-tuned timing', 'Custom journey builder'],
  },
  {
    slug: 'analytics',
    icon: 'chart',
    name: 'Full-funnel analytics',
    short: 'Acquisition → revenue → retention in one dashboard, with app-vs-web attribution.',
    status: 'live',
    hero: 'Every metric that matters, from acquisition to loyalty, in one place.',
    sub: 'The full funnel, built for app commerce, with honest app-vs-web attribution.',
    what: '11 connected views covering the whole customer lifecycle. Every view filters by date range with real period-over-period comparisons.',
    caps: [
      'Overview (GMV, orders, AOV, commission), revenue trends, app vs web',
      'Acquisition funnel and growth (DAU/MAU, stickiness, traffic sources)',
      'Retention cohorts',
      'Order quality: refunds, RTO, COD vs prepaid',
      'Customers: new vs returning, LTV, repeat rate',
      'Top products, collections and discounts',
      'Push performance and feature ROI',
    ],
    how: 'Metrics that come from orders are real from day one. Behaviour views fill in as your app starts sending events.',
    next: ['Saved segments', 'Exportable reports', 'Cohort drill-downs', 'Benchmarks against your category'],
  },
  {
    slug: 'native-app',
    icon: 'phone',
    name: 'Native app, built by AI',
    short: 'Turn your Shopify store into a branded iOS & Android app. No code, no agency.',
    status: 'core',
    hero: 'Your store, as a native app. Live in days, not months.',
    sub: 'We generate a polished iOS and Android app from your Shopify catalogue, branding and content. You review, we publish.',
    what: 'Pulls products, collections, media and brand from Shopify and assembles a production app. No developers, no Figma hand-offs.',
    caps: [
      'Catalogue, collections and product pages synced automatically',
      'Your branding (logo, colours, app name) applied across the app',
      'Ready for push, analytics and personalisation from day one',
      'App Store and Google Play publishing handled for you',
    ],
    how: 'Install from Shopify → connect → we build → you approve → we ship. The app stays in sync through Shopify webhooks for orders, products, inventory and fulfilment.',
    next: ['White-label themes', 'A/B-testable layouts', 'Change screens without an app update'],
  },
  {
    slug: 'guide-ai',
    icon: 'sparkle',
    name: ai.name,
    short: 'Your built-in growth copilot: ask your data, draft campaigns, get next-step ideas.',
    status: 'beta',
    hero: 'Ask your store anything. Get the campaign written for you.',
    sub: 'An AI copilot that works from your own store’s data. It explains what’s happening and suggests what to do next.',
    what: `Two jobs: answer plain-English questions about your analytics (“why did repeat rate drop last month?”), and draft push and campaign copy in your brand voice.`,
    caps: [
      ['Questions about your analytics, answered in plain English', 'soon'],
      ['One-click campaign and notification copywriting (“Draft with AI”)', 'beta'],
      'Suggested next actions (“12 customers hit the win-back window. Send?”)',
      'Rotating messages generated for your automations',
    ],
    how: 'Runs on Anthropic’s Claude models, using only your store’s data. Every suggestion is a draft you approve before anything is sent.',
    next: ['Weekly insight digest', 'Anomaly alerts', 'AI-chosen send times', 'AI segment builder'],
  },
  {
    slug: 'push',
    icon: 'bell',
    name: 'Push & campaigns',
    short: 'Reach shoppers on their home screen with targeted broadcasts and real delivery stats.',
    status: 'live',
    hero: 'The marketing channel you actually own.',
    sub: 'No algorithm, no ad spend. Land directly on the home screen, with results you can measure.',
    what: 'Write and send targeted push broadcasts to every device or by platform, with deep links to products, collections or the home screen, and real delivery reporting.',
    caps: [
      ['Audience targeting: everyone, iOS or Android', 'live'],
      ['Customer segments', 'soon'],
      'Deep link to any product, collection or screen',
      'Delivery stats: recipients, accepted, click-through, attributed revenue',
      'Inactive devices cleaned up automatically, so your reach numbers are real',
    ],
    how: 'Sent to every registered device. Each send is logged and feeds the push analytics view.',
    next: ['Scheduled and recurring campaigns', 'Rich media and images', 'Location and behaviour segments', 'Send-time optimisation'],
  },
  {
    slug: 'personalization',
    icon: 'user',
    name: 'Personalization',
    short: 'Every push and screen tailored by what each shopper bought and browsed.',
    status: 'live',
    hero: 'A different app for every shopper.',
    sub: 'Recommendations and messages shaped by each person’s real purchase and browsing history.',
    caps: [
      'Personalised recommendations in automations and push ({recommendation} picks a product they haven’t bought, or a category they haven’t tried)',
      'Merge tags ({name}, {product}) across every journey',
      'Behaviour-based groups: lapsed, inactive, high lifetime value',
    ],
    next: ['Personalised home feed in the app', '“Recommended for you” rows', 'Predicted next purchase'],
  },
  {
    slug: 'checkout',
    icon: 'card',
    name: 'India-first checkout',
    short: 'COD, UPI, GoKwik & Razorpay: the payment stack Indian D2C actually needs.',
    status: 'beta',
    hero: 'Checkout that Indian shoppers trust.',
    sub: 'COD, UPI and one-tap payment: the stack that actually converts in India.',
    caps: [
      'Choose a checkout provider per store: GoKwik, Razorpay or native Shopify',
      'COD and prepaid, with COD-vs-prepaid and RTO analytics to manage risk',
      'Payment credentials stored securely for each store',
    ],
    next: ['Native in-app checkout', 'One-tap reorder', 'Wallet and UPI-intent flows'],
  },
  {
    slug: 'content',
    icon: 'film',
    name: 'Content & merchandising',
    short: 'Shoppable reels, blog sync, and live collections that update themselves.',
    status: 'mixed',
    hero: 'A storefront that feels alive.',
    sub: 'Your content and collections, always fresh in the app without anyone updating it by hand.',
    caps: [
      ['Blog and news synced from Shopify into the app', 'live'],
      ['Live collections and catalogue, always in sync', 'live'],
      ['Shoppable reels: short videos that open the product page', 'soon'],
    ],
    next: ['Wishlist', 'Reviews and ratings', 'Customer photo galleries', 'Lookbooks'],
  },
]

// Trust strip under the features grid.
export const trustPoints: string[] = ['Shopify-native', 'Commission-friendly pricing', 'Secure multi-tenant platform']

// ---- Home: "Why us" (problem → what we do → outcome) -------------------------
// Order matters: cart recovery, win-back and analytics lead (strongest + live).
export const whyUs: WhyUsItem[] = [
  { icon: 'cart', problem: 'Carts get abandoned and never recovered', fix: 'Automatic cart recovery: a timed sequence, not one nudge', outcome: 'More completed orders, zero manual work', status: 'live' },
  { icon: 'refresh', problem: 'Buyers disappear after a single order', fix: 'Win-back journeys and replenishment reminders that fire on their own', outcome: 'One-time buyers become repeat customers', status: 'live' },
  { icon: 'chart', problem: 'You’re guessing what’s actually working', fix: 'Full-funnel analytics, from acquisition to retention, app vs web', outcome: 'Decisions backed by data, not hunches', status: 'live' },
  { icon: 'bell', problem: 'Customers only return when they happen to remember you', fix: 'Push notifications and new-arrival alerts', outcome: 'You bring them back on your schedule, not the algorithm’s', status: 'live' },
  { icon: 'user', problem: 'Every shopper sees the same store', fix: 'Personalised picks and app-only offers', outcome: 'Bigger baskets, higher order value', status: 'live' },
  { icon: 'phone', problem: 'A templated app looks like everyone else’s', fix: 'A native app in your brand: AI-built, not a clone', outcome: 'Builds brand value, not a lookalike', status: 'live' },
  { icon: 'sparkle', problem: 'Marketing eats time you don’t have', fix: `${ai.name} drafts campaigns and answers questions about your store`, outcome: 'Campaigns out in minutes, not hours', status: 'beta' },
  { icon: 'card', problem: 'Indian shoppers bounce off unfamiliar checkouts', fix: 'COD, UPI and one-tap checkout built in', outcome: 'Fewer drop-offs, lower RTO', status: 'beta' },
]

// ---- How it works (home, under the hero, and top of /features) -------------
// `you` = the merchant's only job in that step. `when` is PLACEHOLDER: it
// adds up to the 14-day hero stat; confirm the real timeline with the team.
export const howSteps: HowStep[] = [
  { icon: 'plug', label: 'Connect', title: 'Connect your store', body: `Install ${brand.name} from the Shopify App Store in one click. We sync your catalogue, collections, branding and content instantly. Nothing to upload.`, chip: '1-click install · Shopify-native', you: 'One click', when: 'Day 1' },
  { icon: 'chat', label: 'Discover', title: 'Tell us about your brand', body: 'We sit down with you to understand your brand values, your customers and what you need the app to do. That brief drives every decision after it.', chip: 'Requirements · brand values · goals', you: 'One kickoff call', when: 'Days 1–2' },
  { icon: 'palette', label: 'Design', title: 'We design it around your brand', body: `Our team and ${ai.name} design your app from that brief: your look, your tone, your customer journey. Not a template. You review and approve every screen.`, chip: 'AI + our designers · you approve', you: 'Approve the screens', when: 'Days 3–6' },
  { icon: 'code', label: 'Develop', title: 'We build your native app', body: 'We develop real iOS and Android apps from the approved design, AI-assisted and connected to your live Shopify store. No builder for you to learn, no code to write.', chip: 'Native iOS + Android · AI-assisted', you: 'Nothing at all', when: 'Days 7–11' },
  { icon: 'rocket', label: 'Launch', title: 'Publish & grow', body: 'We handle App Store and Google Play submission. The moment you’re live, push notifications, lifecycle automations and analytics switch on.', chip: 'We publish for you · growth tools from day one', you: 'Tell your customers', when: 'Days 12–14' },
]

// ---- Retention timeline (home + automations page) ---------------------------
// PLACEHOLDER copy: swap for the real rotating templates from the product.
export const journey: JourneyStage[] = [
  { day: 'Day 0', stage: 'Order confirmed', title: 'Order confirmed', body: 'Thanks Priya! We’re packing your Vitamin C Serum now.',
    trigger: 'First order placed', goal: 'Reassure them and set expectations', status: ['New customer', '#C9F45B', 'laugh'], template: 'Thanks {name}! We’re packing your {product} now.' },
  { day: 'Day 5', stage: 'Post-purchase pick', title: 'Picked for you, Priya', body: 'Loving your serum? Shoppers who bought it also go for the Hydra Gel Moisturiser.',
    trigger: '5 days after the first order', goal: 'A second product, while they’re happy', status: ['Happy', '#7BE0C3', 'smile'], template: 'Loving your {product}? Shoppers who bought it also go for {recommendation}.' },
  { day: 'Day 30', stage: 'Replenishment', title: 'Running low?', body: 'Your Vitamin C Serum is probably half gone. Reorder in one tap.',
    trigger: 'When the product usually runs out', goal: 'Reorder before they shop elsewhere', status: ['Due to reorder', '#4C8DFF', 'meh'], template: 'Your {product} is probably half gone. Reorder in one tap.' },
  { day: 'Day 55', stage: 'Win-back', title: 'We’ve missed you, Priya', body: 'Here’s what’s new since your last order.',
    trigger: 'No order for 55 days', goal: 'Bring them back before they forget you', status: ['Drifting away', '#F59E0B', 'annoyed'], template: 'We’ve missed you, {name}. Here’s what’s new since your last order.' },
  { day: 'Day 90+', stage: 'Recurring win-back', title: 'New this week', body: 'Fresh arrivals picked around what you bought before.',
    trigger: 'Every few weeks after that', goal: 'Stay in their pocket, not their spam', status: ['At risk', '#FB7185', 'frown'], template: 'Fresh arrivals picked around {product}.' },
]

// ---- Comparisons: /compare and /compare/<us>-vs-<competitor> -----------------
// Feature cells: [mark, note]. mark: 'yes' full · 'part' partial/beta · 'no' none
// · null = text only. PLACEHOLDER: every AppBrew / Shopney cell is positioning,
// not verified fact. Check each against their current site, then set
// `checked` on the competitor so the page shows the date.
export const compareRows: CompareGroup[] = [
  { group: 'App', rows: [
    ['Native iOS + Android app', ['yes'], ['yes'], ['yes']],
    ['Setup method', [null, 'AI-built from your brand brief'], [null, 'Template / config'], [null, 'Drag-and-drop designer']],
    ['Shopify-native (webhooks, catalogue sync)', ['yes'], ['yes'], ['yes']],
  ]},
  { group: 'Engagement', rows: [
    ['Push notifications & campaigns', ['yes'], ['yes'], ['yes']],
    ['Lifecycle automations (win-back, replenishment, cross-sell…)', ['yes', '15 journeys, editable timing + copy'], ['part'], ['part', 'Basic']],
    ['Abandoned-cart recovery', ['yes', 'Rotating, quiet-hours aware'], ['yes'], ['yes']],
    ['Personalisation & recommendations', ['yes'], ['yes'], ['part']],
    ['Live chat / in-app support widget', ['no', 'On our roadmap'], ['part'], ['yes']],
  ]},
  { group: 'Growth', rows: [
    ['Built-in AI copilot', ['part', `${ai.name} (beta): insights + copy`], ['yes', 'Milo'], ['no']],
    ['Full-funnel analytics (cohorts, app vs web)', ['yes', '11 views'], ['part'], ['part', 'Basic']],
    ['Content: reels, blog sync, live collections', ['part', 'Blog + collections live, reels coming'], ['yes'], ['part']],
  ]},
  { group: 'Commerce', rows: [
    ['India-first checkout (COD, UPI, GoKwik, Razorpay)', ['part', 'Beta'], [null, 'Depends'], [null, 'Depends']],
  ]},
  { group: 'Pricing', rows: [
    ['Pricing model', [null, 'Commission-friendly, pay as you grow'], [null, 'Premium / custom'], [null, 'Monthly tiers']],
  ]},
]

// Column order in compareRows after our own column.
export const compareColumns: string[] = ['appbrew', 'shopney']

export const compareUrl = (key: string): string => `/compare/${brand.slug}-vs-${key}`

export const competitors: Record<string, Competitor> = {
  appbrew: {
    name: 'AppBrew',
    checked: null, // PLACEHOLDER: e.g. 'October 2026' once the table is verified
    line: 'Enterprise-grade app commerce with a published price. Built for Indian D2C.',
    pills: ['Retention automations built in', 'Full-funnel analytics', 'India-first checkout', 'Pay as you grow'],
    strips: [
      { visual: 'price', title: 'A published price, and no enterprise contract to start.', body: 'Automations, analytics and an AI copilot on plans with a published price, so you don’t start with an enterprise contract.' },
      { visual: 'journeys', title: 'A retention engine, not just an app.', body: '15 lifecycle journeys come switched on: cart recovery, replenishment, a 3-stage win-back ladder and more, each with editable timing and copy.' },
      { visual: 'india', title: 'Built for India.', body: 'COD, UPI, GoKwik and Razorpay at checkout, with RTO and COD-vs-prepaid analytics so you can manage the risk. Checkout is in beta.' },
    ],
    fair: 'AppBrew is a mature, well-known brand with large enterprise clients and a polished AI assistant, Milo. If you want an established vendor and have the budget, it’s a fine choice.',
    counter: `${brand.name} gives you comparable capability with a published price, 0% commission and a focus on Indian D2C.`,
    pricing: 'AppBrew’s plans start at $199/month (Starter), with custom pricing for Enterprise. Ours are $299 and $599 a month, published up front, with 0% commission and custom brand design on Pro.',
    priceCheckedOn: '2026-09-28',
    // Plan-by-plan prices, used on /pricing and the home page teaser.
    plans: [
      { tier: 'Starter', them: 199, us: 299 },
      { tier: 'Pro', them: 599, us: 599 },
      { tier: 'Enterprise', them: null, themLabel: 'Custom quote', us: 599 },
    ],
  },
  shopney: {
    name: 'Shopney',
    checked: null, // PLACEHOLDER: e.g. 'October 2026' once the table is verified
    line: 'More than a pretty storefront: a growth engine.',
    pills: ['Retention automations built in', 'Full-funnel analytics', `${ai.name} copilot`, 'India-first checkout'],
    strips: [
      { visual: 'journeys', title: 'Beyond a beautiful theme: automations that bring shoppers back.', body: 'Win-back, replenishment, cross-sell and cart recovery run every day on their own, and never double-send.' },
      { visual: 'analytics', title: 'Know your whole funnel.', body: 'Retention cohorts, app-vs-web attribution, RTO and LTV across 11 connected views, so you can see what actually drives repeat orders.' },
      { visual: 'ai', title: 'An AI copilot that writes your campaigns.', body: `${ai.name} drafts push and campaign copy in your brand voice, and suggests who to message next. It’s in beta.` },
    ],
    fair: 'Shopney has an excellent drag-and-drop theme designer and built-in live chat, which we don’t offer yet. If designing every screen yourself matters most, it’s a fine choice.',
    counter: `${brand.name} goes deeper on growth: retention automations, analytics and AI.`,
    pricing: 'Shopney sells monthly subscription tiers. We publish every plan’s price and grow with you, with no enterprise contract to start.', // PLACEHOLDER: verify Shopney’s pricing
  },
}

// PLACEHOLDER client names and quote — replace with real partner clients.
// Sample brands used across the site's phone mockups. Invented names, checked
// against web search so none is a real company. PLACEHOLDER: swap for real clients.
export const logos: string[] = ['Quellon', 'Ilvana', 'Vyntra', 'Linnave', 'Harvo Fresh', 'Ferro Fuel']

export const testimonial: Testimonial = {
  quote: 'Our website was fine. Our app is better. The step challenge alone brings people back every single day, and we keep 100% of what they spend.',
  name: 'Ananya Rao', // PLACEHOLDER
  role: 'Founder, Ferro Fuel', // PLACEHOLDER
  metric: '2.4×',
  metricLabel: 'repeat purchases after launch',
}

// Revenue calculator on the home page. PLACEHOLDER assumptions: confirm with
// the partner before launch. appShare matches the 32% hero stat.
export const calculator: Calculator = {
  appShare: 0.32,          // share of sales that moves to the app
  revShare: 0.02,          // a typical revenue-share fee we compare against
  min: 10000, max: 500000, step: 5000, start: 60000,
}

// Blog: no articles yet. These are the guides we plan to publish, shown as
// "Coming soon" so the page isn't empty. PLACEHOLDER: replace with real posts.
export const blogTopics: string[] = ['Retention', 'Push', 'App design', 'D2C India', 'Analytics']
export const upcomingPosts: UpcomingPost[] = [
  { topic: 'Retention', title: 'The win-back ladder: bringing back one-time buyers, step by step' },
  { topic: 'Push', title: 'Push that people don’t mute: timing, tone and frequency' },
  { topic: 'App design', title: 'Your app is not your website: what to change, what to keep' },
  { topic: 'D2C India', title: 'COD, RTO and UPI: designing checkout for Indian shoppers' },
  { topic: 'Analytics', title: 'App vs web: how to read attribution without fooling yourself' },
  { topic: 'Retention', title: 'Replenishment reminders that feel helpful, not pushy' },
]
