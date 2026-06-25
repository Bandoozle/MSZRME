"use client";

import { useAdmin } from "../AdminContext";
import { AbbrLabel, StagePill, StatusPill } from "../components/AdminUi";
import {
  admIsInactive,
  admLastLoginColor,
} from "@/lib/platform/utils/admin";

export function OverviewPage() {
  const { accounts, threads, monthly, featureFlags, setPage, openDetail, showToast, setSupportThread } =
    useAdmin();

  const active = accounts.filter((a) => a.status === "Active").length;
  const unread = Object.values(threads).filter(
    (t) => t[t.length - 1]?.from === "them"
  ).length;
  const curMRR = accounts.reduce((s, a) => s + a.mrr, 0);
  const prevMRR =
    monthly.length >= 2 ? monthly[monthly.length - 2].mrr : curMRR;
  const mrrDelta = curMRR - prevMRR;
  const prevMo = monthly.length >= 2 ? monthly[monthly.length - 2].mo : "Prior";
  const mrrDeltaStr =
    (mrrDelta > 0 ? "↑ +$" : mrrDelta < 0 ? "↓ -$" : "=") +
    Math.abs(mrrDelta).toLocaleString() +
    " vs " +
    prevMo;
  const dateStr = new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const perAcct = featureFlags.filter((f) => !f.global);
  const totalSlots = perAcct.length * accounts.length;
  const onSlots = perAcct.reduce(
    (s, f) => s + Object.values(f.accounts).filter(Boolean).length,
    0
  );
  const pct = totalSlots ? Math.round((onSlots / totalSlots) * 100) : 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: ".02em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Admin Dashboard
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{dateStr}</div>
        </div>
        <button
          type="button"
          className="adm-btn adm-btn-p"
          onClick={() => showToast("Announcement banner pushed")}
          style={{ flexShrink: 0, whiteSpace: "nowrap" }}
        >
          📢 Push Announcement
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        {[
          ["Monthly Recurring Revenue", "MRR", "$" + curMRR.toLocaleString(), mrrDeltaStr, "#00B478"],
          ["Active Accounts", "Active", `${active} / ${accounts.length}`, "↑ +1 this month", "#00B478"],
          [
            "Inactive 7+ Days",
            "Inactive 7d+",
            String(accounts.filter(admIsInactive).length),
            "Churn risk · reach out",
            "#EF4444",
          ],
          ["Support Queue", "Support", `${unread} unread`, "Open threads", "#F59E0B"],
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "14px",
          marginBottom: "14px",
        }}
      >
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Account Health</div>
            <button type="button" className="adm-btn adm-btn-s" onClick={() => setPage("accounts")}>
              View all →
            </button>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Stage</th>
                <th>Status</th>
                <th>
                  <AbbrLabel full="Last Login" abbr="Login" />
                </th>
                <th>
                  <AbbrLabel full="Monthly Revenue" abbr="MRR" />
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPage("accounts");
                    openDetail(a.id);
                  }}
                >
                  <td className="td-n">
                    {a.name}
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>
                      {a.email}
                    </div>
                  </td>
                  <td>
                    <StagePill stage={a.stage} />
                  </td>
                  <td>
                    <StatusPill status={a.status} />
                  </td>
                  <td
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: admLastLoginColor(a),
                    }}
                  >
                    {a.lastLogin}
                  </td>
                  <td style={{ color: "#4A7FD4", fontWeight: 600, fontSize: "11px" }}>
                    {a.mrr > 0 ? "$" + a.mrr.toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="adm-card" style={{ marginBottom: "12px" }}>
            <div className="adm-card-hdr">
              <div className="adm-card-title">Module Activation</div>
              <button type="button" className="adm-btn adm-btn-s" onClick={() => setPage("config")}>
                Manage →
              </button>
            </div>
            <div style={{ padding: "10px 16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Overall activation</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#00B478", letterSpacing: "-.02em" }}>
                  {pct}%
                </div>
              </div>
              {perAcct.slice(0, 5).map((f) => {
                const on = Object.values(f.accounts).filter(Boolean).length;
                const bar = Math.round((on / accounts.length) * 100);
                return (
                  <div key={f.id} style={{ padding: "6px 0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "11px",
                        marginBottom: "3px",
                      }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{f.name}</span>
                      <span style={{ color: "#00B478", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {on}/{accounts.length}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        borderRadius: "3px",
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg,#00694A,#00B478)",
                          width: `${bar}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="adm-card" style={{ marginBottom: "12px" }}>
            <div className="adm-card-hdr">
              <div className="adm-card-title">Platform Vitals</div>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {[
                ["API Uptime", "99.97%", "#00B478"],
                ["Avg Response", "142ms", "#00B478"],
                ["Active Sessions", "6", "#00B478"],
                ["Error Rate", "0.02%", "#00B478"],
                ["DB Load", "34%", "#00B478"],
                ["Storage", "2.1 GB / 50 GB", "#F59E0B"],
              ].map(([l, v, c]) => (
                <div className="adm-sys-row" key={l}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{l}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: c, fontFamily: "monospace" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-hdr">
              <div className="adm-card-title">Support Queue</div>
              <span className="adm-badge">{unread}</span>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {accounts
                .filter((a) => threads[a.id])
                .map((a) => {
                  const t = threads[a.id];
                  const last = t[t.length - 1];
                  const ur = last?.from === "them";
                  return (
                    <div
                      key={a.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setPage("support");
                        setSupportThread(a.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "7px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: ur ? "#EF4444" : "rgba(255,255,255,0.15)",
                          marginTop: "4px",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: ur ? 700 : 500,
                            color: ur ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {a.alias}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.3)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "150px",
                          }}
                        >
                          {last?.msg || ""}
                        </div>
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
