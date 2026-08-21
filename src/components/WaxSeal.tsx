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

      {/* a shield, made of cheese */}
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
    </svg>
  )
}
