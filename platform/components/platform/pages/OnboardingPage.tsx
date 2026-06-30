"use client";

import { useMemo, useState } from "react";
import type { OnboardingData } from "@/lib/auth/profile";
import { STAGE_DEFS } from "@/lib/platform/data/nav";

const REVENUE_OPTIONS = [
  { label: "Under $250K", value: 125_000 },
  { label: "$250K – $500K", value: 375_000 },
  { label: "$500K – $1M", value: 750_000 },
  { label: "$1M – $2.4M", value: 1_700_000 },
  { label: "$2.4M – $5M", value: 3_500_000 },
  { label: "$5M – $8M", value: 6_500_000 },
  { label: "$8M – $15M", value: 11_000_000 },
  { label: "$15M+", value: 18_000_000 },
] as const;

const BUSINESS_TYPES = [
  "Residential HVAC",
  "Commercial HVAC",
  "Residential & Commercial",
  "Plumbing & HVAC",
  "Other trade services",
] as const;

const FOCUS_OPTIONS = [
  "Hit revenue and gross margin targets",
  "Improve closing ratio and lead flow",
  "Build maintenance agreement base",
  "Prepare for scale / exit readiness",
] as const;

interface Props {
  userName: string;
  businessName: string;
  onComplete: (data: OnboardingData) => Promise<boolean>;
}

export function OnboardingPage({ userName, businessName, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(userName);
  const [bizName, setBizName] = useState(businessName);
  const [businessType, setBusinessType] = useState<string>(BUSINESS_TYPES[0]);
  const [revenue, setRevenue] = useState<number>(REVENUE_OPTIONS[2].value);
  const [focus, setFocus] = useState<string>(FOCUS_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const stageFromRevenue = useMemo(() => {
    for (let i = STAGE_DEFS.length - 1; i >= 0; i--) {
      if (revenue >= STAGE_DEFS[i].minRev) return STAGE_DEFS[i];
    }
    return STAGE_DEFS[0];
  }, [revenue]);

  async function finish() {
    if (!displayName.trim() || !bizName.trim()) {
      setError("Name and business name are required.");
      setStep(0);
      return;
    }
    setSubmitting(true);
    setError("");
    const ok = await onComplete({
      displayName: displayName.trim(),
      businessName: bizName.trim(),
      businessType,
      annualRevenue: revenue,
    });
    if (!ok) {
      setError("Could not save your setup. Try again.");
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "0.5px solid rgba(0,0,0,0.12)",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #E8F5EE 0%, #F5F7F5 45%, #FFFFFF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.92)",
          borderRadius: "20px",
          border: "0.5px solid rgba(0,0,0,0.08)",
          boxShadow: "0 24px 64px rgba(0,45,32,0.12)",
          padding: "28px 24px 24px",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#00694A", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "8px" }}>
          Step {step + 1} of 3
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: "#0A160A", letterSpacing: "-.03em" }}>
          {step === 0 ? "Welcome to MSZRME" : step === 1 ? "Your business" : "Your focus"}
        </h1>
        <p style={{ margin: "0 0 22px", fontSize: "14px", color: "#4A6A50", lineHeight: 1.55 }}>
          {step === 0
            ? "Confirm your details so we can personalize your dashboard."
            : step === 1
              ? "This sets your revenue stage and unlocks the right tools."
              : "We'll tailor coaching prompts and goals around what matters most."}
        </p>

        {step === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1E" }}>
              Your name
              <input style={{ ...inputStyle, marginTop: "6px" }} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </label>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1E" }}>
              Business name
              <input style={{ ...inputStyle, marginTop: "6px" }} value={bizName} onChange={(e) => setBizName(e.target.value)} />
            </label>
          </div>
        ) : null}

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1E" }}>
              Business type
              <select style={{ ...inputStyle, marginTop: "6px" }} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#1C1C1E" }}>
              Approximate annual revenue
              <select style={{ ...inputStyle, marginTop: "6px" }} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))}>
                {REVENUE_OPTIONS.map((o) => (
                  <option key={o.label} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <div style={{ borderRadius: "12px", padding: "12px 14px", background: stageFromRevenue.bg, border: `1px solid ${stageFromRevenue.border}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: stageFromRevenue.color }}>Your stage: {stageFromRevenue.label}</div>
              <div style={{ fontSize: "12px", color: "#4A6A50", marginTop: "4px" }}>{stageFromRevenue.rev} annual revenue band</div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FOCUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFocus(option)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: focus === option ? "2px solid #00694A" : "1px solid rgba(0,0,0,0.1)",
                  background: focus === option ? "rgba(0,180,120,0.08)" : "white",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: focus === option ? 700 : 500,
                  color: "#0A160A",
                  fontFamily: "inherit",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <p style={{ color: "#C62828", fontSize: "13px", marginTop: "16px", marginBottom: 0 }}>{error}</p>
        ) : null}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={submitting}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (step < 2) setStep((s) => s + 1);
              else void finish();
            }}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg,#003D2B,#00B478)",
              color: "white",
              fontWeight: 700,
              cursor: submitting ? "wait" : "pointer",
              fontFamily: "inherit",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {step < 2 ? "Continue" : submitting ? "Saving…" : "Go to dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
