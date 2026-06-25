"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { AbbrLabel, PlanPill, StatusPill } from "../components/AdminUi";
import { admIsInactive, admLastLoginColor } from "@/lib/platform/utils/admin";

export function SupportPage() {
  const {
    accounts,
    threads,
    supportThread,
    setSupportThread,
    sendSupportMessage,
    setPage,
    openDetail,
    showToast,
  } = useAdmin();
  const [draft, setDraft] = useState("");
  const [threadQ, setThreadQ] = useState("");

  const groups = [
    { label: "Blue Stage", color: "#00B478", accounts: accounts.filter((a) => a.stage === "Blue") },
    { label: "Green Stage", color: "#00B478", accounts: accounts.filter((a) => a.stage === "Green") },
    { label: "Yellow Stage", color: "#F59E0B", accounts: accounts.filter((a) => a.stage === "Yellow") },
  ].filter((g) => g.accounts.length > 0);

  const active = accounts.find((a) => a.id === supportThread);
  const thread = threads[supportThread] || [];

  const send = () => {
    if (!draft.trim()) return;
    sendSupportMessage(draft);
    setDraft("");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", height: "calc(100vh - 52px)" }} id="adm-chat-grid">
      <div style={{ borderRight: "1px solid rgba(0,0,0,0.08)", overflowY: "auto", background: "#FAFCF9" }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.08)", position: "sticky", top: 0, background: "#FAFCF9", zIndex: 2 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0A160A", marginBottom: "8px" }}>Support Chat</div>
          <input
            style={{
              width: "100%",
              padding: "7px 12px",
              borderRadius: "9px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#F0F3F0",
              fontSize: "12px",
              color: "#0A160A",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder="Search accounts or contacts…"
            value={threadQ}
            onChange={(e) => setThreadQ(e.target.value)}
          />
        </div>
        {groups.map((g) => (
          <div key={g.label}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px 5px", background: "#FFFFFF", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: g.color }} />
              <div style={{ fontSize: "10px", fontWeight: 700, color: g.color, textTransform: "uppercase", letterSpacing: ".6px" }}>{g.label}</div>
            </div>
            {g.accounts
              .filter(
                (a) =>
                  !threadQ ||
                  a.name.toLowerCase().includes(threadQ.toLowerCase()) ||
                  a.contact?.toLowerCase().includes(threadQ.toLowerCase())
              )
              .map((a) => {
                const t = threads[a.id];
                const last = t?.[t.length - 1];
                const ur = last?.from === "them";
                const inactive = admIsInactive(a);
                const selected = supportThread === a.id;
                return (
                  <div
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSupportThread(a.id)}
                    style={{
                      padding: "11px 14px",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      background: selected ? "rgba(26,77,176,0.1)" : "none",
                      position: "relative",
                    }}
                  >
                    {inactive ? (
                      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", background: "#EF4444" }} />
                    ) : null}
                    <div style={{ fontSize: "13px", fontWeight: ur ? 700 : 600, color: ur ? "#0A160A" : "#2D4A32" }}>{a.name}</div>
                    <div style={{ fontSize: "11px", color: "#7A9A7A", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {last?.msg || "No messages yet"}
                    </div>
                    <div style={{ fontSize: "10px", color: admLastLoginColor(a), marginTop: "4px" }}>{a.lastLogin}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0A160A" }}>
            {active?.name || "Select a conversation"}
          </div>
          {active ? (
            <div style={{ fontSize: "12px", color: "#4A6A50", marginTop: "1px" }}>
              {active.contact} · {active.email}
            </div>
          ) : null}
          {active ? (
            <div style={{ display: "flex", gap: "7px", marginTop: "10px", flexWrap: "wrap" }}>
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px", padding: "5px 11px" }} onClick={() => { openDetail(active.id); setPage("accounts"); }}>
                View Account
              </button>
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px", padding: "5px 11px" }} onClick={() => showToast("Password reset sent")}>
                Reset Password
              </button>
            </div>
          ) : null}
        </div>
        <div id="adm-chat-area" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", background: "#EEF2EE" }}>
          {thread.length ? (
            thread.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "us" ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    ...(m.from === "us"
                      ? {
                          background: "linear-gradient(135deg,#0C2D6E,#1A4DB0)",
                          color: "#FFFFFF",
                          borderRadius: "14px 14px 3px 14px",
                          border: "1px solid rgba(30,90,180,0.3)",
                        }
                      : {
                          background: "#FFFFFF",
                          color: "#0A160A",
                          border: "1px solid rgba(0,0,0,0.08)",
                          borderRadius: "14px 14px 14px 3px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }),
                  }}
                >
                  {m.msg}
                </div>
                <div style={{ fontSize: "10px", color: "#7A9A7A", marginTop: "3px", padding: "0 4px" }}>{m.t}</div>
              </div>
            ))
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#7A9A7A", gap: "8px" }}>
              <div style={{ fontSize: "32px" }}>💬</div>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>No messages yet</div>
            </div>
          )}
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: "10px", alignItems: "center", background: "#FFFFFF" }}>
          <input
            id="adm-chat-input"
            placeholder={`Reply to ${active?.contact || "dealer"}…`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{
              flex: 1,
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "#F0F3F0",
              fontSize: "13px",
              fontFamily: "inherit",
              outline: "none",
              color: "#0A160A",
            }}
          />
          <button
            type="button"
            onClick={send}
            style={{
              padding: "9px 18px",
              borderRadius: "4px",
              background: "linear-gradient(135deg,#0C2D6E,#1A4DB0)",
              border: "1px solid rgba(30,90,180,0.45)",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export function BillingPage() {
  const { accounts, monthly, openDetail, showToast } = useAdmin();
  const billingMRR = accounts.reduce((s, a) => s + a.mrr, 0);
  const billingARR = billingMRR * 12;
  const paidAccts = accounts.filter((a) => a.mrr > 0);
  const billingARPA = paidAccts.length ? Math.round(billingMRR / paidAccts.length) : 0;
  const trialAccts = accounts.filter((a) => a.plan === "Trial").length;
  const prevMRRb = monthly.length >= 2 ? monthly[monthly.length - 2].mrr : billingMRR;
  const mrrDeltab = billingMRR - prevMRRb;
  const prevMob = monthly.length >= 2 ? monthly[monthly.length - 2].mo : "Prior";

  const cards = [
    ["Monthly Recurring Revenue", "MRR", "$" + billingMRR.toLocaleString(), (mrrDeltab > 0 ? "↑ +$" : "↓ -$") + Math.abs(mrrDeltab).toLocaleString() + " vs " + prevMob, "#4A7FD4"],
    ["Annual Run Rate", "ARR", "$" + billingARR.toLocaleString(), "Based on current Monthly Recurring Revenue", "#1A4DB0"],
    ["Avg Revenue / Account", "ARPA", "$" + billingARPA.toLocaleString(), paidAccts.length + " paying account(s)", "#8A9BA8"],
    ["Trial Accounts", "Trials", trialAccts + " / " + accounts.length, "Awaiting conversion", "#F59E0B"],
  ];

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em", marginBottom: "4px" }}>Billing & MRR</div>
      <div style={{ fontSize: "13px", color: "var(--atm)", marginBottom: "18px" }}>Platform revenue overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {cards.map(([full, abbr, val, delta, color]) => (
          <div className="adm-stat" key={full}>
            <div className="adm-stat-lbl"><AbbrLabel full={full} abbr={abbr} /></div>
            <div className="adm-stat-val">{val}</div>
            <div className="adm-stat-d" style={{ color, fontSize: "11px", marginTop: "5px" }}>{delta}</div>
          </div>
        ))}
      </div>
      <div className="adm-card">
        <div className="adm-card-hdr">
          <div className="adm-card-title">Account Billing Status</div>
          <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Billing report exported")}>Export</button>
        </div>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Plan</th>
              <th><AbbrLabel full="Monthly Revenue" abbr="MRR" /></th>
              <th>Status</th>
              <th><AbbrLabel full="Next Billing Date" abbr="Next Billing" /></th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a, i) => (
              <tr key={a.id}>
                <td className="td-n" style={{ cursor: "pointer" }} onClick={() => openDetail(a.id)}>{a.name}</td>
                <td><PlanPill plan={a.plan} /></td>
                <td style={{ color: "#4A7FD4", fontWeight: 700, fontFamily: "monospace" }}>{a.mrr > 0 ? "$" + a.mrr.toLocaleString() : "—"}</td>
                <td><StatusPill status={a.status} /></td>
                <td style={{ fontSize: "11px", fontFamily: "monospace" }}>{a.plan === "Trial" ? "N/A" : "Jun 1, 2026"}</td>
                <td style={{ fontSize: "11px", fontFamily: "monospace" }}>••{["4821", "3190", "7722", "9901"][i] || "—"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 8px", marginRight: "3px" }} onClick={() => showToast("Billing extended 30 days")}>Extend</button>
                  <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 8px" }} onClick={() => showToast("Credit applied")}>Credit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function InvoicesPage() {
  const { invoices, showToast } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const filtered = invoices.filter((inv) => {
    const okQ = !q || inv.id.toLowerCase().includes(q.toLowerCase()) || inv.name.toLowerCase().includes(q.toLowerCase());
    const okS = !status || inv.status === status;
    return okQ && okS;
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em" }}>Invoices</div>
        <button type="button" className="adm-btn adm-btn-p" onClick={() => showToast("Invoice created")}>+ Create Invoice</button>
      </div>
      <div style={{ fontSize: "13px", color: "var(--atm)", marginBottom: "14px" }}>All platform invoices and payment history</div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <input className="adm-input" placeholder="Search invoice ID, account name…" style={{ maxWidth: "260px", height: "34px" }} value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="adm-input" style={{ maxWidth: "130px", height: "34px" }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Paid</option>
          <option>Overdue</option>
          <option>Trial</option>
        </select>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Invoices exported as CSV")}>Export CSV</button>
      </div>
      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Account</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#00B478" }}>{inv.id}</td>
                  <td className="td-n">{inv.name}</td>
                  <td style={{ fontSize: "11px", fontFamily: "monospace" }}>{inv.date}</td>
                  <td style={{ color: "#00B478", fontWeight: 700, fontFamily: "monospace" }}>{inv.amount > 0 ? "$" + inv.amount : "—"}</td>
                  <td style={{ fontSize: "11px", fontFamily: "monospace" }}>{inv.method}</td>
                  <td><StatusPill status={inv.status} /></td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 8px" }} onClick={() => showToast("PDF opened")}>PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function SystemPage() {
  const { showToast } = useAdmin();
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em" }}>System Health</div>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Status page refreshed")}>↻ Refresh</button>
      </div>
      <div style={{ fontSize: "13px", color: "var(--atm)", marginBottom: "20px" }}>Live platform monitoring</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {[
          ["API Server", "99.97%", "Operational", "#00B478"],
          ["Database", "99.99%", "Operational", "#00B478"],
          ["Auth Service", "100%", "Operational", "#00B478"],
          ["File Storage", "99.8%", "Operational", "#00B478"],
          ["Email Service", "99.5%", "Degraded", "#F59E0B"],
          ["CDN", "100%", "Operational", "#00B478"],
        ].map(([s, u, st, c]) => (
          <div className="adm-stat" key={s}>
            <div className="adm-stat-lbl">{s}</div>
            <div className="adm-stat-val" style={{ fontSize: "20px" }}>{u}</div>
            <div className="adm-stat-d" style={{ color: c, fontSize: "11px", fontWeight: 600, marginTop: "5px" }}>● {st}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div className="adm-card">
          <div className="adm-card-hdr"><div className="adm-card-title">Resource Usage</div></div>
          <div style={{ padding: "12px 18px" }}>
            {[
              ["CPU Usage", "34%", 34, "#00B478"],
              ["Memory", "61%", 61, "#F59E0B"],
              ["DB Connections", "18/100", 18, "#00B478"],
              ["Storage", "2.1 GB/50 GB", 4, "#00B478"],
              ["Active Sessions", "6", 60, "#00B478"],
              ["API Calls Today", "14,829", 89, "#CCCCCC"],
            ].map(([l, v, p, c]) => (
              <div className="adm-sys-row" key={l as string}>
                <div style={{ fontSize: "12px", color: "var(--ats)", minWidth: "160px" }}>{l}</div>
                <div style={{ flex: 1, margin: "0 12px" }}>
                  <div className="adm-progress">
                    <div className="adm-progress-fill" style={{ width: `${Math.min(Number(p), 100)}%`, background: c as string }} />
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: c as string, fontFamily: "monospace", minWidth: "80px", textAlign: "right" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-hdr"><div className="adm-card-title">Maintenance Actions</div></div>
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              ["Clear Cache", "Flush application cache"],
              ["Run DB Vacuum", "Optimize database tables"],
              ["Force Billing Sync", "Resync Stripe data"],
              ["Send Test Email", "Test email delivery"],
            ].map(([l, d]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--ac)" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ats)" }}>{l}</div>
                  <div style={{ fontSize: "11px", color: "var(--atm)" }}>{d}</div>
                </div>
                <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px", padding: "5px 12px" }} onClick={() => showToast(l + " initiated")}>
                  {l.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function LogsPage() {
  const { logs, showToast } = useAdmin();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const levelColor = { info: "rgba(255,255,255,0.4)", warn: "#F59E0B", admin: "#CCCCCC", error: "#EF4444" };
  const levelBg = { info: "rgba(255,255,255,0.05)", warn: "rgba(245,158,11,0.12)", admin: "rgba(0,105,74,0.08)", error: "rgba(239,68,68,0.12)" };

  const filtered = logs.filter((e) => {
    const okQ = !q || `${e.user} ${e.action} ${e.detail}`.toLowerCase().includes(q.toLowerCase());
    const okL = !level || e.level === level;
    return okQ && okL;
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-.03em" }}>Audit Logs</div>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Audit log exported", "success")}>Export CSV</button>
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
        <AbbrLabel full="All admin and user activity · " abbr="Activity · " />
        {logs.length} events today
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <input className="adm-input" placeholder="Search events…" style={{ maxWidth: "240px", height: "34px" }} value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="adm-input" style={{ maxWidth: "120px", height: "34px" }} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All levels</option>
          <option>info</option>
          <option>warn</option>
          <option>admin</option>
          <option>error</option>
        </select>
      </div>
      <div className="adm-card">
        <div id="adm-logs-body" style={{ fontFamily: "monospace", fontSize: "11px" }}>
          {filtered.slice(0, 25).map((e, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 160px 120px 1fr",
                gap: "12px",
                padding: "9px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                alignItems: "center",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.3)" }}>{e.t}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.user}</div>
              <div style={{ padding: "2px 8px", borderRadius: "4px", background: levelBg[e.level], color: levelColor[e.level], fontWeight: 700, fontSize: "9px", width: "fit-content" }}>{e.action}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "inherit" }}>{e.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
