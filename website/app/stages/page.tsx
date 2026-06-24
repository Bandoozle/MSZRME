import type { Metadata } from "next";
import { LineChart, Lock, Users } from "lucide-react";
import StageProgression from "@/components/StageProgression";
import StageCards from "@/components/StageCards";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Stages",
  description: "Eight stages, one climb. MSZRME places your dealership on the climb by revenue and unlocks the next set of tools as you grow.",
};

export default function StagesPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">The climb</span>
        <h1>Eight stages. One climb.</h1>
        <p className="lead">Every dealership sits somewhere on the climb. MSZRME meets you where you are and unlocks the next set of tools as you grow into them.</p>
      </section>

      <section className="section wrap" style={{ paddingTop: 46 }}><StageProgression /></section>

      <section className="section feat wrap" style={{ paddingTop: 10 }}><StageCards /></section>

      <section className="section feat alt wrap">
        <div>
          <span className="eyebrow">How it works</span>
          <h2>The climb has rules.</h2>
        </div>
        <div className="cards3">
          <div className="fcard"><div className="ic"><LineChart size={23} /></div><h3>Your revenue sets your stage</h3><p>MSZRME places you on the climb by trailing revenue, and moves you up as you grow.</p></div>
          <div className="fcard"><div className="ic"><Lock size={23} /></div><h3>Tools unlock as you climb</h3><p>Each stage opens the next set of capabilities, so the platform never overwhelms.</p></div>
          <div className="fcard"><div className="ic"><Users size={23} /></div><h3>Coaching deepens with you</h3><p>From quarterly to weekly, the support matches the stakes of your stage.</p></div>
        </div>
      </section>

      <CtaBand title="Find your stage." text="See where your dealership sits today, and what the next climb looks like." />
    </>
  );
}
