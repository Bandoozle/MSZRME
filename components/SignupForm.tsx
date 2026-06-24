"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function SignupForm() {
  const [done, setDone] = useState(false);
  const [first, setFirst] = useState("");
  const [biz, setBiz] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errBiz, setErrBiz] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPw, setErrPw] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const b = biz.trim();
    if (!b) { setErrBiz(true); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErrEmail(true); return; }
    if (pw.length < 8) { setErrPw(true); return; }
    setFirst(b.split(/\s+/)[0]);
    setDone(true);
    // TODO: POST to your signup / auth endpoint here.
  }

  if (done) {
    return (
      <div className="su-success" style={{ display: "block" }}>
        <div className="check"><Check size={30} strokeWidth={3} /></div>
        <h3>You&rsquo;re in.</h3>
        <p>Welcome aboard, {first}. Check your inbox to confirm your email, then log your first day.</p>
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
      <button className="btn btn-lg btn-green" type="submit">Create account</button>
      <p className="su-fine">By continuing you agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
