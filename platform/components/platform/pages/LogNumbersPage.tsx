"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
} from "react";
import type { KpiPeriodKey, KpiStore } from "@/lib/platform/data/kpi";
import type { DealerPageId } from "@/lib/platform/data/nav";
import {
  isServiceEnabled,
  type ServiceFeatureFlag,
} from "@/lib/platform/utils/format";

type LogTab = "Installs" | "Sales" | "Service" | "Financials";
type LogPeriod = "Day" | "Week";

interface LogEntry {
  inst?: number;
  ir?: number;
  zcb?: number;
  mktleads?: number;
  techleads?: number;
  leads?: number;
  est?: number;
  sales?: number;
  ast?: number;
  tsr?: number;
  tir?: number;
  demCalls?: number;
  maintCalls?: number;
  demRev?: number;
  maintRev?: number;
  zsc?: number;
  demLeads?: number;
  maintLeads?: number;
  maintAgmts?: number;
  finEquip?: number;
  finLab?: number;
  finMat?: number;
  finOther?: number;
  finRent?: number;
  finAdmin?: number;
  finMktg?: number;
  finVeh?: number;
  finDA?: number;
  finTax?: string | number;
  _savedAt?: number;
}

const EMPTY_FORM: LogEntry = {};

function logKey(date: string, period: LogPeriod): string {
  return `mszrme.log.${date}.${period}`;
}

function getLogEntry(date: string, period: LogPeriod): LogEntry | null {
  try {
    const raw = localStorage.getItem(logKey(date, period));
    return raw ? (JSON.parse(raw) as LogEntry) : null;
  } catch {
    return null;
  }
}

