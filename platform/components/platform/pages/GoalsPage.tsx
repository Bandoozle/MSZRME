"use client";

import { useCallback, useEffect, useState } from "react";
import type { KpiPeriodKey, KpiStore } from "@/lib/platform/data/kpi";
import type { DealerPageId } from "@/lib/platform/data/nav";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

interface GoalsEntry {
  instRev?: number;
  instCount?: number;
  cr?: number;
  ast?: number;
  finPen?: number;
  mAgmts?: number;
  demRev?: number;
  maintRev?: number;
  demTicket?: number;
  maintTicket?: number;
  _savedAt?: number;
}

type GoalsFieldKey = keyof Omit<GoalsEntry, "_savedAt">;

interface FieldDef {
  id: string;
  fieldKey: GoalsFieldKey;
  label: string;
  desc: string;
  type: "dollar" | "pct" | "count";
}

const INSTALL_FIELDS: FieldDef[] = [
  {
    id: "g-instRev",
    fieldKey: "instRev",
    label: "Install Revenue",
    desc: "Target monthly install revenue",
    type: "dollar",
  },
  {
    id: "g-instCount",
    fieldKey: "instCount",
    label: "# of Installs",
    desc: "Equipment installations completed",
    type: "count",
  },
  {
    id: "g-cr",
    fieldKey: "cr",
    label: "Closing Ratio",
    desc: "Sales ÷ Estimates target",
    type: "pct",
  },
  {
    id: "g-ast",
    fieldKey: "ast",
    label: "Avg Ticket",
    desc: "Average closed install value",
    type: "dollar",
  },
  {
    id: "g-finPen",
    fieldKey: "finPen",
    label: "Financing Penetration",
    desc: "% of sales using financing",
    type: "pct",
  },
];

const SERVICE_FIELDS: FieldDef[] = [
  {
    id: "g-mAgmts",
    fieldKey: "mAgmts",
    label: "# of Maintenance Agreements",
    desc: "New + renewed contracts",
    type: "count",
  },
  {
    id: "g-demRev",
    fieldKey: "demRev",
    label: "Demand Revenue",
    desc: "Total demand call revenue",
    type: "dollar",
  },
  {
    id: "g-maintRev",
    fieldKey: "maintRev",
    label: "Maintenance Revenue",
    desc: "Total maintenance revenue",
    type: "dollar",
  },
  {
    id: "g-demTicket",
    fieldKey: "demTicket",
    label: "Avg Demand Ticket",
    desc: "Average per demand call",
    type: "dollar",
  },
  {
    id: "g-maintTicket",
    fieldKey: "maintTicket",
    label: "Avg Maintenance Ticket",
    desc: "Average per maintenance call",
    type: "dollar",
  },
];

function goalsKey(year: number, month: number): string {
  return `mszrme.goals.${year}-${String(month + 1).padStart(2, "0")}`;
}

function getGoals(year: number, month: number): GoalsEntry | null {
  try {
    const raw = localStorage.getItem(goalsKey(year, month));
    return raw ? (JSON.parse(raw) as GoalsEntry) : null;
  } catch {
    return null;
  }
}

