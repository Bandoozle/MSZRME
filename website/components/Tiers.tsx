import Link from "next/link";
import { Check } from "lucide-react";
import { TIERS } from "@/lib/content";

export default function Tiers() {
  return (
    <div className="tiers" style={{ marginTop: 0 }}>
      {TIERS.map((t) => (
        <div key={t.name} className={"tier" + (t.featured ? " feat-tier" : "")}>
          <div className="badge">{t.badge || "\u00a0"}</div>
          <div className="name">{t.name}</div>
          <div className="tag">{t.tag}</div>
          <div className="price">{t.price}<span>/mo</span></div>
          <ul>
            {t.features.map((f) => (
              <li key={f}><Check size={15} strokeWidth={3} />{f}</li>
            ))}
          </ul>
          {t.featured ? (
            <Link className="btn btn-green" style={{ borderRadius: 12, padding: 11, fontSize: 15 }} href="/#signup">{t.cta}</Link>
          ) : (
            <Link className="tier-cta-ghost" href="/#signup">{t.cta}</Link>
          )}
        </div>
      ))}
    </div>
  );
}
