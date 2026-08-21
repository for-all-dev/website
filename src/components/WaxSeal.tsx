import { CheeseShieldGlyph } from './CheeseShield'

export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="1" />

      <CheeseShieldGlyph />
    </svg>
  )
}
