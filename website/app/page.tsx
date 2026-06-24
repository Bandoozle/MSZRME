import Link from "next/link";
import { ChevronRight, Pencil, Target, LineChart, X, Check } from "lucide-react";
import GaugeCluster from "@/components/GaugeCluster";
import StageProgression from "@/components/StageProgression";
import Tiers from "@/components/Tiers";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import SignupForm from "@/components/SignupForm";

const PROBLEMS = [
  "You learn a job lost money weeks after it closed.",
  "Your real margin stays a mystery until tax season.",
  "Goals live in someone's head, not in front of the team.",
  "Busy season hits and nobody is watching the numbers.",
];

const OLD_WAY = [
  "Numbers scattered across spreadsheets",
  "Margin guessed, never truly known",
  "Goals forgotten by mid-month",
  "Problems spotted far too late",
  "No one to call when you are stuck",
];
const NEW_WAY = [
  "Every number in one live dashboard",
  "Real gross margin, EBITDA, and net",
  "Goals tracked automatically as you log",
  "Issues flagged the day they happen",
  "A coach in your corner every month",
];

const QUOTES = [
  { i: "DM", n: "Dave M.", r: "Owner · Fraser Valley", t: "We finally know which jobs actually make money. Last quarter was our best ever, and it was no accident." },
  { i: "SR", n: "Sarah R.", r: "General Manager · Surrey", t: "Logging takes two minutes and the whole team can see the goal. Everyone pulls in the same direction now." },
  { i: "TK", n: "Tony K.", r: "Owner · Abbotsford", t: "The monthly coaching alone paid for the platform. It is like having a CFO who actually knows HVAC." },
];

