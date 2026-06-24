import type { Metadata } from "next";
import { CheckSquare, Wrench, Users } from "lucide-react";
import StageCards from "@/components/StageCards";
import CtaBand from "@/components/CtaBand";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "MSZRME is the performance platform built by operators, for HVAC dealers, the whole dealership on one screen and a clear path to the next stage.",
};

const TEAM = [
  { c: STAGE_COLORS.green,  i: "BK", n: "Bretton Kosick", r: "Co-founder" },
  { c: STAGE_COLORS.blue,   i: "KK", n: "Keith Kosick",   r: "Co-founder" },
  { c: STAGE_COLORS.purple, i: "PG", n: "Philip Graham",  r: "Co-founder" },
];

export default function AboutPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">About MSZRME</span>
        <h1>Built for the climb.</h1>
        <p className="lead">We make the performance platform we wished we had in the field: the whole dealership on one screen, and a clear path to the next stage.</p>
      </section>

      <section className="section wrap">
        <div className="split">
          <div>
            <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Our story</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)" }}>It started on a whiteboard.</h2>
            <p className="lead" style={{ fontSize: 18, marginTop: 16 }}>For years the best HVAC operators ran their dealerships on instinct, a whiteboard, and a spreadsheet only one person understood. The numbers always arrived too late to change anything.</p>
            <p className="lead" style={{ fontSize: 18, marginTop: 14 }}>MSZRME began with a simple question: what if every dealer could see their real numbers the moment they happened, and always know the next move? Everything we build answers it.</p>
          </div>
          <div className="pl-card">
            <div className="pl-row"><span className="k">Built for</span><span className="vn">HVAC dealers</span></div>
            <div className="pl-row"><span className="k">Setup time</span><span className="vn">Under a minute</span></div>
            <div className="pl-row"><span className="k">Daily logging</span><span className="vn">~2 minutes</span></div>
            <div className="pl-row"><span className="k">Live KPIs</span><span className="vn">12</span></div>
            <div className="pl-row total"><span className="k">Stages to climb</span><span className="vn">8</span></div>
          </div>
        </div>
      </section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">The philosophy</span>
          <h2>Eight stages. One climb.</h2>
          <p className="lead">Every dealership sits somewhere on the climb. MSZRME meets you where you are and unlocks the next set of tools as you grow into them.</p>
        </div>
        <StageCards />
      </section>

      <section className="section feat wrap">
        <div>
          <span className="eyebrow">What we stand for</span>
          <h2>Three things we never compromise.</h2>
        </div>
        <div className="cards3">
          <div className="fcard"><div className="ic"><CheckSquare size={23} /></div><h3>Numbers you can trust</h3><p>One source of truth. If it is on your dashboard, it is real and it is current.</p></div>
          <div className="fcard"><div className="ic"><Wrench size={23} /></div><h3>Built for the field</h3><p>If you can enter a few numbers, you can run MSZRME. No analysts, no setup project.</p></div>
          <div className="fcard"><div className="ic"><Users size={23} /></div><h3>A coach in your corner</h3><p>Software shows the numbers. A real coach helps you act on them, at every tier.</p></div>
        </div>
      </section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">The team</span>
          <h2>Built by operators.</h2>
          <p className="lead">MSZRME is built by people who have run the campaigns, carried the targets, and sweated the margins.</p>
        </div>
        <div className="team">
          {TEAM.map((m) => (
            <div className="tm" style={accent(m.c)} key={m.i}>
              <div className="av">{m.i}</div>
              <div className="nm">{m.n}</div>
              <div className="rl">{m.r}</div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title="Find your stage." text="See where your dealership sits today, and what the next climb looks like." />
    </>
  );
}
