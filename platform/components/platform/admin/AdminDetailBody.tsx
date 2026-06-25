"use client";

import { useState } from "react";
import type { AdminAccountExt } from "@/lib/platform/utils/admin";
import {
  admChurnColor,
  admChurnLabel,
  admChurnRisk,
  admIsInactive,
} from "@/lib/platform/utils/admin";
import { TIER_DEFS, type TierId } from "@/lib/platform/data/nav";
import type { AdminCallLog, ExitDeal } from "@/lib/platform/data/admin";
import { useAdmin } from "./AdminContext";
import { AbbrLabel, PlanPill, StagePill, StatusPill } from "./components/AdminUi";
import type { DetailTabId } from "./types";

const EXIT_STAGES = [
  "Optimization",
  "PE Ready",
  "Marketed",
  "LOI",
  "Due Diligence",
  "Closed",
] as const;

const EXIT_STAGE_COLORS: Record<string, string> = {
  Optimization: "#4A6A50",
  "PE Ready": "#1A4DB0",
  Marketed: "#F5A623",
  LOI: "#E8681A",
  "Due Diligence": "#C62828",
  Closed: "#00B478",
};

const ACTIVITY_EVENTS = [
  "Logged in",
  "Logged Numbers — Installs tab",
  "Viewed Market Pulse",
  "Downloaded May invoice",
  "Changed password",
  "Updated revenue goal to $220K",
  "Viewed GM Calculator",
  "Sent message to coach",
  "Logged Numbers — Service tab",
  "Viewed Seasonal Planner",
];

