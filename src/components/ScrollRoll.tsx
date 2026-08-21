import { useId } from 'react'

// One rolled end of a parchment scroll: a shaded cylinder with the sheet
// curling off into a spiral at the left. Rendered twice per blockquote —
// the bottom copy is rotated 180° in CSS so its curl faces the other way.
export function ScrollRoll({ className }: { className?: string }) {
  // useId's colons are invalid in url(#...) fragment references
  const shadeId = `roll-shade-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  return (
    <svg
      viewBox="0 0 640 64"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--roll-hi)" />
          <stop offset="0.45" stopColor="var(--roll-mid)" />
          <stop offset="1" stopColor="var(--roll-lo)" />
        </linearGradient>
      </defs>
      {/* cylinder body */}
      <path
        d="M52,20 L614,20 Q628,20 628,33 Q628,46 614,46 L52,46 Z"
        fill={`url(#${shadeId})`}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* right end cap: rolled edge peeking */}
      <path
        d="M614,20 Q602,20 602,33 Q602,46 614,46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      {/* wrap ticks along the cylinder */}
      <path
        d="M170,20 Q165,33 170,46 M352,20 Q347,33 352,46 M508,20 Q503,33 508,46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* sheet sweeping from the curl over the cylinder */}
      <path
        d="M46,12 Q66,2 92,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* the curled end, spiraling inward */}
      <circle
        cx="32"
        cy="27"
        r="17"
        fill="var(--paper-deep)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M46,19 A 14,14 0 1 0 41,38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M41,38 A 8,8 0 0 0 28,24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M28,24 A 5,5 0 0 1 36,26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}
