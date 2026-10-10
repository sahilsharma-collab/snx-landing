# App-builder marketing site (Phase 1)

Landing, Pricing and Comparison pages for the website-to-app plugin, built
from *Website Research Brief: Appbrew-Style Marketing Site* (Sep 2026).
React + Vite + Tailwind v4 + TypeScript, same stack as PROFABS.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run typecheck  # tsc --noEmit
```

## How the code is organised

Feature-based, with everything shared under `src/shared`:

```
src/
  app/App.tsx            routes
  main.tsx               entry
  shared/
    theme/tokens.ts      colours + fonts (one source, mirrored in styles/index.css @theme)
    styles/index.css     Tailwind @theme + base/components/animations
    config/site.ts       all editable content (typed)
    config/photos.ts     image imports
    types/site.ts        data shapes
    icons/  motion/  phone/   ui/ (reusable kit)  layout/ (Nav, Footer, Logo)  sections/
  features/
    home/  pricing/  blog/  features/  compare/
```

| Route                     | Page        | Main CTA                         |
| ------------------------- | ----------- | -------------------------------- |
| `/`                       | Landing     | Book a demo                      |
| `/pricing`                | Pricing     | Start free trial / Talk to sales |
| `/compare/appbrew-vs-nuvo`| Comparison  | Book a demo                      |
| `/compare/tapcart-vs-nuvo`| Comparison (same template) | Book a demo       |

## Change content in one place

Everything editable lives in `src/shared/config/site.ts`: product name, plan prices,
the feature matrix, competitor prices and table rows, stats, logos and the
testimonial. Anything marked `PLACEHOLDER` is waiting on the partner.

Adding a new competitor page = add one entry to `competitors` in that file;
`/compare/<key>-vs-<slug>` works automatically.

## Before launch

- Competitor prices were checked on 2026-09-28 (Appbrew Starter $199, Pro $599,
  Enterprise custom; Tapcart $500 / $1,250 / $2,850 on monthly billing).
  Re-check them. The "half the price" claim depends on them.
- Starter $99 and Growth $299 are placeholders set at ~50% of Appbrew.
- Stats, client logos, testimonial and the 20% yearly discount are placeholders.
- `brand.demoUrl` should point to the real booking link (Calendly etc.).

Colours and fonts are defined once in `src/shared/theme/tokens.ts` and mirrored
into the Tailwind theme in `src/shared/styles/index.css` (`@theme`), so utility
classes like `bg-ink` / `font-display` and the TS constants stay in sync.

Phone mockups are drawn in code (`src/shared/phone/Phone.tsx`), not images,
so they stay sharp and animate.
