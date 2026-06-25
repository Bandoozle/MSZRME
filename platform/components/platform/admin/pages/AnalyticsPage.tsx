"use client";

import { useAdmin } from "../AdminContext";
import { AbbrLabel, StatusPill } from "../components/AdminUi";
import {
  admHealthColor,
  admHealthScore,
} from "@/lib/platform/utils/admin";

export function AnalyticsPage() {
  const { accounts, monthly, featureFlags } = useAdmin();
  const totalAccts = accounts.length;
  const dau = accounts.filter(
    (a) =>
      a.lastLogin === "Now" ||
      a.lastLogin.includes("min") ||
      a.lastLogin.includes("hr")
  ).length;
  const crAccts = accounts.filter((a) => a.cr > 0);
  const avgCR = crAccts.length
    ? (crAccts.reduce((s, a) => s + a.cr, 0) / crAccts.length).toFixed(1)
    : "—";
  const perAcctFlags = featureFlags.filter((f) => !f.global);
  const totalSlots = perAcctFlags.length * totalAccts;
  const filledSlots = perAcctFlags.reduce(
    (s, f) => s + Object.values(f.accounts).filter(Boolean).length,
    0
  );
  const modActRate = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;
  const avgHealth = totalAccts
    ? Math.round(accounts.reduce((s, a) => s + admHealthScore(a), 0) / totalAccts)
    : 0;
  const healthColor = admHealthColor(avgHealth);

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-.03em", marginBottom: "4px" }}>
        Analytics
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
        Platform usage, engagement, and adoption metrics
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
        {[
          ["Daily Active Users", "DAU", `${dau} / ${totalAccts}`, "Logged in within 24 hours", dau === totalAccts ? "#00B478" : "#F59E0B"],
          ["Average Closing Ratio", "Avg Close", `${avgCR}%`, `Mean across ${crAccts.length} active accounts`, parseFloat(String(avgCR)) >= 60 ? "#00B478" : "#F59E0B"],
          ["Module Activation Rate", "Module Act.", `${modActRate}%`, `${filledSlots} of ${totalSlots} per-account slots on`, modActRate >= 60 ? "#00B478" : "#F59E0B"],
          ["Customer Health Score", "Health", String(avgHealth), avgHealth >= 80 ? "Platform avg: Healthy" : "Platform avg: Moderate", healthColor],
        ].map(([full, abbr, val, delta, color]) => (
          <div className="adm-stat" key={full}>
            <div className="adm-stat-lbl">
              <AbbrLabel full={full} abbr={abbr} />
            </div>
            <div className="adm-stat-val">{val}</div>
            <div className="adm-stat-d" style={{ color, fontSize: "11px", fontWeight: 600, marginTop: "5px" }}>
              {delta}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Feature Flags — Per-Account Activation</div>
          </div>
          <div style={{ padding: "14px 18px" }}>
            {perAcctFlags.map((f) => {
              const on = Object.values(f.accounts).filter(Boolean).length;
              const pct = totalAccts ? Math.round((on / totalAccts) * 100) : 0;
              const c = pct === 100 ? "#00B478" : pct >= 50 ? "#F59E0B" : "rgba(255,255,255,0.3)";
              return (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", minWidth: "130px" }}>{f.name}</div>
                  <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: "3px" }} />
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: c, fontFamily: "monospace", minWidth: "44px", textAlign: "right" }}>
                    {on}/{totalAccts}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="adm-card" style={{ marginBottom: "12px" }}>
            <div className="adm-card-hdr">
              <div className="adm-card-title">Account Login Status</div>
            </div>
            <div style={{ padding: "0 18px" }}>
              {accounts.map((a, i, arr) => {
                const recent = a.lastLogin === "Now" || a.lastLogin.includes("min") || a.lastLogin.includes("hr");
                const stale = a.lastLogin.includes("day") || a.lastLogin.includes("week") || a.lastLogin === "Never";
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                    }}
                  >
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: recent ? "#00B478" : stale ? "#EF4444" : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", flex: 1 }}>
                      {a.name.split(" ").slice(0, 2).join(" ")}
                    </div>
                    <div style={{ fontSize: "11px", fontFamily: "monospace", color: recent ? "#00B478" : stale ? "#EF4444" : "rgba(255,255,255,0.4)" }}>
                      {a.lastLogin}
                    </div>
                    <StatusPill status={a.status} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-hdr">
              <div className="adm-card-title">Monthly Recurring Revenue</div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              {monthly.map((m, i, arr) => {
                const isCur = i === arr.length - 1;
                return (
                  <div key={m.mo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: "12px", color: isCur ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", fontWeight: isCur ? 700 : 400 }}>
                      {m.mo} 2026{isCur ? " now" : ""}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: isCur ? "#00B478" : "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
                      ${m.mrr.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
