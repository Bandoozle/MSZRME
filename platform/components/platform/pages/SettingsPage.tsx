"use client";

import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { UserProfile } from "@/components/platform/types";
import {
  TIER_DEFS,
  type StageId,
  type TierId,
} from "@/lib/platform/data/nav";
import {
  ACCOUNT_FIELDS,
  ACTIVE_SESSIONS,
  BACKUP_CODES,
  DEFAULT_CURRENT_TIER,
  DISPLAY_TOGGLES,
  INTEGRATION_DETAILS,
  INTEGRATIONS,
  NEXT_CALL_DATE,
  NOTIFICATION_PREFS,
  ROLE_PERMISSIONS,
  SETTINGS_TABS,
  TEAM_MEMBERS,
  type Integration,
  type SettingsTab,
} from "@/lib/platform/data/settings";
import { getStageData } from "@/lib/platform/utils/format";

const cardShadow =
  "0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)";

function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={on ? "tog on" : "tog"}
      onClick={onToggle}
      style={{
        width: "51px",
        height: "31px",
        borderRadius: "16px",
        border: "none",
        background: on ? "#34C759" : "rgba(120,120,128,0.16)",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background .2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: on ? "22px" : "2px",
          width: "27px",
          height: "27px",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          transition: "left .2s",
        }}
      />
    </button>
  );
}

