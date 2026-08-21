// The shield of swiss cheese: our safety-engineering crest. Each hole is a
// hazard the layer doesn't stop; stack enough layers and no hole goes all
// the way through. Drawn once here, reused by the wax seal and as the
// section-anchor glyph in rendered markdown.

/** Bare geometry, for composing inside another svg (e.g. the wax seal). */
export function CheeseShieldGlyph() {
  return (
    <g>
      <path
        d="M24,9 L36,13.5 L36,25 C36,33.5 30,40 24,42 C18,40 12,33.5 12,25 L12,13.5 Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g fill="var(--paper)" stroke="currentColor" strokeWidth="0.7">
        <circle cx="20" cy="17" r="2.1" />
        <circle cx="29" cy="16.5" r="1.4" />
        <circle cx="24.5" cy="23.5" r="2.5" />
        <circle cx="17" cy="25.5" r="1.5" />
        <circle cx="30.5" cy="27" r="1.9" />
        <circle cx="22" cy="32" r="1.5" />
        <circle cx="27.5" cy="34" r="1.1" />
      </g>
    </g>
  )
}

/** Standalone shield, viewBox cropped to the glyph. */
export function CheeseShield({ className }: { className?: string }) {
  return (
    <svg
      viewBox="10.5 7.5 27 36"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <CheeseShieldGlyph />
    </svg>
  )
}
