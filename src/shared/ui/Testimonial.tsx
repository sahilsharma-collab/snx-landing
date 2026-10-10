import { testimonial } from '@/shared/config/site'

export interface TestimonialProps {
  dark?: boolean
}

export function Testimonial({ dark = false }: TestimonialProps) {
  const t = testimonial
  return (
    <figure className={`grid gap-8 rounded-[28px] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center ${dark ? 'bg-ink-2 text-white ring-1 ring-white/10' : 'bg-card ring-1 ring-line'}`}>
      <div>
        <blockquote className="font-display text-2xl leading-snug font-semibold sm:text-3xl">“{t.quote}”</blockquote>
        <figcaption className={`mt-6 flex items-center gap-3 text-sm ${dark ? 'text-mist' : 'text-body'}`}>
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-bold text-white">{t.name[0]}</span>
          <span><b className={dark ? 'text-white' : 'text-ink'}>{t.name}</b><br />{t.role}</span>
        </figcaption>
      </div>
      <div className={`rounded-2xl p-6 text-center md:w-52 ${dark ? 'bg-white/5' : 'bg-paper'}`}>
        <p className="font-display text-5xl font-extrabold text-brand">{t.metric}</p>
        <p className={`mt-2 text-sm ${dark ? 'text-mist' : 'text-body'}`}>{t.metricLabel}</p>
      </div>
    </figure>
  )
}