function setGoals(year: number, month: number, data: GoalsEntry): boolean {
  try {
    const payload = { ...data, _savedAt: Date.now() };
    localStorage.setItem(goalsKey(year, month), JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function isGoalsSaved(year: number, month: number): boolean {
  return !!getGoals(year, month);
}

function displayValue(data: GoalsEntry, key: GoalsFieldKey): string {
  const val = data[key];
  if (val !== undefined && val !== null && val !== 0) {
    return String(val);
  }
  return "";
}

function isRequired(
  data: GoalsEntry,
  key: GoalsFieldKey,
  locked: boolean
): boolean {
  if (locked) return false;
  const val = data[key];
  return !(val !== undefined && val !== null && val !== 0);
}

export interface GoalsPageProps {
  period: KpiPeriodKey;
  kpi: KpiStore;
  goTo: (page: DealerPageId) => void;
  showToast: (msg: string) => void;
}

function FieldCard({
  field,
  value,
  locked,
  required,
  onChange,
}: {
  field: FieldDef;
  value: string;
  locked: boolean;
  required: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "14px",
        boxShadow:
          "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#7A9A7A",
          textTransform: "uppercase",
          letterSpacing: ".6px",
          marginBottom: "7px",
        }}
      >
        {field.label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "6px",
        }}
      >
        {field.type === "dollar" ? (
          <span style={{ fontSize: "15px", color: "#4A6A50", fontWeight: 700 }}>
            $
          </span>
        ) : null}
        <input
          id={field.id}
          type="number"
          placeholder="0"
          value={value}
          readOnly={locked}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          className={`lf-input${required ? " lf-required" : ""}`}
          style={{
            flex: 1,
            fontSize: "16px",
            fontWeight: 800,
            color: "#0A160A",
            padding: "8px 10px",
          }}
        />
        {field.type === "pct" ? (
          <span style={{ fontSize: "15px", color: "#4A6A50", fontWeight: 700 }}>
            %
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: "10px", color: "#7A9A7A", lineHeight: 1.4 }}>
        {field.desc}
      </div>
    </div>
  );
}

function LockedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "10px",
        fontWeight: 800,
        color: "#92400E",
        background: "#FEF3C7",
        border: "1px solid #FCD34D",
        padding: "3px 9px",
        borderRadius: "8px",
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Locked
    </span>
  );
}