const FAQ = [
  { q: "Do I need to be technical?", a: "No. If you can enter a few numbers, you can run MSZRME. There is nothing to install and nothing to configure." },
  { q: "How fast will I see value?", a: "Most dealers get their first clear read on the business within a week of logging. The longer you log, the sharper the picture." },
  { q: "What if I already use QuickBooks?", a: "MSZRME sits alongside your accounting. It turns daily activity into the operating KPIs and live margin your books were never built to show." },
  { q: "Can my whole team use it?", a: "Yes. Your team logs the day and sees the goal, while you keep control of the financials and account settings." },
  { q: "Is there a contract?", a: "No. Every plan is month to month. Start with a free trial and cancel anytime." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero wrap">
        <span className="eyebrow">For HVAC dealers</span>
        <h1>Run your dealership by the numbers.</h1>
        <p className="lead">Two minutes of daily logging becomes live KPIs, real profit, and coaching that moves you to the next stage.</p>
        <div className="hero-ctas">
          <Link className="btn btn-lg btn-green" href="/#signup">Start free trial</Link>
          <a className="chev" href="#features">See how it works <ChevronRight size={11} strokeWidth={2.6} /></a>
        </div>
        <p className="reassure">14-day free trial &middot; No credit card required &middot; Cancel anytime</p>
      </section>

      <section className="hero-stage wrap">
        <div className="preview reveal">
          <div className="pv-top">
            <span className="pv-biz">North Van HVAC &middot; Today</span>
            <span className="pv-live"><i /> Live</span>
          </div>
          <div className="pv-headrow">
            <div className="pv-rev">
              <div className="l">Total Revenue</div>
              <div className="v">$25K</div>
              <div className="m">258.8% of target &middot; Day</div>
            </div>
            <div className="pv-goal">
              <div className="l">Progress to Goal</div>
              <div className="v">259%</div>
              <div className="bar"><i style={{ width: "100%" }} /></div>
            </div>
          </div>
          <GaugeCluster preset="hero" bare />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="wrap">
          <span className="eyb reveal">The cost of guessing</span>
          <h2 className="reveal">Running on gut feel is expensive.</h2>
          <p className="problem-lead reveal">Most HVAC dealers close the month with no real idea of what drove profit. By the time the numbers surface, the quarter is already gone.</p>
          <div className="problem-grid">
            {PROBLEMS.map((p) => (
              <div className="prob reveal" key={p}><span className="x">&times;</span><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="section feat wrap" id="features">
        <div className="reveal">
          <span className="eyebrow">The dashboard</span>
          <h2>Your whole dealership. One screen.</h2>
          <p className="lead">Install revenue, closing ratio, average ticket, service health. Read the business at a glance, the way you read a dash at speed.</p>
        </div>
        <div className="feat-visual reveal"><GaugeCluster preset="service" /></div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section feat alt wrap">
        <div className="reveal">
          <span className="eyebrow">How it works</span>
          <h2>Up and running in a day.</h2>
          <p className="lead">No migration, no setup project. Three steps and the dealership is on the numbers.</p>
        </div>
        <div className="steps reveal">
          <div className="step"><div className="num">Step 1</div><h3>Set your target</h3><p>Tell MSZRME your monthly goal and current stage. Setup takes minutes, not weeks.</p></div>
          <div className="step"><div className="num">Step 2</div><h3>Log the day</h3><p>Enter installs, sales, and service as plain subtotals. Two minutes, daily or weekly.</p></div>
          <div className="step"><div className="num">Step 3</div><h3>Grow with the numbers</h3><p>KPIs, profit, and coaching update live, so you always know your next best move.</p></div>
        </div>
      </section>

      {/* THREE CARDS */}
      <section className="section feat wrap">
        <div className="reveal">
          <span className="eyebrow">Built for the field</span>
          <h2>Everything the day needs.</h2>
          <p className="lead">No spreadsheets to wrangle, no reports to assemble. Log the day, and the platform does the rest.</p>
        </div>
        <div className="cards3 reveal">
          <div className="fcard"><div className="ic"><Pencil size={23} /></div><h3>Two-minute logging</h3><p>Installs, sales, and service entered as plain subtotals. Daily or weekly, your call. Every figure flows straight into KPIs and goals.</p></div>
          <div className="fcard"><div className="ic"><Target size={23} /></div><h3>Goals that track themselves</h3><p>Set monthly targets once. Progress updates the moment you log, so you always know where the month stands.</p></div>
          <div className="fcard"><div className="ic"><LineChart size={23} /></div><h3>Market Pulse</h3><p>Local demand signals, rebate programs, and seasonal forecasts for your service area, refreshed for every account.</p></div>
        </div>
      </section>

      {/* PROFIT SPLIT */}
      <section className="section alt wrap">
        <div className="split">
          <div className="reveal">
            <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Financials</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)" }}>Know your real margin.</h2>
            <p className="lead" style={{ fontSize: 18, marginTop: 16 }}>COGS, operating expense, and below-the-line inputs roll up to gross margin, EBITDA, and net. No accountant required to see where the money goes.</p>
            <div style={{ marginTop: 22 }}><Link className="chev" href="/#signup">Start tracking it <ChevronRight size={11} strokeWidth={2.6} /></Link></div>
          </div>
          <div className="pl-card reveal">
            <div className="pl-row"><span className="k">Revenue</span><span className="vn">$248,500</span></div>
            <div className="pl-row"><span className="k">Cost of goods sold</span><span className="vn">$121,300</span></div>
            <div className="pl-row"><span className="k">Gross margin</span><span className="vn">51.2%</span></div>
            <div className="pl-row"><span className="k">Operating expense</span><span className="vn">$84,900</span></div>
            <div className="pl-row total"><span className="k">Net profit</span><span className="vn">$42,300</span></div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section feat wrap">
        <div className="reveal">
          <span className="eyebrow">Why dealers switch</span>
          <h2>Spreadsheets can&rsquo;t do this.</h2>
          <p className="lead">A workbook stores numbers. MSZRME turns them into decisions, the moment you enter them.</p>
        </div>
        <div className="compare reveal">
          <div className="compare-col old">
            <h3>The old way</h3>
            <ul>{OLD_WAY.map((t) => <li key={t}><X size={17} strokeWidth={2.4} />{t}</li>)}</ul>
          </div>
          <div className="compare-col new">
            <h3>With MSZRME</h3>
            <ul>{NEW_WAY.map((t) => <li key={t}><Check size={17} strokeWidth={3} />{t}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section alt wrap">
        <div className="stats reveal">
          <div className="stat"><div className="n">2 min</div><div className="lab">to log a full day</div></div>
          <div className="stat"><div className="n">12</div><div className="lab">live KPIs, always current</div></div>
          <div className="stat"><div className="n">8</div><div className="lab">stages to climb</div></div>
          <div className="stat"><div className="n">1-on-1</div><div className="lab">coaching at every tier</div></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section feat wrap">
        <div className="reveal">
          <span className="eyebrow">From the field</span>
          <h2>Dealers that run on the numbers.</h2>
          <p className="lead">Owners and managers who traded guesswork for a live read on the business.</p>
        </div>
        <div className="quotes reveal">
          {QUOTES.map((q) => (
            <div className="quote" key={q.i}>
              <div className="qm">&ldquo;</div>
              <p>{q.t}</p>
              <div className="who"><span className="av">{q.i}</span><div><div className="nm">{q.n}</div><div className="rl">{q.r}</div></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* STAGES */}
      <section className="section feat alt wrap" id="stages">
        <div className="reveal">
          <span className="eyebrow">The climb</span>
          <h2>Eight stages. One climb.</h2>
          <p className="lead">From your first quarter-million to fifteen million and beyond. Each stage unlocks the next set of tools as the dealership grows into them.</p>
        </div>
        <div className="reveal" style={{ marginTop: 54 }}><StageProgression /></div>
      </section>

      <CtaBand title="Stop guessing. Start growing." text="Join the dealers who run their dealership on real numbers instead of gut feel." label="Start your free trial" />

      {/* PRICING */}
      <section className="section feat wrap" id="pricing">
        <div className="reveal">
          <span className="eyebrow">Programs</span>
          <h2>Pick your program.</h2>
          <p className="lead">Every tier includes the full dashboard and daily logging. Coaching deepens as you climb.</p>
        </div>
        <div className="reveal" style={{ marginTop: 54 }}><Tiers /></div>
      </section>

      {/* FAQ */}
      <section className="section feat alt wrap">
        <div className="reveal">
          <span className="eyebrow">Good to know</span>
          <h2>Questions, answered.</h2>
        </div>
        <div className="reveal" style={{ marginTop: 46 }}><Faq items={FAQ} /></div>
      </section>

      {/* SIGNUP */}
      <section className="section signup wrap" id="signup">
        <div className="reveal">
          <span className="eyebrow">Start today</span>
          <h2>Start your free trial.</h2>
          <p className="lead">Set up your dealership in under a minute. No credit card to start.</p>
        </div>
        <div className="su-card reveal"><SignupForm /></div>
      </section>
    </>
  );
}
