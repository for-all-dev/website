import { Link, Outlet } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import { WaxSeal } from "./WaxSeal";
import { WyrmRule } from "./WyrmRule";

export function Layout() {
    return (
        <>
            <LogoMark className="bg-mark" />

            <div className="site">
                <div className="battlement" aria-hidden="true" />

                <header className="site-header">
                    <Link
                        to="/"
                        className="wordmark"
                        aria-label="for-all.dev home"
                    >
                        <LogoMark className="wordmark-mark" />
                        <span className="wordmark-domain">for-all.dev</span>
                    </Link>
                    <nav className="site-nav">
                        <a href="https://tractable.for-all.dev">
                            Tractable Problems ↗
                        </a>
                    </nav>
                </header>

                <WyrmRule className="wyrm-rule wyrm-rule-header" />

                <main className="site-main">
                    <Outlet />
                </main>

                <WyrmRule className="wyrm-rule wyrm-rule-footer" />

                <footer className="site-footer">
                    <WaxSeal className="seal" />
                    <p>
                        for-all.dev — guiding AI safety orgs through the formal
                        methods explosion.{" "}
                        <a href="mailto:quinn@for-all.dev">quinn@for-all.dev</a>
                    </p>
                </footer>

                <div
                    className="battlement battlement-bottom"
                    aria-hidden="true"
                />
            </div>
        </>
    );
}
