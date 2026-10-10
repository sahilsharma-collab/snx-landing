import { Link } from 'react-router-dom'
import { brand, competitors, compareUrl } from '@/shared/config/site'
import { Logo } from './Logo'

type FooterLink = [label: string, to: string]
type FooterColumn = [title: string, items: FooterLink[]]

const cols: FooterColumn[] = [
  ['Product', [['Features', '/features'], ['How it works', '/#how'], ['Why us', '/#why'], ['Pricing', '/pricing']]],
  ['Compare', [...Object.keys(competitors).map((k) => [`${brand.name} vs ${competitors[k].name}`, compareUrl(k)] as FooterLink), ['All comparisons', '/compare']]],
  ['Resources', [['Blog', '/blog']]],
  ['Company', [['Book a demo', '/#book-demo'], ['Contact sales', `mailto:${brand.salesEmail}`]]],
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-mist">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{brand.tagline} iOS and Android apps for Shopify stores, with 0% commission.</p>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <p className="mb-4 text-sm font-semibold text-white">{title}</p>
            <ul className="space-y-3 text-sm">
              {items.map(([l, to]) => (
                <li key={l}>{to.startsWith('mailto') ? <a href={to} className="transition-colors hover:text-cta">{l}</a> : <Link to={to} className="transition-colors hover:text-cta">{l}</Link>}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shell border-t border-white/10 py-6 text-xs">
        © {new Date().getFullYear()} {brand.name}. Competitor prices are taken from their public pricing pages and may change.
      </div>
      {/* oversized wordmark fading into the bottom edge */}
      <p className="pointer-events-none -mb-[0.22em] text-center font-display text-[26vw] leading-none font-extrabold tracking-[-0.06em] select-none" aria-hidden
        style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.09)', backgroundImage: 'linear-gradient(180deg, rgba(123,97,255,0.22), transparent 75%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>{brand.name}</p>
    </footer>
  )
}

export default Footer