export function GoalsPage({ showToast }: GoalsPageProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [form, setForm] = useState<GoalsEntry>({});
  const [locked, setLocked] = useState(false);
  const [savedMonths, setSavedMonths] = useState<Record<number, boolean>>({});

  const monthName = MONTH_NAMES[month];

  const refreshEntry = useCallback(() => {
    const entry = getGoals(year, month);
    setLocked(!!entry);
    setForm(entry || {});
    const saved: Record<number, boolean> = {};
    for (let i = 0; i < 12; i++) {
      saved[i] = isGoalsSaved(year, i);
    }
    setSavedMonths(saved);
  }, [year, month]);

  useEffect(() => {
    refreshEntry();
  }, [refreshEntry]);

  const handleFieldChange = (key: GoalsFieldKey, val: string) => {
    if (locked) return;
    const num = val === "" ? undefined : parseFloat(val);
    setForm((prev) => ({ ...prev, [key]: num }));
  };

  const handleClearMonth = () => {
    setForm({});
  };

  const handleSave = () => {
    const entry: GoalsEntry = {
      instRev: parseFloat(String(form.instRev)) || 0,
      instCount: parseFloat(String(form.instCount)) || 0,
      cr: parseFloat(String(form.cr)) || 0,
      ast: parseFloat(String(form.ast)) || 0,
      finPen: parseFloat(String(form.finPen)) || 0,
      mAgmts: parseFloat(String(form.mAgmts)) || 0,
      demRev: parseFloat(String(form.demRev)) || 0,
      maintRev: parseFloat(String(form.maintRev)) || 0,
      demTicket: parseFloat(String(form.demTicket)) || 0,
      maintTicket: parseFloat(String(form.maintTicket)) || 0,
    };

    if (!setGoals(year, month, entry)) {
      showToast("Failed to save — storage may be full");
      return;
    }

    showToast(`Goals saved · ${monthName} ${year} · Locked`);
    refreshEntry();
  };

  const savedAtLabel =
    locked && form._savedAt
      ? new Date(form._savedAt).toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  return (
    <>
      <div
        style={{
          padding: "4px 0 12px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0A160A",
                letterSpacing: "-.03em",
              }}
            >
              Goals
            </div>
            {locked ? <LockedBadge /> : null}
          </div>
          <div style={{ fontSize: "13px", color: "#7A9A7A", marginTop: "4px" }}>
            {locked
              ? `Goals for ${monthName} ${year} were saved on ${savedAtLabel} and cannot be edited.`
              : `Set targets for ${monthName} ${year}. Dashboard tracks progress in real time.`}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#7A9A7A",
              marginTop: "6px",
              fontStyle: "italic",
            }}
          >
            All $ figures are subtotals only — never include taxes.
          </div>
        </div>
        <button
          type="button"
          onClick={() => showToast("PDF exported successfully")}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(0,105,74,0.25)",
            background: "white",
            color: "#00694A",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 12 15 15" />
          </svg>
          Export PDF
        </button>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
          padding: "10px 14px",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <button
          type="button"
          aria-label="Previous year"
          onClick={() => setYear((y) => y - 1)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "none",
            background: "#F0F3F0",
            color: "#4A6A50",
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ←
        </button>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: "#0A160A",
            letterSpacing: "-.02em",
          }}
        >
          {year}
        </div>
        <button
          type="button"
          aria-label="Next year"
          onClick={() => setYear((y) => y + 1)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "none",
            background: "#F0F3F0",
            color: "#4A6A50",
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          →
        </button>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
          padding: "6px",
          marginBottom: "12px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "4px",
        }}
      >
        {MONTH_NAMES.map((m, i) => {
          const isActive = i === month;
          const isSaved = savedMonths[i];
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(i)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
              style={{
                position: "relative",
                padding: "9px 4px",
                borderRadius: "9px",
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                background: isActive ? "#00694A" : "transparent",
                color: isActive ? "white" : "#4A6A50",
                fontFamily: "inherit",
                transition: "all .15s",
                letterSpacing: ".02em",
              }}
            >
              {m}
              {isSaved ? (
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "4px",
                    fontSize: "8px",
                    lineHeight: 1,
                  }}
                >
                  {isActive ? "🔓" : "🔒"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "linear-gradient(145deg,#003D2B,#00B478)",
          borderRadius: "16px",
          padding: "14px 18px",
          marginBottom: "10px",
          boxShadow: "0 4px 14px rgba(0,105,74,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "5px",
              height: "18px",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "3px",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "white",
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Install
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
                marginTop: "1px",
              }}
            >
              {monthName} {year} install targets
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {INSTALL_FIELDS.slice(0, 4).map((f) => (
          <FieldCard
            key={f.id}
            field={f}
            value={displayValue(form, f.fieldKey)}
            locked={locked}
            required={isRequired(form, f.fieldKey, locked)}
            onChange={(val) => handleFieldChange(f.fieldKey, val)}
          />
        ))}
      </div>
      <div style={{ marginBottom: "14px" }}>
        <FieldCard
          field={INSTALL_FIELDS[4]}
          value={displayValue(form, INSTALL_FIELDS[4].fieldKey)}
          locked={locked}
          required={isRequired(form, INSTALL_FIELDS[4].fieldKey, locked)}
          onChange={(val) => handleFieldChange(INSTALL_FIELDS[4].fieldKey, val)}
        />
      </div>

      <div
        style={{
          background: "linear-gradient(145deg,#0C2D6E,#1A4DB0)",
          borderRadius: "16px",
          padding: "14px 18px",
          marginBottom: "10px",
          boxShadow: "0 4px 14px rgba(26,77,176,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "5px",
              height: "18px",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "3px",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "white",
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              Service
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
                marginTop: "1px",
              }}
            >
              {monthName} {year} service targets
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {SERVICE_FIELDS.slice(0, 4).map((f) => (
          <FieldCard
            key={f.id}
            field={f}
            value={displayValue(form, f.fieldKey)}
            locked={locked}
            required={isRequired(form, f.fieldKey, locked)}
            onChange={(val) => handleFieldChange(f.fieldKey, val)}
          />
        ))}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <FieldCard
          field={SERVICE_FIELDS[4]}
          value={displayValue(form, SERVICE_FIELDS[4].fieldKey)}
          locked={locked}
          required={isRequired(form, SERVICE_FIELDS[4].fieldKey, locked)}
          onChange={(val) => handleFieldChange(SERVICE_FIELDS[4].fieldKey, val)}
        />
      </div>

      {!locked ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={handleClearMonth}
            style={{
              padding: "10px 22px",
              borderRadius: "40px",
              background: "#F0F3F0",
              border: "none",
              color: "#4A6A50",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear Month
          </button>
          <button type="button" onClick={handleSave} className="save-btn">
            Save &amp; Lock
          </button>
        </div>
      ) : null}
    </>
  );
}

export default GoalsPage;
