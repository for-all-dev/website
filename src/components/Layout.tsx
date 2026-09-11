import { Link, Outlet } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import { WaxSeal } from "./WaxSeal";
import { WyrmRule } from "./WyrmRule";
import { Signature } from "./Signature";

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
                        aria-label="Forall R&D home"
                    >
                        <LogoMark className="wordmark-mark" />
                        <span className="wordmark-domain">Forall R&amp;D</span>
                    </Link>
                    <div className="crest" aria-hidden="true">
                        <WaxSeal className="crest-seal" />
                        <Signature className="crest-signature" />
                        <WaxSeal className="crest-seal" />
                    </div>
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
                    <div className="crest" aria-hidden="true">
                        <WaxSeal className="crest-seal" />
                        <Signature className="crest-signature" />
                        <WaxSeal className="crest-seal" />
                    </div>
                    <p>
                        Forall R&amp;D — guiding AI safety orgs through the formal
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
