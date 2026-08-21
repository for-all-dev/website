import { Link, Outlet } from 'react-router-dom'
import { LogoMark } from './LogoMark'

export function Layout() {
  return (
    <>
      <LogoMark className="bg-mark" />

      <div className="site">
        <header className="site-header">
          <Link to="/" className="wordmark" aria-label="for-all.dev home">
            <LogoMark className="wordmark-mark" />
            <span className="wordmark-domain">for-all.dev</span>
          </Link>
          <nav className="site-nav">
            <a href="https://tractable.for-all.dev">Tractable Problems ↗</a>
          </nav>
        </header>

        <main className="site-main">
          <Outlet />
        </main>

        <footer className="site-footer">
          <p>
            for-all.dev — bridging AI safety and formal methods.{' '}
            <a href="mailto:quinn@for-all.dev">quinn@for-all.dev</a>
          </p>
        </footer>
      </div>
    </>
  )
}
