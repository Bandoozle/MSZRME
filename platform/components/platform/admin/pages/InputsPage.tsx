"use client";

import { MARKETING_INPUTS } from "@/lib/platform/data/admin";
import { useAdmin } from "../AdminContext";

export function InputsPage() {
  const { showToast } = useAdmin();
  const M = MARKETING_INPUTS;
  const coopTotal = M.coop.reduce(
    (s, c) => s + parseInt(c.available.replace(/[^0-9]/g, ""), 10),
    0
  );

  const dot = (c: string) => (
    <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: c, marginRight: "6px", verticalAlign: "middle" }} />
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em", marginBottom: "3px" }}>Marketing Inputs</div>
          <div style={{ fontSize: "13px", color: "var(--atm)" }}>
            Content feeding the dealer Seasonal Planner · changes propagate immediately to every active account in this region
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--abdr)", background: "var(--ac)", fontSize: "11px", color: "var(--ats)", fontWeight: 600 }}>
            📍 Region: <span style={{ color: "var(--atp)", fontWeight: 700 }}>{M.region}</span>
          </div>
          <button type="button" className="adm-btn adm-btn-p" style={{ fontSize: "11px" }} onClick={() => showToast("Inputs pushed to all dealers")}>
            ↑ Push to dealers
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "14px" }}>
        <div className="adm-stat">
          <div className="adm-stat-lbl">{dot("#F5A623")}Weather Signals</div>
          <div className="adm-stat-val">{M.weather.length}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-lbl">{dot("#00B478")}Co-op Programs</div>
          <div className="adm-stat-val">{M.coop.length}</div>
          <div className="adm-stat-d" style={{ color: "#00B478", fontSize: "11px", fontWeight: 600 }}>${coopTotal.toLocaleString()} available</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-lbl">{dot("#4A7FD4")}Utility Programs</div>
          <div className="adm-stat-val">{M.utility.length}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-lbl">{dot("#9B59B6")}Last Push</div>
          <div className="adm-stat-val" style={{ fontSize: "14px" }}>2d ago</div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: "12px" }}>
        <div className="adm-card-hdr">
          <div className="adm-card-title">Weather Forecast</div>
          <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("+ Add weather trend")}>+ Add</button>
        </div>
        <div style={{ padding: "0 18px 4px" }}>
          {M.weather.map((w, i, arr) => (
            <div key={w.label} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "12px", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ac)" : undefined }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--atp)" }}>{w.label}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: w.hot ? "#F5A623" : "#4A7FD4", whiteSpace: "nowrap" }}>{w.impact}</div>
              <div style={{ fontSize: "10px", color: "var(--atm)", background: "var(--atp3)", padding: "3px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>{w.window}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: "12px" }}>
        <div className="adm-card-hdr">
          <div className="adm-card-title">Co-op Marketing Funds</div>
          <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("+ Add co-op program")}>+ Add</button>
        </div>
        <div style={{ padding: "0 18px 4px" }}>
          {M.coop.map((c, i, arr) => (
            <div key={c.name} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ac)" : undefined }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "2px" }}>{c.name}</div>
                <div style={{ fontSize: "10px", color: "var(--atm)" }}>{c.used} used · {c.match} match</div>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#00B478", fontVariantNumeric: "tabular-nums" }}>{c.available}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--atp)" }}>{c.expires}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-hdr">
          <div className="adm-card-title">Utility Grants & Rebates</div>
          <button type="button" className="adm-btn adm-btn-s" onClick={() => showToast("+ Add utility program")}>+ Add</button>
        </div>
        <div style={{ padding: "0 18px 4px" }}>
          {M.utility.map((p, i, arr) => (
            <div key={p.program} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ac)" : undefined }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--atp)", marginBottom: "2px" }}>{p.program}</div>
                <div style={{ fontSize: "10px", color: "var(--atm)" }}>{p.notes}</div>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#4A7FD4", background: "rgba(74,127,212,0.1)", padding: "3px 8px", borderRadius: "6px", letterSpacing: ".05em", textTransform: "uppercase" }}>{p.audience}</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--atp)", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{p.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
