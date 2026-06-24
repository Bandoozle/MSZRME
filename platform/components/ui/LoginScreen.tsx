"use client";

import { useState } from "react";
import { DEMO_ACCOUNTS } from "@/lib/data";
import { WEBSITE_URL } from "@/lib/urls";

interface Props {
  onLogin: (email: string, password: string) => boolean;
  error: string;
  fromWebsite?: boolean;
  signedUp?: boolean;
  initialEmail?: string;
}

export function LoginScreen({
  onLogin,
  error,
  fromWebsite = false,
  signedUp = false,
  initialEmail = "",
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div id="login-screen" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100dvh", background: "var(--wallpaper, #E8E0D8)",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.72)", backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)", borderRadius: "22px",
        padding: "36px 32px 28px", width: "92%", maxWidth: "380px",
        boxShadow: "0 2px 0 rgba(255,255,255,0.6) inset, 0 24px 60px rgba(0,0,0,0.18)",
        border: "0.5px solid rgba(255,255,255,0.5)",
      }}>
        {fromWebsite && (
          <a
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
            &larr; Back to MSZRME.com
          </a>
        )}

        {fromWebsite && signedUp && (
          <div style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#003D2B",
            background: "rgba(0,180,120,0.12)",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "16px",
            lineHeight: 1.45,
          }}>
            Account created. Sign in with the email and password you just set up.
          </div>
        )}

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "linear-gradient(135deg,#003D2B,#00B478)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,100,60,0.3)",
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polygon points="11,2 20,8 20,14 11,20 2,14 2,8" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8"/>
              <circle cx="11" cy="11" r="3" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#0A160A", letterSpacing: "-.02em" }}>MSZRME</div>
            <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)", fontWeight: 500 }}>Measure Your Business</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.7)", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com" autoCapitalize="none" autoCorrect="off"
            style={{ width: "100%", marginBottom: "14px" }}
          />
          <label style={{ fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.7)", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", marginBottom: error ? "8px" : "20px" }}
          />
          {error && (
            <div style={{ fontSize: "12px", color: "#EF4444", marginBottom: "12px", fontWeight: 500 }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{ width: "100%", padding: "13px", background: "#0088FF", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", letterSpacing: "-.01em" }}
          >
            Sign In
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,0,0,0.45)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".06em" }}>
            Demo accounts
          </div>
          {DEMO_ACCOUNTS.map((a) => (
            <div key={a.email} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "11px", color: "rgba(0,0,0,0.55)" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: a.role === "admin" ? "#FF9F0A" : a.role === "new" ? "#FF9F0A" : "#30D158", flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", color: "rgba(0,0,0,0.6)" }}>{a.email}</span>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ fontFamily: "monospace" }}>{a.password}</span>
              <span style={{ marginLeft: "auto", color: "rgba(0,0,0,0.35)" }}>— {a.role === "admin" ? "Admin" : a.role === "new" ? "New Account" : "Dealer"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
