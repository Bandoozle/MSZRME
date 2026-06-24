"use client";

import { useState } from "react";
import { KPI } from "@/lib/data";
import type { AuthUser } from "@/lib/types";

type Period = "Day" | "Week" | "Month" | "YTD" | "Year";

interface Props {
  user: AuthUser;
  dark: boolean;
}

export function Dashboard({ user, dark }: Props) {
  const [period, setPeriod] = useState<Period>("Day");
  const d = KPI[period];

  const c = dark
    ? { t1: "rgba(255,255,255,0.92)", t2: "rgba(235,235,245,0.6)", card: "#1C1C1E", sep: "rgba(255,255,255,0.09)", green: "#30D158", blue: "#0A84FF" }
    : { t1: "#0A160A", t2: "rgba(60,60,67,0.6)", card: "#FFFFFF", sep: "rgba(0,0,0,0.06)", green: "#00694A", blue: "#0088FF" };

  const revPct = Math.round(d.totalRev / d.revTarget * 100);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: c.t1, letterSpacing: "-.03em", margin: 0 }}>Dashboard</h1>
        <div style={{ display: "flex", gap: "4px", background: dark ? "#2C2C2E" : "#F2F2F7", padding: "3px", borderRadius: "10px" }}>
          {(["Day", "Week", "Month", "YTD", "Year"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "5px 10px", border: "none", cursor: "pointer", fontFamily: "inherit",
              background: period === p ? (dark ? "#636366" : "#FFFFFF") : "transparent",
              color: period === p ? c.t1 : c.t2,
              fontWeight: period === p ? 700 : 400, fontSize: "11px", borderRadius: "8px",
              boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg,#003D2B,#00694A,#00B478)", borderRadius: "18px", padding: "20px 22px", marginBottom: "10px", color: "white" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: ".10em", marginBottom: "6px" }}>
          Total Revenue · {period} · {user.biz}
        </div>
        <div style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-.05em", lineHeight: 1, marginBottom: "6px" }}>
          ${(d.totalRev / 1000).toFixed(0)}K
        </div>
        <div style={{ fontSize: "13px", opacity: 0.75 }}>{(d.totalRev / d.revTarget * 100).toFixed(1)}% of target</div>
        <div style={{ marginTop: "12px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(revPct, 100)}%`, background: "#fff", borderRadius: "2px", transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Install Rev vs Target", value: `${(d.installRev / d.installTarget * 100).toFixed(0)}%`, sub: `On $${(d.installRev / 1000).toFixed(0)}K`, col: c.blue },
          { label: "Closing Ratio", value: `${d.closingRatio.toFixed(1)}%`, sub: `On ${d.estimates} estimates`, col: c.green },
          { label: "Avg Ticket", value: `$${(d.avgTicket / 1000).toFixed(1)}K`, sub: `Target $${(d.avgTicketTarget / 1000).toFixed(1)}K`, col: c.green },
          { label: "Service Revenue", value: `$${(d.serviceRev / 1000).toFixed(0)}K`, sub: `Of $${(d.avgTicket / 1000).toFixed(1)}K tgt`, col: c.blue },
          { label: "Maintenance Agmt", value: `${d.maintenanceContracts}`, sub: `of ${d.maintenanceTarget} target`, col: "#FF453A" },
          { label: "Demand Service", value: `${d.demandService}`, sub: `Avg $${Math.round(d.serviceRev / Math.max(d.demandService, 1))} each`, col: "#FF453A" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: c.card, borderRadius: "14px", padding: "14px 12px", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "10px", color: c.t2, fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: ".05em" }}>{stat.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: stat.col, letterSpacing: "-.04em", lineHeight: 1, marginBottom: "3px" }}>{stat.value}</div>
            <div style={{ fontSize: "10px", color: c.t2 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: c.card, borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "13px 16px", borderBottom: `0.5px solid ${c.sep}` }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: c.t2, textTransform: "uppercase", letterSpacing: ".08em" }}>Performance Summary</div>
        </div>
        {[
          { label: "Sales Revenue", sub: `${period} · ${(d.totalRev / d.revTarget * 100).toFixed(0)}% of goal`, value: `$${(d.totalRev / 1000).toFixed(0)}K`, status: d.totalRev >= d.revTarget ? "↑ on pace" : "↓ behind", statusColor: d.totalRev >= d.revTarget ? c.green : "#FF453A" },
          { label: "Closing Ratio", sub: "Top 22% of dealers", value: `${d.closingRatio.toFixed(1)}%`, status: "", statusColor: c.t2 },
          { label: "Average Ticket", sub: "+12% vs trailing 90 days", value: `$${(d.avgTicket / 1000).toFixed(1)}K`, status: "", statusColor: c.t2 },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: `0.5px solid ${c.sep}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: c.t1 }}>{row.label}</div>
              <div style={{ fontSize: "11px", color: c.t2 }}>{row.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: c.t1 }}>{row.value}</div>
              {row.status && <div style={{ fontSize: "10px", color: row.statusColor, fontWeight: 700 }}>{row.status}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
