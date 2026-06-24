"use client";

import { useState } from "react";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [co, setCo] = useState("");
  const [msg, setMsg] = useState("");
  const [errName, setErrName] = useState(false);
  const [errEmail, setErrEmail] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setErrName(true); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErrEmail(true); return; }
    setDone(true);
    // TODO: POST to your contact / CRM endpoint here.
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>Send a message</h2>
      <p style={{ fontSize: 15, color: "var(--ink-2)", marginBottom: 22 }}>We reply within one business day.</p>
      {done ? (
        <p style={{ color: "var(--green)", fontSize: 15, fontWeight: 600 }}>Thanks. We will be in touch shortly.</p>
      ) : (
        <form id="cfForm" noValidate onSubmit={submit}>
          <div className="cf-field"><label htmlFor="cf-name">Name</label>
            <input className="cf-input" id="cf-name" type="text" placeholder="Your name" value={name}
              style={errName ? { borderColor: "#EF4444" } : undefined}
              onChange={(e) => { setName(e.target.value); setErrName(false); }} /></div>
          <div className="cf-field"><label htmlFor="cf-email">Email</label>
            <input className="cf-input" id="cf-email" type="email" placeholder="you@yourdealership.ca" value={email}
              style={errEmail ? { borderColor: "#EF4444" } : undefined}
              onChange={(e) => { setEmail(e.target.value); setErrEmail(false); }} /></div>
          <div className="cf-field"><label htmlFor="cf-co">Dealership</label>
            <input className="cf-input" id="cf-co" type="text" placeholder="Business name" value={co}
              onChange={(e) => setCo(e.target.value)} /></div>
          <div className="cf-field"><label htmlFor="cf-msg">Message</label>
            <textarea className="cf-input" id="cf-msg" placeholder="How can we help?" value={msg}
              onChange={(e) => setMsg(e.target.value)} /></div>
          <button className="btn btn-lg btn-green" type="submit" style={{ width: "100%" }}>Send message</button>
        </form>
      )}
    </div>
  );
}