const ACTIVITY_TIMES = [
  "2min ago",
  "14min ago",
  "1hr ago",
  "2hr ago",
  "Yesterday",
  "Yesterday",
  "2 days ago",
  "2 days ago",
  "3 days ago",
  "4 days ago",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="#00B478" strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TagPills({ accountId }: { accountId: string }) {
  const { tags } = useAdmin();
  const list = tags[accountId] || [];
  if (!list.length) return null;
  return (
    <>
      {list.map((t) => (
        <span
          key={t}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            fontSize: "9px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "20px",
            background: "rgba(0,0,0,0.06)",
            color: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          {t}
        </span>
      ))}
    </>
  );
}

function DetailOverview({ a }: { a: AdminAccountExt }) {
  const {
    setPage,
    setSupportThread,
    closeDetail,
    setDetailTab,
    suspendAccount,
    setAccounts,
    showToast,
    addAuditLog,
    setInputModal,
    setTags,
    tags,
  } = useAdmin();
  const churn = admChurnRisk(a);

  const toggleSuspend = () => {
    if (a.status === "Suspended") {
      setAccounts((prev) =>
        prev.map((x) => (x.id === a.id ? { ...x, status: "Active" } : x))
      );
      showToast(`${a.name} reinstated`, "success");
      addAuditLog("sarah.admin", "REINSTATE", `Reinstated ${a.id}`);
      return;
    }
    suspendAccount(a.id);
  };

  const editTags = () => {
    setInputModal({
      title: `Edit Account Tags — ${a.id}`,
      fields: [
        {
          id: "tags",
          label: "Tags (comma-separated)",
          placeholder: "e.g. VIP, Follow Up, Trial Converting",
          value: (tags[a.id] || []).join(", "),
          hint: "Used for internal organisation only. Not visible to dealers.",
        },
      ],
      confirmLabel: "Save Tags",
      onConfirm: (vals) => {
        setTags((prev) => ({
          ...prev,
          [a.id]: vals.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }));
        showToast("Tags updated", "success");
        addAuditLog("sarah.admin", "TAGS_UPDATE", `Updated tags for ${a.id}`);
        setInputModal(null);
      },
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--ac)",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#003D2B,#00B478)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "19px",
            fontWeight: 800,
            color: "white",
            flexShrink: 0,
          }}
        >
          {a.alias.slice(-1)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--atp)" }}>{a.name}</div>
          <div style={{ fontSize: "12px", color: "var(--atm)", marginTop: "2px" }}>
            {a.email} · {a.city}
          </div>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <StagePill stage={a.stage} />
            <StatusPill status={a.status} />
            <PlanPill plan={a.plan} />
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          [<AbbrLabel key="r" full="Monthly Revenue" abbr="Rev/mo" />, `$${a.rev.toLocaleString()}K`, "#00B478"],
          [<AbbrLabel key="c" full="Closing Ratio" abbr="Close %" />, `${a.cr}%`, "#00B478"],
          ["Maintenance Contracts", a.mc, "#00B478"],
          ["Installs", a.inst, "var(--ats)"],
          [<AbbrLabel key="m" full="Monthly Recurring" abbr="MRR" />, `$${a.mrr.toLocaleString()}`, "#00B478"],
          ["Member Since", a.joined, "var(--ats)"],
        ].map(([l, v, c], i) => (
          <div
            key={i}
            style={{
              background: "var(--ac)",
              borderRadius: "9px",
              padding: "10px 12px",
              border: "1px solid var(--ac)",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontWeight: 600,
                color: "var(--atm)",
                textTransform: "uppercase",
                letterSpacing: ".4px",
                marginBottom: "4px",
              }}
            >
              {l}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: c as string,
                fontFamily: "monospace",
                letterSpacing: "-.02em",
              }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <TagPills accountId={a.id} />
        <button
          type="button"
          onClick={editTags}
          style={{
            fontSize: "10px",
            padding: "3px 9px",
            borderRadius: "20px",
            border: "1px solid var(--abdr2)",
            background: "none",
            color: "var(--atm)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Edit Tags
        </button>
        {churn >= 35 ? (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: "20px",
              background: `${admChurnColor(churn)}1a`,
              color: admChurnColor(churn),
              border: `1px solid ${admChurnColor(churn)}33`,
            }}
          >
            Churn Risk: {admChurnLabel(churn)}
          </span>
        ) : null}
      </div>
      {admIsInactive(a) ? (
        <div
          style={{
            padding: "12px",
            borderRadius: "10px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            marginBottom: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "18px", flexShrink: 0 }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#EF4444", marginBottom: "3px" }}>
              Inactive — last seen {a.lastLogin}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(239,68,68,0.7)", lineHeight: 1.5 }}>
              No login in 7+ days. This account may be at risk — a check-in message is recommended.
            </div>
            <button
              type="button"
              onClick={() => {
                setPage("support");
                setSupportThread(a.id);
                closeDetail();
              }}
              style={{
                marginTop: "8px",
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.12)",
                color: "#EF4444",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Send check-in message →
            </button>
          </div>
        </div>
      ) : null}
      {a.notes ? (
        <div
          style={{
            padding: "12px",
            borderRadius: "10px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            marginBottom: "14px",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 600, color: "#F59E0B", marginBottom: "4px" }}>ADMIN NOTES</div>
          <div style={{ fontSize: "12px", color: "var(--ats)" }}>{a.notes}</div>
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          type="button"
          className="adm-btn adm-btn-p"
          style={{ width: "100%", padding: "10px", textAlign: "left", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}
          onClick={() => {
            setPage("support");
            setSupportThread(a.id);
            closeDetail();
          }}
        >
          Message {a.name.split(" ")[0]}
        </button>
        <button
          type="button"
          className="adm-btn adm-btn-s"
          style={{ width: "100%", padding: "10px", textAlign: "left", fontSize: "12px" }}
          onClick={() => setDetailTab("security")}
        >
          Reset Password
        </button>
        <button
          type="button"
          className="adm-btn adm-btn-s"
          style={{ width: "100%", padding: "10px", textAlign: "left", fontSize: "12px" }}
          onClick={() => setDetailTab("billing")}
        >
          Manage Billing
        </button>
        <button
          type="button"
          className="adm-btn"
          style={{
            width: "100%",
            padding: "10px",
            textAlign: "left",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(239,68,68,0.1)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          onClick={() => {
            toggleSuspend();
            if (a.status !== "Suspended") closeDetail();
          }}
        >
          {a.status === "Suspended" ? "Reinstate Account" : "Suspend Account"}
        </button>
      </div>
    </>
  );
}

function DetailEdit({ a }: { a: AdminAccountExt }) {
  const { setAccounts, showToast, addAuditLog, setConfirm } = useAdmin();
  const [form, setForm] = useState({
    name: a.name,
    email: a.email,
    phone: a.phone,
    city: a.city,
    stage: a.stage,
    status: a.status,
    notes: a.notes || "",
  });

  const save = () => {
    setAccounts((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, ...form } : x))
    );
    showToast("Account updated", "success");
    addAuditLog("sarah.admin", "ACCOUNT_EDIT", `Edited ${a.id} — ${form.name}`);
  };

  const changePlan = (plan: string) => {
    setConfirm({
      title: `Change plan to ${plan}?`,
      body: `${a.name} will be moved from ${a.plan} to ${plan}.${plan === "Pro" ? " $550/mo will apply." : plan === "Trial" ? " Billing paused." : " Custom pricing required."}`,
      confirmLabel: "Change Plan",
      confirmStyle: "background:#00694A;color:white",
      onConfirm: () => {
        const mrr = plan === "Pro" ? 550 : plan === "Trial" ? 0 : 990;
        setAccounts((prev) =>
          prev.map((x) => (x.id === a.id ? { ...x, plan, mrr } : x))
        );
        showToast(`Plan changed to ${plan}`, "success");
        addAuditLog("sarah.admin", "PLAN_CHANGE", `Changed ${a.id} plan: ${plan}`);
        setConfirm(null);
      },
    });
  };

  return (
    <>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ats)", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid var(--ac)" }}>
          Account Information
        </div>
        {(
          [
            ["Business Name", "name", "text"],
            ["Email", "email", "email"],
            ["Phone", "phone", "text"],
            ["City", "city", "text"],
          ] as const
        ).map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "5px" }}>
              {label}
            </label>
            <input
              type={type}
              className="adm-input"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "5px" }}>Stage</label>
          <select className="adm-input" value={form.stage} onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}>
            {["Yellow", "Green", "Blue"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "5px" }}>Status</label>
          <select className="adm-input" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {["Active", "At Risk", "Trial", "Suspended"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "5px" }}>Admin Notes</label>
          <textarea className="adm-input" rows={3} style={{ resize: "vertical" }} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <button type="button" className="adm-btn adm-btn-p" style={{ width: "100%", padding: "10px" }} onClick={save}>
          Save Changes
        </button>
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ats)", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid var(--ac)" }}>
          Plan Management
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Trial", "Pro", "Enterprise"].map((p) => (
            <button key={p} type="button" className={`adm-btn ${a.plan === p ? "adm-btn-p" : "adm-btn-s"}`} style={{ fontSize: "12px" }} onClick={() => changePlan(p)}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "var(--atm)", marginTop: "8px" }}>
          Current: {a.plan} · ${a.mrr}/mo
        </div>
      </div>
    </>
  );
}

