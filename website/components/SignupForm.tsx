"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PLATFORM_URL, platformOnboardingUrl, platformSignInUrl } from "@/lib/platform";

export default function SignupForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [first, setFirst] = useState("");
  const [biz, setBiz] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errBiz, setErrBiz] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPw, setErrPw] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    const b = biz.trim();
    if (!b) {
      setErrBiz(true);
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setErrEmail(true);
      return;
    }
    if (pw.length < 8) {
      setErrPw(true);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    setSubmitting(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: pw,
          businessName: b,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setApiError(data.error ?? "Could not create account. Try again.");
        setSubmitting(false);
        return;
      }

      const signInRes = await fetch(`${PLATFORM_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail, password: pw }),
      });

      setFirst(b.split(/\s+/)[0]);
      setDone(true);

      if (signInRes.ok) {
        window.setTimeout(() => {
          window.location.href = platformOnboardingUrl();
        }, 1200);
        return;
      }

      window.setTimeout(() => {
        window.location.href = platformSignInUrl({ email: trimmedEmail, signedup: true });
      }, 1200);
    } catch {
      setApiError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="su-success" style={{ display: "block" }}>
        <div className="check"><Check size={30} strokeWidth={3} /></div>
        <h3>You&rsquo;re in.</h3>
        <p>Welcome aboard, {first}. Let&rsquo;s finish setting up your account&hellip;</p>
      </div>
    );
  }

  return (
    <form id="suForm" noValidate onSubmit={submit}>
      <div className="su-field">
        <label htmlFor="su-biz">Business name</label>
        <input className="su-input" id="su-biz" type="text" placeholder="North Van HVAC Solutions"
          autoComplete="organization" value={biz}
          style={errBiz ? { borderColor: "#EF4444" } : undefined}
          onChange={(e) => { setBiz(e.target.value); setErrBiz(false); }} />
      </div>
      <div className="su-field">
        <label htmlFor="su-email">Work email</label>
        <input className="su-input" id="su-email" type="email" placeholder="you@yourdealership.ca"
          autoComplete="email" value={email}
          style={errEmail ? { borderColor: "#EF4444" } : undefined}
          onChange={(e) => { setEmail(e.target.value); setErrEmail(false); }} />
      </div>
      <div className="su-field">
        <label htmlFor="su-pw">Password</label>
        <input className="su-input" id="su-pw" type="password" placeholder="At least 8 characters"
          autoComplete="new-password" value={pw}
          style={errPw ? { borderColor: "#EF4444" } : undefined}
          onChange={(e) => { setPw(e.target.value); setErrPw(false); }} />
      </div>
      {apiError ? (
        <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px", fontWeight: 500 }}>
          {apiError}
        </p>
      ) : null}
      <button className="btn btn-lg btn-green" type="submit" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </button>
      <p className="su-fine">By continuing you agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
