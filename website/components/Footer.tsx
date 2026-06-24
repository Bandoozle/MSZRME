import Link from "next/link";
import { platformSignInUrl } from "@/lib/platform";

const SIGN_IN_URL = platformSignInUrl();

export default function Footer() {
  return (
    <footer>
      <div className="foot-top">
        <div>
          <div className="foot-brand"><span className="mk">M</span> MSZRME</div>
          <p style={{ maxWidth: "24ch", lineHeight: 1.5 }}>
            The performance platform for HVAC dealers who run on data.
          </p>
        </div>
        <div className="foot-col">
          <h4>Platform</h4>
          <Link href="/platform">Overview</Link>
          <Link href="/features">Features</Link>
          <Link href="/stages">Stages</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <Link href="/about">About</Link>
          <Link href="/coaching">Coaching</Link>
          <Link href="/contact">Contact</Link>
          <a href={SIGN_IN_URL}>Sign in</a>
        </div>
        <div className="foot-col">
          <h4>Get started</h4>
          <Link href="/#signup">Free trial</Link>
          <Link href="/pricing">Programs</Link>
          <Link href="/support">Support</Link>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 MSZRME Inc. Built for HVAC dealers.</span>
        <span>
          <Link href="/privacy" style={{ color: "var(--ink-3)" }}>Privacy</Link>
          {" \u00b7 "}
          <Link href="/terms" style={{ color: "var(--ink-3)" }}>Terms</Link>
        </span>
      </div>
    </footer>
  );
}
