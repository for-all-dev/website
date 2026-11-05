import dragonSvg from '../assets/dragon-rule.svg?raw'
import './DragonRule.css'

/** Section divider: two dragons breathing fire, joined by a long spine.
    Inlined so the drawing takes its colour from CSS (currentColor). */
export function DragonRule({ className }: { className?: string }) {
  return (
    <div
      className={className ? `dragon-rule ${className}` : 'dragon-rule'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: dragonSvg }}
    />
  )
}
