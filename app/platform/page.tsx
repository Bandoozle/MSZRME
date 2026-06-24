import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LayoutGrid, Pencil, Target, DollarSign, LineChart, Users } from "lucide-react";
import GaugeCluster from "@/components/GaugeCluster";
import CtaBand from "@/components/CtaBand";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Platform",
  description: "The whole dealership on one screen: a live dashboard, daily logging, goals, financials, market pulse, and coaching, working as one system.",
};

const MODULES = [
  { c: STAGE_COLORS.green,  Icon: LayoutGrid, h: "Dashboard",   p: "Live KPIs across install and service, read at a glance." },
  { c: STAGE_COLORS.blue,   Icon: Pencil,     h: "Log Numbers", p: "Daily or weekly subtotals in two minutes flat." },
  { c: STAGE_COLORS.purple, Icon: Target,     h: "Goals",       p: "Targets that update the moment you log." },
  { c: STAGE_COLORS.orange, Icon: DollarSign, h: "Financials",  p: "Real gross margin, EBITDA, and net profit." },
  { c: STAGE_COLORS.yellow, Icon: LineChart,  h: "Market Pulse",p: "Local demand, rebates, and seasonal forecasts." },
  { c: STAGE_COLORS.red,    Icon: Users,      h: "Coaching",    p: "A real coach, built into every plan." },
];

export default function PlatformPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">The platform</span>
        <h1>The whole dealership, on one screen.</h1>
        <p className="lead">MSZRME pulls every number that matters into one live system: a dashboard you read at a glance, the inputs behind it, and the coaching to act on it.</p>
        <div className="hero-ctas">
          <Link className="btn btn-lg btn-green" href="/#signup">Start free trial</Link>
          <Link className="chev" href="/features">Explore features <ChevronRight size={11} strokeWidth={2.6} /></Link>
        </div>
      </section>

      <section className="section feat wrap" style={{ paddingTop: 54 }}>
        <div>
          <span className="eyebrow">The dashboard</span>
          <h2>Read the business at a glance.</h2>
          <p className="lead">Install revenue, closing ratio, average ticket, service health. The instruments you need, the way you read a dash at speed.</p>
        </div>
        <div className="feat-visual"><GaugeCluster preset="hero" /></div>
      </section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">One system</span>
          <h2>Six surfaces, working together.</h2>
          <p className="lead">Each surface feeds the next. Log once, and it flows everywhere it belongs.</p>
        </div>
        <div className="accent-grid c3">
          {MODULES.map(({ c, Icon, h, p }) => (
            <div className="ac-card" style={accent(c)} key={h}>
              <div className="ic"><Icon size={22} /></div>
              <h3>{h}</h3><p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt wrap">
        <div className="stats">
          <div className="stat"><div className="n">2 min</div><div className="lab">to log a full day</div></div>
          <div className="stat"><div className="n">12</div><div className="lab">live KPIs</div></div>
          <div className="stat"><div className="n">1</div><div className="lab">source of truth</div></div>
          <div className="stat"><div className="n">0</div><div className="lab">spreadsheets required</div></div>
        </div>
      </section>

      <CtaBand title="See it on your numbers." text="Spin up your dealership and watch the dashboard come to life." />
    </>
  );
}
