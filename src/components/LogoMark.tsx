export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 640"
      role="img"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(320, 320) scale(1.6) translate(-390, -160)">
        <text
          x="455"
          y="112"
          fontFamily="var(--font-mono)"
          fontSize="52"
          fontWeight="500"
          fill="currentColor"
        >
          R&amp;D
        </text>
        <g
          stroke="currentColor"
          strokeWidth="17"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          fill="none"
        >
          <path d="M250 60 L340 260 L430 60" />
          <line x1="285" y1="140" x2="560" y2="140" />
        </g>
      </g>
    </svg>
  )
}
