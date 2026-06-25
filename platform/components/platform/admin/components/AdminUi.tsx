"use client";

import type { ReactNode } from "react";
import type { ToastType } from "../types";

export function AbbrLabel({ full, abbr }: { full: string; abbr: string }) {
  return (
    <>
      <span className="adm-full">{full}</span>
      <span className="adm-abbr">{abbr}</span>
    </>
  );
}

const PILL_CLASS: Record<string, string> = {
  g: "pill-g",
  r: "pill-r",
  a: "pill-a",
  b: "pill-b",
  p: "pill-p",
};

export function StagePill({ stage }: { stage: string }) {
  const cls =
    stage === "Blue" ? "b" : stage === "Green" ? "g" : "a";
  return <span className={`adm-pill ${PILL_CLASS[cls]}`}>{stage}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Active" ? "g" : status === "At Risk" ? "r" : "a";
  return <span className={`adm-pill ${PILL_CLASS[cls]}`}>{status}</span>;
}

export function PlanPill({ plan }: { plan: string }) {
  let cls = "a";
  if (plan === "Pro" || plan === "Starter" || plan === "Base") cls = "g";
  if (plan === "Growth") cls = "b";
  return <span className={`adm-pill ${PILL_CLASS[cls]}`}>{plan}</span>;
}

export function AdminToast({
  message,
  type = "info",
}: {
  message: string | null;
  type?: ToastType;
}) {
  if (!message) return null;
  const bg: Record<ToastType, string> = {
    info: "rgba(8,13,8,0.97)",
    success: "rgba(0,61,43,0.97)",
    error: "rgba(80,0,0,0.95)",
    warn: "rgba(60,40,0,0.95)",
  };
  return (
    <div
      id="adm-toast"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%) translateY(0)",
        borderRadius: "4px",
        padding: "10px 20px",
        fontSize: "13px",
        fontWeight: 600,
        zIndex: 9999,
        opacity: 1,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
        background: bg[type],
        color: "#E8F5EE",
        border: "1px solid rgba(0,180,120,0.35)",
        borderTop: "1px solid rgba(0,180,120,0.6)",
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      {message}
    </div>
  );
}

export function AdminConfirm({
  title,
  body,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  confirmStyle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      id="adm-confirm"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#080D08,#0E140E)",
          border: "1px solid rgba(0,180,120,0.2)",
          borderTop: "1px solid rgba(0,180,120,0.4)",
          borderRadius: "6px",
          padding: "28px",
          width: "380px",
          maxWidth: "90vw",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            marginBottom: "8px",
            letterSpacing: "-.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.55,
            marginBottom: "22px",
          }}
        >
          {body}
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              borderRadius: "9px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "9px 18px",
              borderRadius: "9px",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              ...(parseInlineStyle(confirmStyle) as object),
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function parseInlineStyle(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  css.split(";").forEach((part) => {
    const [k, v] = part.split(":").map((s) => s.trim());
    if (k && v) {
      const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[camel] = v;
    }
  });
  return out;
}

export function AdminInputModal({
  title,
  fields,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  fields: {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    hint?: string;
    options?: string[];
  }[];
  confirmLabel: string;
  onConfirm: (vals: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const vals: Record<string, string> = {};
    fields.forEach((f) => {
      vals[f.id] = String(fd.get(f.id) ?? "");
    });
    onConfirm(vals);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "linear-gradient(160deg,#080D08,#0E140E)",
          border: "1px solid rgba(0,180,120,0.2)",
          borderTop: "1px solid rgba(0,180,120,0.4)",
          borderRadius: "6px",
          padding: "28px",
          width: "420px",
          maxWidth: "90vw",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            marginBottom: "20px",
          }}
        >
          {title}
        </div>
        {fields.map((f) => (
          <div key={f.id} style={{ marginBottom: "14px" }}>
            <label
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: ".3px",
                display: "block",
                marginBottom: "5px",
              }}
            >
              {f.label}
            </label>
            {f.type === "select" ? (
              <select
                name={f.id}
                defaultValue={f.options?.[0]}
                className="adm-input"
                style={{ width: "100%" }}
              >
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.id}
                type={f.type || "text"}
                placeholder={f.placeholder}
                defaultValue={f.value}
                className="adm-input"
                style={{ width: "100%" }}
              />
            )}
            {f.hint ? (
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "4px",
                }}
              >
                {f.hint}
              </div>
            ) : null}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
            marginTop: "4px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              borderRadius: "9px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="adm-btn adm-btn-p"
            style={{
              padding: "9px 20px",
              borderRadius: "9px",
              fontSize: "13px",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminCard({
  title,
  subtitle,
  action,
  children,
  headerStyle,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  headerStyle?: React.CSSProperties;
}) {
  return (
    <div className="adm-card">
      {title ? (
        <div className="adm-card-hdr" style={headerStyle}>
          <div>
            <div className="adm-card-title">{title}</div>
            {subtitle ? (
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--atm)",
                  marginTop: "2px",
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}
