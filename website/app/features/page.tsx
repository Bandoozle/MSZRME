import type { Metadata } from "next";
import { Pencil, Target, LineChart, FileText, Users, Briefcase } from "lucide-react";
import GaugeCluster from "@/components/GaugeCluster";
import CtaBand from "@/components/CtaBand";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "Live KPI dashboard, two-minute logging, self-tracking goals, real margin, Market Pulse, reports, and one-on-one coaching, built for HVAC dealers.",
};

const MORE = [
  { c: STAGE_COLORS.blue,   Icon: Pencil,    h: "Two-minute logging", p: "Installs, sales, and service as plain subtotals, daily or weekly." },
  { c: STAGE_COLORS.purple, Icon: Target,    h: "Self-tracking goals", p: "Set targets once. Progress updates as you log." },
  { c: STAGE_COLORS.yellow, Icon: LineChart, h: "Market Pulse", p: "Local demand, rebate programs, seasonal forecasts." },
  { c: STAGE_COLORS.orange, Icon: FileText,  h: "Reports & exports", p: "Every view exports to PDF or CSV. Your data is yours." },
  { c: STAGE_COLORS.red,    Icon: Users,     h: "One-on-one coaching", p: "A real coach in every plan, deepening as you climb." },
  { c: STAGE_COLORS.green,  Icon: Briefcase, h: "Team access", p: "Your team logs and sees goals; you control the financials." },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Features</span>
        <h1>Everything the day needs.</h1>
        <p className="lead">No spreadsheets to wrangle, no reports to assemble. Log the day, and MSZRME does the rest.</p>
      </section>

      <section className="section wrap" style={{ paddingTop: 50 }}>
        <div className="split">
          <div>
            <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Live dashboard</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)" }}>Your KPIs, always current.</h2>
            <p className="lead" style={{ fontSize: 18, marginTop: 16 }}>Install revenue against target, closing ratio, average ticket, service health. Every gauge updates the moment you log, so the picture is never stale.</p>
          </div>
          <GaugeCluster preset="hero" />
        </div>
      </section>

      <section className="section alt wrap">
        <div className="split">
          <div className="pl-card" style={{ order: 0 }}>
            <div className="pl-row"><span className="k">Revenue</span><span className="vn">$248,500</span></div>
            <div className="pl-row"><span className="k">Cost of goods sold</span><span className="vn">$121,300</span></div>
            <div className="pl-row"><span className="k">Gross margin</span><span className="vn">51.2%</span></div>
            <div className="pl-row"><span className="k">Operating expense</span><span className="vn">$84,900</span></div>
            <div className="pl-row total"><span className="k">Net profit</span><span className="vn">$42,300</span></div>
          </div>
          <div>
            <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Financials</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)" }}>Know your real margin.</h2>
            <p className="lead" style={{ fontSize: 18, marginTop: 16 }}>COGS, operating expense, and below-the-line inputs roll up to gross margin, EBITDA, and net. No accountant required to see where the money goes.</p>
          </div>
        </div>
      </section>

      <section className="section feat wrap">
        <div>
          <span className="eyebrow">And more</span>
          <h2>The rest of the toolkit.</h2>
        </div>
        <div className="accent-grid c3">
          {MORE.map(({ c, Icon, h, p }) => (
            <div className="ac-card" style={accent(c)} key={h}>
              <div className="ic"><Icon size={22} /></div>
              <h3>{h}</h3><p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Put the toolkit to work." text="Start free and have your dashboard live today." />
    </>
  );
}
