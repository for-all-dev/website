import type { ReactNode } from 'react'
import { DragonRule } from './DragonRule'

export function Section({
  id,
  label,
  children,
}: {
  id: string
  label?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="proof">
      {label && (
        <p className="turnstile">
          <span aria-hidden="true">⊨</span> {label}
        </p>
      )}
      <div className="proof-body">{children}</div>
    </section>
  )
}

export function Qed() {
  return (
    <div className="qed" role="separator" aria-hidden="true">
      {/* was: <WyrmRule className="wyrm-rule qed-wyrm" /> (import from './WyrmRule') */}
      <DragonRule />
    </div>
  )
}