function DetailCalls({ a }: { a: AdminAccountExt }) {
  const { callLogs, setCallLogs } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [actionText, setActionText] = useState("");
  const logs = callLogs[a.id] || [];

  const saveCall = () => {
    if (!noteText.trim()) return;
    const date = new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
    const entry: AdminCallLog = {
      id: "c" + Date.now(),
      date,
      duration: "60 min",
      type: "Coaching",
      notes: noteText.trim(),
      actions: actionText ? [actionText] : [],
      done: actionText ? [false] : [],
    };
    setCallLogs((prev) => ({ ...prev, [a.id]: [entry, ...(prev[a.id] || [])] }));
    setShowModal(false);
    setNoteText("");
    setActionText("");
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)" }}>Coaching Calls</div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            padding: "7px 14px",
            borderRadius: "20px",
            background: "rgba(0,105,74,0.12)",
            border: "1px solid rgba(0,105,74,0.25)",
            color: "#00694A",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Log Call
        </button>
      </div>
      {logs.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--atm)", fontSize: "13px", background: "var(--ac)", borderRadius: "12px", border: "1px solid var(--abdr)" }}>
          No calls logged yet
        </div>
      ) : (
        logs.map((call) => {
          const doneCount = call.done.filter(Boolean).length;
          const allDone = doneCount === call.actions.length && call.actions.length > 0;
          return (
            <div key={call.id} style={{ background: "var(--ac)", borderRadius: "12px", border: "1px solid var(--abdr)", overflow: "hidden", marginBottom: "10px" }}>
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--abdr)" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)" }}>{call.date}</div>
                  <div style={{ fontSize: "11px", color: "var(--ats)", marginTop: "2px" }}>
                    {call.type} · {call.duration}
                  </div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: allDone ? "#00B478" : "#F5A623" }}>
                  {allDone ? "✓ All done" : `${doneCount}/${call.actions.length} done`}
                </div>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: "12px", color: "var(--ats)", lineHeight: 1.6, marginBottom: "10px" }}>{call.notes}</div>
                {call.actions.length > 0 ? (
                  <>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "6px" }}>Action Items</div>
                    {call.actions.map((act, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid var(--abdr)" }}>
                        <div
                          style={{
                            width: "17px",
                            height: "17px",
                            borderRadius: "50%",
                            border: `1.5px solid ${call.done[i] ? "#00B478" : "var(--abdr2)"}`,
                            background: call.done[i] ? "rgba(0,180,120,0.15)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {call.done[i] ? <CheckIcon /> : null}
                        </div>
                        <span style={{ fontSize: "12px", color: call.done[i] ? "var(--atm)" : "var(--ats)", textDecoration: call.done[i] ? "line-through" : "none" }}>{act}</span>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          );
        })
      )}
      {showModal ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--as)", borderRadius: "16px", width: "100%", maxWidth: "420px", overflow: "hidden", border: "1px solid var(--abdr)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--abdr)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--atp)" }}>Log Coaching Call</div>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--atm)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--atm)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".4px" }}>Call Notes</div>
                <textarea className="adm-input" rows={4} placeholder="Summary of discussion, key takeaways..." value={noteText} onChange={(e) => setNoteText(e.target.value)} style={{ width: "100%", resize: "none" }} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--atm)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".4px" }}>Action Item</div>
                <input className="adm-input" type="text" placeholder="One key action item..." value={actionText} onChange={(e) => setActionText(e.target.value)} style={{ width: "100%" }} />
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--abdr)", display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--abdr)", background: "none", color: "var(--ats)", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button type="button" onClick={saveCall} style={{ flex: 2, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#003D2B,#00694A)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Save Call</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DetailTier({ a }: { a: AdminAccountExt }) {
  const { pendingTier, setPendingTier, setAccounts, showToast, exitPipeline, setExitPipeline } = useAdmin();
  const currentTier = (a.tier || 1) as TierId;
  const t = TIER_DEFS[currentTier];
  const milestones = t.milestones || [];
  const mDone = [true, false, false, false].slice(0, milestones.length);
  const pending = pendingTier !== null && pendingTier !== currentTier ? pendingTier : null;
  const pt = pending ? TIER_DEFS[pending as TierId] : null;
  const deal = exitPipeline.find((d) => d.dealerName === a.name);

  const saveTier = () => {
    if (pending === null) return;
    const tier = pending as TierId;
    setAccounts((prev) =>
      prev.map((x) =>
        x.id === a.id ? { ...x, tier, mrr: TIER_DEFS[tier].price } : x
      )
    );
    setPendingTier(null);
    showToast(`Tier updated to ${TIER_DEFS[tier].name} — dealer nav updated`, "success");
  };

  const addExit = () => {
    const evEst = Math.round(a.rev * 1000 * 0.12 * 4.5);
    const row: ExitDeal = {
      id: "exit" + Date.now(),
      dealerName: a.name,
      tier: a.tier || 3,
      revM: Math.round(a.rev / 100) / 10,
      ebitdaM: Math.round(a.rev * 0.12) / 1000,
      multiple: 4.5,
      evEstimate: evEst,
      stage: "Optimization",
      targetExit: "Q4 2027",
      successFeeRate: 1.5,
      successFee: Math.round(evEst * 0.015),
      notes: "Recently added to exit pipeline.",
    };
    setExitPipeline((prev) => [...prev, row]);
  };

  return (
    <>
      <div style={{ background: t.gradient, borderRadius: "12px", padding: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: "4px" }}>Current Tier</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "white", letterSpacing: "-.04em" }}>
            T{currentTier} · {t.name}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginTop: "3px" }}>{t.calls}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "white" }}>${t.price.toLocaleString()}</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>{t.priceSuffix}</div>
        </div>
      </div>
      <div style={{ background: "var(--ac)", borderRadius: "12px", border: "1px solid var(--abdr)", padding: "14px 16px", marginBottom: "10px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ats)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "10px" }}>Change Tier</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: pending ? "12px" : 0 }}>
          {([1, 2, 3, 4] as TierId[]).map((n) => {
            const td = TIER_DEFS[n];
            const isCurrent = n === currentTier;
            const isSelected = n === (pending ?? currentTier);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPendingTier(n === currentTier ? null : n)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: `2px solid ${isSelected ? td.color : "var(--abdr)"}`,
                  background: isSelected ? `${td.color}18` : "transparent",
                  color: isSelected ? td.color : "var(--atm)",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  position: "relative",
                }}
              >
                T{n} {td.name}
                {isCurrent && !pending ? (
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", fontSize: "7px", fontWeight: 700, color: "white", background: td.color, padding: "1px 5px", borderRadius: "10px" }}>CURRENT</span>
                ) : null}
              </button>
            );
          })}
        </div>
        {pending && pt ? (
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: `${pt.color}10`, borderRadius: "10px", border: `1px dashed ${pt.color}55`, marginTop: "2px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: pt.color }}>
                Changing to T{pending} · {pt.name}
              </div>
              <div style={{ fontSize: "10px", color: "var(--atm)", marginTop: "2px" }}>
                ${pt.price.toLocaleString()}
                {pt.priceSuffix} · {pt.calls}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button type="button" onClick={() => setPendingTier(null)} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid var(--abdr)", background: "none", color: "var(--ats)", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button type="button" onClick={saveTier} style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: pt.gradient, color: "white", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Save Change</button>
            </div>
          </div>
        ) : null}
      </div>
      {currentTier < 4 ? (
        <div style={{ background: "var(--ac)", borderRadius: "12px", border: "1px solid var(--abdr)", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ats)", textTransform: "uppercase", letterSpacing: ".5px" }}>
              Milestones → T{currentTier + 1} {TIER_DEFS[(currentTier + 1) as TierId].name}
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: mDone.filter(Boolean).length === milestones.length && milestones.length > 0 ? "#00B478" : "var(--atm)" }}>
              {mDone.filter(Boolean).length}/{milestones.length}
            </div>
          </div>
          {milestones.map((m, i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid var(--abdr)" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${mDone[i] ? "#00B478" : "var(--abdr2)"}`, background: mDone[i] ? "rgba(0,180,120,0.12)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {mDone[i] ? <CheckIcon /> : null}
              </div>
              <span style={{ fontSize: "13px", color: mDone[i] ? "var(--atm)" : "var(--atp)", textDecoration: mDone[i] ? "line-through" : "none" }}>{m}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "rgba(0,180,120,0.08)", borderRadius: "12px", border: "1px solid rgba(0,180,120,0.2)", padding: "14px 16px", fontSize: "13px", color: "#00694A", fontWeight: 600 }}>
          ✓ Maximum tier — Exit Prep advisory active
        </div>
      )}
      {currentTier >= 3 ? (
        <div style={{ background: "var(--ac)", borderRadius: "12px", border: "1px solid var(--abdr)", padding: "14px 16px", marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ats)", textTransform: "uppercase", letterSpacing: ".5px" }}>Exit Deal</div>
            {!deal ? (
              <button type="button" onClick={addExit} style={{ fontSize: "10px", fontWeight: 700, color: "#00694A", background: "rgba(0,105,74,0.1)", border: "1px solid rgba(0,105,74,0.2)", borderRadius: "20px", padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>+ Start tracking</button>
            ) : null}
          </div>
          {!deal ? (
            <div style={{ fontSize: "12px", color: "var(--atm)", textAlign: "center", padding: "12px 0" }}>No exit deal tracked yet</div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                {[
                  ["Est. Value", `$${Math.round(deal.evEstimate / 1000)}K`, "#4A7FD4"],
                  ["Success Fee", `$${deal.successFee.toLocaleString()}`, "#F5A623"],
                  ["Revenue", `$${deal.revM}M/yr`, "var(--ats)"],
                  ["Target Exit", deal.targetExit, "var(--ats)"],
                ].map(([l, v, c]) => (
                  <div key={l as string} style={{ background: "var(--ac2)", borderRadius: "8px", padding: "10px 12px", border: "1px solid var(--abdr)" }}>
                    <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "3px" }}>{l}</div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: c as string }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "7px" }}>Deal Stage</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {EXIT_STAGES.map((stage) => {
                  const sc = EXIT_STAGE_COLORS[stage];
                  const active = stage === deal.stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() =>
                        setExitPipeline((prev) =>
                          prev.map((d) => (d.id === deal.id ? { ...d, stage } : d))
                        )
                      }
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        border: `1px solid ${active ? sc : "var(--abdr)"}`,
                        background: active ? `${sc}22` : "transparent",
                        color: active ? sc : "var(--atm)",
                        fontSize: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

function DetailSecurity({ a }: { a: AdminAccountExt }) {
  const { setAccounts, setConfirm, showToast, addAuditLog } = useAdmin();

  const sendPwReset = () => {
    setConfirm({
      title: "Send Password Reset Email",
      body: `A password reset link will be sent to ${a.email}. The link expires in 24 hours.`,
      confirmLabel: "Send Email",
      confirmStyle: "background:#00694A;color:white",
      onConfirm: () => {
        showToast("Password reset email sent", "success");
        addAuditLog("sarah.admin", "PW_RESET", `Sent password reset to ${a.email}`);
        setConfirm(null);
      },
    });
  };

  const setTempPw = () => {
    const tempPw = "Temp" + Math.random().toString(36).slice(-6).toUpperCase() + "!";
    setConfirm({
      title: "Set Temporary Password",
      body: `A temporary password will be set for ${a.name}: ${tempPw}. They will be forced to change it on next login.`,
      confirmLabel: "Set Password",
      confirmStyle: "background:#00694A;color:white",
      onConfirm: () => {
        showToast("Temporary password set", "success");
        addAuditLog("sarah.admin", "TEMP_PW", `Set temporary password for ${a.id}`);
        setConfirm(null);
      },
    });
  };

  const forceLogout = () => {
    setConfirm({
      title: "Force Logout",
      body: `All active sessions for ${a.name} will be terminated immediately.`,
      confirmLabel: "Force Logout",
      confirmStyle: "background:#EF4444;color:white",
      onConfirm: () => {
        setAccounts((prev) => prev.map((x) => (x.id === a.id ? { ...x, sessions: 0 } : x)));
        showToast("All sessions terminated", "warn");
        addAuditLog("sarah.admin", "FORCE_LOGOUT", `Forced logout for ${a.id}`);
        setConfirm(null);
      },
    });
  };

  const reset2fa = () => {
    setConfirm({
      title: "Reset 2FA",
      body: `This will disable two-factor authentication for ${a.name}. They will need to re-enrol.`,
      confirmLabel: "Reset 2FA",
      confirmStyle: "background:#F59E0B;color:black",
      onConfirm: () => {
        setAccounts((prev) => prev.map((x) => (x.id === a.id ? { ...x, tfa: false } : x)));
        showToast("2FA reset", "warn");
        addAuditLog("sarah.admin", "2FA_RESET", `Reset 2FA for ${a.id}`);
        setConfirm(null);
      },
    });
  };

  const loginHistory = [
    "Now — North Vancouver, BC — MacBook Pro",
    "3hr ago — North Vancouver, BC — iPhone 15",
    "Yesterday — North Vancouver, BC — MacBook Pro",
    "2 days ago — North Vancouver, BC — MacBook Pro",
  ];

  return (
    <>
      <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid var(--ac)" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "12px" }}>Password Reset</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button type="button" className="adm-btn adm-btn-p" style={{ width: "100%", padding: "10px", fontSize: "12px", textAlign: "left" }} onClick={sendPwReset}>Send Password Reset Email</button>
          <button type="button" className="adm-btn adm-btn-s" style={{ width: "100%", padding: "10px", fontSize: "12px", textAlign: "left" }} onClick={setTempPw}>Set Temporary Password</button>
          <button type="button" className="adm-btn adm-btn-s" style={{ width: "100%", padding: "10px", fontSize: "12px", textAlign: "left" }} onClick={forceLogout}>Force Logout All Sessions</button>
        </div>
      </div>
      <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid var(--ac)" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "12px" }}>Two-Factor Authentication</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "10px", background: "var(--ac)", border: "1px solid var(--ac)" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--atp)" }}>2FA Status</div>
            <div style={{ fontSize: "11px", color: a.tfa ? "#00B478" : "#F59E0B", marginTop: "2px" }}>{a.tfa ? "● Enabled" : "○ Not enabled"}</div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {a.tfa ? (
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px" }} onClick={reset2fa}>Reset 2FA</button>
            ) : (
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px" }} onClick={() => showToast("2FA enforcement email sent")}>Enforce 2FA</button>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid var(--ac)" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "12px" }}>Active Sessions ({a.sessions})</div>
        {a.sessions > 0 ? (
          Array.from({ length: a.sessions }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "9px", background: "var(--ac)", marginBottom: "6px", border: "1px solid var(--ac)" }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--atp)" }}>{i === 0 ? "MacBook Pro · Safari" : "iPhone · MSZRME App"}</div>
                <div style={{ fontSize: "11px", color: "var(--atm)", marginTop: "1px" }}>
                  {a.city} · {i === 0 ? "Active now" : "2h ago"}
                </div>
              </div>
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "4px 9px" }} onClick={() => showToast("Session revoked")}>Revoke</button>
            </div>
          ))
        ) : (
          <div style={{ fontSize: "13px", color: "var(--atm)" }}>No active sessions</div>
        )}
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "12px" }}>Recent Login History</div>
        {loginHistory.map((ev, i) => (
          <div key={ev} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid var(--ac)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 0 ? "#00B478" : "var(--atm)", flexShrink: 0 }} />
            <div style={{ fontSize: "11px", color: "var(--ats)" }}>{ev}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function DetailBilling({ a }: { a: AdminAccountExt }) {
  const { invoices, setAccounts, setInputModal, setConfirm, showToast, addAuditLog } = useAdmin();
  const invs = invoices.filter((i) => i.account === a.id);

  const extendBilling = () => {
    setInputModal({
      title: "Extend Billing Period",
      fields: [
        { id: "days", label: "Extension (days)", type: "number", placeholder: "30", value: "30" },
        { id: "reason", label: "Reason", placeholder: "e.g. Payment issue accommodation" },
      ],
      confirmLabel: "Extend Billing",
      onConfirm: (vals) => {
        showToast(`Billing extended ${vals.days} days`, "success");
        addAuditLog("sarah.admin", "BILLING_EXT", `Extended billing ${vals.days} days for ${a.id}`);
        setInputModal(null);
      },
    });
  };

  const addCredit = () => {
    setInputModal({
      title: "Add Account Credit",
      fields: [
        { id: "amount", label: "Credit Amount ($)", type: "number", placeholder: "0" },
        { id: "reason", label: "Reason", placeholder: "e.g. Service issue credit" },
      ],
      confirmLabel: "Add Credit",
      onConfirm: (vals) => {
        setAccounts((prev) =>
          prev.map((x) =>
            x.id === a.id ? { ...x, credits: (x.credits || 0) + parseFloat(vals.amount || "0") } : x
          )
        );
        showToast(`$${vals.amount} credit added`, "success");
        addAuditLog("sarah.admin", "CREDIT_ADD", `Added $${vals.amount} credit to ${a.id}`);
        setInputModal(null);
      },
    });
  };

  const issueRefund = () => {
    setInputModal({
      title: "Issue Refund",
      fields: [
        { id: "invoice", label: "Invoice ID", placeholder: "INV-2026-000", value: "INV-2026-0" + a.id.slice(-2) + "0" },
        { id: "amount", label: "Refund Amount ($)", type: "number", placeholder: "550" },
        { id: "reason", label: "Reason", placeholder: "e.g. Service quality issue" },
      ],
      confirmLabel: "Issue Refund",
      onConfirm: (vals) => {
        showToast(`Refund of $${vals.amount} issued`, "success");
        addAuditLog("sarah.admin", "REFUND", `Issued $${vals.amount} refund for ${a.id}`);
        setInputModal(null);
      },
    });
  };

  const manualCharge = () => {
    setInputModal({
      title: "Manual Charge",
      fields: [
        { id: "amount", label: "Amount ($)", type: "number", placeholder: "550", value: String(a.mrr || 550) },
        { id: "desc", label: "Description", placeholder: "e.g. MSZRME Pro — June 2026" },
        { id: "method", label: "Payment Method", type: "select", options: ["Card on file", "Other"] },
      ],
      confirmLabel: "Charge Now",
      onConfirm: (vals) => {
        setInputModal(null);
        setConfirm({
          title: "Confirm Charge",
          body: `Charge $${vals.amount} to ${a.name} (${a.email}) for "${vals.desc}"?`,
          confirmLabel: "Confirm Charge",
          confirmStyle: "background:#00694A;color:white",
          onConfirm: () => {
            showToast(`$${vals.amount} charged successfully`, "success");
            addAuditLog("sarah.admin", "MANUAL_CHARGE", `Charged $${vals.amount} to ${a.id}`);
            setConfirm(null);
          },
        });
      },
    });
  };

  return (
    <>
      <div style={{ background: "linear-gradient(135deg,#060D08,#00694A)", borderRadius: "12px", padding: "16px", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "var(--ac)" }} />
        <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--ats)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "4px" }}>Current Plan</div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "#E8F0FF", letterSpacing: "-.02em", textTransform: "uppercase" }}>MSZRME {a.plan}</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <div style={{ fontSize: "13px", color: "var(--ats)" }}>${a.mrr}/month · Next Jun 1, 2026</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>${a.mrr}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        <button type="button" className="adm-btn adm-btn-s" style={{ padding: "10px", fontSize: "12px" }} onClick={extendBilling}>Extend Billing</button>
        <button type="button" className="adm-btn adm-btn-s" style={{ padding: "10px", fontSize: "12px" }} onClick={addCredit}>Add Credit</button>
        <button type="button" className="adm-btn adm-btn-s" style={{ padding: "10px", fontSize: "12px" }} onClick={issueRefund}>Issue Refund</button>
        <button type="button" className="adm-btn adm-btn-s" style={{ padding: "10px", fontSize: "12px" }} onClick={manualCharge}>Manual Charge</button>
      </div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "10px" }}>Invoice History</div>
      {invs.length ? (
        invs.map((inv) => (
          <div key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--ac)" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--atp)" }}>{inv.name}</div>
              <div style={{ fontSize: "11px", color: "var(--atm)", marginTop: "1px", fontFamily: "monospace" }}>
                {inv.id} · {inv.date}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", textAlign: "right" }}>{inv.amount > 0 ? `$${inv.amount}` : "—"}</div>
                <div style={{ fontSize: "10px", fontWeight: 600, color: inv.status === "Paid" ? "#00B478" : inv.status === "Overdue" ? "#EF4444" : "#F59E0B", textAlign: "right" }}>{inv.status}</div>
              </div>
              <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 9px" }} onClick={() => showToast("Invoice PDF opened")}>PDF</button>
              {inv.status === "Overdue" ? (
                <button type="button" className="adm-btn" style={{ fontSize: "10px", padding: "3px 9px", background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }} onClick={() => showToast("Retry charge initiated")}>Retry</button>
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <div style={{ fontSize: "13px", color: "var(--atm)", padding: "10px 0" }}>No invoices found</div>
      )}
    </>
  );
}