function SaveButton({
  children,
  onClick,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className="save-btn"
      onClick={onClick}
      style={{
        padding: "10px 22px",
        borderRadius: "40px",
        background: "linear-gradient(135deg,#003D2B,#00694A)",
        color: "white",
        fontSize: "14px",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function checkPwStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "Enter a password", color: "#7A9A7A" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const idx = Math.max(0, Math.min(score - 1, 3));
  return { level: score, label: labels[idx], color: colors[idx] };
}

export interface SettingsPageProps {
  user?: UserProfile;
  stageId?: StageId;
  currentTier?: TierId;
  initialTab?: SettingsTab;
  onLogout?: () => void;
  onToast?: (message: string) => void;
  onShowStageModal?: () => void;
}

export function SettingsPage({
  user = {
    name: "John Smith",
    biz: "North Vancouver HVAC Solutions",
    initials: "JS",
    email: "john@northvanhvac.ca",
  },
  stageId = "green",
  currentTier = DEFAULT_CURRENT_TIER,
  initialTab,
  onLogout,
  onToast,
  onShowStageModal,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    initialTab ?? "Account"
  );
  const [showAddMember, setShowAddMember] = useState(false);
  const [tfaOn, setTfaOn] = useState(false);
  const [tfaSetup, setTfaSetup] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [displayToggles, setDisplayToggles] = useState(
    () => DISPLAY_TOGGLES.map(() => true)
  );
  const [notifToggles, setNotifToggles] = useState(
    () => NOTIFICATION_PREFS.map(([, , on]) => on)
  );
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [intSearch, setIntSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState(currentTier);

  const stage = getStageData(stageId);
  const pwStrength = checkPwStrength(newPw);

  const intCategories = useMemo(() => {
    const seen = new Set<string>();
    return integrations
      .map((i) => i.category)
      .filter((c) => {
        if (seen.has(c)) return false;
        seen.add(c);
        return true;
      });
  }, [integrations]);

  const filteredIntegrations = useCallback(
    (cat: string) => {
      const q = intSearch.trim().toLowerCase();
      return integrations.filter((i) => {
        if (i.category !== cat) return false;
        if (!q) return true;
        return (
          i.name.toLowerCase().includes(q) ||
          i.desc.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        );
      });
    },
    [integrations, intSearch]
  );

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const totalToday = integrations.reduce((sum, i) => {
    if (i.status === "connected" && INTEGRATION_DETAILS[i.name]) {
      return sum + (INTEGRATION_DETAILS[i.name].syncedToday || 0);
    }
    return sum;
  }, 0);
  const anyConnected = connectedCount > 0;

  const toggleIntegration = (name: string, connect: boolean) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.name === name
          ? { ...i, status: connect ? "connected" : "" }
          : i
      )
    );
    onToast?.(connect ? `${name} connected` : `${name} disconnected`);
  };

  const selectTier = (n: TierId) => {
    setSelectedTier(n);
    onToast?.(`Selected ${TIER_DEFS[n].name} — contact your coach to confirm`);
  };

  return (
    <>
      <div style={{ padding: "4px 0 14px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0A160A",
            letterSpacing: "-.03em",
          }}
        >
          Settings
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          background: "rgba(118,118,128,0.1)",
          borderRadius: "13px",
          padding: "3px",
          marginBottom: "14px",
        }}
      >
        {SETTINGS_TABS.map((t) => {
          const active = activeTab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              style={{
                flex: 1,
                padding: "8px 4px",
                borderRadius: "10px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .15s",
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#00694A" : "#4A6A50",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                fontFamily: "inherit",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {activeTab === "Account" ? (
        <>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              padding: "16px 20px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  marginBottom: "5px",
                }}
              >
                Current Stage
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: stage.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#0A160A",
                  }}
                >
                  {stage.label} Stage
                </span>
                <span style={{ fontSize: "13px", color: "#7A9A7A" }}>
                  {stage.rev}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onShowStageModal}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                background: "#EEF1EE",
                border: "none",
                color: "#2D4A32",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              View Stages
            </button>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                }}
              >
                Account
              </div>
              <div style={{ fontSize: "13px", color: "#7A9A7A", marginTop: "2px" }}>
                {user.name} · {user.biz}
              </div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                {ACCOUNT_FIELDS.map(([label, value]) => (
                  <div key={label}>
                    <label
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#7A9A7A",
                        letterSpacing: ".3px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      defaultValue={value}
                      style={{
                        width: "100%",
                        padding: "10px 13px",
                        borderRadius: "10px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "#EEF1EE",
                        fontSize: "14px",
                        color: "#0A160A",
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.background = "#fff";
                        e.target.style.borderColor = "rgba(0,105,74,0.4)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "#EBF0EB";
                        e.target.style.borderColor = "rgba(0,0,0,0.1)";
                      }}
                    />
                  </div>
                ))}
              </div>
              <SaveButton onClick={() => onToast?.("Profile saved")}>
                Save Profile
              </SaveButton>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                }}
              >
                Change Password
              </div>
              <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
                Use a strong, unique password for this account
              </div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#7A9A7A",
                      letterSpacing: ".3px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    CURRENT PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 13px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "#EEF1EE",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#7A9A7A",
                      letterSpacing: ".3px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 13px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "#EEF1EE",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginTop: "6px",
                    }}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: "3px",
                          borderRadius: "2px",
                          background:
                            pwStrength.level >= n
                              ? pwStrength.color
                              : "#D4E4D4",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: pwStrength.color,
                      marginTop: "4px",
                    }}
                  >
                    {pwStrength.label}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#7A9A7A",
                      letterSpacing: ".3px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    CONFIRM NEW PASSWORD
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "10px 13px",
                      borderRadius: "10px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "#EEF1EE",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <SaveButton onClick={() => onToast?.("Password updated successfully")}>
                Update Password
              </SaveButton>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                }}
              >
                Security
              </div>
              <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
                Two-factor authentication & active sessions
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0A160A",
                      marginBottom: "2px",
                    }}
                  >
                    Two-Factor Authentication
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#7A9A7A",
                      maxWidth: "300px",
                      lineHeight: 1.5,
                    }}
                  >
                    Require a verification code from your authenticator app each
                    time you sign in. Strongly recommended.
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      marginTop: "8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: tfaOn ? "#34C759" : "#FF9500",
                    }}
                  >
                    <div
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: tfaOn ? "#34C759" : "#FF9500",
                      }}
                    />
                    {tfaOn ? "Enabled" : "Not enabled"}
                  </div>
                </div>
                <Toggle
                  on={tfaOn || tfaSetup}
                  onToggle={() => {
                    if (!tfaOn) setTfaSetup((s) => !s);
                    else {
                      setTfaOn(false);
                      setTfaSetup(false);
                    }
                  }}
                />
              </div>

              {tfaSetup && !tfaOn ? (
                <div
                  style={{
                    padding: "16px 0",
                    borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0A160A",
                      marginBottom: "10px",
                    }}
                  >
                    Setup Authenticator App
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "12px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "#F0F3F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        padding: "8px",
                        flexDirection: "column",
                        fontSize: "10px",
                        color: "#7A9A7A",
                        textAlign: "center",
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7A9A7A"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span style={{ fontSize: "9px", marginTop: "4px" }}>
                        QR CODE
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: "180px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#4A6A50",
                          lineHeight: 1.6,
                          marginBottom: "10px",
                        }}
                      >
                        1. Open Google Authenticator or Authy
                        <br />
                        2. Tap the + button and scan the QR code
                        <br />
                        3. Enter the 6-digit code below to confirm
                      </div>
                      <input
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        style={{
                          width: "100%",
                          padding: "10px 13px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.1)",
                          background: "#EEF1EE",
                          fontSize: "16px",
                          letterSpacing: "4px",
                          fontFamily: "inherit",
                          outline: "none",
                          textAlign: "center",
                          boxSizing: "border-box",
                        }}
                      />
                      <SaveButton
                        style={{ marginTop: "10px", fontSize: "13px" }}
                        onClick={() => {
                          setTfaOn(true);
                          setTfaSetup(false);
                          onToast?.("2FA enabled");
                        }}
                      >
                        Verify & Enable 2FA
                      </SaveButton>
                    </div>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#7A9A7A",
                        textTransform: "uppercase",
                        letterSpacing: ".4px",
                        marginBottom: "8px",
                      }}
                    >
                      Backup Codes — save these securely
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "6px",
                      }}
                    >
                      {BACKUP_CODES.map((c) => (
                        <div
                          key={c}
                          style={{
                            padding: "8px 12px",
                            background: "#F0F3F0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#0A160A",
                            fontFamily: "'Courier New',monospace",
                            letterSpacing: "1px",
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div style={{ padding: "14px 0" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0A160A",
                    marginBottom: "10px",
                  }}
                >
                  Active Sessions
                </div>
                {ACTIVE_SESSIONS.map((s, i) => (
                  <div
                    key={s.device}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        i < ACTIVE_SESSIONS.length - 1
                          ? "0.5px solid rgba(0,0,0,0.07)"
                          : undefined,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "9px",
                          background: "#EEF1EE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A6A50"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        >
                          {s.device.includes("Mac") || s.device.includes("PC") ? (
                            <>
                              <rect x="2" y="4" width="20" height="14" rx="2" />
                              <path d="M8 20h8M12 18v2" />
                            </>
                          ) : (
                            <>
                              <rect x="7" y="2" width="10" height="20" rx="2" />
                              <line x1="12" y1="18" x2="12.01" y2="18" />
                            </>
                          )}
                        </svg>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#0A160A",
                          }}
                        >
                          {s.device}{" "}
                          {s.current ? (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#34C759",
                                fontWeight: 700,
                              }}
                            >
                              · This device
                            </span>
                          ) : null}
                        </div>
                        <div style={{ fontSize: "11px", color: "#7A9A7A" }}>
                          {s.location} · {s.time}
                        </div>
                      </div>
                    </div>
                    {!s.current ? (
                      <button
                        type="button"
                        onClick={() => onToast?.("Session revoked")}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          border: "1px solid rgba(255,59,48,0.2)",
                          background: "#fff5f5",
                          color: "#FF3B30",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Revoke
                      </button>
                    ) : null}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onToast?.("All other sessions revoked")}
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#FF3B30",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  Sign out all other devices →
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0A160A",
                marginBottom: "4px",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#7A9A7A",
                marginBottom: "14px",
              }}
            >
              {user.email} · {user.biz}
            </div>
            <button
              type="button"
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1.5px solid rgba(0,0,0,0.1)",
                background: "#FAFCF9",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: "rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0A160A"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0A160A",
                  }}
                >
                  Log Out
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7A9A7A",
                    marginTop: "1px",
                  }}
                >
                  Sign out of your MSZRME account
                </div>
              </div>
              <svg
                style={{ marginLeft: "auto" }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7A9A7A"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div style={{ padding: "0 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                }}
              >
                <div style={{ fontSize: "14px", color: "#FF3B30" }}>
                  Delete Account
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7A9A7A"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "Team" ? (
        <>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#0A160A",
                    letterSpacing: "-.02em",
                  }}
                >
                  Team Members
                </div>
                <div style={{ fontSize: "12px", color: "#7A9A7A", marginTop: "2px" }}>
                  {user.biz} · 4 members
                </div>
              </div>
              <SaveButton
                style={{ padding: "8px 16px", fontSize: "12px" }}
                onClick={() => setShowAddMember((s) => !s)}
              >
                + Add Member
              </SaveButton>
            </div>

            {showAddMember ? (
              <div
                style={{
                  padding: "16px 20px",
                  background: "#F8F8FC",
                  borderBottom: "0.5px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0A160A",
                    marginBottom: "12px",
                  }}
                >
                  New Team Member
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {["First Name", "Last Name", "Email address", "Phone number"].map(
                    (ph) => (
                      <input
                        key={ph}
                        placeholder={ph}
                        type={ph.includes("Email") ? "email" : "text"}
                        style={{
                          padding: "10px 13px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0,0,0,0.1)",
                          background: "#fff",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          outline: "none",
                        }}
                      />
                    )
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <SaveButton
                    style={{ fontSize: "13px", padding: "9px 20px" }}
                    onClick={() => {
                      onToast?.("Invitation sent");
                      setShowAddMember(false);
                    }}
                  >
                    Send Invitation
                  </SaveButton>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "40px",
                      background: "#EEF1EE",
                      border: "none",
                      color: "#4A6A50",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            <div style={{ padding: "0 20px" }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div
                  key={m.email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 0",
                    borderBottom:
                      i < TEAM_MEMBERS.length - 1
                        ? "0.5px solid rgba(0,0,0,0.07)"
                        : undefined,
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: m.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      {m.avatar}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: m.active ? "#34C759" : "#7A9A7A",
                        border: "2px solid white",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#0A160A",
                        }}
                      >
                        {m.name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background:
                            m.role === "Owner" || m.role === "Admin"
                              ? "rgba(0,105,74,0.1)"
                              : m.role === "Technician"
                                ? "rgba(0,180,120,0.1)"
                                : "rgba(0,0,0,0.05)",
                          color:
                            m.role === "Office" ? "#4A6A50" : "#00694A",
                        }}
                      >
                        {m.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#7A9A7A" }}>
                      {m.email}
                    </div>
                    {m.cr !== "—" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginTop: "4px",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "#4A6A50" }}>
                          CR:{" "}
                          <strong style={{ color: "#0A160A" }}>{m.cr}%</strong>
                        </span>
                        <span style={{ fontSize: "11px", color: "#4A6A50" }}>
                          Installs:{" "}
                          <strong style={{ color: "#0A160A" }}>{m.inst}</strong>
                        </span>
                        <span style={{ fontSize: "11px", color: "#4A6A50" }}>
                          Contracts:{" "}
                          <strong style={{ color: "#00694A" }}>{m.mc}</strong>
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onToast?.("Edit coming soon")}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "#FFFFFF",
                        color: "#0A160A",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                    {m.role !== "Owner" ? (
                      <button
                        type="button"
                        onClick={() => onToast?.("Member removed")}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          border: "1px solid rgba(255,59,48,0.2)",
                          background: "#fff5f5",
                          color: "#FF3B30",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#0A160A",
                }}
              >
                Role Permissions
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {ROLE_PERMISSIONS.map(([role, c, desc], i) => (
                <div
                  key={role}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom:
                      i < ROLE_PERMISSIONS.length - 1
                        ? "0.5px solid rgba(0,0,0,0.07)"
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: "10px",
                      background:
                        c === "#00B478"
                          ? "rgba(0,180,120,0.1)"
                          : c === "#4A6A50"
                            ? "rgba(0,0,0,0.05)"
                            : "rgba(0,105,74,0.1)",
                      color: c,
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {role}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#4A6A50",
                      lineHeight: 1.5,
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "Preferences" ? (
        <>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                }}
              >
                Display
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {DISPLAY_TOGGLES.map((label, i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 0",
                    borderBottom:
                      i < DISPLAY_TOGGLES.length - 1
                        ? "0.5px solid rgba(0,0,0,0.07)"
                        : undefined,
                  }}
                >
                  <div style={{ fontSize: "14px", color: "#0A160A" }}>
                    {label}
                  </div>
                  <Toggle
                    on={displayToggles[i]}
                    onToggle={() =>
                      setDisplayToggles((prev) =>
                        prev.map((v, j) => (j === i ? !v : v))
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: cardShadow,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                }}
              >
                Notifications
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {NOTIFICATION_PREFS.map(([label, sub], i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 0",
                    borderBottom:
                      i < NOTIFICATION_PREFS.length - 1
                        ? "0.5px solid rgba(0,0,0,0.07)"
                        : undefined,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", color: "#0A160A" }}>
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#7A9A7A",
                        marginTop: "1px",
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                  <Toggle
                    on={notifToggles[i]}
                    onToggle={() =>
                      setNotifToggles((prev) =>
                        prev.map((v, j) => (j === i ? !v : v))
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "Billing" ? (
        <>
          {(() => {
            const t = TIER_DEFS[selectedTier];
            return (
              <div
                style={{
                  background: t.gradient,
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "14px",
                  position: "relative",
                  overflow: "hidden",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.5)",
                        textTransform: "uppercase",
                        letterSpacing: ".8px",
                        marginBottom: "4px",
                      }}
                    >
                      Active Plan · Tier {selectedTier}
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "white",
                        letterSpacing: "-.04em",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.6)",
                        marginTop: "3px",
                      }}
                    >
                      {t.calls}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "white",
                        letterSpacing: "-.04em",
                        lineHeight: 1,
                      }}
                    >
                      ${t.price.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.5)",
                        marginTop: "2px",
                      }}
                    >
                      {t.priceSuffix}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  &quot;{t.focus}&quot;
                </div>
              </div>
            );
          })()}

          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#7A9A7A",
              textTransform: "uppercase",
              letterSpacing: ".6px",
              marginBottom: "10px",
            }}
          >
            Choose your program
          </div>

          {([1, 2, 3, 4] as TierId[]).map((n) => {
            const t = TIER_DEFS[n];
            const active = selectedTier === n;
            return (
              <div
                key={n}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  marginBottom: "8px",
                  overflow: "hidden",
                  border: `2px solid ${active ? t.color : "rgba(0,0,0,0.07)"}`,
                  boxShadow: active
                    ? `0 4px 20px ${t.color}22`
                    : "0 1px 0 rgba(0,0,0,0.04)",
                  transition: "all .2s",
                }}
              >
                <div
                  style={{
                    background: active ? t.gradient : "transparent",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          background: "rgba(255,255,255,0.2)",
                          color: active ? "white" : t.color,
                          border: `1px solid ${active ? "rgba(255,255,255,0.3)" : t.color + "44"}`,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          letterSpacing: ".5px",
                        }}
                      >
                        TIER {n}
                      </div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: active ? "white" : t.color,
                          letterSpacing: "-.02em",
                        }}
                      >
                        {t.name}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: active ? "rgba(255,255,255,0.65)" : "#7A9A7A",
                        marginTop: "2px",
                      }}
                    >
                      {t.tagline}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: active ? "white" : t.color,
                        letterSpacing: "-.04em",
                      }}
                    >
                      ${t.price.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: active ? "rgba(255,255,255,0.5)" : "#7A9A7A",
                      }}
                    >
                      {t.priceSuffix}
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 16px 0" }}>
                  {t.features.map((f, i) => (
                    <div
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "5px 0",
                        borderBottom:
                          i < t.features.length - 1
                            ? "0.5px solid rgba(0,0,0,0.05)"
                            : "none",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke={t.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: "12px", color: "#0A160A" }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {active ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 0",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: t.color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: t.color,
                        }}
                      >
                        Your current plan
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => selectTier(n)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        background: t.color,
                        color: "white",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        letterSpacing: ".02em",
                      }}
                    >
                      Select {t.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              padding: "16px",
              boxShadow: cardShadow,
              marginTop: "4px",
              borderTop: "1px solid rgba(0,180,120,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#0A160A",
                }}
              >
                Next Coaching Call
              </div>
              <button
                type="button"
                onClick={() => onToast?.("Edit call date")}
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#00694A",
                  background: "rgba(0,105,74,0.08)",
                  border: "1px solid rgba(0,105,74,0.15)",
                  borderRadius: "20px",
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Edit
              </button>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#7A9A7A",
                marginBottom: "10px",
              }}
            >
              Your {TIER_DEFS[selectedTier].calls.toLowerCase()}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(0,105,74,0.05)",
                borderRadius: "10px",
                border: "1px solid rgba(0,105,74,0.12)",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#003D2B,#00694A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#0A160A",
                  }}
                >
                  {NEXT_CALL_DATE.date}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7A9A7A",
                    marginTop: "1px",
                  }}
                >
                  {NEXT_CALL_DATE.time} · {NEXT_CALL_DATE.duration}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToast?.("Added to calendar")}
                style={{
                  marginLeft: "auto",
                  padding: "7px 14px",
                  borderRadius: "20px",
                  background: "rgba(0,105,74,0.08)",
                  border: "1px solid rgba(0,105,74,0.2)",
                  color: "#00694A",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Add to Calendar
              </button>
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "Connected" ? (
        <>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <svg
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="#7A9A7A"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search integrations…"
              value={intSearch}
              onChange={(e) => setIntSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#F0F3F0",
                fontSize: "13px",
                color: "#0A160A",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "14px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "20px",
                background: "rgba(0,105,74,0.08)",
                border: "1px solid rgba(0,105,74,0.15)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#00B478",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#00694A",
                }}
              >
                {connectedCount} Connected
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#B8CCB8",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#7A9A7A",
                }}
              >
                {integrations.length - connectedCount} Available
              </span>
            </div>
            {anyConnected ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "rgba(74,127,212,0.08)",
                  border: "1px solid rgba(74,127,212,0.2)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#1A4DB0",
                  }}
                >
                  {totalToday.toLocaleString()} records today
                </span>
              </div>
            ) : null}
            <div style={{ flex: 1 }} />
            {anyConnected ? (
              <button
                type="button"
                onClick={() => onToast?.("Syncing all integrations…")}
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#00694A",
                  background: "white",
                  border: "1px solid rgba(0,105,74,0.25)",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Sync All
              </button>
            ) : null}
          </div>

          {intCategories.map((cat) => {
            const items = filteredIntegrations(cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#7A9A7A",
                    textTransform: "uppercase",
                    letterSpacing: ".6px",
                    marginBottom: "8px",
                  }}
                >
                  {cat}
                </div>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "14px",
                    boxShadow: cardShadow,
                    overflow: "hidden",
                    borderTop: "1px solid rgba(0,180,120,0.08)",
                  }}
                >
                  {items.map((itm, idx) => {
                    const det = INTEGRATION_DETAILS[itm.name];
                    const statusColor =
                      itm.status === "connected"
                        ? "#00B478"
                        : itm.status === "error"
                          ? "#C62828"
                          : "#B8CCB8";
                    const statusLabel =
                      itm.status === "connected"
                        ? "Connected"
                        : itm.status === "error"
                          ? "Error"
                          : "Not connected";
                    return (
                      <div
                        key={itm.name}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "13px 16px",
                          borderBottom:
                            idx < items.length - 1
                              ? "0.5px solid rgba(0,0,0,0.06)"
                              : undefined,
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: itm.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            border: "1px solid rgba(0,0,0,0.06)",
                            fontSize: "13px",
                            fontWeight: 800,
                            color: itm.color,
                          }}
                        >
                          {itm.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#0A160A",
                            }}
                          >
                            {itm.name}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#7A9A7A",
                              marginTop: "1px",
                            }}
                          >
                            {itm.desc}
                          </div>
                          {itm.status === "connected" && det ? (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#4A6A50",
                                marginTop: "3px",
                              }}
                            >
                              Synced {det.lastSync} ·{" "}
                              <span
                                style={{
                                  color: "#00694A",
                                  fontWeight: 700,
                                }}
                              >
                                {det.syncedToday} records today
                              </span>{" "}
                              · {det.mappings.length} field mappings
                            </div>
                          ) : null}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "5px",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <div
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: statusColor,
                              }}
                            />
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: statusColor,
                              }}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          {itm.status === "connected" ? (
                            <button
                              type="button"
                              onClick={() => toggleIntegration(itm.name, false)}
                              style={{
                                fontSize: "10px",
                                color: "#7A9A7A",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                padding: 0,
                                textDecoration: "underline",
                                textUnderlineOffset: "2px",
                              }}
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleIntegration(itm.name, true)}
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#00694A",
                                background: "rgba(0,105,74,0.08)",
                                border: "1px solid rgba(0,105,74,0.2)",
                                borderRadius: "20px",
                                padding: "4px 12px",
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div
            style={{
              padding: "14px",
              background: "#F0F3F0",
              borderRadius: "12px",
              marginTop: "4px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="#7A9A7A"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ flexShrink: 0, marginTop: "1px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span
              style={{
                fontSize: "11px",
                color: "#7A9A7A",
                lineHeight: 1.5,
              }}
            >
              Connections sync every 24 hours. OAuth tokens are stored
              encrypted. Your accounting data is never shared with other dealers.
            </span>
          </div>
        </>
      ) : null}

      <div
        style={{
          textAlign: "center",
          padding: "16px",
          fontSize: "12px",
          color: "#7A9A7A",
        }}
      >
        MSZRME v2.1.0 · © 2026 MSZRME Inc.
      </div>
    </>
  );
}

export default SettingsPage;
