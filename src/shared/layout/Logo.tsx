import { Link } from 'react-router-dom'

export interface LogoProps {
  light?: boolean
}

/**
 * Brand logo. `light` = on a dark surface (use the white-wordmark artwork);
 * otherwise the dark-wordmark artwork for light surfaces. Both are transparent PNGs.
 */
export function Logo({ light = true }: LogoProps) {
  return (
    <Link to="/" aria-label="appitup — home" className="flex items-center">
      <img
        src={light ? '/brand/appitup-logo-dark.png' : '/brand/appitup-logo-light.png'}
        alt="appitup"
        className="h-10 w-auto"
        width={1203}
        height={316}
      />
    </Link>
  )
}