function DetailData({ a }: { a: AdminAccountExt }) {
  const { showToast } = useAdmin();
  const cells = [
    ["Installs", a.inst],
    ["Install Rev", `$${Math.round(a.rev * 0.7).toLocaleString()}K`],
    ["Leads", Math.round(a.mc / 0.4)],
    ["Estimates", Math.round(a.mc / 0.3)],
    ["Sales Closed", Math.round((a.cr * a.mc) / 100 * 1.2)],
    ["Avg Ticket", `$${Math.round((a.rev * 1000) / Math.max(a.inst, 1) / 100) * 100}`],
    ["Maint. Calls", a.mc],
    ["Demand Calls", Math.round(a.mc * 0.3)],
    ["Service Rev", `$${Math.round(a.rev * 0.15).toLocaleString()}K`],
    ["Total Rev", `$${a.rev.toLocaleString()}K`],
  ];

  return (
    <>
      <div style={{ fontSize: "12px", color: "var(--atm)", marginBottom: "14px" }}>
        Viewing {a.alias}&apos;s May KPI data. Admins can correct entries.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {cells.map(([l, v]) => (
          <div key={l as string} style={{ background: "var(--ac)", borderRadius: "9px", padding: "10px 12px", border: "1px solid var(--ac)" }}>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: "4px" }}>{l}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--atp)", fontFamily: "monospace" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("KPI data exported as CSV")}>Export KPI CSV</button>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Correction submitted")}>Submit Correction</button>
        <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Full report opened")}>Generate Report</button>
      </div>
    </>
  );
}

