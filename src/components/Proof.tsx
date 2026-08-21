import type { ReactNode } from 'react'

export function Section({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <section id={id} className="proof">
      <p className="turnstile">
        <span aria-hidden="true">⊢</span> {label}
      </p>
      <div className="proof-body">{children}</div>
    </section>
  )
}

export function Qed() {
  return (
    <div className="qed" role="separator" aria-hidden="true">
      <span />
      <span className="qed-mark">∎</span>
      <span />
    </div>
  )
}