function setLogEntry(
  date: string,
  period: LogPeriod,
  data: LogEntry
): boolean {
  try {
    const payload = { ...data, _savedAt: Date.now() };
    localStorage.setItem(logKey(date, period), JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function fmtLive(n: number): string {
  if (n > 0) {
    return (
      "$" +
      (n >= 1000
        ? Math.round(n / 1000).toLocaleString() + "K"
        : Math.round(n).toLocaleString())
    );
  }
  return n === 0 ? "$0" : "—";
}

function fmtSigned(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  return (
    (n < 0 ? "-" : "") +
    "$" +
    (abs >= 1000
      ? Math.round(abs / 1000).toLocaleString() + "K"
      : Math.round(abs).toLocaleString())
  );
}

function displayVal(data: LogEntry, key: keyof LogEntry): string {
  const val = data[key];
  if (val !== undefined && val !== null && val !== "" && val !== 0) {
    return String(val);
  }
  return "";
}

function isReq(data: LogEntry, key: keyof LogEntry, locked: boolean): boolean {
  if (locked) return false;
  const val = data[key];
  return !(val !== undefined && val !== "" && val !== 0);
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

export interface LogNumbersPageProps {
  period: KpiPeriodKey;
  kpi: KpiStore;
  goTo: (page: DealerPageId) => void;
  showToast: (msg: string) => void;
  featureFlags?: ServiceFeatureFlag[];
  tier?: number;
}

export function LogNumbersPage({
  goTo,
  showToast,
  featureFlags,
  tier = 1,
}: LogNumbersPageProps) {
  const svcOn = isServiceEnabled(featureFlags);
  const tabs: LogTab[] = svcOn
    ? ["Installs", "Sales", "Service", "Financials"]
    : ["Installs", "Sales", "Financials"];
  const finUnlocked = tier >= 2;

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [logPeriod, setLogPeriod] = useState<LogPeriod>("Day");
  const [activeTab, setActiveTab] = useState<LogTab>("Installs");
  const [form, setForm] = useState<LogEntry>(EMPTY_FORM);
  const [locked, setLocked] = useState(false);
  const [leadsTouched, setLeadsTouched] = useState(false);

  const effectiveTab = tabs.includes(activeTab) ? activeTab : "Installs";

  const loadEntry = useCallback(() => {
    const entry = getLogEntry(date, logPeriod);
    setLocked(!!entry);
    setForm(entry || EMPTY_FORM);
    setLeadsTouched(!!entry?.leads);
  }, [date, logPeriod]);

  useEffect(() => {
    loadEntry();
  }, [loadEntry]);

  const setField = (key: keyof LogEntry, raw: string) => {
    if (locked) return;
    const num = raw === "" ? undefined : parseFloat(raw);
    setForm((prev) => ({ ...prev, [key]: num }));
    if (key === "leads") setLeadsTouched(true);
  };

  const num = (key: keyof LogEntry): number => {
    const v = form[key];
    return typeof v === "number" ? v : parseFloat(String(v)) || 0;
  };

  const live = useMemo(() => {
    const mkt = num("mktleads");
    const tech = num("techleads");
    const leads = num("leads") || (!leadsTouched ? mkt + tech : 0) || mkt + tech;
    const est = num("est");
    const sales = num("sales");
    const tsr = num("tsr");
    const ast = sales > 0 && tsr > 0 ? Math.round(tsr / sales) : 0;
    const cr = est > 0 ? (sales / est) * 100 : null;

    const dc = num("demCalls");
    const mc = num("maintCalls");
    const demRev = num("demRev");
    const maintRev = num("maintRev");
    const demLeads = num("demLeads");
    const maintLeads = num("maintLeads");

    const cogs =
      num("finEquip") + num("finLab") + num("finMat") + num("finOther");
    const opex =
      num("finRent") + num("finAdmin") + num("finMktg") + num("finVeh");
    const da = num("finDA");
    const taxPct = (num("finTax") || 27) / 100;
    const rev = tsr + demRev + maintRev;
    const ebitda = rev - cogs - opex;
    const net = (ebitda - da) * (1 - taxPct);

    return {
      instLive: fmtLive(num("ir")),
      crLive: cr !== null ? `${cr.toFixed(1)}%` : "—",
      svrLive: fmtLive(demRev + maintRev),
      avgDem: dc > 0 ? fmtLive(demRev / dc) : "$0",
      avgMaint: mc > 0 ? fmtLive(maintRev / mc) : "$0",
      demConv:
        demLeads > 0 ? `${((dc / demLeads) * 100).toFixed(0)}%` : "—",
      maintConv:
        maintLeads > 0 ? `${((mc / maintLeads) * 100).toFixed(0)}%` : "—",
      astDisplay: ast > 0 ? String(ast) : displayVal(form, "ast"),
      leadsAuto: !leadsTouched && !locked && (mkt || tech) ? mkt + tech : null,
      cogsTotal: fmtSigned(cogs),
      opexTotal: fmtSigned(opex),
      gmPct: rev > 0 ? `${(((rev - cogs) / rev) * 100).toFixed(1)}%` : "—",
      ebitda: rev > 0 ? fmtSigned(ebitda) : "$0",
      ebitdaPct:
        rev > 0 ? `${((ebitda / rev) * 100).toFixed(1)}% of rev` : "—",
      net: rev > 0 ? fmtSigned(net) : "$0",
      netPct: rev > 0 ? `${((net / rev) * 100).toFixed(1)}% of rev` : "—",
    };
  }, [form, leadsTouched, locked]);

  const handleClearTab = () => {
    const fieldMap: Record<LogTab, (keyof LogEntry)[]> = {
      Installs: ["inst", "ir", "zcb"],
      Sales: [
        "mktleads",
        "techleads",
        "leads",
        "est",
        "sales",
        "ast",
        "tsr",
        "tir",
      ],
      Service: [
        "demCalls",
        "maintCalls",
        "demRev",
        "maintRev",
        "zsc",
        "demLeads",
        "maintLeads",
        "maintAgmts",
      ],
      Financials: [
        "finEquip",
        "finLab",
        "finMat",
        "finOther",
        "finRent",
        "finAdmin",
        "finMktg",
        "finVeh",
        "finDA",
        "finTax",
      ],
    };
    const keys = fieldMap[effectiveTab] || [];
    setForm((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
    if (effectiveTab === "Sales") setLeadsTouched(false);
  };

  const handleSave = () => {
    const entry: LogEntry = {
      inst: num("inst"),
      ir: num("ir"),
      zcb: num("zcb"),
      mktleads: num("mktleads"),
      techleads: num("techleads"),
      leads: num("leads") || num("mktleads") + num("techleads"),
      est: num("est"),
      sales: num("sales"),
      ast:
        num("sales") > 0 && num("tsr") > 0
          ? Math.round(num("tsr") / num("sales"))
          : num("ast"),
      tsr: num("tsr"),
      tir: num("tir"),
      demCalls: num("demCalls"),
      maintCalls: num("maintCalls"),
      demRev: num("demRev"),
      maintRev: num("maintRev"),
      zsc: num("zsc"),
      demLeads: num("demLeads"),
      maintLeads: num("maintLeads"),
      maintAgmts: num("maintAgmts"),
      finEquip: num("finEquip"),
      finLab: num("finLab"),
      finMat: num("finMat"),
      finOther: num("finOther"),
      finRent: num("finRent"),
      finAdmin: num("finAdmin"),
      finMktg: num("finMktg"),
      finVeh: num("finVeh"),
      finDA: num("finDA"),
      finTax: form.finTax ?? "27",
    };

    if (!setLogEntry(date, logPeriod, entry)) {
      showToast("⚠ Failed to save — storage may be full");
      return;
    }

    showToast("Entry saved & locked");
    loadEntry();
  };

  const savedAtLabel =
    locked && form._savedAt
      ? new Date(form._savedAt).toLocaleDateString("en-CA", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const inputProps = (
    key: keyof LogEntry,
    id: string,
    opts?: { readonly?: boolean; style?: CSSProperties }
  ) => ({
    id,
    type: "number" as const,
    placeholder: "0",
    value:
      key === "leads" && live.leadsAuto !== null
        ? String(live.leadsAuto)
        : key === "ast"
          ? live.astDisplay
          : displayVal(form, key),
    readOnly: locked || opts?.readonly,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      setField(key, e.target.value),
    onFocus: (e: FocusEvent<HTMLInputElement>) => e.target.select(),
    className: `lf-input${isReq(form, key, locked) ? " lf-required" : ""}`,
    style: opts?.style,
  });

  return (
    <>
      <div style={{ padding: "4px 0 12px" }}>
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
            Log Numbers
          </div>
          {locked ? <LockedBadge /> : null}
        </div>
        <div style={{ fontSize: "13px", color: "#7A9A7A", marginTop: "4px" }}>
          {locked
            ? `This entry was saved on ${savedAtLabel} and cannot be edited. Change the date or period to log a new entry.`
            : "Enter data to update Dashboard KPIs and Financials."}
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

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
          padding: "14px 18px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#7A9A7A",
              textTransform: "uppercase",
              letterSpacing: ".5px",
              marginBottom: "4px",
            }}
          >
            Entry Date
          </div>
          <input
            type="date"
            id="log-date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "7px 12px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0A160A",
              background: "#F0F3F0",
              fontFamily: "inherit",
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#7A9A7A",
              textTransform: "uppercase",
              letterSpacing: ".5px",
              marginBottom: "4px",
            }}
          >
            Period
          </div>
          <select
            id="log-period"
            value={logPeriod}
            onChange={(e) => setLogPeriod(e.target.value as LogPeriod)}
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "7px 12px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0A160A",
              background: "#F0F3F0",
              fontFamily: "inherit",
            }}
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          background: "rgba(118,118,128,0.1)",
          borderRadius: "13px",
          padding: "3px",
          marginBottom: "10px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            id={`logtab-${t}`}
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
              background: effectiveTab === t ? "#FFFFFF" : "transparent",
              color: effectiveTab === t ? "#00694A" : "#4A6A50",
              boxShadow:
                effectiveTab === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              fontFamily: "inherit",
            }}
          >
            {t}
            {t === "Financials" && !finUnlocked ? " 🔒" : ""}
          </button>
        ))}
      </div>

      {/* INSTALLS TAB */}
      <div
        id="log-panel-Installs"
        style={{
          display: effectiveTab === "Installs" ? "block" : "none",
          minHeight: "520px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg,#003D2B,#00B478)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
                Installs
              </div>
              <div
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}
              >
                Equipment installations
              </div>
            </div>
            <div
              id="log-inst-live"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-.04em",
              }}
            >
              {live.instLive}
            </div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div className="lf-row lf-2">
              <div>
                <label className="lf-label" htmlFor="log-inst">
                  # of Installs
                </label>
                <input {...inputProps("inst", "log-inst")} />
              </div>
              <div>
                <label className="lf-label" htmlFor="log-ir">
                  Install Revenue
                </label>
                <div className="lf-wrap">
                  <span className="lf-pre">$</span>
                  <input {...inputProps("ir", "log-ir")} />
                </div>
              </div>
            </div>
            <div className="lf-row" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <label className="lf-label" htmlFor="log-zcb">
                  $0 Install callbacks
                </label>
                <input {...inputProps("zcb", "log-zcb")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SALES TAB */}
      <div
        id="log-panel-Sales"
        style={{
          display: effectiveTab === "Sales" ? "block" : "none",
          minHeight: "520px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg,#0C2D6E,#1A4DB0)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
                Sales Pipeline
              </div>
              <div
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}
              >
                Leads, estimates & closed deals
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
                Closing Ratio
              </div>
              <div
                id="log-cr-live"
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-.04em",
                }}
              >
                {live.crLive}
              </div>
            </div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#7A9A7A",
                textTransform: "uppercase",
                letterSpacing: ".6px",
                marginBottom: "10px",
              }}
            >
              Lead Sources
            </div>
            <div className="lf-row lf-3">
              <div>
                <label className="lf-label" htmlFor="log-mktleads">
                  Marketing Leads
                </label>
                <input {...inputProps("mktleads", "log-mktleads")} />
              </div>
              <div>
                <label className="lf-label" htmlFor="log-techleads">
                  Tech Leads
                </label>
                <input {...inputProps("techleads", "log-techleads")} />
              </div>
              <div>
                <label className="lf-label" htmlFor="log-leads">
                  Total Leads
                </label>
                <input {...inputProps("leads", "log-leads")} />
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#7A9A7A",
                textTransform: "uppercase",
                letterSpacing: ".6px",
                margin: "14px 0 10px",
              }}
            >
              Pipeline
            </div>
            <div className="lf-row lf-3">
              <div>
                <label className="lf-label" htmlFor="log-est">
                  # Estimates
                </label>
                <input {...inputProps("est", "log-est")} />
              </div>
              <div>
                <label className="lf-label" htmlFor="log-sales">
                  # Sales Closed
                </label>
                <input {...inputProps("sales", "log-sales")} />
              </div>
              <div>
                <label
                  className="lf-label"
                  htmlFor="log-ast"
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Avg Ticket{" "}
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#00694A",
                      background: "rgba(0,105,74,0.1)",
                      padding: "1px 5px",
                      borderRadius: "5px",
                      letterSpacing: ".04em",
                    }}
                  >
                    AUTO
                  </span>
                </label>
                <div className="lf-wrap">
                  <span className="lf-pre">$</span>
                  <input {...inputProps("ast", "log-ast", { readonly: true })} />
                </div>
              </div>
            </div>
            <div className="lf-row lf-2">
              <div>
                <label className="lf-label" htmlFor="log-tsr">
                  Total Sales Revenue
                </label>
                <div className="lf-wrap">
                  <span className="lf-pre">$</span>
                  <input {...inputProps("tsr", "log-tsr")} />
                </div>
              </div>
              <div>
                <label className="lf-label" htmlFor="log-tir">
                  Total Installed Revenue
                </label>
                <div className="lf-wrap">
                  <span className="lf-pre">$</span>
                  <input {...inputProps("tir", "log-tir")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE TAB */}
      {svcOn ? (
        <div
          id="log-panel-Service"
          style={{
            display: effectiveTab === "Service" ? "block" : "none",
            minHeight: "520px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(145deg,#0C2D6E,#1A4DB0)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{ fontSize: "15px", fontWeight: 700, color: "white" }}
                >
                  Service
                </div>
                <div
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}
                >
                  Demand & maintenance activity
                </div>
              </div>
              <div
                id="log-svr-live"
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-.04em",
                }}
              >
                {live.svrLive}
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  marginBottom: "10px",
                }}
              >
                Calls Performed
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="log-dc">
                    # of Demand calls
                  </label>
                  <input {...inputProps("demCalls", "log-dc")} />
                </div>
                <div>
                  <label className="lf-label" htmlFor="log-mc">
                    # of Maintenance calls
                  </label>
                  <input {...inputProps("maintCalls", "log-mc")} />
                </div>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  margin: "14px 0 10px",
                }}
              >
                Revenue Generated
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="log-demRev">
                    Total demand revenue
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("demRev", "log-demRev")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="log-maintRev">
                    Total maintenance revenue
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("maintRev", "log-maintRev")} />
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  margin: "14px 0 10px",
                }}
              >
                Quality & Pipeline
              </div>
              <div className="lf-row" style={{ gridTemplateColumns: "1fr" }}>
                <div>
                  <label className="lf-label" htmlFor="log-zsc">
                    # of $0 Service Calls
                  </label>
                  <input {...inputProps("zsc", "log-zsc")} />
                </div>
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="log-demLeads">
                    # of Demand leads
                  </label>
                  <input {...inputProps("demLeads", "log-demLeads")} />
                </div>
                <div>
                  <label className="lf-label" htmlFor="log-maintLeads">
                    # of Maintenance leads
                  </label>
                  <input {...inputProps("maintLeads", "log-maintLeads")} />
                </div>
              </div>
              <div className="lf-row" style={{ gridTemplateColumns: "1fr" }}>
                <div>
                  <label className="lf-label" htmlFor="log-maintAgmts">
                    # of Maintenance agreements
                  </label>
                  <input {...inputProps("maintAgmts", "log-maintAgmts")} />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "14px",
                }}
              >
                <div
                  style={{
                    background: "rgba(0,105,74,0.06)",
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#00694A",
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Avg Demand Rev/call
                  </div>
                  <div
                    id="log-avg-dem"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#00694A",
                    }}
                  >
                    {live.avgDem}
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(0,105,74,0.06)",
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#00694A",
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Avg Maint Rev/call
                  </div>
                  <div
                    id="log-avg-maint"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#00694A",
                    }}
                  >
                    {live.avgMaint}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    background: "#F0F3F0",
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "#7A9A7A",
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Demand Lead Conv.
                  </div>
                  <div
                    id="log-dem-conv"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0A160A",
                    }}
                  >
                    {live.demConv}
                  </div>
                </div>
                <div
                  style={{
                    background: "#F0F3F0",
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      color: "#7A9A7A",
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Maint Lead Conv.
                  </div>
                  <div
                    id="log-maint-conv"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0A160A",
                    }}
                  >
                    {live.maintConv}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* FINANCIALS TAB */}
      <div
        id="log-panel-Financials"
        style={{
          display: effectiveTab === "Financials" ? "block" : "none",
          minHeight: "520px",
        }}
      >
        {finUnlocked ? (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(145deg,#003D2B,#00694A)",
                padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>
                Financial Inputs
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>
                COGS, OpEx, and below-the-line figures
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  marginBottom: "10px",
                }}
              >
                Cost of Goods Sold
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="fin-equipment">
                    Equipment / Units
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finEquip", "fin-equipment")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="fin-labour">
                    Labour / Subs
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finLab", "fin-labour")} />
                  </div>
                </div>
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="fin-materials">
                    Materials / Parts
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finMat", "fin-materials")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="fin-other">
                    Permits / Crane / Other
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finOther", "fin-other")} />
                  </div>
                </div>
              </div>

              <div
                style={{
                  margin: "14px 0",
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "11px 16px",
                    borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", fontWeight: 600, color: "#4A6A50" }}
                  >
                    Total COGS
                  </span>
                  <span
                    id="fin-cogs-total"
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#0A160A",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {live.cogsTotal}
                  </span>
                </div>
                <div
                  style={{
                    padding: "11px 16px",
                    background: "rgba(0,105,74,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", fontWeight: 700, color: "#00694A" }}
                  >
                    Gross Margin %
                  </span>
                  <span
                    id="fin-gm-pct"
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#00694A",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {live.gmPct}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  marginBottom: "10px",
                }}
              >
                Operating Expenses
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="fin-rent">
                    Rent / Facilities
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finRent", "fin-rent")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="fin-admin">
                    Admin / Salaries
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finAdmin", "fin-admin")} />
                  </div>
                </div>
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="fin-mktg">
                    Marketing
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finMktg", "fin-mktg")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="fin-vehicle">
                    Vehicle / Insurance
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finVeh", "fin-vehicle")} />
                  </div>
                </div>
              </div>

              <div
                style={{
                  margin: "14px 0",
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "11px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", fontWeight: 600, color: "#4A6A50" }}
                  >
                    Total OpEx
                  </span>
                  <span
                    id="fin-opex-total"
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#0A160A",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {live.opexTotal}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#7A9A7A",
                  textTransform: "uppercase",
                  letterSpacing: ".6px",
                  marginBottom: "10px",
                }}
              >
                Below the Line
              </div>
              <div className="lf-row lf-2">
                <div>
                  <label className="lf-label" htmlFor="fin-da">
                    D&amp;A + Interest
                  </label>
                  <div className="lf-wrap">
                    <span className="lf-pre">$</span>
                    <input {...inputProps("finDA", "fin-da")} />
                  </div>
                </div>
                <div>
                  <label className="lf-label" htmlFor="fin-tax">
                    Tax %
                  </label>
                  <div className="lf-wrap">
                    <input
                      id="fin-tax"
                      type="number"
                      placeholder="27"
                      value={displayVal(form, "finTax") || "27"}
                      readOnly={locked}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          finTax: e.target.value,
                        }))
                      }
                      onFocus={(e) => e.target.select()}
                      className="lf-input"
                      style={{ paddingLeft: "12px" }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(26,77,176,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A4DB0",
                      }}
                    >
                      EBITDA
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#7A9A7A",
                        marginLeft: "8px",
                      }}
                    >
                      Rev − COGS − OpEx
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      id="fin-ebitda"
                      style={{
                        fontSize: "17px",
                        fontWeight: 800,
                        color: "#1A4DB0",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {live.ebitda}
                    </div>
                    <div
                      id="fin-ebitda-pct"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#1A4DB0",
                        marginTop: "1px",
                      }}
                    >
                      {live.ebitdaPct}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(0,105,74,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#00694A",
                      }}
                    >
                      NET
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#7A9A7A",
                        marginLeft: "8px",
                      }}
                    >
                      (EBITDA − D&amp;A) × (1 − Tax)
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      id="fin-net"
                      style={{
                        fontSize: "19px",
                        fontWeight: 800,
                        color: "#00694A",
                        letterSpacing: "-.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {live.net}
                    </div>
                    <div
                      id="fin-net-pct"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#00694A",
                        marginTop: "1px",
                      }}
                    >
                      {live.netPct}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow:
                "0 1px 0 rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.06)",
              padding: "48px 28px",
              textAlign: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 30%,rgba(245,166,35,0.08),transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#F5A623,#D97706)",
                  margin: "0 auto 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 18px rgba(245,166,35,0.3)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0A160A",
                  letterSpacing: "-.02em",
                  marginBottom: "6px",
                }}
              >
                Financials unlocks at Tier 2
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#7A9A7A",
                  maxWidth: "380px",
                  margin: "0 auto 22px",
                  lineHeight: 1.6,
                }}
              >
                P&amp;L modelling with COGS, OpEx, EBITDA, and NET requires the
                Tier 2 plan. Upgrade to start tracking gross margin and
                profitability alongside your KPIs.
              </div>
              <button
                type="button"
                onClick={() => goTo("settings")}
                style={{
                  padding: "10px 22px",
                  borderRadius: "40px",
                  background: "linear-gradient(135deg,#003D2B,#00694A)",
                  color: "white",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(0,105,74,0.3)",
                }}
              >
                View Plans
              </button>
            </div>
          </div>
        )}
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
          }}
        >
          <button
            type="button"
            onClick={handleClearTab}
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
            Clear Tab
          </button>
          <button type="button" onClick={handleSave} className="save-btn">
            Save &amp; Lock
          </button>
        </div>
      ) : null}
    </>
  );
}

export default LogNumbersPage;
