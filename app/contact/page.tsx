import type { Metadata } from "next";
import Link from "next/link";
import { LineChart, Power, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { STAGE_COLORS, accent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to MSZRME about the platform, a plan, or getting your dealership set up. Sales, support, and general enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Contact</span>
        <h1>Talk to us.</h1>
        <p className="lead">Questions about the platform, a plan, or getting your dealership set up? We are here.</p>
      </section>

      <section className="section wrap" style={{ paddingTop: 40 }}>
        <div className="accent-grid c3">
          <div className="ac-card" style={accent(STAGE_COLORS.green)}>
            <div className="ic"><LineChart size={22} /></div>
            <h3>Sales</h3><p>See whether MSZRME fits your dealership and which plan makes sense.</p>
            <a className="lnk" href="mailto:sales@mszrme.com">sales@mszrme.com</a>
          </div>
          <div className="ac-card" style={accent(STAGE_COLORS.blue)}>
            <div className="ic"><Power size={22} /></div>
            <h3>Support</h3><p>Already on the platform? Reach the team that knows your account.</p>
            <Link className="lnk" href="/support">Visit support &rsaquo;</Link>
          </div>
          <div className="ac-card" style={accent(STAGE_COLORS.purple)}>
            <div className="ic"><MessageSquare size={22} /></div>
            <h3>Everything else</h3><p>Partnerships, press, or a question that does not fit a box.</p>
            <a className="lnk" href="mailto:hello@mszrme.com">hello@mszrme.com</a>
          </div>
        </div>
      </section>

      <section className="section alt wrap">
        <div className="contact-split">
          <ContactForm />
          <div className="contact-aside">
            <div className="ca-item"><h4>Sales</h4><a href="mailto:sales@mszrme.com">sales@mszrme.com</a></div>
            <div className="ca-item"><h4>General</h4><a href="mailto:hello@mszrme.com">hello@mszrme.com</a></div>
            <div className="ca-item"><h4>Hours</h4><p>Monday to Friday, 8am&ndash;5pm PT</p></div>
            <div className="ca-item"><h4>Based in</h4><p>Vancouver, BC &middot; serving dealers across Canada</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
