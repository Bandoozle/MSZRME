"use client";

import { useState } from "react";
import { useAdmin } from "../AdminContext";

function AiMessageContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i, arr) => (
        <span key={i}>
          {line.split(/(\*\*.*?\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={j}>{seg.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{seg}</span>
            )
          )}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export function FinancialsAdminPage() {
  const { monthly, accounts, tiers, aiMessages, setAiMessages, aiLoading, setAiLoading } = useAdmin();
  const [aiInput, setAiInput] = useState("");

  const totalMRR = monthly[monthly.length - 1].mrr;
  const arr = totalMRR * 12;
  const avgNewThisYear = (
    monthly.reduce((s, m) => s + m.new, 0) / monthly.length
  ).toFixed(1);
  const maxMRR = Math.max(...monthly.map((m) => m.mrr));

  const sendAi = (preset?: string) => {
    const msg = preset || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    setAiLoading(true);
    setAiMessages((prev) => [...prev, { role: "user", content: msg }]);
    window.setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on current MRR of **$" +
            totalMRR.toLocaleString() +
            "** and **" +
            accounts.length +
            "** accounts, focus on converting the Trial account before May 31 and recovering Dealer C's failed payment. That alone protects **$999/mo** in MRR.",
        },
      ]);
      setAiLoading(false);
    }, 1200);
  };

  return (
    <>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#0A160A", letterSpacing: "-.03em", marginBottom: "4px" }}>
        Financials & Revenue Intelligence
      </div>
      <div style={{ fontSize: "13px", color: "#4A6A50", marginBottom: "20px" }}>
        MRR growth · dealer acquisition · tier analysis · AI revenue advisor
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          ["Current MRR", "$" + totalMRR.toLocaleString(), "↑ +$550 from Apr", "#00B478"],
          ["ARR Run Rate", "$" + arr.toLocaleString(), "Annualised", "#00B478"],
          ["Avg New/Month", avgNewThisYear + "/mo", "Goal: 3–5 dealers", "#F59E0B"],
          ["Projected EOY", "$" + (3897 + 7 * 550 * 12).toLocaleString(), "At ~11 dealers", "#00B478"],
        ].map(([l, v, d, c]) => (
          <div className="adm-stat" key={l} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: c, borderRadius: "14px 14px 0 0" }} />
            <div className="adm-stat-lbl" style={{ marginTop: "4px" }}>{l}</div>
            <div className="adm-stat-val">{v}</div>
            <div className="adm-stat-d" style={{ color: c, fontSize: "11px", fontWeight: 600, marginTop: "5px" }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }} className="adm-fin-grid">
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div>
              <div className="adm-card-title">MRR Growth</div>
              <div style={{ fontSize: "11px", color: "#7A9A7A", marginTop: "2px" }}>Monthly recurring revenue · January–May 2026</div>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#00B478" }}>+60% YTD</div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "140px", paddingBottom: "28px", marginBottom: "4px" }}>
              {monthly.map((m, i) => {
                const BAR_MAX = 96;
                const px = Math.max(Math.round((m.mrr / maxMRR) * BAR_MAX), 8);
                const isCur = i === monthly.length - 1;
                return (
                  <div key={m.mo} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: isCur ? "#00B478" : "#4A6A50", marginBottom: "4px", whiteSpace: "nowrap" }}>
                      ${Math.round(m.mrr / 1000)}K
                    </div>
                    <div style={{ width: "100%", height: `${px}px`, background: isCur ? "linear-gradient(180deg,#34C759,#00B478)" : "linear-gradient(180deg,#93C5FD,#00B478)", borderRadius: "6px 6px 0 0", flexShrink: 0 }} />
                    <div style={{ fontSize: "10px", fontWeight: isCur ? 700 : 400, color: isCur ? "#00B478" : "#7A9A7A", marginTop: "5px", whiteSpace: "nowrap" }}>{m.mo}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Account Tiers</div>
            <div style={{ fontSize: "11px", color: "#4A6A50" }}>Current distribution</div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {tiers.map((t) => (
              <div key={t.name} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: t.color }} />
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#0A160A" }}>{t.name}</div>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#0A160A" }}>{t.count} accts</div>
                </div>
                <div style={{ height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${accounts.length > 0 ? (t.count / accounts.length) * 100 : 0}%`, background: t.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-hdr" style={{ background: "linear-gradient(135deg,#060D08,#00694A)", margin: "-1px", borderRadius: "14px 14px 0 0", padding: "14px 20px" }}>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>✦</span>Revenue AI Advisor
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>Powered by Claude · Analyses your account data to surface revenue opportunities</div>
          </div>
        </div>
        <div id="adm-ai-messages" style={{ padding: "16px 20px", maxHeight: "380px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#FAFCF9" }}>
          {aiMessages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: "14px 14px 3px 14px", background: "#00694A", color: "white", fontSize: "13px", lineHeight: 1.55 }}>{m.content}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg,#060D08,#00694A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>✦</div>
                <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "3px 14px 14px 14px", padding: "12px 14px", fontSize: "13px", color: "#0A160A", lineHeight: 1.6, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <AiMessageContent content={m.content} />
                </div>
              </div>
            )
          )}
          {aiLoading ? <div style={{ fontSize: "12px", color: "#7A9A7A" }}>Thinking…</div> : null}
        </div>
        <div style={{ padding: "10px 20px 14px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: "10px", alignItems: "center", background: "#FFFFFF" }}>
          <input
            id="adm-ai-input"
            className="adm-input"
            placeholder="Ask about revenue, growth strategy, churn risk…"
            style={{ flex: 1, background: "#F0F3F0", color: "#0A160A", borderColor: "rgba(0,0,0,0.1)" }}
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendAi()}
          />
          <button type="button" onClick={() => sendAi()} style={{ padding: "9px 20px", borderRadius: "4px", background: "linear-gradient(135deg,#0C2D6E,#1A4DB0)", border: "1px solid rgba(30,90,180,0.45)", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
