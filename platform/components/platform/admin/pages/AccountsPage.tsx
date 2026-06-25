"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "../AdminContext";
import {
  AbbrLabel,
  PlanPill,
  StagePill,
  StatusPill,
} from "../components/AdminUi";
import { STAGE_DEFS, TIER_DEFS } from "@/lib/platform/data/nav";
import {
  admChurnColor,
  admChurnLabel,
  admChurnRisk,
  admHealthColor,
  admHealthScore,
} from "@/lib/platform/utils/admin";

export function AccountsPage() {
  const {
    accounts,
    openDetail,
    suspendAccount,
    setInputModal,
    createAccount,
    tags,
    showToast,
  } = useAdmin();
  const [nameQ, setNameQ] = useState("");
  const [stageQ, setStageQ] = useState("");
  const [statusQ, setStatusQ] = useState("");

  const filtered = useMemo(
    () =>
      accounts.filter((a) => {
        const q = nameQ.toLowerCase();
        const okName =
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q);
        const okStage = !stageQ || a.stage === stageQ;
        const okStatus = !statusQ || a.status === statusQ;
        return okName && okStage && okStatus;
      }),
    [accounts, nameQ, stageQ, statusQ]
  );

  const tagPills = (id: string) =>
    (tags[id] || []).map((t) => (
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
    ));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "-.03em" }}>
          Accounts
        </div>
        <button
          type="button"
          className="adm-btn adm-btn-p"
          onClick={() =>
            setInputModal({
              title: "Create New Account",
              fields: [
                { id: "name", label: "Business Name", placeholder: "e.g. Maple Ridge HVAC", hint: "Required" },
                { id: "email", label: "Email Address", type: "email", placeholder: "owner@company.ca", hint: "Used for login and billing" },
                { id: "phone", label: "Phone", placeholder: "+1 604 555 0000" },
                { id: "city", label: "City", placeholder: "e.g. Maple Ridge, BC" },
                { id: "plan", label: "Plan", type: "select", options: ["Trial", "Pro"] },
              ],
              confirmLabel: "Create Account",
              onConfirm: (vals) => {
                createAccount(vals);
                setInputModal(null);
              },
            })
          }
        >
          + Create Account
        </button>
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
        All {accounts.length} dealer accounts — click a row to open full management panel
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        <input
          className="adm-input"
          placeholder="Search name, email, ID…"
          style={{ maxWidth: "240px", height: "34px" }}
          value={nameQ}
          onChange={(e) => setNameQ(e.target.value)}
        />
        <select
          className="adm-input"
          style={{ maxWidth: "120px", height: "34px" }}
          value={stageQ}
          onChange={(e) => setStageQ(e.target.value)}
        >
          <option value="">All stages</option>
          <option>Blue</option>
          <option>Green</option>
          <option>Yellow</option>
        </select>
        <select
          className="adm-input"
          style={{ maxWidth: "120px", height: "34px" }}
          value={statusQ}
          onChange={(e) => setStatusQ(e.target.value)}
        >
          <option value="">All statuses</option>
          <option>Active</option>
          <option>At Risk</option>
          <option>Trial</option>
          <option>Suspended</option>
        </select>
        <button
          type="button"
          className="adm-btn adm-btn-s"
          onClick={() => showToast("CSV exported", "success")}
        >
          Export CSV
        </button>
      </div>
      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Business</th>
                <th>Email</th>
                <th>Stage</th>
                <th>Status</th>
                <th>Health</th>
                <th>Tier · Stage</th>
                <th>Churn Risk</th>
                <th>Plan</th>
                <th>
                  <AbbrLabel full="Two-Factor Auth" abbr="2FA" />
                </th>
                <th>
                  <AbbrLabel full="Closing Ratio" abbr="CR%" />
                </th>
                <th>
                  <AbbrLabel full="Revenue / Month" abbr="Rev/mo" />
                </th>
                <th>
                  <AbbrLabel full="Last Login" abbr="Login" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const tier = TIER_DEFS[(a.tier || 1) as 1 | 2 | 3 | 4];
                const stageId = a.clientStage || "white";
                const stageData =
                  STAGE_DEFS.find((s) => s.id === stageId) || STAGE_DEFS[0];
                const risk = admChurnRisk(a);
                return (
                  <tr
                    key={a.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => openDetail(a.id)}
                  >
                    <td style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                      {a.id}
                    </td>
                    <td className="td-n">
                      {a.name}
                      {(tags[a.id] || []).length ? (
                        <div style={{ marginTop: "3px" }}>{tagPills(a.id)}</div>
                      ) : null}
                    </td>
                    <td style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{a.email}</td>
                    <td>
                      <StagePill stage={a.stage} />
                    </td>
                    <td>
                      <StatusPill status={a.status} />
                    </td>
                    <td>
                      {(() => {
                        const s = admHealthScore(a);
                        const c = admHealthColor(s);
                        return (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "20px",
                              background: c + "1a",
                              color: c,
                            }}
                          >
                            {s}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 7px",
                            borderRadius: "6px",
                            background: tier.color + "15",
                            color: tier.color,
                            border: `1px solid ${tier.color}28`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          T{a.tier || 1} {tier.name}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: stageData.color,
                              flexShrink: 0,
                              display: "inline-block",
                            }}
                          />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: stageData.color }}>
                            {stageData.label}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "11px", fontWeight: 700, color: admChurnColor(risk) }}>
                      {admChurnLabel(risk)}
                    </td>
                    <td>
                      <PlanPill plan={a.plan} />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {a.tfa ? (
                        <span style={{ color: "#00B478", fontSize: "14px" }}>✓</span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                      )}
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{a.cr}%</td>
                    <td style={{ color: "#00B478", fontWeight: 600 }}>
                      {a.rev > 0 ? "$" + a.rev.toLocaleString() + "K" : "—"}
                    </td>
                    <td
                      style={{
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color:
                          a.lastLogin === "Now" ||
                          a.lastLogin.includes("min") ||
                          a.lastLogin.includes("hr")
                            ? "#00B478"
                            : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {a.lastLogin}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <button
                        type="button"
                        className="adm-btn adm-btn-s"
                        style={{ fontSize: "10px", padding: "3px 8px", marginRight: "3px" }}
                        onClick={() => openDetail(a.id)}
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        className="adm-btn"
                        style={{
                          fontSize: "10px",
                          padding: "3px 8px",
                          background: "rgba(239,68,68,0.1)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                        onClick={() => suspendAccount(a.id)}
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
