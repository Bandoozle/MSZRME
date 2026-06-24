"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { platformSignInUrl } from "@/lib/platform";

const SIGN_IN_URL = platformSignInUrl();

const LINKS = [
  { href: "/platform", label: "Platform" },
  { href: "/features", label: "Features" },
  { href: "/stages", label: "Stages" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={"nav" + (open ? " nav-open" : "")}>
      <nav className="nav-inner" aria-label="Primary">
        <Link className="brand" href="/" onClick={close}>
          <span className="mk">M</span> MSZRME
        </Link>
        <div className="nav-links" id="navLinks">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : undefined}
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
          <a href={SIGN_IN_URL} className="nav-mobile-only" onClick={close}>Sign in</a>
        </div>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
        <div className="nav-right">
          <a className="signin" href={SIGN_IN_URL}>Sign in</a>
          <Link className="btn btn-pill" href="/#signup">Start free trial</Link>
        </div>
      </nav>
    </header>
  );
}
