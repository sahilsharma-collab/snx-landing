import { useEffect } from 'react'
import { brand } from '@/shared/config/site'

const DEFAULT_IMAGE = '/brand/appitup-icon.png'

// Create the meta tag if it doesn't exist yet, then set its content.
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export interface Seo {
  title: string
  description: string
  /** Append " | appitup" to the title. Off for the home page (brand is in the title). */
  brandSuffix?: boolean
  image?: string
}

// Per-page <title> + meta (description, Open Graph, Twitter) for this SPA.
export function useSeo({ title, description, brandSuffix = true, image = DEFAULT_IMAGE }: Seo) {
  useEffect(() => {
    const full = brandSuffix ? `${title} | ${brand.name}` : title
    document.title = full
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', full)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', full)
    upsertMeta('name', 'twitter:description', description)
  }, [title, description, brandSuffix, image])
}
