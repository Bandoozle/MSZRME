"use client";

import { useMemo } from "react";
import { useAdmin } from "./AdminContext";
import { StatusPill } from "./components/AdminUi";

export function AdminTopbar() {
  const {
    accounts,
    invoices,
    searchQuery,
    setSearchQuery,
    searchOpen,
    setSearchOpen,
    toggleSidebar,
    toggleTheme,
    isDark,
    setPage,
    openDetail,
    showDealerExit,
    onExitAdmin,
    onLogout,
  } = useAdmin();

  const hits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { accounts: [], invoices: [] };
    return {
      accounts: accounts.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      ),
      invoices: invoices.filter(
        (i) =>
          i.id.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, accounts, invoices]);

  return (
    <div className="adm-topbar">
      <button
        type="button"
        id="adm-hamburger"
        onClick={toggleSidebar}
        style={{
          display: "none",
          width: "34px",
          height: "34px",
          borderRadius: "8px",
          border: "none",
          background: "rgba(0,0,0,0.06)",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginRight: "8px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          borderRight: "1px solid rgba(60,60,67,0.20)",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 18px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28C840" }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 14px",
            borderLeft: "1px solid rgba(60,60,67,0.20)",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "5px",
              background: "linear-gradient(140deg,#003D2B,#00694A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              color: "#00B478",
              fontWeight: 900,
            }}
          >
            M
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(0,0,0,0.80)" }}>
            MSZRME Admin
          </span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              background: "#00694A",
              color: "white",
              padding: "1px 6px",
              borderRadius: "4px",
              letterSpacing: ".04em",
            }}
          >
            ADMIN
          </span>
        </div>
      </div>
      <div id="adm-topbar-search" style={{ flex: 1, position: "relative", maxWidth: "360px" }}>
        <svg
          style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="adm-input"
          id="adm-global-search"
          placeholder="Search accounts, emails, invoice IDs…"
          style={{ paddingLeft: "32px", height: "36px" }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchOpen(!!e.target.value.trim());
          }}
          onFocus={() => searchQuery.trim() && setSearchOpen(true)}
        />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div
          id="adm-sys-status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#00B478",
            background: "rgba(0,180,120,0.1)",
            border: "1px solid rgba(0,180,120,0.2)",
            borderRadius: "20px",
            padding: "4px 10px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00B478",
              animation: "admpulse 2s infinite",
            }}
          />
          All systems operational
        </div>
        {showDealerExit ? (
          <button
            type="button"
            onClick={onExitAdmin}
            className="view-switch-btn"
            style={{
              fontSize: "12px",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(0,180,120,0.3)",
              background: "rgba(0,180,120,0.1)",
              color: "#00B478",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dealer View
          </button>
        ) : null}
        <button
          type="button"
          id="adm-theme-btn"
          onClick={toggleTheme}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.05)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Toggle light/dark"
        >
          <svg id="adm-theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A6A50" strokeWidth="2">
            {isDark ? (
              <>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </>
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            )}
          </svg>
        </button>
        <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#1A1A1A,#3A3A3A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 800,
              color: "#00B478",
              border: "1px solid rgba(0,180,120,0.3)",
            }}
          >
            SA
          </div>
          <div className="adm-admin-name">
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
              Sarah Admin
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Super Admin</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          style={{
            padding: "5px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "none",
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Sign Out
        </button>
      </div>

      {searchOpen ? (
        <div
          id="adm-global-results"
          style={{
            position: "absolute",
            top: "52px",
            left: "230px",
            right: 0,
            background: "#0A120A",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            zIndex: 150,
            padding: "12px 20px",
          }}
        >
          {!hits.accounts.length && !hits.invoices.length ? (
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>No results</div>
          ) : (
            <>
              {hits.accounts.length ? (
                <>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: ".5px",
                      marginBottom: "8px",
                    }}
                  >
                    Accounts
                  </div>
                  {hits.accounts.map((a) => (
                    <div
                      key={a.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setPage("accounts");
                        openDetail(a.id);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                        {a.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{a.email}</div>
                      <StatusPill status={a.status} />
                    </div>
                  ))}
                </>
              ) : null}
              {hits.invoices.length ? (
                <>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: ".5px",
                      margin: "10px 0 8px",
                    }}
                  >
                    Invoices
                  </div>
                  {hits.invoices.map((i) => (
                    <div
                      key={i.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setPage("invoices");
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#00B478" }}>{i.id}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{i.name}</div>
                    </div>
                  ))}
                </>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
