import type { Metadata } from "next";
import { Target, LineChart, Users } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Coaching",
  description: "Every MSZRME plan includes real one-on-one coaching, from quarterly check-ins to weekly advisory, deepening as your dealership climbs.",
};

const CADENCE = [
  { c: STAGE_COLORS.white,  tier: "Base",    freq: "Quarterly", p: "A focused check-in to keep the fundamentals on track." },
  { c: STAGE_COLORS.green,  tier: "Starter", freq: "Monthly",   p: "A standing 1-on-1 to review goals, margin, and the month ahead." },
  { c: STAGE_COLORS.purple, tier: "Growth",  freq: "Biweekly",  p: "Tighter loops on hiring, capacity, and the numbers driving growth." },
  { c: STAGE_COLORS.black,  tier: "Scale",   freq: "Weekly",    p: "Advisory-level partnership, all the way to exit readiness." },
];

export default function CoachingPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Coaching</span>
        <h1>Coaching that compounds.</h1>
        <p className="lead">Software shows you the numbers. A coach helps you act on them. Every MSZRME plan includes real one-on-one coaching, and it deepens as you climb.</p>
      </section>

      <section className="section feat wrap">
        <div>
          <span className="eyebrow">The rhythm</span>
          <h2>A cadence that matches your stage.</h2>
          <p className="lead">The higher the stakes, the closer the coaching. Your plan sets the pace.</p>
        </div>
        <div className="cadence">
          {CADENCE.map((c) => (
            <div className="cad" style={accent(c.c)} key={c.tier}>
              <div className="tier">{c.tier}</div>
              <div className="freq">{c.freq}</div>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">In every session</span>
          <h2>More than a status call.</h2>
        </div>
        <div className="cards3">
          <div className="fcard"><div className="ic"><Target size={23} /></div><h3>Goals, set and pressure-tested</h3><p>Targets grounded in your real capacity, not last year plus ten percent.</p></div>
          <div className="fcard"><div className="ic"><LineChart size={23} /></div><h3>Margin, line by line</h3><p>Where the money actually goes, and the one change that moves it most.</p></div>
          <div className="fcard"><div className="ic"><Users size={23} /></div><h3>People and capacity</h3><p>When to hire, how to load the schedule, and how to keep your best crews.</p></div>
        </div>
      </section>

      <CtaBand title="Numbers plus a coach beats software alone." text="Start the trial and book your first session in the same week." />
    </>
  );
}
