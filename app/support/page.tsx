import type { Metadata } from "next";
import { Zap, Target, LineChart, CreditCard } from "lucide-react";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Support",
  description: "Guides and answers for getting the most out of MSZRME, plus a way to reach a human anytime.",
};

const CATS = [
  { c: STAGE_COLORS.green,  Icon: Zap,        h: "Getting started",  p: "Set up your dealership, invite your team, and log your first day." },
  { c: STAGE_COLORS.blue,   Icon: Target,     h: "Logging & KPIs",   p: "What each number means and how it flows into your dashboard." },
  { c: STAGE_COLORS.purple, Icon: LineChart,  h: "Goals & stages",   p: "Set targets and understand how the eight-stage climb works." },
  { c: STAGE_COLORS.orange, Icon: CreditCard, h: "Billing & plans",  p: "Change plan, update payment, and manage your subscription." },
];

const FAQ = [
  { q: "How do I add my team?", a: "Invite teammates by email from Settings. They can log the day and see goals, while you keep control of financials." },
  { q: "Can I change plans later?", a: "Yes. Upgrade or downgrade anytime from Billing. Changes take effect at your next cycle." },
  { q: "How do I export my data?", a: "Every report and KPI view exports to PDF or CSV. Your data is always yours." },
  { q: "Where do I book coaching?", a: "Your coaching cadence is set by your plan. Book sessions from the dashboard once your trial begins." },
];

export default function SupportPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Support</span>
        <h1>How can we help?</h1>
        <p className="lead">Guides and answers for getting the most out of MSZRME. Still stuck? Reach a human anytime.</p>
      </section>

      <section className="section wrap" style={{ paddingTop: 40 }}>
        <div className="accent-grid c4">
          {CATS.map(({ c, Icon, h, p }) => (
            <div className="ac-card" style={accent(c)} key={h}>
              <div className="ic"><Icon size={22} /></div>
              <h3>{h}</h3><p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">Common questions</span>
          <h2>Quick answers.</h2>
        </div>
        <div style={{ marginTop: 46 }}><Faq items={FAQ} /></div>
      </section>

      <CtaBand title="Still need a hand?" text="Reach the support team and we will get you sorted." label="Contact support" href="/contact" reassure={null} />
    </>
  );
}