function DetailActivity({ a }: { a: AdminAccountExt }) {
  const { notesTimeline, setNotesTimeline, setInputModal, setDetailTab, showToast, addAuditLog } = useAdmin();
  const notes = notesTimeline[a.id] || [];

  const addNote = () => {
    setInputModal({
      title: `Add Note — ${a.id}`,
      fields: [{ id: "note", label: "Note", placeholder: "e.g. Called owner, discussed upgrade path to Enterprise…" }],
      confirmLabel: "Add Note",
      onConfirm: (vals) => {
        if (!vals.note.trim()) {
          showToast("Note cannot be empty", "error");
          return;
        }
        const now = new Date().toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        setNotesTimeline((prev) => ({
          ...prev,
          [a.id]: [{ t: now, author: "Sarah Admin", note: vals.note.trim() }, ...(prev[a.id] || [])],
        }));
        showToast("Note added", "success");
        addAuditLog("sarah.admin", "NOTE_ADDED", `Added note for ${a.id}`);
        setDetailTab("activity");
        setInputModal(null);
      },
    });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ fontSize: "12px", color: "var(--atm)" }}>Last 7 days · {ACTIVITY_EVENTS.length} events</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button type="button" className="adm-btn adm-btn-p" style={{ fontSize: "11px" }} onClick={addNote}>+ Add Note</button>
          <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "11px" }} onClick={() => showToast("Activity log exported")}>Export</button>
        </div>
      </div>
      {notes.map((n, i) => (
        <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(0,105,74,0.06)", border: "1px solid rgba(0,105,74,0.12)", marginBottom: "8px" }}>
          <div style={{ fontSize: "10px", color: "var(--atm)", marginBottom: "4px" }}>
            {n.t} · {n.author}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ats)", lineHeight: 1.5 }}>{n.note}</div>
        </div>
      ))}
      {ACTIVITY_EVENTS.map((ev, i) => (
        <div key={ev} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid var(--ac)" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: i === 0 ? "#00B478" : "rgba(0,180,120,0.4)", flexShrink: 0, marginTop: "5px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", color: "var(--ats)" }}>{ev}</div>
            <div style={{ fontSize: "10px", color: "var(--atm)", marginTop: "1px" }}>{ACTIVITY_TIMES[i]}</div>
          </div>
        </div>
      ))}
    </>
  );
}

export function AdminDetailBody({ account, tab }: { account: AdminAccountExt; tab: DetailTabId }) {
  switch (tab) {
    case "overview":
      return <DetailOverview a={account} />;
    case "edit":
      return <DetailEdit a={account} />;
    case "calls":
      return <DetailCalls a={account} />;
    case "tier":
      return <DetailTier a={account} />;
    case "security":
      return <DetailSecurity a={account} />;
    case "billing":
      return <DetailBilling a={account} />;
    case "data":
      return <DetailData a={account} />;
    case "activity":
      return <DetailActivity a={account} />;
    default:
      return null;
  }
}
