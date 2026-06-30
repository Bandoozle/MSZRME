"use client";

import { useEffect, useState } from "react";
import { WEBSITE_URL } from "@/lib/urls";

interface Props {
  onLogin: (email: string, password: string) => void | Promise<void>;
  error?: string;
  fromWebsite?: boolean;
  initialEmail?: string;
  signedUp?: boolean;
}

const DEMO_ACCOUNTS = [
  {
    email: "john@northvanhvac.ca",
    password: "demo123",
    dotColor: "#00694A",
    label: "Dealer",
  },
  {
    email: "admin@mszrme.com",
    password: "admin123",
    dotColor: "#00B478",
    label: "Admin",
  },
  {
    email: "new@hvacdealer.ca",
    password: "welcome1",
    dotColor: "#FF8D28",
    label: "New Account",
  },
] as const;

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  padding: "0 9px",
  height: "26px",
  borderRadius: "6px",
  border: "0.5px solid rgba(0,0,0,0.24)",
  background: "rgba(255,255,255,0.90)",
  fontSize: "13px",
  color: "#1C1C1E",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro','Inter',sans-serif",
  outline: "none",
  transition: "box-shadow .12s, border-color .12s",
  letterSpacing: "-0.008em",
  boxSizing: "border-box",
};

const isSupabaseMode = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function LoginScreen({
  onLogin,
  error = "",
  fromWebsite = false,
  initialEmail = "",
  signedUp = false,
}: Props) {
  const fromSignup = signedUp || Boolean(initialEmail);
  const [email, setEmail] = useState(
    () => initialEmail || (isSupabaseMode ? "" : "john@northvanhvac.ca")
  );
  const [password, setPassword] = useState(() => (fromSignup || isSupabaseMode ? "" : "demo123"));
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [hoverDemo, setHoverDemo] = useState<number | null>(null);
  const [signInHover, setSignInHover] = useState(false);
  const [signInPressed, setSignInPressed] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (signedUp) setPassword("");
  }, [signedUp]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const inputFocusStyle = (focused: boolean): React.CSSProperties =>
    focused
      ? {
          borderColor: "#00694A",
          boxShadow: "0 0 0 4px rgba(0,105,74,0.14)",
        }
      : {
          borderColor: "rgba(0,0,0,0.08)",
          boxShadow: "none",
        };

  const handleSubmit = () => void onLogin(email, password);

  return (
    <div
      id="login-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          '#3a2818 url("/images/login-wallpaper.jpg") center center / cover no-repeat',
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "saturate(200%) blur(40px)",
          WebkitBackdropFilter: "saturate(200%) blur(40px)",
          borderRadius: "28px",
          padding: "42px",
          width: "440px",
          maxWidth: "92vw",
          boxShadow:
            "0 0.5px 0 rgba(255,255,255,0.7) inset, 0 0 0 0.5px rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.15), 0 32px 80px rgba(0,0,0,0.22)",
          border: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {fromWebsite ? (
          <a
            id="website-back-link"
            href={WEBSITE_URL}
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(0,0,0,0.45)",
              textDecoration: "none",
              marginBottom: "16px",
            }}
          >
            ← Back to MSZRME.com
          </a>
        ) : null}

        {fromWebsite && signedUp ? (
          <div
            id="website-signedup-banner"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#003D2B",
              background: "rgba(0,180,120,0.12)",
              borderRadius: "10px",
              padding: "10px 12px",
              marginBottom: "16px",
              lineHeight: 1.45,
            }}
          >
            Account created. Sign in with the email and password you just set up.
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(140deg,#00694A,#00B478)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "white",
              fontWeight: 700,
              letterSpacing: "-.02em",
              boxShadow:
                "0 0.5px 0 rgba(255,255,255,0.4) inset, 0 2px 8px rgba(0,105,74,0.3)",
            }}
          >
            ◈
          </div>
          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#000",
                letterSpacing: "-.025em",
              }}
            >
              MSZRME
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(60,60,67,0.6)",
                  letterSpacing: "-.01em",
                }}
              >
                Measure Your Business
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#00B478",
                  background: "rgba(0,180,120,0.12)",
                  padding: "2px 6px",
                  borderRadius: "5px",
                  letterSpacing: ".05em",
                }}
              >
                V2
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "none" }}>Welcome back</div>
        <div style={{ display: "none" }}>
          Sign in to your account to continue.
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(0,0,0,0.55)",
              letterSpacing: "-0.005em",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...inputBaseStyle, ...inputFocusStyle(emailFocused) }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(0,0,0,0.55)",
              letterSpacing: "-0.005em",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Password
          </label>
          <input
            id="login-pw"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputBaseStyle, ...inputFocusStyle(passwordFocused) }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        {error ? (
          <div
            id="login-err"
            style={{
              fontSize: "13px",
              color: "#FF383C",
              marginBottom: "14px",
              padding: "11px 14px",
              background: "rgba(255,56,60,0.08)",
              borderRadius: "10px",
              border: "0.5px solid rgba(255,56,60,0.18)",
            }}
          >
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "100%",
            height: "26px",
            borderRadius: "6px",
            background: "linear-gradient(180deg,#0099FF,#0071EF)",
            border: "0.5px solid rgba(0,80,180,0.5)",
            color: "white",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "default",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Pro','Inter',sans-serif",
            transition: "filter .12s",
            letterSpacing: "-0.008em",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.28) inset, 0 0.5px 0 rgba(0,0,0,0.10)",
            filter: signInPressed
              ? "brightness(0.90)"
              : signInHover
                ? "brightness(1.06)"
                : undefined,
          }}
          onMouseEnter={() => setSignInHover(true)}
          onMouseLeave={() => {
            setSignInHover(false);
            setSignInPressed(false);
          }}
          onMouseDown={() => setSignInPressed(true)}
          onMouseUp={() => setSignInPressed(false)}
        >
          Sign In
        </button>

        {!isSupabaseMode ? (
        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "0.5px solid rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(60,60,67,0.6)",
              marginBottom: "8px",
              letterSpacing: "-.005em",
            }}
          >
            Demo accounts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {DEMO_ACCOUNTS.map((account, index) => (
              <div
                key={account.email}
                role="button"
                tabIndex={0}
                style={{
                  fontSize: "12px",
                  fontFamily: "'SF Mono',ui-monospace,monospace",
                  color: "rgba(60,60,67,0.85)",
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  transition: "background .15s",
                  background:
                    hoverDemo === index ? "rgba(0,0,0,0.04)" : "transparent",
                }}
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setEmail(account.email);
                    setPassword(account.password);
                  }
                }}
                onMouseEnter={() => setHoverDemo(index)}
                onMouseLeave={() => setHoverDemo(null)}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: account.dotColor,
                    marginRight: "7px",
                    verticalAlign: "middle",
                  }}
                />
                {account.email} / {account.password} — {account.label}
              </div>
            ))}
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
}

export function V2Badge() {
  return (
    <div id="v2-badge">
      <div className="v2-dot" />
      macOS 27 · V2
    </div>
  );
}
