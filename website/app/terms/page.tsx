import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of MSZRME.",
};

export default function TermsPage() {
  return (
    <>
      <section className="pg-hero wrap">
        <span className="eyebrow">Legal</span>
        <h1>Terms of Service</h1>
      </section>
      <section className="section wrap" style={{ paddingTop: 30 }}>
        <div className="legal">
          <p className="updated">Last updated: June 2026</p>
          <div className="note"><strong>Template notice.</strong> This is placeholder terms language for layout purposes. Have it reviewed and finalized by legal counsel before MSZRME goes live.</div>

          <h2>Acceptance</h2>
          <p>By creating an account or using MSZRME, you agree to these terms. If you are using the platform on behalf of a dealership, you confirm you have authority to bind that business.</p>

          <h2>Your account</h2>
          <p>You are responsible for the activity under your account and for keeping your credentials secure. Keep your information accurate and let us know of any unauthorized use.</p>

          <h2>Plans and billing</h2>
          <p>Paid plans are billed monthly in advance and renew automatically until cancelled. Trials convert to paid plans unless cancelled before the trial ends. Fees are non-refundable except where required by law.</p>

          <h2>Acceptable use</h2>
          <p>Do not misuse the platform, attempt to disrupt it, or use it to violate any law or the rights of others. We may suspend accounts that do.</p>

          <h2>Your data and ownership</h2>
          <p>You own the data you put into MSZRME. We own the platform and its software. You grant us the limited rights needed to operate the service for you.</p>

          <h2>Termination</h2>
          <p>You can cancel anytime. We may suspend or end access for breach of these terms. You can export your data before your account closes.</p>

          <h2>Disclaimer and liability</h2>
          <p>MSZRME provides operational insight and is not financial, tax, or legal advice. The platform is provided as is, and our liability is limited to the maximum extent permitted by law.</p>

          <h2>Contact</h2>
          <p>Questions about these terms can be sent to <a href="mailto:legal@mszrme.com" style={{ color: "var(--green-link)" }}>legal@mszrme.com</a>.</p>
        </div>
      </section>
    </>
  );
}
