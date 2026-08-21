export function WyrmRule({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 32"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* head */}
      <path
        d="M46,16 C40,8 28,7 18,11 C12,13.5 11,18.5 18,21 C28,25 40,24 46,16 Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="25" cy="14.5" r="1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <line x1="21" y1="8" x2="19" y2="3" />
        <line x1="29" y1="8" x2="31" y2="3" />
        <line x1="11" y1="16" x2="4" y2="13" />
        <line x1="11" y1="16" x2="4" y2="19" />
      </g>

      {/* sinuous body */}
      <path
        d="M46,16 C86,7 126,25 166,16 C206,7 246,25 286,16 C326,7 366,25 406,16 C446,7 486,25 526,16 L556,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />

      {/* dorsal spikes at the crests */}
      <g fill="currentColor">
        <polygon points="83,7 86,1 89,7" />
        <polygon points="203,7 206,1 209,7" />
        <polygon points="323,7 326,1 329,7" />
        <polygon points="443,7 446,1 449,7" />
      </g>

      {/* belly scales at the troughs */}
      <g fill="currentColor">
        <circle cx="126" cy="25" r="1.3" />
        <circle cx="246" cy="25" r="1.3" />
        <circle cx="366" cy="25" r="1.3" />
        <circle cx="486" cy="25" r="1.3" />
      </g>

      {/* tapering tail */}
      <polygon points="556,11 590,16 556,21" fill="currentColor" fillOpacity="0.85" />
    </svg>
  )
}
