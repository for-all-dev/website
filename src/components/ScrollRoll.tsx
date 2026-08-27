import { useId } from 'react'

// One rolled end of a parchment scroll: a shaded cylinder with the sheet
// curling off into a spiral at the left. Rendered twice per blockquote —
// the bottom copy is rotated 180° in CSS so its curl faces the other way.
// The right end's lower corner (y=46, the edge nearest the sheet) is a flat,
// sharp cut lined up with the scroll-sheet's own edge beneath it (see the
// .scroll-roll/.scroll-sheet-wrap geometry in index.css), so the two form
// one continuous flush line. The upper corner (y=20, facing away from the
// sheet) stays rounded, like the tube's far surface still showing at the
// cut while its underside sits flush on the page. The bottom copy's 180°
// rotation swaps which physical edge is which — the corner nearest ITS
// sheet-facing side is still the flush one, the outward-facing side still
// the rounded one — so both copies read the same way.
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
      {/* cylinder body: fill only — the left closing edge hides under the
          curl, so the cylinder reads as open where it meets the spiral. The
          right edge rounds over at the top and cuts flat at the bottom. */}
      <path
        d="M44,20 L585,20 Q613,20 613,46 L34,46 Z"
        fill={`url(#${shadeId})`}
      />
      {/* cylinder outline: one open stroke — rounded/flat at the right,
          terminating on the curl's circumference at the left (no vertical
          bar there) */}
      <path
        d="M44,20 L585,20 Q613,20 613,46 L34,46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
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
      {/* the curled end, spiraling inward; tangent to the cylinder's bottom
          line so both horizontals run into its circumference */}
      <circle
        cx="32"
        cy="29"
        r="17"
        fill="var(--paper-deep)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M46,21 A 14,14 0 1 0 41,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M41,40 A 8,8 0 0 0 28,26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M28,26 A 5,5 0 0 1 36,28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}
