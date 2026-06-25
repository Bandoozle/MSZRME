"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";
import { PlanPill, StatusPill } from "../components/AdminUi";

export function CommsPage() {
  const { accounts, scheduled, notifHistory, showToast, addAuditLog } = useAdmin();
  const [notifIcon, setNotifIcon] = useState("📣");
  const [notifMsg, setNotifMsg] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const sendNotif = () => {
    if (!selectedCount || !notifMsg.trim()) {
      showToast("Select accounts and enter a message", "error");
      return;
    }
    showToast(`Notification sent to ${selectedCount} account(s)`, "success");
    addAuditLog("sarah.admin", "NOTIF_SENT", `Notification: "${notifMsg.slice(0, 50)}"`);
    setNotifMsg("");
  };

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em", marginBottom: "4px" }}>Communications</div>
      <div style={{ fontSize: "13px", color: "var(--atm)", marginBottom: "20px" }}>Push notifications, broadcasts, and email campaigns</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div>
              <div className="adm-card-title">Send Notification</div>
              <div style={{ fontSize: "11px", color: "var(--atm)", marginTop: "2px" }}>Pushes directly to dealer in-app bell</div>
            </div>
            <span className="adm-pill pill-b">In-App</span>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "6px" }}>Notification Type</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  ["📣", "Announcement"],
                  ["⚠️", "Alert"],
                  ["✅", "Achievement"],
                  ["💡", "Tip"],
                ].map(([icon, label]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNotifIcon(icon)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 11px",
                      borderRadius: "20px",
                      border: `1px solid ${notifIcon === icon ? "rgba(0,180,120,0.4)" : "var(--ac)"}`,
                      background: notifIcon === icon ? "rgba(0,180,120,0.15)" : "none",
                      color: notifIcon === icon ? "#00B478" : "var(--atm)",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px", display: "block", marginBottom: "6px" }}>Message</label>
              <textarea
                className="adm-input"
                rows={3}
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                placeholder="e.g. Your closing ratio hit 70% this week — top 15% in your market."
                style={{ resize: "vertical", width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".3px" }}>Recipients</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 9px" }} onClick={() => setSelected(Object.fromEntries(accounts.map((a) => [a.id, true])))}>Select All</button>
                  <button type="button" className="adm-btn adm-btn-s" style={{ fontSize: "10px", padding: "3px 9px" }} onClick={() => setSelected({})}>Clear</button>
                </div>
              </div>
              <div style={{ maxHeight: "220px", overflowY: "auto", paddingRight: "4px" }}>
                {accounts.map((a) => (
                  <label
                    key={a.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "9px",
                      cursor: "pointer",
                      border: "1px solid var(--ac)",
                      marginBottom: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!selected[a.id]}
                      onChange={(e) => setSelected((s) => ({ ...s, [a.id]: e.target.checked }))}
                      style={{ accentColor: "#00B478", width: "15px", height: "15px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--atp)" }}>{a.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--atm)" }}>{a.city}</div>
                    </div>
                    <StatusPill status={a.status} />
                  </label>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "var(--atm)", marginTop: "8px", textAlign: "right" }}>{selectedCount} accounts selected</div>
            </div>
            <button type="button" className="adm-btn adm-btn-p" style={{ width: "100%", padding: "11px", fontSize: "13px" }} onClick={sendNotif}>
              Send Notification
            </button>
          </div>
        </div>

        <div>
          <div className="adm-card" style={{ marginBottom: "12px" }}>
            <div className="adm-card-hdr">
              <div className="adm-card-title">Notification History</div>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {notifHistory.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "11px 0", borderBottom: i < notifHistory.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined }}>
                  <div style={{ fontSize: "18px", flexShrink: 0 }}>{n.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "3px" }}>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{n.t}</span>
                      <span style={{ fontSize: "10px", color: "rgba(0,180,120,0.7)" }}>→ {n.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-hdr">
              <div className="adm-card-title">Scheduled</div>
              <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("Schedule modal coming soon")}>+ Schedule</button>
            </div>
            <div style={{ padding: "10px 16px" }}>
              {scheduled.map((s) => (
                <div key={s.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--ac)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--atp)" }}>{s.icon} {s.text.slice(0, 60)}</div>
                  <div style={{ fontSize: "10px", color: "var(--atm)", marginTop: "4px" }}>{s.sendAt} · {s.to}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
