import type { Metadata } from "next";
import { LayoutGrid, Users, ShieldCheck } from "lucide-react";
import Tiers from "@/components/Tiers";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Four plans from $750 to $3,500 a month. Every tier includes the full dashboard and daily logging. Month to month, cancel anytime.",
};

const FAQ = [
  { q: "Is there really a free trial?", a: "Yes. Fourteen days, no credit card required. Set up your dealership and explore the full platform before you pay anything." },
  { q: "Can I switch plans later?", a: "Anytime, in both directions. Upgrades take effect immediately; changes bill on your next cycle." },
  { q: "How does billing work?", a: "Plans are billed monthly in advance and renew automatically until you cancel. No setup fees, no long-term commitment." },
  { q: "What if I need something custom?", a: "Larger or multi-location operations can reach our team to tailor a plan. Start on Scale and we will take it from there." },
];

export default function PricingPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Pricing</span>
        <h1>Pick your program.</h1>
        <p className="lead">Every tier includes the full dashboard and daily logging. Coaching deepens as you climb. Month to month, cancel anytime.</p>
      </section>

      <section className="section feat wrap" style={{ paddingTop: 46 }}><Tiers /></section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">Every plan includes</span>
          <h2>The essentials, always.</h2>
        </div>
        <div className="cards3">
          <div className="fcard"><div className="ic"><LayoutGrid size={23} /></div><h3>The full dashboard</h3><p>Every live KPI from day one, no matter the tier.</p></div>
          <div className="fcard"><div className="ic"><Users size={23} /></div><h3>Real coaching</h3><p>A human coach on every plan. The cadence scales with you.</p></div>
          <div className="fcard"><div className="ic"><ShieldCheck size={23} /></div><h3>No contract</h3><p>Month to month. Start with a free trial, cancel anytime.</p></div>
        </div>
      </section>

      <section className="section feat wrap">
        <div>
          <span className="eyebrow">Pricing questions</span>
          <h2>The fine print, in plain terms.</h2>
        </div>
        <div style={{ marginTop: 46 }}><Faq items={FAQ} /></div>
      </section>

      <CtaBand title="Start free. Decide later." text="Fourteen days on the full platform, no card required." reassure="No credit card required \u00b7 Cancel anytime" />
    </>
  );
}
