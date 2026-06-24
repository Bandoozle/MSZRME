"use client";

/**
 * PlaceholderPage
 *
 * Used for pages not yet ported from the HTML prototype.
 * Marco: replace each case in DealerShell's PageRenderer with the real component.
 */

interface Props {
  page: string;
  dark: boolean;
}

export function PlaceholderPage({ page, dark }: Props) {
  const c = dark
    ? { bg: "#1C1C1E", t1: "rgba(255,255,255,0.92)", t2: "rgba(235,235,245,0.5)", border: "rgba(255,255,255,0.09)" }
    : { bg: "#FFFFFF",  t1: "#0A160A",               t2: "rgba(60,60,67,0.5)",    border: "rgba(0,0,0,0.06)" };

  const label = page.charAt(0).toUpperCase() + page.slice(1).replace(/([A-Z])/g, " $1");

  return (
    <div style={{ background: c.bg, borderRadius: "18px", padding: "40px 32px", textAlign: "center", border: `1px dashed ${c.border}` }}>
      <div style={{ fontSize: "32px", marginBottom: "14px" }}>🚧</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: c.t1, marginBottom: "8px", letterSpacing: "-.02em" }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", color: c.t2, lineHeight: 1.6, maxWidth: "380px", margin: "0 auto" }}>
        This page exists in the HTML prototype ({" "}
        <code style={{ fontFamily: "monospace", fontSize: "12px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: "4px" }}>
          render{label.replace(/\s/g, "")}()
        </code>
        {" "}) and needs to be ported to a React component.
        <br /><br />
        Create <code style={{ fontFamily: "monospace", fontSize: "12px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: "4px" }}>
          components/dealer/pages/{label.replace(/\s/g, "")}.tsx
        </code>{" "}
        and add it to <strong>DealerShell.tsx</strong>.
      </div>
    </div>
  );
}

// Stub exports for all unported pages — wire up as you build them
export const Market      = ({ page, dark }: Props) => <PlaceholderPage page="Market Pulse" dark={dark} />;
export const Seasonal    = ({ page, dark }: Props) => <PlaceholderPage page="Seasonal Planner" dark={dark} />;
export const Messages    = ({ page, dark }: Props) => <PlaceholderPage page="Messages" dark={dark} />;
export const LogNumbers  = ({ page, dark }: Props) => <PlaceholderPage page="Log Numbers" dark={dark} />;
export const Goals       = ({ page, dark }: Props) => <PlaceholderPage page="Goals" dark={dark} />;
export const Reports     = ({ page, dark }: Props) => <PlaceholderPage page="Reports" dark={dark} />;
export const Settings    = ({ page, dark }: Props) => <PlaceholderPage page="Settings" dark={dark} />;

export default PlaceholderPage;
