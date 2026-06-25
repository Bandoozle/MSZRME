"use client";

import { useAdmin } from "../AdminContext";

export function ConfigPage() {
  const { accounts, featureFlags, setFeatureFlags, setConfirm, showToast, addAuditLog } = useAdmin();
  const globalFlags = featureFlags.filter((f) => f.global);
  const perAcctFlags = featureFlags.filter((f) => !f.global);
  const totalAcctSlots = accounts.length * perAcctFlags.length;
  const filledAcctSlots = perAcctFlags.reduce(
    (s, f) => s + Object.values(f.accounts).filter(Boolean).length,
    0
  );

  const tierBadge = (t: number) => {
    if (t === 0)
      return (
        <span style={{ fontSize: "9px", fontWeight: 800, padding: "2px 7px", borderRadius: "5px", background: "rgba(155,89,182,0.12)", color: "#9B59B6", letterSpacing: ".05em", textTransform: "uppercase" }}>
          Beta
        </span>
      );
    if (t)
      return (
        <span style={{ fontSize: "9px", fontWeight: 800, padding: "2px 7px", borderRadius: "5px", background: "rgba(0,180,120,0.12)", color: "#00B478", letterSpacing: ".05em", textTransform: "uppercase" }}>
          T{t}+
        </span>
      );
    return null;
  };

  const toggleGlobal = (flagId: string, flagName: string, enabled: boolean) => {
    setConfirm({
      title: (enabled ? "Enable " : "Disable ") + flagName + " globally?",
      body: `This affects all ${accounts.length} accounts immediately. You can reverse this at any time.`,
      confirmLabel: enabled ? "Enable" : "Disable",
      confirmStyle: enabled ? "background:#00694A;color:white" : "background:#EF4444;color:white",
      onConfirm: () => {
        showToast(flagName + " " + (enabled ? "enabled" : "disabled") + " for all accounts", enabled ? "success" : "warn");
        addAuditLog("sarah.admin", "FEATURE_FLAG", flagName + " global " + (enabled ? "enabled" : "disabled"));
        setConfirm(null);
      },
    });
  };

  const toggleAcct = (flagId: string, accountId: string, alias: string, flagName: string, checked: boolean) => {
    setFeatureFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? { ...f, accounts: { ...f.accounts, [accountId]: checked } }
          : f
      )
    );
    showToast(`${flagName} ${checked ? "enabled" : "disabled"} for ${alias}`, checked ? "success" : "warn");
    addAuditLog("sarah.admin", "FEATURE_FLAG", `${flagName} for ${accountId}: ${checked ? "ON" : "OFF"}`);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--atp)", letterSpacing: "-.03em", marginBottom: "3px" }}>Feature Flags</div>
          <div style={{ fontSize: "13px", color: "var(--atm)" }}>Module-level control across every dealer-facing surface</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            [featureFlags.length, "Total Flags"],
            [globalFlags.length, "Global"],
            [perAcctFlags.length, "Per-Account"],
            [totalAcctSlots ? Math.round((filledAcctSlots / totalAcctSlots) * 100) : 0, "Activation %"],
          ].map(([v, l]) => (
            <div key={l} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid var(--abdr)", background: "var(--ac)", textAlign: "center", minWidth: "90px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--atp)", letterSpacing: "-.02em" }}>{v}</div>
              <div style={{ fontSize: "9px", color: "var(--atm)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "14px" }}>
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Global Modules</div>
            <div style={{ fontSize: "11px", color: "var(--atm)" }}>Affects all accounts</div>
          </div>
          <div style={{ padding: "0 18px" }}>
            {globalFlags.map((f, i, arr) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ac)" : undefined }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--atp)" }}>{f.name}</div>
                    {tierBadge(f.tier)}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--atm)", lineHeight: 1.4 }}>{f.desc}</div>
                </div>
                <button type="button" className="adm-tog on" style={{ flexShrink: 0, marginLeft: "10px" }} onClick={() => toggleGlobal(f.id, f.name, false)} />
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div className="adm-card-title">Per-Account Modules</div>
            <div style={{ fontSize: "11px", color: "var(--atm)" }}>Click an account chip to toggle</div>
          </div>
          <div style={{ padding: "0 18px" }}>
            {perAcctFlags.map((f, i, arr) => {
              const enabled = Object.values(f.accounts).filter(Boolean).length;
              return (
                <div key={f.id} style={{ padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--ac)" : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "9px", gap: "10px" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--atp)" }}>{f.name}</div>
                        {tierBadge(f.tier)}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--atm)", lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: enabled > 0 ? "#00B478" : "var(--atm)", whiteSpace: "nowrap", background: enabled > 0 ? "rgba(0,180,120,0.08)" : "var(--atp3)", padding: "3px 9px", borderRadius: "12px", flexShrink: 0 }}>
                      {enabled} / {accounts.length}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {accounts.map((a) => (
                      <label
                        key={a.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          border: `1px solid ${f.accounts[a.id] ? "rgba(0,180,120,0.35)" : "var(--abdr)"}`,
                          background: f.accounts[a.id] ? "rgba(0,180,120,0.12)" : "none",
                          cursor: "pointer",
                          fontSize: "11px",
                          color: f.accounts[a.id] ? "#00B478" : "var(--atm)",
                          fontWeight: 600,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!f.accounts[a.id]}
                          style={{ accentColor: "#00B478", cursor: "pointer" }}
                          onChange={(e) => toggleAcct(f.id, a.id, a.alias, f.name, e.target.checked)}
                        />
                        {a.alias}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
