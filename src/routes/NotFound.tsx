import { Link, useLocation } from 'react-router-dom'
import { Section } from '../components/Proof'

export function NotFound() {
  const location = useLocation()
  return (
    <Section id="404" label="404">
      <p>
        No proof obligation matches <code>{location.pathname}</code>.
      </p>
      <p>
        <Link to="/">Return to the index.</Link>
      </p>
    </Section>
  )
}
